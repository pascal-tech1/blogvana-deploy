const Post = require("../model/post/Post");
const _ = require("lodash");
const {
	getUserSavedAndViewedHistory,
} = require("./getUserSavedAndViewedHistory");

const generateloginUserEmbd = async (userId) => {
	const uniqueUserInteractions = await getUserSavedAndViewedHistory(
		userId
	);

	const userPostsEmbeddings = await Promise.all(
		uniqueUserInteractions.map(async (postId) => {
			const post = await Post.findById(postId).select(["embedding"]);
			return post ? post.embedding : null; // return null if the post is not found
		})
	);

	const averageEmbedding = _.zip(...userPostsEmbeddings).map((values) =>
		_.mean(values)
	);
	// Step 2: Normalize the Averaged Embedding
	const norm = Math.sqrt(_.sum(averageEmbedding.map((val) => val ** 2)));

	const normalizedEmbedding = _.map(averageEmbedding, (val) => val / norm);

	return normalizedEmbedding;
};

module.exports = { generateloginUserEmbd };
