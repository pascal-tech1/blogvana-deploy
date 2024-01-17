const User = require("../model/user/User");

const getUserSavedAndViewedHistory = async (userId) => {
	const user = await User.findById(userId).populate([
		"savedPost",
		"postViewHistory",
	]);

	const savedPost = user?.savedPost;
	const postViewHistory = user?.postViewHistory;
	const recentSavedPostIds = savedPost
		? savedPost.slice(0, 10).map((savedPost) => savedPost?.post.toString())
		: [];
	const recentPostViewIds = postViewHistory
		? postViewHistory
				.slice(0, 5)
				.map((postView) => postView?.post.toString())
		: [];

	const userInteractions = [...recentPostViewIds, ...recentSavedPostIds];
	const uniqueUserInteractions = [...new Set(userInteractions)];
	return uniqueUserInteractions;
};

module.exports = { getUserSavedAndViewedHistory };
