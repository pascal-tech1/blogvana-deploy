const express = require("express");
const {
	createPostCtrl,

	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
	fetchUserPostCtrl,

	fetchPostByCategoryCtrl,
	fetchUserPostHistoryCtrl,
	fetchUserSavedPostCtrl,
	fetchAllUserPostCtrl,
	postImageCtrl,
	fetchTrendingPost,
} = require("../../controllers/posts/postsCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const {
	postImageResize,
	postImageUpload,
} = require("../../middlewares/uploads/PhotoUpload");
const adminMiddleWare = require("../../middlewares/authentication/authAdminCheck");
const testAuthMiddleWare = require("../../middlewares/authentication/testUserAuth");

const postsRoutes = express.Router();
postsRoutes.get("/", fetchPostByCategoryCtrl);

postsRoutes.get(
	"/admin-all-post",
	authMiddleWare,
	adminMiddleWare,
	fetchAllUserPostCtrl
);
postsRoutes.get("/user-history", authMiddleWare, fetchUserPostHistoryCtrl);
postsRoutes.get("/user-savedPost", authMiddleWare, fetchUserSavedPostCtrl);
postsRoutes.post(
	"/delete",
	authMiddleWare,
	testAuthMiddleWare,
	deletePostCtrl
);
postsRoutes.post("/trending-post", fetchTrendingPost);

postsRoutes.post(
	"/",
	authMiddleWare,
	testAuthMiddleWare,
	postImageUpload.single("image"),
	postImageResize,
	createPostCtrl
);
postsRoutes.post(
	"/upload-image",
	authMiddleWare,
	testAuthMiddleWare,
	postImageUpload.single("image"),
	postImageResize,
	postImageCtrl
);
postsRoutes.put(
	"/update/:id",
	authMiddleWare,
	testAuthMiddleWare,
	postImageUpload.single("image"),
	postImageResize,
	updatePostCtrl
);
postsRoutes.get("/search", searchPostCtrl);
postsRoutes.put("/user-post", fetchUserPostCtrl);
postsRoutes.put("/like", authMiddleWare,  likePostCtrl);
postsRoutes.put("/dislike", authMiddleWare, disLikingPostCtrl);

postsRoutes.put("/:id", fetchSinglePostsCtrl);

module.exports = postsRoutes;
