import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoginOpen: false,
  isConfirmOpen: false,
  areButtonsCollapsed: false,
}

export const modalsSlice = createSlice({
    name: "modals",
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.isLoginOpen = true;
        },
        closeLoginModal: (state) => {
            state.isLoginOpen = false;
        },
        openConfirmModal: (state) => {
            state.isConfirmOpen = true;
        },
        closeConfirmModal: (state) => {
            state.isConfirmOpen = false;
        },
        toggleCollapsedButtons: (state) => {
            state.areButtonsCollapsed = !state.areButtonsCollapsed;
        },
    },
})

export const selector = (state) => state.modals;
export const reducers = modalsSlice.actions;
export default modalsSlice.reducer;