const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/Post");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
const handleCloudinaryUpload = require("../../config/cloundinary/cloudinaryUploadConfig");
const User = require("../../model/user/User");
const checkProfanity = require("../../utils/profanWords");
const decodeToken = require("../../utils/DecodeLoginUser");
const mongoose = require("mongoose");
const { filterCriteria } = require("../../utils/filterSortCriteria");
const PostViewedHistory = require("../../model/postHistory/PostViewedHistory");
const { isValidObjectId } = require("mongoose");
const DOMPurify = require("isomorphic-dompurify");
const cheerio = require("cheerio");

const { main, query } = require("../../utils/getEmbeddins");
const _ = require("lodash");
const Category = require("../../model/category/Category");
const fs = require("fs");
const {
	generateNonLoginUserEmbd,
} = require("../../utils/generateNonLoginUserEmbd");
const {
	getUserSavedAndViewedHistory,
} = require("../../utils/getUserSavedAndViewedHistory");

// '''''''''''''''''''''''''''''''''''''''''
//   Create Post conttoller
// '''''''''''''''''''''''''''''''''''''''''''''
const createPostCtrl = expressAsyncHandler(async (req, res) => {
	const { id } = req.user;

	try {
		validateMongoDbUserId(id);

		const user = await User.findById(id);

		const $ = cheerio.load(req?.body?.content); // Load your HTML
		const postContent = $.root().text();

		const enteredDetails =
			req?.body?.title + "" + req?.body?.description + "" + postContent;

		// const profaneWords = enteredDetails
		// 	.split(" ")
		// 	.filter((word) => checkProfanity(word));
		// if (profaneWords.length > 0) {
		// 	user.isProfaneCount += 1;
		// 	await user.save();

		// 	if (user.isProfaneCount >= 3) {
		// 		user.isBlocked = true;
		// 		await user.save();
		// 		throw new Error(
		// 			"Post contains profane words and account is blocked"
		// 		);
		// 	} else {
		// 		throw new Error(
		// 			`Post not created because it contains profane words (${profaneWords.join(
		// 				", "
		// 			)}). Account will be blocked after the third time.`
		// 		);
		// 	}
		// }

		uploadedImage = await handleCloudinaryUpload(
			req.image,
			`mern-blog-app/${user?.email}/postImage`
		);
		const category = req.body?.category;

		const postCategory = await Category.find({
			title: category,
		});
		const categoryId = postCategory[0]._id;
		const cleanHtml = DOMPurify.sanitize(req.body?.content);

		const embedding = await main(
			`${req.body?.category},
			${postContent},`
		);
		const post = await Post.create({
			...req.body,
			user: id,
			content: cleanHtml,
			category: categoryId,
			embedding,
			categoryText: category,
			image: uploadedImage?.url,
			blurImageUrl: req.blurImageUrl,
		});

		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const fetchAllUserPostCtrl = expressAsyncHandler(async (req, res) => {
	const { filter, searchTerm } = req.query;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");
	const sortingObject = filterCriteria(filter);
	console.log(filter);
	let searchQuery;

	if (searchTerm) {
		if (isValidObjectId(searchTerm)) {
			searchQuery = { _id: new mongoose.Types.ObjectId(searchTerm) };
		} else {
			searchQuery = { "category.title": { $regex: regexPattern } };
		}
	} else {
		searchQuery = {};
	}
	console.log(sortingObject);
	try {
		const matchStage = {
			$match: searchQuery,
		};

		const lookupUserStage = {
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
			},
		};

		const unwindUserStage = {
			$unwind: "$user",
		};

		const lookupCategoryStage = {
			$lookup: {
				from: "categories",
				localField: "category",
				foreignField: "_id",
				as: "category",
			},
		};

		const unwindCategoryStage = {
			$unwind: "$category",
		};
		addFieldStage = {
			$addFields: {
				likesCount: { $size: "$likes" },
				disLikesCount: { $size: "$disLikes" },
			},
		};

		const projectStage = {
			$project: {
				content: 0,
				description: 0,
				title: 0,
				image: 0,
				blurImageUrl: 0,
				password: 0,
			},
		};

		const sortStage = {
			$sort: sortingObject,
		};

		const skipStage = {
			$skip: (page - 1) * postNumberPerPage,
		};

		const limitStage = {
			$limit: postNumberPerPage,
		};

		const aggregationPipeline = [
			lookupUserStage,
			unwindUserStage,
			lookupCategoryStage,
			unwindCategoryStage,
			addFieldStage,
			projectStage,
			matchStage,
			sortStage,
			skipStage,
			limitStage,
		];
		console.log("im her before aggregation");
		const posts = await Post.aggregate(aggregationPipeline);
		console.log("im here after aggregation");

		const totalPosts = await Post.countDocuments(searchQuery);
		const totalPages = Math.ceil(totalPosts / postNumberPerPage);

		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: posts,
			totalNumber: totalPosts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   fetch All the  user post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchUserPostCtrl = expressAsyncHandler(async (req, res) => {
	const { userId } = req.body;

	const { filter, searchTerm } = req.query;

	const page = parseInt(req.query.page) || 1; // Current page number, default to 1
	const postNumberPerPage = parseInt(req.query.postNumberPerPage) || 10; // Number of items per page
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");
	const sortingObject = filterCriteria(filter);
	let searchQuery;

	if (searchTerm) {
		searchQuery = {
			$or: [
				{ title: { $regex: regexPattern } },
				{ categoryText: { $regex: regexPattern } },
			],
		};
	} else {
		searchQuery = {};
	}

	try {
		const { Posts } = await User.findById(userId)
			.populate({
				path: "Posts",
				select: "_id",
			})
			.select("Posts");

		const user = await User.findById(userId)
			.populate({
				path: "Posts",
				populate: {
					path: "category",
				},
				select: "-content",

				match: searchQuery,
				options: { sort: sortingObject },
				skip: (page - 1) * postNumberPerPage,
				limit: postNumberPerPage,
			})
			.select("Posts");

		const userPosts = user.Posts;

		const totalPosts = Posts.length;
		const totalPages = Math.ceil(totalPosts / postNumberPerPage);
		res.json({
			currentPage: page,
			totalPages: totalPages,
			posts: userPosts,
			totalNumber: totalPosts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch single post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const fetchSinglePostsCtrl = expressAsyncHandler(async (req, res) => {
	const userToken = req?.body?.userToken;

	const { id } = req.params;
	validateMongoDbUserId(id);
	try {
		const post = await Post.findById(id)
			.populate("user")
			.populate({
				path: "category",
				select: ["title"],
			});
		// updating number of views of post
		post.numViews++;
		await post.save();

		if (userToken) {
			const loginUserId = await decodeToken(userToken);
			const thresholdTime = new Date();
			thresholdTime.setHours(thresholdTime.getHours() - 24);

			// Check if userViewedPost exists and updatedAt is within the last 24 hours

			userViewedPost = await PostViewedHistory.findOneAndUpdate(
				{
					post: post._id,
					user: loginUserId,
					updatedAt: { $gte: thresholdTime },
				},
				{ $set: { updatedAt: new Date() } },
				{ upsert: true, new: true }
			).populate({
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			});
			res.json({ post, userViewedPost });
			return;
		}

		res.json({ post });
	} catch (error) {
		res.json({ message: "fetching post failed try again" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update post controller
// '''''''''''''''''''''''''''''''''''''''''''''
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const postId = req?.params?.id;
		const loginUserId = req?.user?._id;
		validateMongoDbUserId(loginUserId);
		validateMongoDbUserId(postId);
		let user = await User.findById(loginUserId);
		let post = await Post.findById(postId);

		if (user?._id.toString() !== post?.user?._id.toString())
			throw new Error("only User who created post can Edit it");
		const $ = cheerio.load(req?.body?.content); // Load your HTML
		const postContent = $.root().text();

		const enteredDetails =
			req?.body?.title + "" + req?.body?.description + "" + postContent;

		// const profaneWords = enteredDetails
		// 	.split(" ")
		// 	.filter((word) => checkProfanity(word));
		// if (profaneWords.length > 0) {
		// 	user.isProfaneCount += 1;
		// 	await user.save();

		// 	if (user.isProfaneCount >= 3) {
		// 		user.isBlocked = true;
		// 		await user.save();
		// 		throw new Error(
		// 			"Post contains profane words and account is blocked"
		// 		);
		// 	} else {
		// 		throw new Error(
		// 			`Post not created because it contains profane words (${profaneWords}). Account will be blocked after the third time.`
		// 		);
		// 	}
		// }

		if (req?.file) {
			uploadedImage = await handleCloudinaryUpload(
				req.image,
				`mern-blog-app/${user?.email}/postImage`
			);
		}
		const category = req.body?.category;

		const postCategory = await Category.find({
			title: category,
		});
		const categoryId = postCategory[0]._id;
		const cleanHtml = DOMPurify.sanitize(req.body?.content);

		let imageUrl;
		req?.file ? (imageUrl = uploadedImage?.url) : (imageUrl = post.image);

		const embedding = await main(
			`${req.body?.category},
			${postContent},`
		);

		post = await Post.findByIdAndUpdate(
			postId,
			{
				...req.body,
				embedding,
				image: imageUrl,
				content: cleanHtml,
				category: categoryId,
				blurImageUrl: req.blurImageUrl,
			},
			{
				new: true,
			}
		).populate("user");
		res.json(post);
	} catch (error) {
		res.status(500).json({ messsage: error.message });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   delete post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const deletePostCtrl = expressAsyncHandler(async (req, res) => {
	const { postIds } = req.body;

	try {
		const deletedPosts = await Post.deleteMany({
			_id: { $in: postIds },
		});

		res.status(200).json({
			message: `successfully deleted ${deletedPosts.deletedCount} posts`,
			postIds,
		});
	} catch (error) {
		res.status(400).json({ message: "failed to delete post" });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   liking a post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const likePostCtrl = expressAsyncHandler(async (req, res) => {
	const { postId } = req?.body;

	const loginUserId = req?.user?.id;
	try {
		const post = await Post.findById(postId);
		const alreadyDisliked = post.disLikes.includes(loginUserId);
		if (alreadyDisliked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { disLikes: loginUserId },
					$push: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
		const alreadyLiked = post.likes.includes(loginUserId);
		if (alreadyLiked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		} else {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$push: { likes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
	} catch (error) {
		res.json(error);
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   Disliking a post controller
// ''''''''''''''''''''''''''''''''''''''''''''

const disLikingPostCtrl = expressAsyncHandler(async (req, res) => {
	const { postId } = req?.body;
	const loginUserId = req?.user?.id;
	try {
		const post = await Post.findById(postId);
		const alreadyLiked = post.likes.includes(loginUserId);
		if (alreadyLiked) {
			newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { likes: loginUserId },
					$push: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
		const alreadyDisliked = post.disLikes.includes(loginUserId);
		if (alreadyDisliked) {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$pull: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		} else {
			const newPost = await Post.findByIdAndUpdate(
				postId,
				{
					$push: { disLikes: loginUserId },
				},
				{ new: true }
			);
			res.json({ likes: newPost.likes, disLikes: newPost.disLikes });
			return;
		}
	} catch (error) {
		res.json(error);
	}
});

const searchPostCtrl = expressAsyncHandler(async (req, res) => {
	const page = parseInt(req?.query?.page) || 1; // Current page,
	const searchQuery = req?.query?.searchQuery;
	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page

	// Calculate the skip value to skip items on previous pages
	const skip = (page - 1) * postNumberPerPage;
	try {
		// Use MongoDB's find method with skip and limit

		const posts = await Post.find({ $text: { $search: searchQuery } })
			.skip(skip)
			.limit(postNumberPerPage)
			.populate("user"); // Use the query parameter

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const fetchPostByCategoryCtrl = expressAsyncHandler(async (req, res) => {
	let page = parseInt(req?.query?.page) || 1; // Current page,ipco
	const id = req?.query?.id;

	const postNumberPerPage = parseInt(req?.query?.postNumberPerPage) || 10; // Number of items per page
	let category = req.query?.category;
	const searchQuery = req.query?.searchQuery;
	const userId = req.query?.userId;
	let randomPostId;
	randomPostId = req.query?.randomPostId;

	const where = req.query?.where;

	let skip = (page - 1) * postNumberPerPage;

	try {
		let searchQueryEmbedding;
		let matchCriteria;

		if (searchQuery) {
			matchCriteria = {
				score: { $gte: 0.9 },
			};
			searchQueryEmbedding = await main(searchQuery);
		}

		if (!searchQuery && where === "morePost") {
			const { embedding } = await Post.findById(
				new mongoose.Types.ObjectId(id)
			).select(["embedding"]);
			console.log("search", embedding);
			searchQueryEmbedding = embedding;
			matchCriteria = { _id: { $ne: new mongoose.Types.ObjectId(id) } };
		}

		if (!searchQuery && userId !== "undefined" && where !== "morePost") {
			const { embedding } = await User.findById(userId).select([
				"embedding",
			]);

			if (embedding.length === 0) {
				randomPostIdAndEmbedding = await generateNonLoginUserEmbd(
					page,
					randomPostId
				);
				searchQueryEmbedding = randomPostIdAndEmbedding.embedding;
				randomPostId = randomPostIdAndEmbedding.randomPostId;
				matchCriteria = {};
			} else {
				searchQueryEmbedding = embedding;
				const uniqueUserInteractions = await getUserSavedAndViewedHistory(
					userId
				);
				// const UserHistoryPostIds = uniqueUserInteractions.map(
				// 	(idString) => new mongoose.Types.ObjectId(idString)
				// );
				// matchCriteria = { _id: { $nin: UserHistoryPostIds } };
				matchCriteria = {};
			}
		}
		if (!searchQuery && userId === "undefined" && where !== "morePost") {
			randomPostIdAndEmbedding = await generateNonLoginUserEmbd(
				page,
				randomPostId
			);
			searchQueryEmbedding = randomPostIdAndEmbedding.embedding;
			randomPostId = randomPostIdAndEmbedding.randomPostId;
			matchCriteria = {};
		}
		let preFilter;
		if (category === "all") {
			preFilter = { "category.title": { $ne: category } };
		} else {
			preFilter = { "category.title": { $eq: category } };
		}

		const posts = await Post.aggregate([
			{
				$vectorSearch: {
					index: "vector_index",
					path: "embedding",

					queryVector: searchQueryEmbedding,
					numCandidates: 10000,
					limit: 10000,
				},
			},

			{
				$lookup: {
					from: "users", // Assuming your User model is named "User"
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: "$user",
			},
			{
				$lookup: {
					from: "categories", // Assuming your Category model is named "Category"
					localField: "category",
					foreignField: "_id",
					as: "category",
				},
			},
			{
				$unwind: "$category",
			},

			{
				$project: {
					_id: 1,
					title: 1,
					description: 1,
					numViews: 1,
					readingTime: 1,
					likes: 1,
					disLikes: 1,
					blurImageUrl: 1,
					image: 1,
					updatedAt: 1,
					createdAt: 1,

					score: {
						$meta: "vectorSearchScore",
					},
					"user._id": 1,
					"user.firstName": 1,
					"user.lastName": 1,
					"user.profilePhoto": 1,
					"user.blurProfilePhoto": 1,
					"category.title": 1,
				},
			},
			{
				$match: {
					$and: [preFilter, matchCriteria],
				},
			},
			{ $skip: skip },
			{ $limit: postNumberPerPage },
		]);

		res.status(200).json({ posts, randomPostId });
		return;
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

const fetchUserPostHistoryCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { searchTerm } = req.query;
	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.postNumberPerPage) || 10;
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");

	let searchQuery = {};
	if (searchTerm) {
		searchQuery = { title: { $regex: regexPattern } };
	}

	try {
		const user = await User.findById(_id).populate({
			path: "postViewHistory",
			populate: {
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			},

			options: { sort: { updatedAt: -1 } },
		});

		// Filter the post history array based on the search criteria

		const filteredpostViewHistory = user.postViewHistory.filter(
			(postViewHistory) => {
				return (
					postViewHistory.post &&
					postViewHistory.post.title.match(regexPattern)
				);
			}
		);

		const postViewHistoryTotalCount = filteredpostViewHistory.length;

		const paginatedpostViewHistory = filteredpostViewHistory.slice(
			(page - 1) * numberPerPage,
			page * numberPerPage
		);

		res.json({
			totalPostHistory: postViewHistoryTotalCount,
			posts: paginatedpostViewHistory,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

const fetchUserSavedPostCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { searchTerm } = req.query;
	const page = parseInt(req.query.page) || 1;
	const numberPerPage = parseInt(req.query.postNumberPerPage) || 10;
	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");

	let searchQuery = {};
	if (searchTerm) {
		searchQuery = { title: { $regex: regexPattern } };
	}

	try {
		const user = await User.findById(_id).populate({
			path: "savedPost",
			populate: {
				path: "post",
				select: ["image", "title", "createdAt", "blurImageUrl"],
			},

			options: { sort: { updatedAt: -1 } },
		});

		// Filter the savedPost array based on the search criteria
		const filteredSavedPost = user.savedPost.filter((savedPost) => {
			return savedPost.post && savedPost.post.title.match(regexPattern);
		});

		const savedPosTotalCount = filteredSavedPost.length;

		const paginatedSavedPost = filteredSavedPost.slice(
			(page - 1) * numberPerPage,
			page * numberPerPage
		);

		res.json({
			totalSavedPosts: savedPosTotalCount,
			posts: paginatedSavedPost,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

const postImageCtrl = expressAsyncHandler(async (req, res) => {
	const user = req.user;

	uploadedImage = await handleCloudinaryUpload(
		req.image,
		`mern-blog-app/${user?.email}/postImage`
	);

	res.status(200).json(uploadedImage);
});

const fetchTrendingPost = expressAsyncHandler(async (req, res) => {
	const numberOfPost = req.body?.numberOfPost;
	try {
		const post = await Post.find({})
			.sort({ numViews: -1 })
			.limit(numberOfPost)
			.populate({
				path: "user",
				select: [
					"firstName",
					"lastName",
					"profilePhoto",
					"blurProfilePhoto",
				],
			})
			.select(["title", "readingTime", "updatedAt", "numViews"]);

		res.status(200).json(post);
	} catch (error) {
		res.status(500).json("failed to fetch trending Post");
	}
});

module.exports = {
	createPostCtrl,
	fetchUserPostCtrl,
	fetchSinglePostsCtrl,
	updatePostCtrl,
	deletePostCtrl,
	likePostCtrl,
	disLikingPostCtrl,
	searchPostCtrl,
	fetchPostByCategoryCtrl,
	fetchUserPostHistoryCtrl,
	fetchUserSavedPostCtrl,
	fetchAllUserPostCtrl,
	postImageCtrl,
	fetchTrendingPost,
};
