const mongoose = require("mongoose");
const Post = require("../../model/post/Post");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI, {
			minPoolSize: 2,
			maxPoolSize: 10,
		});
	} catch (error) {
		process.exit(1);
	}
};
module.exports = connectDB;
