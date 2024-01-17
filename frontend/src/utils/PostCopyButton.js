import { toast } from "react-toastify";

// Function to copy text to clipboard
export const copyToClipboard = (text) => {
	toast.success("code copied successfully");

	navigator.clipboard.writeText(text);
};

// Function to add copy buttons to each pre tag
export const addCopyButtons = () => {
	const preElements = document.querySelectorAll(".ql-syntax");

	preElements.forEach((preElement) => {
		const codeDiv = document.createElement("div");
		codeDiv.className = "code-div";

		const copyButton = document.createElement("button");
		copyButton.innerText = "Copy";
		copyButton.className = "copy-button";

		codeDiv.appendChild(preElement.cloneNode(true)); // Clone the preElement to avoid moving it
		codeDiv.appendChild(copyButton);

		copyButton.addEventListener("click", () => {
			copyToClipboard(preElement.innerText);
		});

		// Replace the original preElement with the codeDiv
		preElement.parentNode.replaceChild(codeDiv, preElement);
	});
};



