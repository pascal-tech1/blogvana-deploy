const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/comment");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");

// '''''''''''''''''''''''''''''''''''''''''
//   creating a comment
// ''''''''''''''''''''''''''''''''''''''''''''
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { postId } = req?.params;
	const loginUser = req?.user;

	try {
		const comment = await Comment.create({
			post: postId,
			user: loginUser,
			description: req?.body.description,
		});
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch all comments
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const allComments = await Comment.find({});
		res.json(allComments);
	} catch (error) {
		res.json(error);
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   fetch single comment
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchSingleCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { commentId } = req?.params;
	validateMongoDbUserId(commentId);
	try {
		const comment = await Comment.findById(commentId);
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update comment cocntroller
// ''''''''''''''''''''''''''''''''''''''''''''
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { commentId } = req?.params;
	validateMongoDbUserId(commentId);
	try {
		const comment = await Comment.findByIdAndUpdate(
			commentId,
			{
				description: req?.body?.description,
			},
			{ new: true, runValidators: true }
		);
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   delete comment controller
// ''''''''''''''''''''''''''''''''''''''''''''
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
	const { commentId } = req?.params;
	validateMongoDbUserId(commentId);

	try {
		const comment = await Comment.findByIdAndDelete(commentId, {
			new: true,
			runValidators: true,
		});
		res.json(comment);
	} catch (error) {
		res.json(error);
	}
});

module.exports = {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchSingleCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
};
