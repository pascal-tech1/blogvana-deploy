const mongoose = require("mongoose");

const postViewHistorySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: [true, "user is required"],
		},
        post:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: [true, "post is required"],
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

const PostViewedHistory = mongoose.model(
	"PostViewedHistory",
	postViewHistorySchema
);
module.exports = PostViewedHistory;
