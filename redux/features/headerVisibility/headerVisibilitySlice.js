import { createSlice } from "@reduxjs/toolkit";

export const headerCollapseAnimationDuration = 500;

const initialState = {
    canHeaderExpand: true, 
    isHeaderMinimized: false,
    canHandleScroll: true,
}

export const headerVisibilitySlice = createSlice({
    name: "headerVisibility",
    initialState,
    reducers: {
        capSearchbars: (state) => { state.canHeaderExpand = false; },
        uncapSearchbars: (state) => { state.canHeaderExpand = true; },
        minimizeHeader: (state) => { state.isHeaderMinimized = true; },
        maximizeHeader: (state) => { state.isHeaderMinimized = false; },
        toggleHeader: (state) => { state.isHeaderMinimized = !state.isHeaderMinimized; },
        lockHeader: (state) => { state.canHandleScroll = false; },
        unlockHeader: (state) => { state.canHandleScroll = true; },
    },
})

export const selector = (state) => state.headerVisibility;
export const reducers = headerVisibilitySlice.actions;
export default headerVisibilitySlice.reducer;