import customFetch from "./axios";
import { store } from "../redux/Store";
import { uptimizeCloudinaryImage } from "./imageCloudinaryOptimizer";
import { toast } from "react-toastify";
// import hljs from "highlight.js";

// import "highlight.js/styles/github.css";
const toolbarOptions = [
	["bold", "italic", "underline", "strike"], // toggled buttons
	["blockquote", "code-block"],
	[{ list: "ordered" }, { list: "bullet" }],
	[{ script: "sub" }, { script: "super" }],
	[{ indent: "-1" }, { indent: "+1" }],
	[{ direction: "rtl" }],
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	[{ color: [] }, { background: [] }],
	[{ align: [] }],
	["link", "image", "video"], // Include the new "iframeVideo" button
	["clean"],
];

// Call the function to load Highlight.js before rendering your component

export const modules = {
	syntax: {
		highlight: (text) => {
			if (window.hljs) {
				return hljs.highlightAuto(text).value;
			} else {
				// Handle the case where Highlight.js is not yet loaded
				return text; // Or display a placeholder message
			}
		},
	},
	toolbar: toolbarOptions,
	blotFormatter: {
		overlay: {
			style: {
				border: "2px solid blue",
			},
		},
	},

	imageUploader: {
		upload: (file) => {
			return new Promise((resolve, reject) => {
				const formData = new FormData();
				formData.append("image", file);

				customFetch
					.post(
						`/posts/upload-image`,
						formData,

						{
							headers: {
								"Content-Type": "multipart/form-data",
								Authorization: `Bearer ${
									store.getState().userSlice.token
								} `,
							},
						}
					)

					.then((result) => {
						resolve(
							uptimizeCloudinaryImage(
								"f_auto,q_auto,w_800",
								result.data.url
							)
						);
					})
					.catch((error) => {
						reject("Upload failed");
						console.error("Error:", error);
						toast.error("upload failed");
					});
			});
		},
	},
};

function loadHighlightJS() {
	const script = document.createElement("script");
	script.src =
		"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
	document.head.appendChild(script);
}

export default loadHighlightJS;
