const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			// required: [true, "Post title is required"],
			trim: true,
		},
		//Created by only category
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			// required: [true, "Post category is required"],
		},
		categoryText: {
			type: String,
		},
		description: {
			type: String,
			required: [true, "Description is Required"],
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisLiked: {
			type: Boolean,
			default: false,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		readingTime: Number,
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		disLikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Please user is required"],
		},

		content: {
			type: Object,
			// required: [true, "Post content is required"],
		},
		blurImageUrl: {
			type: String,
		},
		image: {
			type: String,
			required: [true, "Post image is required"],
		},
		embedding: {
			type: [Number],
			select: false,
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

//compile
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
