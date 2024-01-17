const mongoose = require("mongoose");

const savedPostsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: [true, "user is required"],
		},
		post: {
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

const SavedPosts = mongoose.model("SavedPosts", savedPostsSchema);
module.exports = SavedPosts;
