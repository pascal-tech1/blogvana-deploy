import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { togleSinglePostLikesAndDisLikes } from "./singlePostSlice";
import { togleAllPostLikesAndDisLikes } from "./allPostSlice";
import { togleMorePostLikesAndDisLikes } from "./morePostSlice";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";

export const likeOrDislikePost = createAsyncThunk(
	"like/DislikePost",
	async (data, { getState, rejectWithValue, dispatch }) => {
		const { postId, choice } = data;
		try {
			const resp = await customFetch.put(
				`/posts/${choice}`,
				{ postId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			const disLikes = resp.data.disLikes;
			const likes = resp.data.likes;
			dispatch(
				togleSinglePostLikesAndDisLikes({ likes, disLikes, postId })
			);
			dispatch(togleAllPostLikesAndDisLikes({ likes, disLikes, postId }));
			dispatch(togleMorePostLikesAndDisLikes({ likes, disLikes, postId }));

			return {
				postId,
				disLikes,
				likes,
				choice,
			};
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchPostCreatorProfile = createAsyncThunk(
	"fetch/postcreatorProfile",
	async (userId, { rejectWithValue, getState, dispatch }) => {
		try {
			const resp = await customFetch(`/users/profile/${userId}`, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchCreatorPosts = createAsyncThunk(
	"fetch/creatorPost",
	async (params, { getState, rejectWithValue }) => {
		const postNumberPerPage = 10;
		const { dashboardSearchTerm } = getState().userSlice;
		const { creatorAllPostPageNumber } = getState().generalPostSlice;
		try {
			const resp = await customFetch.put(
				`/posts/user-post?page=${creatorAllPostPageNumber}&postNumberPerPage=${postNumberPerPage}&filter=${params.filter}&searchTerm=${dashboardSearchTerm}`,
				params
			);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error();
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const deletePost = createAsyncThunk(
	"delete/Post",
	async (postIds, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post(
				`/posts/delete`,
				{ postIds },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	postCreatorProfile: null,
	postCreatorProfileStatus: "idle",
	creatorAllPost: [],
	creatorAllPostTotalPages: null,
	creatoPostTotalNumber: null,
	hasMore: true,
	MyPostSelectedFilter: "A-Z",
	creatorAllPostPageNumber: 1,
};

const generalPostSlice = createSlice({
	name: "generaPostSlice",
	initialState,
	reducers: {
		clearCreatorAllPost: (state) => {
			state.hasMore = true;
			state.creatorAllPost = [];
			state.creatorAllPostPageNumber = 1;
		},
		setMyPostSelectedFilter: (state, { payload }) => {
			state.MyPostSelectedFilter = payload;
		},
		increaseCreatorPostPageNumber: (state) => {
			state.creatorAllPostPageNumber += 1;
		},
	},

	extraReducers: {
		// like or dislike post
		[likeOrDislikePost.pending]: (state, action) => {
			state.isLoading = true;
		},
		[likeOrDislikePost.fulfilled]: (state, { payload }) => {
			state.creatorAllPost.map((post) => {
				if (post?._id === payload?.postId) {
					post.likes = payload.likes;
					post.disLikes = payload.disLikes;
				}
			});
			state.isLoading = false;
			state.serverErr = undefined;
			state.appErr = undefined;
		},
		[likeOrDislikePost.rejected]: (state, action) => {
			(state.isLoading = false),
				(state.serverErr = action?.error?.message);
			state.appErr = action?.payload?.message;
			state.appErr
				? toast.error(state.appErr)
				: toast.error(state.serverErr);
		},
		[fetchPostCreatorProfile.pending]: (state) => {
			state.postCreatorProfileStatus = "loading";
		},
		[fetchPostCreatorProfile.fulfilled]: (state, { payload }) => {
			state.postCreatorProfileStatus = "success";
			state.postCreatorProfile = payload.foundUser;
		},
		[fetchPostCreatorProfile.rejected]: (state, action) => {
			state.postCreatorProfileStatus = "failed";
		},
		[fetchCreatorPosts.pending]: (state) => {
			state.creatorPostStatus = "loading";
		},
		[fetchCreatorPosts.fulfilled]: (state, { payload }) => {
			state.creatorPostStatus = "success";

			state.creatoPostTotalNumber = payload.totalNumber;
			state.creatorAllPost = [...state.creatorAllPost, ...payload.posts];
			state.creatorAllPostTotalPages = payload.totalPages;

			if (state.creatoPostTotalNumber <= state.creatorAllPost.length)
				state.hasMore = false;
			else state.hasMore = true;
		},
		[fetchCreatorPosts.rejected]: (state, action) => {
			state.creatorPostStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		// user delete posts
		[deletePost.pending]: (state) => {
			state.deletingPostStatus = "loading";
		},
		[deletePost.fulfilled]: (state, { payload }) => {
			state.deletingPostStatus = "success";
			const { postIds } = payload;
			state.creatoPostTotalNumber -= 1;
			state.creatorAllPost = state.creatorAllPost.filter(
				(post) => !postIds.includes(post._id)
			);
			toast.success(payload.message);
		},
		[deletePost.rejected]: (state, { payload }) => {
			state.deletingPostStatus = "falied";

			toast.error(payload.message);
		},
	},
});

export default generalPostSlice.reducer;
export const {
	clearCreatorAllPost,
	setMyPostSelectedFilter,
	increaseCreatorPostPageNumber,
} = generalPostSlice.actions;
