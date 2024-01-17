const express = require("express");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUserCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
	updateUserDetailsCtrl,
	updatePasswordCtrl,
	followingUserCtrl,
	unFollowingUserCtrl,
	sendAcctVerificationEmailCtrl,
	confirmSentEmailCtrl,
	sendPasswordResetEmailCtrl,
	resetPasswordCtrl,
	profilePhotoUploadCtrl,
	userLoginWithTokenCtrl,
	savePostCtrl,
	fetchRandomUserCtrl,
	fetchUserFollowersListCtrl,
	fetchUserFollowingListCtrl,
	fetchUserCountsCtrl,
	fetchWhoViewedUserProfileCtrl,
	fetchPostImpressionsCount,
	blockOrUnblockUserCtrl,
	ChangeEmailCtrl,
	toggleAdminUserCtrl,
	updateUserEmbeddingCtrl,
} = require("../../controllers/users/usersCtrl");
const {
	profilePhotoUpload,
	ProfilePhotResize,
} = require("../../middlewares/uploads/PhotoUpload");
const adminMiddleWare = require("../../middlewares/authentication/authAdminCheck");

const userRoutes = express.Router();

userRoutes.get("/user-details-Count", authMiddleWare, fetchUserCountsCtrl);
userRoutes.get(
	"/admin-all-users",
	authMiddleWare,
	adminMiddleWare,
	fetchAllUserCtrl
);
userRoutes.get("/viewedBy", authMiddleWare, fetchWhoViewedUserProfileCtrl);
userRoutes.get("/following", fetchUserFollowingListCtrl);
userRoutes.get("/followers", fetchUserFollowersListCtrl);
userRoutes.get(
	"/update-embedding",
	authMiddleWare,
	updateUserEmbeddingCtrl
);
userRoutes.post(
	"/blockOrUnblock-user",
	authMiddleWare,
	adminMiddleWare,
	blockOrUnblockUserCtrl
);
userRoutes.get(
	"/impression-Counts",
	authMiddleWare,
	fetchPostImpressionsCount
);
userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/random-users", fetchRandomUserCtrl);
userRoutes.get("/loginWithToken", authMiddleWare, userLoginWithTokenCtrl);
userRoutes.post("/login", userLoginCtrl);

userRoutes.post(
	"/delete",
	authMiddleWare,
	adminMiddleWare,
	deleteUserCtrl
);
// userRoutes.get("/:USERID", authMiddleWare, fetchUserDetailsCtrl);
userRoutes.get("/profile/:userId", authMiddleWare, fetchUserDetailsCtrl);
userRoutes.post("/save-post", authMiddleWare, savePostCtrl);
userRoutes.post(
	"/profile-picture-upload",
	authMiddleWare,
	profilePhotoUpload.single("image"),
	ProfilePhotResize,
	profilePhotoUploadCtrl
);
userRoutes.post("/send-email", sendAcctVerificationEmailCtrl);
userRoutes.post("/confirm-sent-email", confirmSentEmailCtrl);
userRoutes.post("/change-email", authMiddleWare, ChangeEmailCtrl);
userRoutes.post("/forget-password", sendPasswordResetEmailCtrl);
userRoutes.post("/reset-password", resetPasswordCtrl);
userRoutes.post("/follow", authMiddleWare, followingUserCtrl);
userRoutes.post("/unfollow", authMiddleWare, unFollowingUserCtrl);
userRoutes.post("/update-password", authMiddleWare, updatePasswordCtrl);
userRoutes.put("/:USERID", authMiddleWare, updateUserDetailsCtrl);
userRoutes.post(
	"/toggleAdminStatus",
	authMiddleWare,
	adminMiddleWare,
	toggleAdminUserCtrl
);

module.exports = userRoutes;
