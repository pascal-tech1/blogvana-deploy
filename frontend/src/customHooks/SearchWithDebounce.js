import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	fetchPostByCategory,
	setFirstSearch,
} from "../redux/post/allPostSlice";

export const useSearchWithDebounce = () => {
	const [isSearching, setIsSearching] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isSearching) return;
		// Create a timer variable to store the timeout ID
		let timer;

		// Define the debounced search function
		const debouncedSearch = () => {
			dispatch(setFirstSearch(searchTerm));
			navigate("/");
			dispatch(fetchPostByCategory());
			setSearchTerm("");
			setIsSearching(false);
		};

		// Clear the previous timer to avoid multiple simultaneous searches

		clearTimeout(timer);

		// Set a new timer for the debounce effect
		timer = setTimeout(debouncedSearch, 1000);

		// Cleanup function to clear the timer if component unmounts or searchTerm changes
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handleInputChange = (event) => {
		event.preventDefault();
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
		setIsSearching(true);
	};
	return { searchTerm, handleInputChange };
};
