import { configureStore } from '@reduxjs/toolkit'
import searchReducer from "@/redux/features/search/searchSlice";
import headerVisibilityReducer from "@/redux/features/headerVisibility/headerVisibilitySlice";
import searchbarsReducer from "@/redux/features/searchbars/searchbarsSlice";
import filtersReducer from "@/redux/features/filters/filtersSlice";
import modalsReducer from "@/redux/features/modals/modalsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
        search: searchReducer,
        headerVisibility: headerVisibilityReducer,
        searchbars: searchbarsReducer,
        filters: filtersReducer,
        modals: modalsReducer
      }
  })
}