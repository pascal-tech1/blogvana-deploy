import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import allPostSlice from "./post/allPostSlice";
import singlePostSlice from "./post/singlePostSlice";
import morePostSlice from "./post/morePostSlice";
import generalPostSlice from "./post/generalPostSlice";
import categorySlice from "./category/categorySlice";
import messageSlice from "./message/messageSlice";
import adminSlice from "./admin/adminSlice";

export const store = configureStore({
	reducer: {
		userSlice,
		allPostSlice,
		singlePostSlice,
		morePostSlice,
		generalPostSlice,
		categorySlice,
		messageSlice,
		adminSlice,
	},
});
