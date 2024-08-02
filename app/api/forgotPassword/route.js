import { headers } from "next/headers";
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

// GETS the encrypted token key and value from search params, validates them and returns the decrypted email address if everything is valid
export const GET = async (request) => {
  const { token, key } = Object.fromEntries(request.nextUrl.searchParams);
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();

    errorProgressMessage = "Failed to decrypt token key: ";
    const { email, exp } = decrypt(token, key);
    if(!email || !email.includes("@")) throw new Error("decryption error");
    
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

const emailBody = (host, email, token, key) =>
  `Helló!
  
  Kaptunk egy kérést arra, hogy visszaállítsuk a Solibrarium fiókodhoz tartozó jelszavadat amire a ${email} email címmel regisztráltál.
  Még nem történt semmilyen változás, de ha te kezdeményezted akkor az alábbi linkre kattintva visszaállíthatod a jelszavadat:
  
  http://${host}/resetPassword/${token}/${key}
  
  Ha nem te voltál akkor hagyd ezt a levelet figyelmen kívül. Vagy ha gondolod akkor válaszolhatsz is rá, akár más témában is.`;

const emailHtml = (host, email, token, key) =>
  `<div style="width:700px;margin: auto;background:white;">
  <table role="presentation" border="0" width="100%" cellspacing="0">
    <tr><td width="75%">
    <table role="presentation" border="0" width="100%" cellspacing="0">
      <tr><td bgcolor="#FFFFFF" align="left" style="color:#37BB37">
        <h3 style="margin-bottom: 20px;font-size: 40px;">Solibrarium</h3>
      </td></tr>
    </table>
    <hr>
    <table role="presentation" border="0" width="100%" cellspacing="10" style="text-align: justify;font-size: 0.875rem;line-height: 1.25rem;color:#000000">
      <tr><td>
        <h2>Helló!</h2>
      </td></tr>
      <tr></tr>
      <tr><td><p>Kaptunk egy kérést arra, hogy visszaállítsuk a Solibrarium fiókodhoz tartozó jelszavadat amire a ${email} email címmel regisztráltál.</p></td></tr>
      <tr><td><p>Még nem történt semmilyen változás, de ha te kezdeményezted akkor az alábbi linkre kattintva visszaállíthatod a jelszavadat:</p></td></tr>
      <tr><td align="center" style="text-align: center;">
        <a href="http://${host}/resetPassword/${token}/${key}" style="color: #FFFFFF;line-height: 1.5;font-weight: 600;font-size: 0.875rem;background-color: #3B71CA;border-radius: 0.25rem;padding: 10px 10.5rem;">Jelszó visszaállítása</a>
      </td></tr>
      <tr></tr>
      <tr><td><p style="padding-bottom: 20px;">Ha nem te voltál akkor hagyd ezt a levelet figyelmen kívül.</p></td></tr>
    </table>
    </td>
    <td width="25%" style="width: 170px;background: url('https://solibrarium.vercel.app/_next/image?url=%2Femail_grad.png&w=1920&q=75');border-radius: 0 76px 0 0/0 45px 0 0;"></td>
    </tr>
  </table>
  </div>`;

//POSTS a user email and sends a link to their email address to reset password
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

    const host = headers().get("host");

    const mailData = {
      from: "solibrarium@hotmail.com",
      to: reqBody.email,
      subject: "Elfelejtett jelszó",
      text: emailBody(host, reqBody.email, resetToken, key),
      html: emailHtml(host, reqBody.email, resetToken, key),
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
