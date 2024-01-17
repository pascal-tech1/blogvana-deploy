const expressAsyncHandler = require("express-async-handler");
const mailTransporter = require("../../config/sendEmail/sendEmailConfig");

const checkProfanity = require("../../utils/profanWords");
const Message = require("../../model/message/message");
const User = require("../../model/user/User");
const sendPasswoedChangeEmail = require("../users/sendPasswoedChangeEmail");

// '''''''''''''''''''''''''''''''''''''''''
//   creating email messaging
// ''''''''''''''''''''''''''''''''''''''''''''

const createMsgCtrl = expressAsyncHandler(async (req, res) => {
	const { receiverId, message } = req?.body;

	const senderId = req.user._id;

	const receiverInfo = await User.findById(receiverId).select("email");
	const senderInfo = await User.findById(senderId).select([
		"firstName",
		"lastName",
		"isBlocked",
		"isProfaneCount",
	]);
	if (checkProfanity(" " + message)) {
		senderInfo.isProfaneCount += 1;
		await senderInfo.save();
		if (senderInfo.isProfaneCount >= 3) {
			senderInfo.isBlocked = true;
			await senderInfo.save();
			res.status(401).json({
				status: "failed",
				isBlocked: true,
				message: "message contains profane words and account blocked",
			});
			return;
		} else {
			throw new Error(
				"message not sent, because it contains profane wordss, account will be block after the third time"
			);
		}
	}
	const subject = `Message from BlogVana user  ${senderInfo?.firstName} ${senderInfo?.lastName}`;

	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to: receiverInfo.email,
		subject,
		text: message,
	};
	mailTransporter.sendMail(mailDetails, async function (err, data) {
		if (err) {
			res.status(500).json({
				status: "failed",
				message: "sending message failed try again",
			});
		} else {
			try {
				await Message.create({
					sender: senderId,
					message: message,
					receiver: receiverId,
				});
				res.json({
					status: "success",
					message: "Message sent successfully",
				});
			} catch (error) {}
		}
	});
});

const fetchMsgCtrl = expressAsyncHandler(async (req, res) => {
	const page = req.query.page;
	const numberPerPage = req.query.numberPerPage;

	try {
		const userId = req.user._id;
		const messages = await User.findById(userId)
			.populate({
				path: "receivedMessages",
			})
			.select("receivedMessages");

		const receivedMessageCount = messages.receivedMessages.length;

		const { receivedMessages } = await User.findById(userId)
			.populate({
				path: "receivedMessages",

				options: { sort: { updatedAt: -1 } },
				skip: (page - 1) * numberPerPage,
				limit: numberPerPage,
				populate: {
					path: "sender",
					select: [
						"_id",
						"firstName",
						"lastName",
						"profilePhoto",
						"blurProfilePhoto",
					],
				},
			})
			.select("receivedMessages");

		res
			.status(200)
			.json({ status: "success", receivedMessages, receivedMessageCount });
	} catch (error) {
		res.status(500).json({
			status: "failed",
			messages: "fetching messages failed try again",
		});
	}
});

const MsgPascalCtrl = expressAsyncHandler(async (req, res) => {
	const { sendingData } = req.body;

	const subject = `Message from BlogVana user to Pascal`;
	function flattenObjectToString(obj, parentKey = "") {
		let result = "";

		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				let newKey = parentKey ? `${parentKey}.${key}` : key;

				if (typeof obj[key] === "object" && obj[key] !== null) {
					// Recursively flatten nested objects
					result += flattenObjectToString(obj[key], newKey);
				} else {
					result += `${newKey}: ${obj[key].toString()}\n`;
				}
			}
		}

		return result;
	}

	const data = flattenObjectToString(sendingData);

	let mailDetails = {
		from: "pascalazubike003@gmail.com",
		to: "pascalazubike10@gmail.com",
		subject,
		html: data,
	};
	mailTransporter.sendMail(mailDetails, async function (err, data) {
		if (err) {
			res.status(500).json({
				status: "failed",
				message: "sending  pascal message failed please try again",
			});
		} else {
			res.status(200).json({
				status: "success",
				message: "message sent to Azubike Pascal successfull",
			});
		}
	});
});

module.exports = { createMsgCtrl, fetchMsgCtrl, MsgPascalCtrl };
