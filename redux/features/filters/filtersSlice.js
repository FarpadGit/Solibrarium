import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isFilterOn: false,
}

export const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilter: (state, action) => {
            let value, shouldScrollToTop = false;
            
            if(typeof action.payload === "boolean") value = action.payload;
            else {
                ({ value, shouldScrollToTop } = action.payload ?? {});
            };
            
            if (shouldScrollToTop) window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            state.isFilterOn = value;
        },
        
    },
})

export const selector = (state) => state.filters;
export const reducers = filtersSlice.actions;
export default filtersSlice.reducer;