import User from "@/models/user";
import { connectToDB } from "@/utils/DatabaseConnect";

//GETS all books in users collection
export const GET = async (request, { params }) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    // get user from database
    errorProgressMessage = "Error finding user in database: ";
    const dbUser = await User.findById(params.userID);

    if (!dbUser) {
      return Response.json(
        { error: `couldn't find user ID ${params.userID} in database` },
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(dbUser.books), { status: 200 });
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

//POSTS many books and adds to users collection
export const POST = async (request, { params }) => {
  let errorProgressMessage = "Failed to connect to database: ";
  try {
    await connectToDB();
    const reqBody = await request.json();
    // get user from database
    errorProgressMessage = "Error finding user in database: ";
    const dbUser = await User.findById(params.userID);

    if (!dbUser) {
      return Response.json(
        { error: `couldn't find user ID ${params.userID} in database` },
        {
          status: 404,
        }
      );
    }

    // adding books to collection
    errorProgressMessage = "Error adding books to collection: ";
    reqBody.books.forEach((book) => {
      if (dbUser.books.findIndex((b) => b.id === book.id) === -1)
        dbUser.books.push(book);
    });
    dbUser.loyaltyPoints += reqBody.loyaltyPoints;
    if (dbUser.loyaltyPoints < 0) dbUser.loyaltyPoints = 0;
    await dbUser.save();

    return Response.json(
      { message: `${reqBody.books.count} added successfully` },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(errorProgressMessage, error.message);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
