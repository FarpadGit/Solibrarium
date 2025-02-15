import { SearchENUM } from "@/utils/SearchENUM";
import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchBarArray: [
        { id: 0, type: SearchENUM.title },
      ],
}

export const searchbarsSlice = createSlice({
    name: "searchbars",
    initialState,
    reducers: {
        addSearchBar: (state, action) => {
            state.searchBarArray.push(action.payload);
        },
        removeSearchBar: (state, action) => {
            state.searchBarArray = state.searchBarArray.filter((searchbar) => searchbar.id !== action.payload)
        },
        replaceSearchBarType: (state, action) => {
            const { id, newType } = action.payload;
            const newSearchBarArray = state.searchBarArray.map((searchbar) =>
                searchbar.id === id ? { id: searchbar.id, type: newType } : searchbar
              );
              state.searchBarArray = newSearchBarArray;
        },
        
    },
})

export const selector = createSelector((state) => state.searchbars, (state) => {
    return { searchBarArray: state.searchBarArray, 
        currentSearchBarCount: state.searchBarArray.length, 
        hasSearchBarWithType: (type) => state.searchBarArray.map((searchbar) => searchbar.type).includes(type) }
});
export const reducers = searchbarsSlice.actions;
export default searchbarsSlice.reducer;