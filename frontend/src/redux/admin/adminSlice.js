import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";
import { setUserState, updateUser } from "../user/userSlice";

export const fetchAllUsersPost = createAsyncThunk(
	"fetch/AllUsersPost",
	async (params, { getState, dispatch, rejectWithValue }) => {
		const { adminAllPostPageNumber, postNumberPerPage } =
			getState().adminSlice;
		const { dashboardSearchTerm } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/posts/admin-all-post?page=${adminAllPostPageNumber}&postNumberPerPage=${postNumberPerPage}&filter=${params.filter}&searchTerm=${dashboardSearchTerm}`,
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
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

export const fetchAllUsers = createAsyncThunk(
	"fetch/AllUsers",
	async (params, { getState, rejectWithValue }) => {
		const numberPerPage = 10;
		const { adminAllUsersPageNumber } = getState().adminSlice;
		const { dashboardSearchTerm } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/admin-all-users?page=${adminAllUsersPageNumber}&numberPerPage=${numberPerPage}&filter=${params.filter}&searchTerm=${dashboardSearchTerm}`,
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
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
export const deletePostAdmin = createAsyncThunk(
	"delete/PostAdmin",
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

export const deleteUserAdmin = createAsyncThunk(
	"delete/UserAdmin",
	async (userIds, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(
				`/users/delete`,
				{ userIds },
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

export const blockOrUnblockUser = createAsyncThunk(
	"block/unblockUser",
	async (userId, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(
				`/users/blockOrUnblock-user`,
				userId,
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

export const toggleUserAdmin = createAsyncThunk(
	"toggle/AdminSTatus",
	async (params, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(
				`/users/toggleAdminStatus`,
				params,
				{
					headers: {
						Authorization: `Bearer ${getState().userSlice.token} `,
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
	postNumberPerPage: 10,
	hasMore: true,
	allPost: [],
	MyPostSelectedFilter: "Category",
	adminAllPostStatus: "idle",
	adminAllPostTotalNumber: null,
	adminAllPostTotalPages: null,
	deletingPostStatus: "idle",
	adminAllPostPageNumber: 1,
	// allusers
	adminAllUsersPageNumber: 1,
	adminFetchUsersHasMore: true,
	allUsers: [],
	AdminAllUserSelectedFilter: "Newest User",
	adminAllUsersStatus: "idle",
	adminAllUsersTotalNumber: null,
	adminAllUsersTotalPages: null,
	deleteUsersStatus: "idle",
};

const adminSlice = createSlice({
	name: "adminSlice",
	initialState,
	reducers: {
		clearAdminAllPost: (state) => {
			state.adminAllPostPageNumber = 1;
			state.hasMore = true;
			state.allPost = [];
		},
		setMyPostSelectedFilter: (state, { payload }) => {
			state.allPost = [];
			state.adminAllPostPageNumber = 1;
			state.MyPostSelectedFilter = payload;
		},
		increaseAdminAllPostPageNumber: (state) => {
			state.adminAllPostPageNumber += 1;
		},
		clearAdminAllUser: (state) => {
			state.adminAllUsersPageNumber = 1;
			state.AdminFetchUsersHasMore = true;
			state.allUsers = [];
		},
		setAllUsersSelectedFilter: (state, { payload }) => {
			state.AdminAllUserSelectedFilter = payload;
		},
		increaseAdminAllUsersPageNumber: (state) => {
			state.adminAllUsersPageNumber += 1;
		},
	},
	extraReducers: {
		[fetchAllUsersPost.pending]: (state) => {
			state.adminAllPostStatus = "loading";
		},
		[fetchAllUsersPost.fulfilled]: (state, { payload }) => {
			state.adminAllPostStatus = "success";

			state.adminAllPostTotalNumber = payload.totalNumber;
			state.allPost = [...state.allPost, ...payload.posts];
			state.adminAllPostTotalPages = payload.totalPages;

			if (payload.posts.length < state.postNumberPerPage)
				state.hasMore = false;
			else state.hasMore = true;
		},
		[fetchAllUsersPost.rejected]: (state, action) => {
			state.adminAllPostStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		[fetchAllUsers.pending]: (state) => {
			state.adminAllUsersStatus = "loading";
		},
		[fetchAllUsers.fulfilled]: (state, { payload }) => {
			state.adminAllUsersStatus = "success";

			state.adminAllUsersTotalNumber = payload.totalNumber;
			state.allUsers = [...state.allUsers, ...payload.users];
			state.adminAllUsersTotalPages = payload.totalPages;

			if (payload.totalPages === payload.currentPage)
				state.adminFetchUsersHasMore = false;
			else state.adminFetchUsersHasMore = true;
		},
		[fetchAllUsers.rejected]: (state, action) => {
			state.adminAllUsersStatus = "failed";
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},

		[deletePostAdmin.pending]: (state) => {
			state.deletingPostStatus = "loading";
		},
		[deletePostAdmin.fulfilled]: (state, { payload }) => {
			state.deletingPostStatus = "success";
			const { postIds } = payload;

			state.adminAllPostTotalNumber -= 1;
			state.allPost = state.allPost.filter(
				(post) => !postIds.includes(post._id)
			);
			toast.success(payload.message);
		},
		[deletePostAdmin.rejected]: (state, action) => {
			state.deletingPostStatus = "falied";
			toast.error(payload.message);
		},
		[deleteUserAdmin.pending]: (state) => {
			state.deleteUsersStatus = "loading";
		},
		[deleteUserAdmin.fulfilled]: (state, { payload }) => {
			state.deleteUsersStatus = "success";
			const { userIds } = payload;

			state.adminAllUsersTotalNumber -= 1;
			state.allUsers = state.allUsers.filter(
				(user) => !userIds.includes(user._id)
			);
			toast.success(payload.message);
		},
		[deleteUserAdmin.rejected]: (state, { payload }) => {
			state.deleteUsersStatus = "falied";
			toast.error(payload.message);
		},
		[blockOrUnblockUser.pending]: (state) => {
			state.blockOrUnblockUserStatus = "loading";
		},
		[blockOrUnblockUser.fulfilled]: (state, { payload }) => {
			state.blockOrUnblockUserStatus = "success";

			state.allUsers = state.allUsers.map((post) => {
				if (post._id === payload.user._id) {
					post.isBlocked = payload.user.isBlocked;
				}

				return post;
			});
			toast.success(payload.message);
		},
		[blockOrUnblockUser.rejected]: (state, action) => {
			state.blockOrUnblockUserStatus = "falied";
			toast.error(payload.message);
		},
		[toggleUserAdmin.pending]: (state) => {
			state.toggleUserAdminStatus = "loading";
		},
		[toggleUserAdmin.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.allUsers.map((user) => {
				if (user._id === payload.userId) {
					if (payload.action === "enableAdmin") {
						user.isAdmin = true;
					}
					if (payload.action === "disableAdmin") {
						user.isAdmin = false;
					}
				}
				return user;
			});

			state.toggleUserAdminStatus = "success";
		},
		[toggleUserAdmin.rejected]: (state, action) => {
			state.toggleUserAdminStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
	},
});

export const {
	clearAdminAllPost,
	setMyPostSelectedFilter,
	increaseAdminAllPostPageNumber,
	increaseAdminAllUsersPageNumber,
	setAllUsersSelectedFilter,
	clearAdminAllUser,
} = adminSlice.actions;
export default adminSlice.reducer;
