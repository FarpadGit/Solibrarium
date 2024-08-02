import ids from "./Bestsellers.json";
import { getBookDetails } from "@/app/api/bookDetails";
import { getFromCache, cacheBook } from "@/utils/cachedBooks";
import { send } from "@/utils/FetchRequest";

//GETS all the volume data for the books listed in Bestsellers.json and returns the fields specified in getBookDetails
export const getBestsellers = async () => {
  try {
    const books = await Promise.all(
      ids.map(async (id) => {
        const cachedBook = getFromCache(id.id);
        if(cachedBook) return cachedBook;

        const book = await send({
          url: `https://www.googleapis.com/books/v1/volumes/${id.id}?key=${process.env.BOOKS_API_KEY}`,
          callback: (body) => getBookDetails(body),
        });

        if(book.error) return null;
        cacheBook(book);
        return book;
      })
    );

    if(books.includes(null)) return {error: "error"}
    return books;
  } catch (error) {
    console.error("Error in Bestsellers component", error);
    return Promise.reject("Failed to fetch bestsellers from database " + error);
  }
};
