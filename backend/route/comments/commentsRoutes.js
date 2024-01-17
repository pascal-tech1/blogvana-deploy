const express = require("express");
const {
	createCommentCtrl, fetchAllCommentsCtrl, fetchSingleCommentCtrl, updateCommentCtrl, deleteCommentCtrl,
} = require("../../controllers/comments/commentsCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const commentRoutes = express.Router();

commentRoutes.post("/:postId", authMiddleWare, createCommentCtrl);
commentRoutes.get('/', authMiddleWare,fetchAllCommentsCtrl)
commentRoutes.get('/:commentId', authMiddleWare,fetchSingleCommentCtrl)
commentRoutes.put('/:commentId', authMiddleWare,updateCommentCtrl)
commentRoutes.delete('/:commentId', authMiddleWare,deleteCommentCtrl)


module.exports = commentRoutes;
