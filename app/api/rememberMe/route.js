import RememberMe from "@/models/rememberMe";
import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

//POSTS a user email and writes an associated Remember Me key-value pair into database
export const POST = async (request) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();
    const rememberMeToken = {
      Key: reqBody.tokenKey ?? uuidv4(),
      Value: uuidv4(),
    };

    //brand new Remember Me token for a given user
    if (reqBody.userEmail) {
      //looking up user with email address
      errorProgressMessage = "Error finding user in database: ";
      const userInDB = await User.findOne({ email: reqBody.userEmail });
      if (!userInDB)
        return Response.json(
          { error: `User with email ${reqBody.userEmail} cannot be found` },
          {
            status: 404,
          }
        );
      //saving new Remember Me token into database
      errorProgressMessage = "Error writing new token into database: ";
      RememberMe.create({
        userRef: userInDB._id,
        tokenKey: rememberMeToken.Key,
        tokenValue: await bcrypt.hash(rememberMeToken.Value, 16),
      });
    }
    //security replacement token for existing Remember Me
    else if (reqBody.tokenKey) {
      //looking up token in database
      errorProgressMessage = "Error finding token in database: ";
      const tokenInDB = await RememberMe.findOne({
        tokenKey: reqBody.tokenKey,
      });
      if (!tokenInDB)
        return Response.json(
          { error: `Remember Me token ${reqBody.tokenKey} cannot be found` },
          {
            status: 500,
          }
        );
      //saving new Remember Me token into database
      errorProgressMessage = "Error writing new token into database: ";
      (tokenInDB.tokenValue = await bcrypt.hash(rememberMeToken.Value, 16)),
        tokenInDB.save();
    }

    return Response.json(rememberMeToken, { status: 201 });
  } catch (error) {
    console.error(errorProgressMessage, error);
    return Response.json(
      { error: "Failed to create Remember Me token" },
      {
        status: 500,
      }
    );
  }
};

//DELETES a Remember Me key-value pair from database
export const DELETE = async (request) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();
    // check if token already exists
    errorProgressMessage = "Error checking if token exists: ";
    const tokenInDB = await RememberMe.findOne({ tokenKey: reqBody.tokenKey });

    if (!tokenInDB) {
      return Response.json(
        { error: `Token ${reqBody.tokenKey} cannot be found` },
        { status: 500 }
      );
    }

    //delete token
    errorProgressMessage = "Error deleting token from database: ";
    await RememberMe.deleteOne({ tokenKey: reqBody.tokenKey });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(errorProgressMessage, error);
    return Response.json(
      { error: "Failed to delete Remember Me token from database" },
      {
        status: 500,
      }
    );
  }
};
