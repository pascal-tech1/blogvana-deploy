import customFetch from "../../utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { updateUserSavedPost } from "../post/morePostSlice";

export const loginUser = createAsyncThunk(
	"user/loginUser",
	async (user, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/login", user);
			return resp.data;
		} catch (error) {
			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const loginUserWithToken = createAsyncThunk(
	"user/loginUserWithtoken",
	async (_, { getState, dispatch, rejectWithValue }) => {
		try {
			const resp = await customFetch("/users/loginWithToken", {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			dispatch(logOutUser());

			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const RegisterUser = createAsyncThunk(
	"user/RegisterUser",
	async (user, { rejectWithValue, getState, dispatch }) => {
		try {
			const resp = await customFetch.post("/users/register", user);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const updateUser = createAsyncThunk(
	"user/UpdateUser",
	async (user, { rejectWithValue, getState, dispatch }) => {
		const userId = getState().userSlice.user._id;

		try {
			const resp = await customFetch.put(`/users/${userId}`, user, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const followOrUnfollowUser = createAsyncThunk(
	"followOrUnfollow/User",
	async (
		userToFollowOrUnfollowId,
		{ getState, rejectWithValue, dispatch }
	) => {
		const isfollowing = getState().userSlice.user?.following.includes(
			userToFollowOrUnfollowId
		);

		const action = isfollowing ? "unfollow" : "follow";

		try {
			const resp = await customFetch.post(
				`users/${action}`,
				{ userToFollowOrUnfollowId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return { data: resp.data, action };
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const savePost = createAsyncThunk(
	"save/Post",
	async (postId, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post(
				`users/save-post`,
				{ postId },
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			dispatch(updateUserSavedPost(resp.data.savedPost));

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchRandomUser = createAsyncThunk(
	"fetch/randomUsers",
	async (numberOfUser, { rejectWithValue }) => {
		try {
			const resp = await customFetch.post("/users/random-users", {
				numberOfUser,
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

export const fetchUserFollowingList = createAsyncThunk(
	"fetchUser/followingList",
	async (_id, { getState, rejectWithValue }) => {
		const { followingListPageNumber, followsNumberPerPage } =
			getState().userSlice;
		const { dashboardSearchTerm } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/following?userId=${_id}&pageNumber=${followingListPageNumber}&numberPerPage=${followsNumberPerPage}&searchTerm=${dashboardSearchTerm}`
			);
			return { data: resp.data, followingUserId: _id };
		} catch (error) {
			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const fetchUserFollowersList = createAsyncThunk(
	"user/followersList",
	async (_, { getState, rejectWithValue }) => {
		const { followersListPageNumber, followsNumberPerPage, user } =
			getState().userSlice;
		const { dashboardSearchTerm } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/followers?userId=${user._id}&pageNumber=${followersListPageNumber}&numberPerPage=${followsNumberPerPage}&searchTerm=${dashboardSearchTerm}`
			);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				toast.error(error.message);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchUserDetailsCounts = createAsyncThunk(
	"fetchUser/DetailsCounts",
	async (_, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch("/users/user-details-Count", {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
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
export const fetchWhoViewedUserProfile = createAsyncThunk(
	"fetchWho/ViewedUserProfile",
	async (data, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch(
				`/users/viewedBy?page=${data.page}&numberPerPage=${data.limit}`,
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const fetchPostImpressionsCount = createAsyncThunk(
	"post/impressionCount",
	async (params, { getState, rejectWithValue }) => {
		const { chartSelectedFilter } = getState().userSlice;

		try {
			const resp = await customFetch(
				`/users/impression-Counts?page=${params.page}&numberPerPage=${params.numberPerPage}&filter=${chartSelectedFilter}`,
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
export const uploadProfilePhoto = createAsyncThunk(
	"uploadProfile/Photo",
	async (userImage, { getState, rejectWithValue, dispatch }) => {
		try {
			dispatch(setWhatIsUploading(userImage?.whatUploading));

			const resp = await customFetch.post(
				`/users/profile-picture-upload`,
				{ image: userImage.file, whatUploading: userImage.whatUploading },
				{
					headers: {
						"Content-Type": "multipart/form-data",
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
export const verifyEmail = createAsyncThunk(
	"verify/Email",
	async (emailParam, { getState, rejectWithValue }) => {
		const email = emailParam || getState().userSlice.userEmail;

		try {
			const resp = await customFetch.post(`/users/send-email`, {
				email,
			});

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const confirmSentEmail = createAsyncThunk(
	"confirm/sentEmail",
	async (token, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/confirm-sent-email`, {
				token,
			});

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const sendForgotPasswordEmail = createAsyncThunk(
	"send/forgotPasswordEmail",
	async (email, { getState, rejectWithValue }) => {
		console.log("im here");
		try {
			const resp = await customFetch.post(`/users/forget-password`, email);

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const resetPassword = createAsyncThunk(
	"reset/Password",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/reset-password`, user);

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const updatePassword = createAsyncThunk(
	"update/Password",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/update-password`, user, {
				headers: {
					Authorization: `Bearer ${getState().userSlice.token} `,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

export const changeEmail = createAsyncThunk(
	"change/email",
	async (user, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/users/change-email`, user, {
				headers: {
					Authorization: `Bearer ${getState().userSlice.token} `,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);
export const updateUserEmbedding = createAsyncThunk(
	"update/UserEmbeddings",
	async (_, { getState, rejectWithValue }) => {
		console.log("updating user embedding running");
		console.log("im here managing user");
		try {
			const resp = await customFetch(`/users/update-embedding`, {
				headers: {
					Authorization: `Bearer ${getState().userSlice.token} `,
				},
			});
		} catch (error) {
			console.log(error);
			if (!error?.response) {
				throw new Error(error);
			}
			return rejectWithValue(error?.response?.data);
		}
	}
);

const initialState = {
	user: null,
	token: getUserFromLocalStorage(),
	randomUsers: [],
	userfollowinglist: [],
	followinglistTotalNumber: 0,
	userFollowerslist: [],
	followerslistTotalNumber: 0,
	fetchingFollowersListStatus: "idle",
	fetchingFollowingListStatus: "idle",
	userDetailsCount: {},
	whoViewUserProfile: [],
	whoViewUserProfileStatus: "idle",
	whoViewUserProfileCount: 0,
	chartSelectedFilter: "likes and dislikes",
	userPostImpression: null,
	followingListPageNumber: 1,
	followsNumberPerPage: 10,
	followersListPageNumber: 1,
	confirmSentEmailStatus: "idle",
	resetPasswordStatus: "idle",
	changeEmailStatus: false,
	changePasswordStatus: false,
	followingUserListForNonLoginUser: [],
	followingUserListForNonLoginUserTotalNumber: 0,
	dashboardSearchTerm: "",
	isSearchBarNeeded: false,
	loginUserTokenStatus: "idle",
};
const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {
		logOutUser: (state, action) => {
			removeUserFromLocalStorage();
			state.user = null;
			state.token = null;
			state.randomUsers = [];
			state.userfollowinglist = [];
			state.followinglistTotalNumber = 0;
			state.userFollowerslist = [];
			state.followerslistTotalNumber = 0;
			state.fetchingFollowersListStatus = "idle";
			state.fetchingFollowingListStatus = "idle";
			state.userDetailsCount = {};
			state.whoViewUserProfile = [];
			state.whoViewUserProfileStatus = "idle";
			state.chartSelectedFilter = "likes and dislikes";
			state.userPostImpression = null;
			state.followingListPageNumber = 1;
			state.followsNumberPerPage = 2;
			state.followersListPageNumber = 1;
			state.confirmSentEmailStatus = "idle";
			state.resetPasswordStatus = "idle";
			state.changeEmailStatus = false;
		},
		setChangeEmail: (state) => {
			state.changeEmailStatus = !state.changeEmailStatus;
		},
		setChangePassword: (state) => {
			state.changePasswordStatus = !state.changePasswordStatus;
		},
		setUserState: (state, action) => {
			state.user = action.payload;
		},
		updateFollowingListPageNumber: (state, action) => {
			state.followingListPageNumber += 1;
		},
		updateFollowersListPageNumber: (state, action) => {
			state.followersListPageNumber += 1;
		},
		setFirstFetchFollowingUser: (state, action) => {
			state.followinglistTotalNumber = 0;
			state.followingListPageNumber = 1;
			state.userfollowinglist = [];
			state.followingUserListForNonLoginUserTotalNumber = 0;

			state.followingUserListForNonLoginUser = [];
		},

		setFirstFetchFollowersUser: (state, action) => {
			state.followerslistTotalNumber = 0;
			state.followersListPageNumber = 1;
			state.userFollowerslist = [];
		},
		setChartSelectedFilter: (state, { payload }) => {
			state.chartSelectedFilter = payload;
		},
		clearWhoViewedUserProfile: (state) => {
			state.whoViewUserProfile = [];
		},
		setSearchTermInStore: (state, { payload }) => {
			state.dashboardSearchTerm = payload;
		},
		setIsSearchBArNeeded: (state, { payload }) => {
			state.isSearchBarNeeded = payload;
		},
		setIsAdmin: (state, { payload }) => {
			state.user.isAdmin = payload;
		},
		setWhatIsUploading: (state, { payload }) => {
			state.whatUploading = payload;
		},
	},
	extraReducers: {
		[loginUser.pending]: (state) => {
			state.isLoading = true;
		},
		[loginUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.user = payload.user;
			state.status = payload.status;
			addUserToLocalStorage(payload.token);
			state.token = payload.token;
			toast.success(payload.message);
		},
		[loginUser.rejected]: (state, { payload }) => {
			const anyError = payload?.message;
			toast.error(anyError);
			state.isLoading = false;
		},
		[loginUserWithToken.pending]: (state) => {
			state.loginUserTokenStatus = "loading";
		},
		[loginUserWithToken.fulfilled]: (state, { payload }) => {
			state.loginUserTokenStatus = "success";
			state.user = payload.user;
		},
		[loginUserWithToken.rejected]: (state, action) => {
			state.loginUserTokenStatus = "failed";
			toast.error("login failed");
		},
		[RegisterUser.pending]: (state) => {
			state.registerUserStatus = "loading";
		},
		[RegisterUser.fulfilled]: (state, { payload }) => {
			state.registerUserStatus = "success";
			state.userEmail = payload.userEmail;
			toast.success(payload?.message);
		},
		[RegisterUser.rejected]: (state, action) => {
			state.registerUserStatus = "failed";

			const error = action?.payload?.message || action?.error?.message;

			toast.error(error);
		},
		[updateUser.pending]: (state) => {
			state.isLoading = true;
		},
		[updateUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;

			state.user = payload.user;
			toast.success(payload.message);
		},
		[updateUser.rejected]: (state, { payload }) => {
			state.isLoading = false;
			toast.error(payload.message);
		},
		[followOrUnfollowUser.pending]: (state) => {
			state.follwoingIsLoading = true;
		},
		[followOrUnfollowUser.fulfilled]: (state, { payload }) => {
			state.follwoingIsLoading = false;
			state.user = payload.data.user;

			toast.success(payload.data.message);

			if (payload.action === "unfollow") {
				state.userfollowinglist = state.userfollowinglist.filter(
					(user) => user._id !== payload.data.userToUnFollowId
				);
				state.followinglistTotalNumber -= 1;
				state.numberOfUnFollowUser += 1;
			}
			if (payload.action === "follow") {
				state.userfollowinglist = [
					payload.data.userToFollow,
					...state.userfollowinglist,
				];
				state.followinglistTotalNumber += 1;
				state.numberOfFollowUser += 1;
			}
		},
		[followOrUnfollowUser.rejected]: (state, action) => {
			state.follwoingIsLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			state?.appErr
				? toast.warn(state?.appErr)
				: toast.error(state?.serverErr);
		},
		[savePost.pending]: (state) => {
			state.isLoading = true;
		},
		[savePost.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			toast.success(payload?.message);
		},
		[savePost.rejected]: (state, action) => {
			state.isLoading = false;

			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		[fetchRandomUser.pending]: (state) => {
			state.isLoading = true;
		},
		[fetchRandomUser.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.randomUsers = payload.users;
			toast.success(payload?.message);
		},
		[fetchRandomUser.rejected]: (state, action) => {
			state.isLoading = false;
			state.appErr = action?.payload?.message;
			state.serverErr = action?.error?.message;
			toast.error(action?.payload?.message);
		},
		[fetchUserFollowingList.pending]: (state) => {
			state.fetchingFollowingListStatus = "loading";
		},
		[fetchUserFollowingList.fulfilled]: (state, { payload }) => {
			state.fetchingFollowingListStatus = "success";

			if (payload.followingUserId !== state.user._id) {
				state.followingUserListForNonLoginUser = [
					...state.followingUserListForNonLoginUser,
					...payload.data.userfollowinglist.following,
				];
				state.followingUserListForNonLoginUserTotalNumber =
					payload.data.followinglistTotalNumber;
			} else {
				state.userfollowinglist = [
					...state.userfollowinglist,
					...payload.data.userfollowinglist.following,
				];
				state.followinglistTotalNumber =
					payload.data.followinglistTotalNumber;
			}
		},
		[fetchUserFollowingList.rejected]: (state, action) => {
			state.fetchingFollowingListStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
		[fetchUserFollowersList.pending]: (state) => {
			state.fetchingFollowersListStatus = "loading";
		},
		[fetchUserFollowersList.fulfilled]: (state, { payload }) => {
			state.fetchingFollowersListStatus = "success";
			state.userFollowerslist = [
				...state.userFollowerslist,
				...payload.userfollowerlist.followers,
			];
			state.followerslistTotalNumber = payload.followerslistTotalNumber;
		},
		[fetchUserFollowersList.rejected]: (state, action) => {
			state.fetchingFollowersListStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
		[fetchUserDetailsCounts.pending]: (state) => {
			state.userDetailsCountStatus = "loading";
		},
		[fetchUserDetailsCounts.fulfilled]: (state, { payload }) => {
			state.userDetailsCountStatus = "success";
			state.userDetailsCount = payload;
		},
		[fetchUserDetailsCounts.rejected]: (state, action) => {
			state.userDetailsCountStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[fetchWhoViewedUserProfile.pending]: (state) => {
			state.whoViewUserProfileStatus = "loading";
		},
		[fetchWhoViewedUserProfile.fulfilled]: (state, { payload }) => {
			state.whoViewUserProfileStatus = "success";
			if (
				payload.whoViewUserProfileCount > state.whoViewUserProfile.length
			) {
				state.whoViewUserProfile = [
					...state.whoViewUserProfile,
					...payload.userWhoViewProfile,
				];
			}

			state.whoViewUserProfileCount = payload.whoViewUserProfileCount;
		},
		[fetchWhoViewedUserProfile.rejected]: (state, action) => {
			state.whoViewUserProfileStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[fetchPostImpressionsCount.pending]: (state) => {
			state.userPostImpressionStatus = "loading";
		},
		[fetchPostImpressionsCount.fulfilled]: (state, { payload }) => {
			state.userPostImpressionStatus = "success";
			state.userPostImpression = payload;
		},
		[fetchPostImpressionsCount.rejected]: (state, action) => {
			state.userPostImpressionStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[uploadProfilePhoto.pending]: (state) => {
			state.profilePictureUploadStatus = "loading";
		},
		[uploadProfilePhoto.fulfilled]: (state, { payload }) => {
			if (payload.whatUploading === "profilePhoto") {
				state.user.profilePhoto = payload.userImage;
				state.whatUploading = payload.whatUploading;
			}
			if (payload.whatUploading === "coverPhoto") {
				state.user.coverPhoto = payload.userImage;
				state.whatUploading = payload.whatUploading;
			}

			toast.success(payload?.message);

			state.profilePictureUploadStatus = "success";
		},
		[uploadProfilePhoto.rejected]: (state, action) => {
			state.profilePictureUploadStatus = "failed";
			toast.error(action?.payload?.message);
		},
		[verifyEmail.pending]: (state) => {
			state.verifyEmailStatus = "loading";
		},
		[verifyEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.verifyEmailStatus = "success";
		},
		[verifyEmail.rejected]: (state, { payload }) => {
			state.verifyEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[confirmSentEmail.pending]: (state) => {
			state.confirmSentEmailStatus = "loading";
		},
		[confirmSentEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.confirmSentEmailStatus = "success";
		},
		[confirmSentEmail.rejected]: (state, { payload }) => {
			state.confirmSentEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[sendForgotPasswordEmail.pending]: (state) => {
			state.sendForgotPasswordEmailStatus = "loading";
		},
		[sendForgotPasswordEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.sendForgotPasswordEmailStatus = "success";
		},
		[sendForgotPasswordEmail.rejected]: (state, { payload }) => {
			state.sendForgotPasswordEmailStatus = "failed";
			toast.error(payload?.message);
		},
		[resetPassword.pending]: (state) => {
			state.resetPasswordStatus = "loading";
		},
		[resetPassword.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.resetPasswordStatus = "success";
		},
		[resetPassword.rejected]: (state, { payload }) => {
			state.resetPasswordStatus = "failed";
			toast.error(payload?.message);
		},
		[updatePassword.pending]: (state) => {
			state.updatePasswordStatus = "loading";
		},
		[updatePassword.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.updatePasswordStatus = "success";
		},
		[updatePassword.rejected]: (state, { payload }) => {
			state.updatePasswordStatus = "failed";
			toast.error(payload?.message);
		},
		[changeEmail.pending]: (state) => {
			state.changeEmailStatus = "loading";
		},
		[changeEmail.fulfilled]: (state, { payload }) => {
			toast.success(payload?.message);
			state.changeEmailStatus = "success";
		},
		[changeEmail.rejected]: (state, action) => {
			state.changeEmailStatus = "failed";
			const error = action?.payload?.message || action?.error?.message;
			toast.error(error);
		},
	},
});

export default userSlice.reducer;
export const {
	logOutUser,
	setUserState,
	setChartSelectedFilter,
	updateFollowingListPageNumber,
	updateFollowersListPageNumber,
	setFirstFetchFollowingUser,
	setFirstFetchFollowersUser,
	setChangeEmail,
	clearWhoViewedUserProfile,
	setSearchTermInStore,
	setIsSearchBArNeeded,
	SetverifyEmailStatus,
	setIsAdmin,
	setChangePassword,
	setWhatIsUploading,
} = userSlice.actions;
