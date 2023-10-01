import jsdom from "jsdom";

//extracts book data from the JSON response given by Google Books API
export const getBookDetails = (volumeBody) => {
  try {
    return {
      id: volumeBody.id,
      author: volumeBody.volumeInfo.authors?.join(", "),
      title: volumeBody.volumeInfo.title,
      subtitle: volumeBody.volumeInfo.subtitle,
      publisher: volumeBody.volumeInfo.publisher,
      publishedDate: volumeBody.volumeInfo.publishedDate,
      description: getSanitizedDescription(volumeBody.volumeInfo.description),
      ISBN10: volumeBody.volumeInfo.industryIdentifiers?.at(0)?.identifier,
      ISBN13: volumeBody.volumeInfo.industryIdentifiers?.at(1)?.identifier,
      pageCount: volumeBody.volumeInfo.pageCount,
      dimensions: volumeBody.volumeInfo.dimensions,
      categories: volumeBody.volumeInfo.categories,
      rating: volumeBody.volumeInfo.averageRating,
      ratingsCount: volumeBody.volumeInfo.ratingsCount,
      thumbnail: volumeBody.volumeInfo.imageLinks?.thumbnail,
      image: getLargestImage(volumeBody.volumeInfo.imageLinks),
      price: volumeBody.saleInfo?.retailPrice?.amount,
    };
  } catch (error) {
    console.error("Error in BookDetails", error);
    return { error: "Failed to fetch book details" };
  }
};

function getSanitizedDescription(description) {
  //sometimes Google Books just returns trash invalid html as the description which I have to sanitize first with this trick (somehow it works)
  //gotta love Google Books
  const parsedDescription = new jsdom.JSDOM(description, "text/html");
  const refactoredDescription =
    parsedDescription.window.document.querySelector("body").innerHTML;
  return refactoredDescription;
}

function getLargestImage(imageLinks) {
  if (!imageLinks) return null;
  if (imageLinks.extraLarge) return imageLinks.extraLarge;
  if (imageLinks.large) return imageLinks.large;
  if (imageLinks.medium) return imageLinks.medium;
  if (imageLinks.small) return imageLinks.small;
  if (imageLinks.thumbnail) return imageLinks.thumbnail;
}

//function getApproxImageHeight(imageLinks) {
//  if (!imageLinks) return 0;
//  if (imageLinks.extraLarge) return 2065;
//  if (imageLinks.large) return 1290;
//  if (imageLinks.medium) return 925;
//  if (imageLinks.small) return 485;
//  if (imageLinks.thumbnail) return 205;
//}
