import ids from "./Bestsellers.json";
import { getBookDetails } from "@/app/api/bookDetails";
import { send } from "@/utils/FetchRequest";

//GETS all the volume data for the books listed in Bestsellers.json and returns the fields specified in getBookDetails
export const getBestsellers = async () => {
  try {
    const books = await Promise.all(
      ids.map(async (id) => {
        const book = await send({
          url: `https://www.googleapis.com/books/v1/volumes/${id.id}`,
          callback: (body) => getBookDetails(body),
        });
        return book;
      })
    );

    return books;
  } catch (error) {
    console.error("Error in Bestsellers component", error);
    return Promise.reject("Failed to fetch bestsellers from database " + error);
  }
};
