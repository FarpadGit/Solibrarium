import { getBookDetails } from "@/app/api/bookDetails";
import { getFromCache, cacheBook } from "@/utils/cachedBooks";
import { send } from "@/utils/FetchRequest";

//server-side helper function that fetches a book and returns its details to /details/[bookID]
export const getBookInfo = async (id) => {
  try {
    const cachedBook = getFromCache(id);
    if (cachedBook) return cachedBook;
    const book = await send({
      url: `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.BOOKS_API_KEY}`,
      callback: (body) => getBookDetails(body),
    });

    cacheBook(book);
    return book;
  } catch (error) {
    return Promise.reject("Failed to fetch from database: " + error);
  }
};
