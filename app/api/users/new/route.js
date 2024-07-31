import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";
import bcrypt from "bcrypt";

//POSTS one new user and adds to db
export const POST = async (request) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();
    // check if user already exists
    errorProgressMessage = "Error checking if user exists: ";
    const userExists = await User.findOne({ email: reqBody.email });

    if (userExists) {
      if (reqBody.overwrite) {
        userExists.password = await bcrypt.hash(reqBody.password, 16);
        userExists.save();
      } else {
        return Response.json(
          { error: `${reqBody.email} already registered` },
          { status: 400 }
        );
      }
    } else {
      // hash the password with bcrypt and store user
      errorProgressMessage = "Error hashing password: ";
      const hashedPassword = await bcrypt.hash(reqBody.password, 16);
      await User.create({
        email: reqBody.email,
        password: hashedPassword,
      });
    }

    return Response.json(
      { message: `${reqBody.email} registered successfully` },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
