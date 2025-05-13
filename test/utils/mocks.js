import { getBookDetails } from "../../app/api/bookDetails";
import { uniqueId } from "lodash";

// The structure Google Books returns for a specific book
const mockGoogleBookResponse = {
    id: 0,
    volumeInfo: {
      authors: ["Fake Author"],
      title: "Fake Book Title",
      subtitle: "Fake Subtitle",
      publisher: "Fake Pulisher Ltd.",
      publishedDate: "1970. 01. 01.",
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Hic mollitia blanditiis non doloremque facere neque necessitatibus, eius ea explicabo quas magnam architecto. 
        Laborum, reprehenderit. Recusandae, unde! Perspiciatis vel molestiae dolores et sapiente! Odio ipsum laborum consequatur pariatur est error nisi. 
        Labore, reiciendis. Similique veniam, alias cum accusamus quasi impedit ut.`,
      industryIdentifiers: [
        {
          identifier: "3-16-148410-X",
        },
        {
          identifier: "978-3-16-148410-0",
        },
      ],
      pageCount: "123",
      dimensions: {
        height: "10 cm",
        width: "10 cm",
        thickness: "10 cm"
      },
      categories: ["fake category"],
      averageRating: 5,
      ratingsCount: 100,
      imageLinks: {
        thumbnail: "/book_placeholder.png",
        large: "/book_placeholder.png",
      },
    },
    saleInfo: {
      retailPrice: {
        amount: 999,
      },
    },
};

// takes the template above and generates a unique ID and title for it
export const generateMockGoogleBookResponse = () => {
  const randomID = uniqueId();
  return { 
    ...mockGoogleBookResponse, 
    id: randomID, 
    volumeInfo: {
      ...mockGoogleBookResponse.volumeInfo,
      title: mockGoogleBookResponse.volumeInfo.title + " " + randomID
    } 
  }
};

// maps the mock Google Book structure to a Solibrarium book structure (getBookDetails is a trusted function and is not tested)
export const generateMockBook = () => getBookDetails(generateMockGoogleBookResponse());

// in case a generated mock book cannot be saved before rendering for comparison, use mockBook instead, such as: screen.getBytext(mockBook.title)
export const mockBook = { ...getBookDetails(mockGoogleBookResponse), title: new RegExp(mockGoogleBookResponse.volumeInfo.title) };

const mockReview = {
  id: 0,
  book: generateMockBook(),
  reviewText: "Fake Review",
  rating: 5
};
export const generateMockReview = () => ({ ...mockReview, id: uniqueId() });

export const mockCartItems = Array.from({ length: 5 }, () => ({
  bookData: generateMockBook(),
  quantity: 1,
}));