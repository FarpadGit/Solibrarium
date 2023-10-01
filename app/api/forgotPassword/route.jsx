import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";
import * as crypto from "crypto";
import nodemailer from "nodemailer";

const algorithm = "aes-256-cbc";

function encrypt(data, keySecret) {
  const key = crypto.createHash("sha256").update(keySecret).digest("base64");
  const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, "base64"),
    iv
  );
  const encrypted =
    cipher.update(JSON.stringify(data), "utf8", "hex") + cipher.final("hex");
  const compositeKey = Buffer.from(JSON.stringify({ key, iv }, "hex"));

  return {
    resetToken: encrypted.toString("hex"),
    key: compositeKey.toString("hex"),
  };
}

function decrypt(encryptedData, compositeKey) {
  const { key, iv } = JSON.parse(Buffer.from(compositeKey, "hex").toString());
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "base64"),
    iv
  );
  const decrypted =
    decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");

  return JSON.parse(decrypted);
}

export const GET = async (request) => {
  const { token, key } = Object.fromEntries(request.nextUrl.searchParams);
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();

    const { email, exp } = decrypt(token, key);
    if (exp > Date.now())
      return new Response(JSON.stringify(email), { status: 200 });
    else return Response.json({ error: "token have expired" }, { status: 500 });
  } catch (error) {
    console.error(errorProgressMessage, error);
    return Response.json(
      { error: "Failed to validate token" },
      { status: 500 }
    );
  }
};

const emailBody = (email, token, key) =>
  `Helló!
  
  Kaptunk egy kérést arra, hogy visszaállítsuk a Solibrarium fiókodhoz tartozó jelszavadat amire a ${email} email címmel regisztráltál.
  Még nem történt semmilyen változás, de ha te kezdeményezted akkor az alábbi linkre kattintva visszaállíthatod a jelszavadat:
  
  http://localhost:3000/resetPassword/${token}/${key}
  
  Ha nem te voltál akkor hagyd ezt a levelet figyelmen kívül. Vagy ha gondolod akkor válaszolhatsz is rá, akár más témában is.`;

const emailHtml = (email, token, key) =>
  `<div style="margin-bottom: 3.6rem;display: flex;gap: 1.25rem;width: 700px;">
    <div style="display: grid;grid-template-columns: repeat(1, minmax(0, 1fr));padding-left: 0.75rem;flex: 1 1 auto;width: 50%;" flex-auto="" grid="" grid-cols-1="">
      <h3 style="margin-bottom: 20px;font-size: 40px;color: rgb(55 187 55);">Solibrarium</h3>
      <div style="width: 100%; height: 1px; align-self: center; border: 1px solid rgb(204 204 204);"></div>
      <div style="position: relative; display: flex; flex-direction:column; text-align: justify; gap: 10px;margin-top: 30px;font-size: 0.875rem;line-height: 1.25rem;">
        <h2>Helló!</h2>
        <br>
        <p>Kaptunk egy kérést arra, hogy visszaállítsuk a Solibrarium fiókodhoz tartozó jelszavadat amire a ${email} email címmel regisztráltál.</p>
        <p>Még nem történt semmilyen változás, de ha te kezdeményezted akkor az alábbi linkre kattintva visszaállíthatod a jelszavadat:</p>
        
        <a href="http://localhost:3000/resetPassword/${token}/${key}" style="box-shadow: 0 4px 9px -4px rgb(59 113 202);color: rgb(255 255 255);line-height: 1.5;font-weight: 600;font-size: 0.875rem; padding: 0.5rem 0;background-color: rgb(59 113 202);border-radius: 0.25rem;justify-content: center;width: 100%;display: flex;margin: 5px 0 15px;">Jelszó visszaállítása</a>

        <div style="padding-bottom: 20px;">Ha nem te voltál akkor hagyd ezt a levelet figyelmen kívül. Vagy ha gondolod akkor válaszolhatsz is rá, akár más témában is.</div>
      </div>
    </div>
  <div style="width: 170px;border-radius: 0 76px 0 0/0 45px 0 0;background-image: linear-gradient(to right, transparent, rgb(253 230 138));"></div>
</div>`;

//POSTS a user email and sends a link to their address to reset password
export const POST = async (request) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();

    //looking up user with email address
    errorProgressMessage = "Error finding user in database: ";
    const userInDB = await User.findOne({ email: reqBody.email });
    if (!userInDB)
      return Response.json(
        { message: `User with email ${reqBody.email} cannot be found` },
        {
          status: 200,
        }
      );

    //encrypting the email address and an expiry deadline of 24 hours, using the email's database ID as a "salt"
    errorProgressMessage = "Error encrypting data: ";
    const { resetToken, key } = encrypt(
      { email: reqBody.email, exp: Date.now() + 1000 * 60 * 60 * 24 },
      userInDB._id.toString()
    );

    //sending email to address
    errorProgressMessage = "Error sending email: ";
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "solibrarium@hotmail.com",
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailData = {
      from: "solibrarium@hotmail.com",
      to: reqBody.email,
      subject: "Elfelejtett jelszó",
      text: emailBody(reqBody.email, resetToken, key),
      html: emailHtml(reqBody.email, resetToken, key),
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) console.error(error);
      else console.log(info);
    });

    return Response.json(
      { message: "email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(errorProgressMessage, error);
    return Response.json(
      { error: "Failed to send email" },
      {
        status: 500,
      }
    );
  }
};
