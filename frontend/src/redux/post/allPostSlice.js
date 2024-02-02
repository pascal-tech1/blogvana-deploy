import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

export const fetchPostByCategory = createAsyncThunk(
	"fetch/PostByCategory",
	async (params, { getState, rejectWithValue, dispatch }) => {
		let {
			page,
			postNumberPerPage,
			activeCategory,
			searchQuery,
			notLoginUserRandomPostFetchingId,
			morePostCategory,
		} = getState().allPostSlice;
		const userId = getState().userSlice?.userId;

		const newPage = params?.page || page;
		const newPostNumberPerPaage =
			params?.postNumberPerPage || postNumberPerPage;
		const category =
			params?.where === "morePost" ? morePostCategory : activeCategory;

		try {
			const resp = await customFetch(
				`/posts/?page=${newPage}&postNumberPerPage=${newPostNumberPerPaage}
				&category=${category}&searchQuery=${searchQuery}
				&where=${params?.where}&id=${params?.id}
				&userId=${userId}&randomPostId=${notLoginUserRandomPostFetchingId}`
			);

			return { data: resp.data, fromWhere: params?.where };
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchTrendingPost = createAsyncThunk(
	"fetch/TrendingPost",
	async (numberOfPost, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/posts/trending-post", {
				numberOfPost,
			});

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	allPostStatus: "idle",
	allPost: [],
	page: 1,
	postNumberPerPage: 10,
	searchQuery: "",
	hasMore: true,
	activeCategory: "all",
	morePostCategory: "all",
	morePost: [],
	morePostStatus: "idle",
	morePostHasMore: true,
	notLoginUserRandomPostFetchingId: null,
};

const allPostSlice = createSlice({
	name: "allPostSlice",
	initialState,

	reducers: {
		setFirstSearch: (state, { payload }) => {
			state.searchQuery = payload;
			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},
		setEmptySearch: (state, { payload }) => {
			state.searchQuery = "";

			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},
		IncreasePageNumber: (state, { payload }) => {
			state.page = state.page + 1;
		},
		setFetchFirstCategory: (state, { payload }) => {
			state.activeCategory = payload;
			state.allPost = [];
			state.page = 1;
			state.hasMore = true;
		},

		updateNumbPostViewInAllPostSlice: (state, { payload }) => {
			state.allPost.map((post) => {
				if (post._id === payload.id) {
					post.numViews = payload.numViews;
				}
			});
		},
		updateSinglePost: (state, { payload }) => {
			const index = state.allPost.findIndex(
				(post) => post.id === payload.id
			);
			const post = state.allPost[index];

			state.allPost[index] = { ...post, ...payload.post };
		},
		togleAllPostLikesAndDisLikes: (state, { payload }) => {
			const { postId, likes, disLikes } = payload;
			state.allPost?.map((post) => {
				if (post?._id === postId) {
					post.likes = likes;
					post.disLikes = disLikes;
				}
			});
		},
		clearMorePost: (state) => {
			state.morePost = [];
			state.morePostHasMore = true;
		},
		clearSearchAndCategory: (state, { payload }) => {
			state.searchQuery = "";
		},
	},

	extraReducers: {
		[fetchPostByCategory.pending]: (state, action) => {
			state.allPostStatus = "loading";
		},
		[fetchPostByCategory.fulfilled]: (state, { payload }) => {
			if (payload?.fromWhere === "morePost") {
				if (payload.data.posts.length < state.postNumberPerPage) {
					state.morePostHasMore = false;
					state.morePost = [...state.morePost, ...payload.data.posts];
				} else {
					state.morePost = [...state.morePost, ...payload.data.posts];
				}
				state.morePostStatus = "success";
			} else {
				if (payload.data.posts.length < state.postNumberPerPage) {
					state.hasMore = false;
					state.allPost = [...state.allPost, ...payload.data.posts];
				} else {
					state.allPost = [...state.allPost, ...payload.data.posts];

					state.notLoginUserRandomPostFetchingId =
						payload.data.randomPostId;
				}
			}
			state.allPostStatus = "success";
		},
		[fetchPostByCategory.rejected]: (state, { payload }) => {
			if (payload?.fromWhere === "morePost") {
				state.morePostStatus = "failed";
				toast.error("fetching more Post faild try again later");
			} else {
				state.allPostStatus = "failed";
			}
		},
		[fetchTrendingPost.pending]: (state, { payload }) => {
			state.trendingPostStatus = "loading";
		},
		[fetchTrendingPost.fulfilled]: (state, { payload }) => {
			
			state.trendingPostStatus = "success";
			
			state.trendingPost = payload;
		},
		[fetchTrendingPost.rejected]: (state, { payload }) => {
			state.trendingPostStatus = "failed";
		},
	},
});
export const {
	togleAllPostLikesAndDisLikes,
	IncreasePageNumber,
	setFirstSearch,
	updateNumbPostViewInAllPostSlice,
	updateSinglePost,
	setFetchFirstCategory,

	setEmptySearch,
	clearMorePost,
	clearSearchAndCategory,
} = allPostSlice.actions;
export default allPostSlice.reducer;
