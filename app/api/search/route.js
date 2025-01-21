import { getBookDetails } from "@/app/api/bookDetails";
import { cacheBook } from "@/utils/CachedBooks";
import { send } from "@/utils/FetchRequest";

//GETS an array of books as returned by the Google Books Search API and returns a processed version of them
export const GET = async (request) => {
  try {
    //gets the search params from the url and wraps the non-single words in quotes to appease the Google Search API
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    Object.keys(searchParams).forEach((param) => {
      if (searchParams[param].includes(" "))
        searchParams[param] = `"${searchParams[param]}"`.replace(/\s/g, "+");
    });

    const { inTitle, inAuthor, inPublisher, subject, excluding, isbn, page } =
      searchParams;

    //translates the search params to syntax used by Google Books
    const apiParams = [
      inTitle ? `intitle:${inTitle}` : "",
      inAuthor ? `inauthor:${inAuthor}` : "",
      inPublisher ? `inpublisher:${inPublisher}` : "",
      subject ? `subject:${subject}` : "",
      excluding ? `-${excluding}` : "",
      isbn ? `isbn:${isbn}` : "",
    ];
    const searchquery = apiParams.filter((i) => i !== "").join("+");
    //sends request to API, processes the response and returns an array of book details
    const books = await send({
      url: `https://www.googleapis.com/books/v1/volumes?q=${searchquery}&startIndex=${page}&key=${process.env.BOOKS_API_KEY}`,
      callback: (body) => {
        if (!body.items) return [];
        const bookWithDetails = body.items.map((book) => getBookDetails(book));
        bookWithDetails.forEach(book => cacheBook(book));
        return bookWithDetails;
      },
    });

    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    console.error("Error in Search route", error);
    return Response.json(
      { error: "Failed to execute search in database" },
      {
        status: 500,
      }
    );
  }
};
