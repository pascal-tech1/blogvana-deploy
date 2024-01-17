const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: [true, "Message is required"],
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Message Sender is required"],
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Message receiver is required"],
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: { virtuals: true },
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
