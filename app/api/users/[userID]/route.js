import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";

//DELETES one user from db
export const DELETE = async (request, { params }) => {
  const { userID } = await params;
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    // check if user already exists
    errorProgressMessage = "Error checking if user exists: ";
    const dbUser = await User.findById(userID);

    errorProgressMessage = "Error deleting user: ";
    await User.deleteOne({_id: userID});

    return Response.json(
      { message: `user id ${userID} deleted successfully` },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
