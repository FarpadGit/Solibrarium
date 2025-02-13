import { getBookDetails } from "@/app/api/bookDetails";
import { getFromCache, cacheBook } from "@/utils/CachedBooks";
import { sendWithAPIKey } from "@/utils/FetchRequest";

//server-side helper function that fetches a book and returns its details to /details/[bookID]
export const getBookInfo = async (id) => {
  try {
    const cachedBook = await getFromCache(id);
    if (cachedBook) return cachedBook;
    const book = await sendWithAPIKey(
      `https://www.googleapis.com/books/v1/volumes/${id}`
    ).then((body) => getBookDetails(body));

    cacheBook(book);
    return book;
  } catch (error) {
    return Promise.reject("Failed to fetch from database: " + error);
  }
};
