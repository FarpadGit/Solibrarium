import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";

//DELETES one user from db
export const DELETE = async (request, { params }) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    // check if user already exists
    errorProgressMessage = "Error checking if user exists: ";
    const dbUser = await User.findById(params.userID);

    errorProgressMessage = "Error deleting user: ";
    await User.deleteOne({_id: params.userID});

    return Response.json(
      { message: `user id ${params.userID} deleted successfully` },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
