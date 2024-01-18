const mongoose = require("mongoose");
const Post = require("../../model/post/Post");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI, {});
		console.log(`Mongo db connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
module.exports = connectDB;

const db = mongoose.connection;

// Event listener for successful connection
db.once("open", () => {
	// Set up a timer for periodic warm-up queries
	setInterval(() => {
		Post.findOne({});
		console.log("i have run");
	}, 60000); // Send a warm-up query every 60 seconds (adjust as needed)
});
