import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios";
import { toast } from "react-toastify";

export const sendMsg = createAsyncThunk(
	"send/message",
	async (sendingData, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch.post("/message", sendingData, {
				headers: {
					authorization: `Bearer ${getState().userSlice?.token}`,
				},
			});

			return resp.data;
		} catch (error) {
			if (!error.response) throw new Error(error);
			return rejectWithValue(error.response.data);
		}
	}
);
export const fetchMsg = createAsyncThunk(
	"fetch/message",
	async (data, { getState, rejectWithValue, dispatch }) => {
		try {
			const resp = await customFetch(
				`/message?page=${data.page}&numberPerPage=${data.limit}`,
				{
					headers: {
						authorization: `Bearer ${getState().userSlice?.token}`,
					},
				}
			);

			return resp.data;
		} catch (error) {
			if (!error.response) throw new Error(error);
			return rejectWithValue(error.response.data);
		}
	}
);
// this is to send me (pascal) creator message

export const sendPascalMsg = createAsyncThunk(
	"send/pascal-message",
	async (sendingData, { getState, rejectWithValue, h }) => {
		console.log(sendingData);
		try {
			const resp = await customFetch.post(
				"/message/contact-me",
				sendingData
			);
			return resp.data;
		} catch (error) {
			if (!error.response) throw new Error(error);
			return rejectWithValue(error.response.data);
		}
	}
);
const initialState = {
	msg: [],
	receivedMessageCount: 0,
	isBlocked: false,
};

const messageSlice = createSlice({
	name: "messageSlice",
	initialState,

	reducers: {
		clearMsg: (state, action) => {
			state.msg = [];
		},
	},
	extraReducers: {
		[sendMsg.pending]: (state) => {
			state.SendingMessageStatus = "loading";
		},
		[sendMsg.fulfilled]: (state, { payload }) => {
			state.SendingMessageStatus = "success";
			toast.success(payload.message);
		},
		[sendMsg.rejected]: (state, { payload }) => {
			state.isBlocked = payload.isBlocked;
			state.SendingMessageStatus = "failed";
			toast.error(payload.message);
		},
		[fetchMsg.pending]: (state) => {
			state.fetchMessageStatus = "loading";
		},
		[fetchMsg.fulfilled]: (state, { payload }) => {
			state.fetchMessageStatus = "success";
			if (state.msg.length < payload.receivedMessageCount) {
				state.msg = [...state.msg, ...payload.receivedMessages];
			}
			state.receivedMessageCount = payload.receivedMessageCount;
		},
		[fetchMsg.rejected]: (state, { papyload }) => {
			state.fetchMessageStatus = "failed";
			toast.error(payload.message);
		},
		[sendPascalMsg.pending]: (state) => {
			state.SendingPascalMsgtatus = "loading";
		},
		[sendPascalMsg.fulfilled]: (state, { payload }) => {
			state.SendingPascalMsgtatus = "success";
			toast.success(payload.message);
		},
		[sendPascalMsg.rejected]: (state, { payload }) => {
			state.isBlocked = payload.isBlocked;
			state.SendingPascalMsgtatus = "failed";
			toast.error(payload.message);
		},
	},
});

export const { clearMsg } = messageSlice.actions;
export default messageSlice.reducer;
