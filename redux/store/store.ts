import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../slice/authSlice/authSlice"

export const store = configureStore({
reducer:{
    auth: authSlice.reducer
}
})