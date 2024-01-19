const { HfInference } = require("@huggingface/inference");
const hf = new HfInference("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");

async function main(input) {
	const output = await hf.featureExtraction({
		model: "thenlper/gte-small",
		inputs: input,
		pooling: "mean",
		normalize: true,
	});

	return output;
}

async function query(data) {
	const result = await hf.textToSpeech({
		model: "espnet/kan-bayashi_ljspeech_vits",
		inputs: data,
	});
	return result;
}

module.exports = { main, query };

// // Function to split the content into chunks
// function splitContent(content, chunkSize) {
// 	const chunks = [];
// 	for (let i = 0; i < content.length; i += chunkSize) {
// 		chunks.push(content.slice(i, i + chunkSize));
// 	}
// 	return chunks;
// }

// // Split postContent into chunks of 300 characters
// const contentChunks = splitContent(postContent, 300);

// // Process each chunk separately
// contentChunks.map((string, index) => {
// 	query(string).then((response) => {
// 		const inputFilePath = `input${index}.flac`;
// 		const outputFilePath = "output.mp3"; // You can change the format as needed
// 		const blobURL = URL.createObjectURL(response);
// 		console.log(response);
// 		console.log(blobURL);

// 		// Fetch the Blob data
// 		fetch(blobURL)
// 			.then((response) => response.arrayBuffer())
// 			.then((data) => {
// 				console.log(data);
// 				fs.writeFileSync(inputFilePath, Buffer.from(data));
// 			})
// 			.catch((error) =>
// 				console.error("Error fetching Blob data:", error)
// 			);
// 	});
// });
