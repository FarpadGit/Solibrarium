"use client";

import { useState, useRef, useEffect, useContext, createContext } from "react";
import { usePathname } from "next/navigation";
import { SearchENUM } from "@/utils/SearchENUM";
import { send } from "@/utils/FetchRequest";

const searchContext = createContext();
export const useSearchContext = () => useContext(searchContext);

const bookResultsDefaultValue = [
  { id: 0, placeholder: true },
  { id: 1, placeholder: true },
  { id: 2, placeholder: true },
];

export default ({ children }) => {
  const [inTitle, setInTitle] = useState("");
  const [inAuthor, setInAuthor] = useState("");
  const [inPublisher, setInPublisher] = useState("");
  const [subject, setSubject] = useState("");
  const [excluding, setExcluding] = useState("");
  const [isbn, setIsbn] = useState("");
  const [transient, setTransient] = useState({});
  const [shouldClearSearch, setShouldClearSearch] = useState(false);
  const clearAllFields = () => {
    setShouldClearSearch((prev) => !prev);
    setInTitle("");
    setInAuthor("");
    setInPublisher("");
    setSubject("");
    setExcluding("");
    setIsbn("");
  };

  const SearchCriteria = {
    setTitleSearch: (value) => setInTitle(value),
    setAuthorSearch: (value) => setInAuthor(value),
    setPublisherSearch: (value) => setInPublisher(value),
    setSubjectSearch: (value) => setSubject(value),
    setExcludingSearch: (value) => setExcluding(value),
    setISBNSearch: (value) => setIsbn(value),
    setTransientSearch: (value) => setTransient(value),
    shouldClearSearch,
    clearAllFields,
  };

  const [bookResults, setBookResults] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const aborted = useRef(false);
  const pageOffset = useRef(0);
  const resetPagination = () => {
    pageOffset.current = 0;
    //if user typed in a new search query then previous searches tagged as transient are cleared out and are not part of the current query
    if (transient[SearchENUM.title]) setInTitle("");
    if (transient[SearchENUM.author]) setInAuthor("");
    if (transient[SearchENUM.publisher]) setInPublisher("");
    if (transient[SearchENUM.subject]) setSubject("");
    if (transient[SearchENUM.excluding]) setExcluding("");
    if (transient[SearchENUM.isbn]) setIsbn("");
    setTransient({});
    //if there are results from a previous search on screen replace them with placeholder cards while the next search is executing
    //otherwise we are likely leaving the /Search page and should set results back to the default first-visit value
    if (bookResults.length > 0)
      setBookResults((prev) =>
        prev.map((book) => ({ id: book.id, placeholder: true }))
      );
    else setBookResults(bookResultsDefaultValue);
    setHasMore(true);
  };
  const nextPage = () => {
    if (!aborted.current) handleFetch();
  };

  const SearchResults = {
    bookResults,
    searchString,
    isLoading,
    hasMore,
    resetPagination,
    nextPage,
  };

  //Puts together a search query string for the server API
  function getSearchQueryForServer(page = pageOffset.current) {
    return [
      inTitle === "" ? "" : `inTitle=${inTitle}`,
      inAuthor === "" ? "" : `inAuthor=${inAuthor}`,
      inPublisher === "" ? "" : `inPublisher=${inPublisher}`,
      subject === "" ? "" : `subject=${subject}`,
      excluding === "" ? "" : `excluding=${excluding}`,
      isbn === "" ? "" : `isbn=${isbn}`,
      `page=${page}`,
    ]
      .filter((i) => i !== "")
      .join("&");
  }

  //Puts together a search query string for the client to display what the search values are
  function getSearchStringForClient() {
    return [
      inTitle === "" ? "" : `cím: "${inTitle}"`,
      inAuthor === "" ? "" : `szerző: "${inAuthor}"`,
      inPublisher === "" ? "" : `kiadó: "${inPublisher}"`,
      subject === "" ? "" : `kategória: "${subject}"`,
      excluding === "" ? "" : `ne szerepeljen: "${excluding}"`,
      isbn === "" ? "" : `isbn: "${isbn}"`,
    ]
      .filter((i) => i !== "")
      .join(", ");
  }

  const isOnSearchPage = usePathname() === "/search";

  async function handleFetch() {
    //if search was called with no search values return an empty array and scroll to top
    if (getSearchQueryForServer().startsWith("page")) {
      if (!isOnSearchPage) return;
      setBookResults([]);
      window.scrollTo({ top: 0, left: 0 });
      return;
    }
    //if we reached the end of an infinite scroll dont do anything
    if (!hasMore) return;
    //The search API for Google Books is somewhat unreliable and sometimes returns results already present on the previous page
    //To avoid duplicates while also returning 10 results per page we have to keep track of the results and query multiple times as needed
    //while remembering where did we leave the iterating - its not pretty
    try {
      setIsLoading(true);
      setSearchString(getSearchStringForClient());
      let tempBookResults = bookResults[0]?.placeholder ? [] : bookResults;
      let tempHasMore = hasMore;
      const targetLength = tempBookResults.length + 10;
      for (
        ;
        tempBookResults.length < targetLength && tempHasMore;
        pageOffset.current += 10
      ) {
        if (aborted.current) throw "Aborted";
        const searchquery = getSearchQueryForServer(pageOffset.current);
        const returnedBooks = await send({
          url: `/api/search?${searchquery}`,
        });
        if (returnedBooks.length === 0) tempHasMore = false;
        if (returnedBooks.error) throw new Error();
        else {
          tempHasMore =
            tempBookResults.length + returnedBooks.length >= targetLength;
          //Filter out duplicate results - because Google API
          tempBookResults = [...tempBookResults, ...returnedBooks].filter(
            (b, index, a) => a.findIndex((i) => b.id === i.id) === index
          );
        }
      }
      //when we have 10 new results the iterator will be one page ahead so we step back pagination with one page
      pageOffset.current -= 10;
      //if we collected more then 10 new results (the targetLength) then crop off the end and leave them for the next round
      tempBookResults.splice(targetLength);
      setBookResults(tempBookResults);
      setHasMore(tempHasMore);
    } catch (error) {
      if (error === "Aborted") return;
      console.error("Error in Search context", error);
      setBookResults(["error"]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      aborted.current = false;
    }
  }

  //When any of the search values change send search request to server
  useEffect(() => {
    if (isLoading) aborted.current = true;
    handleFetch();
  }, [inTitle, inAuthor, inPublisher, subject, excluding, isbn]);

  const Search = {
    SearchCriteria,
    SearchResults,
  };

  return (
    <searchContext.Provider value={Search}>{children}</searchContext.Provider>
  );
};
