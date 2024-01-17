const mongoose = require("mongoose");

const UserProfileViewSchema = new mongoose.Schema(
	{
		viewedUser: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		viewedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		numberOfView: {
			type: Number,
			default: 1,
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

const UserProfileView = mongoose.model(
	"UserProfileView",
	UserProfileViewSchema
);
module.exports = UserProfileView;
