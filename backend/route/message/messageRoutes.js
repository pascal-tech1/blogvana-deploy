const express = require("express");

const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const {
	createMsgCtrl,
	fetchMsgCtrl,
	MsgPascalCtrl,
} = require("../../controllers/message/messageCtrl");

const messageRoutes = express.Router();

messageRoutes.post("/", authMiddleWare, createMsgCtrl);
messageRoutes.get("/", authMiddleWare, fetchMsgCtrl);
messageRoutes.post("/contact-me", MsgPascalCtrl);

module.exports = messageRoutes;
