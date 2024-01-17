import { store } from "../redux/Store";
import { setIsTAbleOfContentClick } from "../redux/category/categorySlice";

export const addIdsToHeadings = (html) => {
	const doc = new DOMParser().parseFromString(html, "text/html");

	const headings = ["h1", "h2", "h3"];

	headings.forEach((headingTag, index) => {
		const headingElements = doc.querySelectorAll(headingTag);
		headingElements.forEach((element, i) => {
			const uniqueId = `${element.tagName.toLowerCase()}-${element.textContent.trim()}`;
			element.id = uniqueId;
		});
	});

	return doc.body.innerHTML;
};

export const createLinksForHeadings = (html) => {
	const doc = new DOMParser().parseFromString(html, "text/html");

	const headingElements = Array.from(doc.querySelectorAll("h1, h2, h3"));
	const linksDiv = doc.createElement("div");

	headingElements.forEach((element) => {
		const uniqueId = `${element.tagName.toLowerCase()}-${element.textContent.trim()}`;
		element.id = uniqueId;

		// Create link element
		const linkElement = doc.createElement("a");
		linkElement.href = `#${uniqueId}`;
		const linkElementChild = doc.createElement(element.tagName);
		linkElementChild.textContent = element.textContent;
		linkElement.appendChild(linkElementChild);
		linkElement.className = "toc-link";

		// Append link to the new div
		linksDiv.appendChild(linkElement);
	});

	return linksDiv.outerHTML;
};

// add an event listener to all the heading tags h1,h2 and h3
export const addClickEventToTocHeadings = () => {
	const tocDiv = document.querySelector(".toc");
	if (tocDiv) {
		const headings = tocDiv.querySelectorAll("a");
		headings.forEach((heading) => {
			heading.addEventListener("click", (e) => {
				e.preventDefault();

				// Extract the target ID from the href
				const targetId = heading.getAttribute("href").substring(1);

				// Find the target element by ID
				const targetElement = document.getElementById(targetId);

				if (targetElement) {
					// Scroll to the target element with smooth behavior
					targetElement.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});

					// Close mobile dropdown state in categoryslice
					store.dispatch(setIsTAbleOfContentClick(false));
				}
			});
		});
	}
};

// handle scrolling and add is-active clsss to the heading element nearest to the top
//  of the screen and also to the link that is active in the table of content
export const handleScroll = () => {
	const scrollPosition = window.scrollY;

	// Find the div with the class name 'post-content'
	const postContentDiv = document.querySelector(".post-content");

	if (!postContentDiv) {
		return; // Exit if the post-content div is not found
	}

	// Find heading elements within the post-content div
	const headingElements = postContentDiv.querySelectorAll("h1, h2, h3");

	// Get the heights of fixed elements (e.g., navbar and search component)
	const navbarHeight =
		document.querySelector(".nav-bar")?.offsetHeight || 63;

	const searchComponentHeight =
		document.querySelector(".post-search")?.offsetHeight || 54;

	// Initialize the nearest heading as null
	let nearestHeading = null;

	// Loop through heading elements to find the nearest visible heading
	headingElements.forEach((headingElement) => {
		const boundingBox = headingElement.getBoundingClientRect();

		// Check if the heading is currently visible on the screen
		if (
			boundingBox.top + scrollPosition >= navbarHeight + 30 &&
			boundingBox.bottom <= window.innerHeight - searchComponentHeight
		) {
			// Check if nearestHeading is null or if the current heading is closer to the top
			if (
				!nearestHeading ||
				Math.abs(boundingBox.top - scrollPosition) <
					Math.abs(
						nearestHeading.getBoundingClientRect().top - scrollPosition
					)
			) {
				nearestHeading = headingElement;
			}
		}
	});

	if (nearestHeading) {
		// Check for elements with the class 'is-active' in the DOM
		const elementsWithIsActiveClass =
			document.querySelectorAll(".is-active");

		// Remove 'is-active' class from all elements
		elementsWithIsActiveClass.forEach((element) => {
			element.classList.remove("is-active");
		});

		// Find the corresponding <a> tag with href matching the id of nearestHeading
		const correspondingLink = document.querySelector(
			`a[href="#${nearestHeading.id}"]`
		);

		// Add 'is-active' class to the nearestHeading element
		nearestHeading.classList.add("is-active");
		// Add 'is-active' class to the corresponding <a> tag
		if (correspondingLink) {
			correspondingLink.classList.add("is-active");
		}
	}
};
