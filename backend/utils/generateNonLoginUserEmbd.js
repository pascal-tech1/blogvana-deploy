const Post = require("../model/post/Post");

const generateNonLoginUserEmbd = async (page, randomPostId) => {
	if (page === 1) {
		const randomPost = await Post.aggregate([{ $sample: { size: 1 } }]);
		randomPostId = randomPost[0]?._id;
		return { embedding: randomPost[0]?.embedding, randomPostId };
	} else {
		const { embedding } = await Post.findById(randomPostId).select([
			"embedding",
		]);
		return { embedding, randomPostId };
	}
};

module.exports = { generateNonLoginUserEmbd };
