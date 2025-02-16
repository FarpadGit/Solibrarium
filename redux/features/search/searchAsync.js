import { send } from "@/utils/FetchRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

const resultsPerPage = 10;

//Puts together a search query string for the server API
function getSearchQueryForServer(state) {
    return [
        state.inTitle === "" ? "" : `inTitle=${state.inTitle.replace(/\s/g, "+")}`,
        state.inAuthor === "" ? "" : `inAuthor=${state.inAuthor.replace(/\s/g, "+")}`,
        state.inPublisher === "" ? "" : `inPublisher=${state.inPublisher.replace(/\s/g, "+")}`,
        state.subject === "" ? "" : `subject=${state.subject.replace(/\s/g, "+")}`,
        state.excluding === "" ? "" : `excluding=${state.excluding.replace(/\s/g, "+")}`,
        state.isbn === "" ? "" : `isbn=${state.isbn.replace(/\s/g, "+")}`,
      `page=${state.pageOffset}`,
    ]
      .filter((i) => i !== "")
      .join("&");
}

//Puts together a search query string for the client to display what the search values are
function getSearchStringForClient(state) {
    return [
        state.inTitle === "" ? "" : `cím: "${state.inTitle}"`,
        state.inAuthor === "" ? "" : `szerző: "${state.inAuthor}"`,
        state.inPublisher === "" ? "" : `kiadó: "${state.inPublisher}"`,
        state.subject === "" ? "" : `kategória: "${state.subject}"`,
        state.excluding === "" ? "" : `ne szerepeljen: "${state.excluding}"`,
        state.isbn === "" ? "" : `isbn: "${state.isbn}"`,
    ]
        .filter((i) => i !== "")
        .join(", ");
}

async function handleFetch(state) {
    let newState = state;
    
    const searchquery = getSearchQueryForServer(state);

    //if we reached the end of an infinite scroll dont do anything
    if (!state.hasMore) return newState;
    try {
        newState = { ...newState, searchString: getSearchStringForClient(state) }
        let tempBookResults = state.bookResults[0]?.placeholder ? [] : [...newState.bookResults];
        
        const returnedBooks =  await send(`/api/search?${searchquery}`);
        
        if (returnedBooks.error) throw new Error();
        if (returnedBooks.length === 0) newState = { ...newState, hasMore: false };
        else {
            //The search API for Google Books is somewhat unreliable and sometimes returns results already present on the previous page, these need to be filtered out
            tempBookResults = [...tempBookResults, ...returnedBooks].filter(
                (b, index, a) => a.findIndex((i) => b.id === i.id) === index
            );
        }
        newState = { ...newState, bookResults: tempBookResults, wasError: false }
    } catch (error) {
        console.error("Error while executing Search: ", error);
        newState = { ...newState, bookResults: [], wasError: true, hasMore: false }
    } finally {
        return newState;
    }
}

export const executeSearch = createAsyncThunk("search/setSearch", 
    async (params, thunkAPI) => {
        const { isOnSearchPage = false } = params ?? {};
        
        const state = thunkAPI.getState();
        let newState = state.search;

        const areNewValuesEmpty = 
            newState.inTitle === "" && 
            newState.inAuthor === "" && 
            newState.inPublisher === "" && 
            newState.subject === "" && 
            newState.excluding === "" &&
            newState.isbn === "";
        
        //if search was called with no search values return an empty array
        if(areNewValuesEmpty && isOnSearchPage) {
            newState = { ...newState, bookResults: [], wasError: false };
            return new Promise((resolve)=> resolve(newState));
        }
        
        return handleFetch(newState);
    });

export const nextPage = createAsyncThunk("search/nextPage", 
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();

        let newState = state.search;
        
        newState = { ...newState, pageOffset: newState.pageOffset + resultsPerPage };
        
        return handleFetch(newState);
    });