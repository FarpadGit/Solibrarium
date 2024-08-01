import { getBookDetails } from "@/app/api/bookDetails";
import { send } from "@/utils/FetchRequest";

//server-side helper function that fetches a book and returns its details to /details/[bookID]
export const getBookInfo = async (id) => {
  try {
    const book = await send({
      url: `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.BOOKS_API_KEY}`,
      callback: (body) => getBookDetails(body),
    });

    return book;
  } catch (error) {
    return Promise.reject("Failed to fetch from database: " + error);
  }
};
