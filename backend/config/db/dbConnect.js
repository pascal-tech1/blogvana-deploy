const mongoose = require("mongoose");

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

// const url = "mongodb://127.0.0.1:27017/mern-blog-app";

// mongoose.connect(url, { useNewUrlParser: true });

// const db = mongoose.connection;

// const connectDB = () => {
// 	db.once("open", (_) => {
// 		console.log("Database connected:", url);
// 	});

// 	db.on("error", (err) => {
// 		console.error("connection error:", err);
// 	});
// };

// module.exports = connectDB;

const db = mongoose.connection;

// Event listener for successful connection
db.once("open", () => {
	console.log("Connected to MongoDB");

	// Set up a timer for periodic warm-up queries
	setInterval(() => {
		const collection = db.collection("yourCollectionName"); // Replace with your actual collection name
		collection.findOne({}, (err, doc) => {
			if (err) {
				console.error("Warm-up query error:", err);
				// Handle connection errors if needed
			}
		});
	}, 60000); // Send a warm-up query every 60 seconds (adjust as needed)
});
