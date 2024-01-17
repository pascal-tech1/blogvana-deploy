import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllCategorys = createAsyncThunk(
	"fetch/AllCategories",
	async (_, { getState, rejectWithValue }) => {
		const { dashboardSearchTerm } = getState().userSlice;
		try {
			const resp = await customFetch(
				`/categorys?searchTerm=${dashboardSearchTerm}`
			);
			return resp.data;
		} catch (error) {
			if (!error.response) {
				throw new Error(error);
			}
			return rejectWithValue(error.response.data);
		}
	}
);

export const createCategory = createAsyncThunk(
	"create/Category",
	async (category, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.post(`/categorys/create`, category, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
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
export const editCategory = createAsyncThunk(
	"Edit/Category",
	async (category, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.put(
				`/categorys/edit/${category.id}`,
				{ title: category.title },
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

export const deleteCategory = createAsyncThunk(
	"Delete/Category",
	async (category, { getState, rejectWithValue }) => {
		try {
			const resp = await customFetch.put("/categorys/delete", category, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
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



const initialState = {
	allCategory: [],
	status: "idle",
	categorystatus: "idle",
	deleteCategoryStatus: "idle",
	isCategoryEditing: false,
	activeEditingCategory: "",
	isSideBarOpen: false,
	theme: localStorage.getItem("theme"),
	isTableOfContentClciked: false,
};

const categorySlice = createSlice({
	name: "categorySlice",
	initialState,

	reducers: {
		setIsCategoryEdting: (state, { payload }) => {
			state.isCategoryEditing = payload;
		},
		setActiveEditingCategory: (state, { payload }) => {
			state.activeEditingCategory = payload;
		},
		setSideBarStateInStore: (state, { payload }) => {
			state.isSideBarOpen = payload;
		},

		setThemeInStore: (state, { payload }) => {
			state.theme = payload;
		},

		setIsTAbleOfContentClick: (state, { payload }) => {
			state.isTableOfContentClciked = payload;
		},
	},
	extraReducers: {
		[fetchAllCategorys.pending]: (state, { payload }) => {
			state.status = "loading";
		},
		[fetchAllCategorys.fulfilled]: (state, { payload }) => {
			state.status = "success";
			state.allCategory = payload.allCategory;
		},
		[fetchAllCategorys.rejected]: (state, { payload }) => {
			state.status = "failed";
			toast.error(payload?.message);
		},
		[createCategory.pending]: (state, { payload }) => {
			state.categorystatus = "loading";
		},
		[createCategory.fulfilled]: (state, { payload }) => {
			state.categorystatus = "success";

			state.allCategory = [...state.allCategory, payload.createdCategory];
			toast.success(payload.message);
		},
		[createCategory.rejected]: (state, { payload }) => {
			state.categorystatus = "failed";
			toast.error(payload?.message);
		},
		[editCategory.pending]: (state, { payload }) => {
			state.categorystatus = "loading";
		},
		[editCategory.fulfilled]: (state, { payload }) => {
			state.categorystatus = "success";
			state.allCategory = state.allCategory.map((oldCategory) => {
				if (oldCategory._id === payload.category._id) {
					oldCategory.title = payload.category.title;
				}

				return oldCategory;
			});

			toast.success(payload.message);
			state.isCategoryEditing = false;
		},
		[editCategory.rejected]: (state, { payload }) => {
			state.categorystatus = "failed";
			toast.error(payload?.message);
		},
		[deleteCategory.pending]: (state, { payload }) => {
			state.deleteCategoryStatus = "loading";
		},
		[deleteCategory.fulfilled]: (state, { payload }) => {
			state.deleteCategoryStatus = "success";
			state.allCategory = state.allCategory.filter(
				(category) => !payload.categoryIds.includes(category._id)
			);

			toast.success(payload.message);
		},
		[deleteCategory.rejected]: (state, { payload }) => {
			state.deleteCategoryStatus = "failed";
			toast.error(payload?.message);
		},
	},
});

export default categorySlice.reducer;
export const {
	setIsCategoryEdting,
	setActiveEditingCategory,
	setSideBarStateInStore,
	setThemeInStore,
	setIsTAbleOfContentClick,
} = categorySlice.actions;
