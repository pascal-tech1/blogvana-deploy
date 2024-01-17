const mongoose = require("mongoose");

const followsSchema = new mongoose.Schema(
	{
		followingUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
		followerUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
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

const Follows = mongoose.model("Follows", followsSchema);
module.exports = Follows;
