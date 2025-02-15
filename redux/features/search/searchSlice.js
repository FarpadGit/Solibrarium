import { SearchENUM } from "@/utils/SearchENUM";
import { createSlice } from "@reduxjs/toolkit";
import { executeSearch, nextPage } from "./searchAsync";

const bookResultsDefaultValue = [];

const initialState = {
    inTitle: "", 
    inAuthor: "", 
    inPublisher: "", 
    subject: "", 
    excluding: "", 
    isbn: "", 
    transient: {}, 

    bookResults: [],
    searchString: "",
    isLoading: false,
    hasMore: true,
    wasError: false,
    pageOffset: 0
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchValue: (state, action) => {
            const { type, newValue } = action.payload;
            if(type === SearchENUM.title) state.inTitle = newValue;
            if(type === SearchENUM.author) state.inAuthor = newValue;
            if(type === SearchENUM.publisher) state.inPublisher = newValue;
            if(type === SearchENUM.subject) state.subject = newValue;
            if(type === SearchENUM.excluding) state.excluding = newValue;
            if(type === SearchENUM.isbn) state.isbn = newValue;
        },
        setTransientSearch: (state, action) => { state.transient = action.payload; },
        clearAllFields: (state) => {
            state.inTitle = "";
            state.inAuthor = "";
            state.inPublisher = "";
            state.subject = "";
            state.excluding = "";
            state.isbn = "";
        },
        resetPagination: (state) => {
            state.pageOffset = 0;
            //previous searches tagged as transient are cleared out
            if (state.transient[SearchENUM.title]) state.inTitle = "";
            if (state.transient[SearchENUM.author]) state.inAuthor  = "";
            if (state.transient[SearchENUM.publisher]) state.inPublisher = "";
            if (state.transient[SearchENUM.subject]) state.subject = "";
            if (state.transient[SearchENUM.excluding]) state.excluding = "";
            if (state.transient[SearchENUM.isbn]) state.isbn = "";
            state.transient = {};

            const areValuesEmpty = 
                state.inTitle === "" && 
                state.inAuthor === "" && 
                state.inPublisher === "" && 
                state.subject === "" && 
                state.excluding === "" &&
                state.isbn === "";

            //if there are non-empty search values then replace previous results on screen with placeholder cards while the next search is executing
            //otherwise we are likely leaving the /Search page and should set results back to the default first-visit value
            if (!areValuesEmpty)
                state.bookResults = state.bookResults.map((book) => ({ id: book.id, placeholder: true }));
            else state.bookResults = bookResultsDefaultValue;
            state.hasMore = true;
          },
    },
    extraReducers: (builder) => {
        builder
          .addCase(executeSearch.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(executeSearch.fulfilled, (state, action) => {
            if(action.payload.wasError) return { ...initialState, wasError: true };
            return { ...action.payload, isLoading: false };
        })
        .addCase(executeSearch.rejected, (state) => {
            state.isLoading = false;
            state.wasError = true;
            state.bookResults = [];
        })
        .addCase(nextPage.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(nextPage.fulfilled, (state, action) => {
            return { ...action.payload, isLoading: false, wasError: false };
        })
        .addCase(nextPage.rejected, (state) => {
            state.isLoading = false;
            state.wasError = true;
            state.bookResults = [];
        });
      },
})

export const selector = (state) => state.search;
export const reducers = searchSlice.actions;
export default searchSlice.reducer;