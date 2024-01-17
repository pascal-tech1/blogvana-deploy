import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";

import { BsPencilSquare } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

import { Link, useNavigate } from "react-router-dom";
import {
	clearSinglesliceState,
	setIsEditingPost,
	setPostToBeEdited,
} from "../../redux/post/singlePostSlice";
import { useDispatch, useSelector } from "react-redux";
import UserDashboardMenu from "./UserDashboardMenu";
import { setSearchTermInStore } from "../../redux/user/userSlice";
import { useClickOutside } from "../../customHooks";
import { setSideBarStateInStore } from "../../redux/category/categorySlice";

import { BiSearch } from "react-icons/bi";
import { Theme } from "../../components";

const DashboardNavBAr = ({ refOpt, screenWidth }) => {
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, isSearchBarNeeded } = useSelector(
		(store) => store.userSlice
	);
	const { isSideBarOpen } = useSelector((store) => store.categorySlice);

	const dispatch = useDispatch();
	const handleOnclick = (e) => {
		e.preventDefault();
		dispatch(setSideBarStateInStore(!isSideBarOpen));
	};

	useEffect(() => {
		if (!isTyping) return;
		// Create a timer variable to store the timeout ID
		let timer;

		// Define the debounced search function
		const debouncedSearch = () => {
			dispatch(setSearchTermInStore(searchTerm));
			setIsTyping(false);
			setSearchTerm("");
			setIsSearching(false);
		};

		// Clear the previous timer to avoid multiple simultaneous searches
		clearTimeout(timer);

		// Set a new timer for the debounce effect
		timer = setTimeout(debouncedSearch, 700);

		// Cleanup function to clear the timer if component unmounts or searchTerm changes
		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handleInputChange = (event) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(newSearchTerm);
		setIsTyping(true);
	};
	// using custom hook to close the open UserDashboardMenu
	const divRef = useRef();
	const iconRef = useRef();
	const searchBarIconRef = useRef();
	const searchInputRef = useRef();
	const isOutsideClicked = useClickOutside(divRef, iconRef);
	const isSearchBarOutsideClick = useClickOutside(
		searchBarIconRef,
		searchInputRef
	);

	useEffect(() => {
		isMenuOpen && !isOutsideClicked && setIsMenuOpen(false);
	}, [isOutsideClicked]);

	useEffect(() => {
		isSearching && !isSearchBarOutsideClick && setIsSearching(false);
	}, [isSearchBarOutsideClick]);

	useEffect(() => {
		isSearching && searchInputRef.current.focus();
	}, [isSearching]);
	return (
		<div className="  flex font-inter  w-full top-0 right-0 justify-between  bg-white dark:bg-dark  border-b dark:border-b-gray-800 z-50 items-center relative   py-2 dark:text-slate-300 ">
			<div ref={divRef} className={`absolute right-0`}>
				<UserDashboardMenu
					isMenuOpen={isMenuOpen}
					setIsMenuOpen={setIsMenuOpen}
				/>
			</div>

			<div
				ref={screenWidth <= 798 ? refOpt : null}
				onClick={handleOnclick}
			>
				<FiMenu className=" text-2xl ml-4  cursor-pointer text-gray-900 dark:text-slate-300" />
			</div>
			{isSearchBarNeeded && (
				<div className="flex items-center">
					<input
						ref={searchInputRef}
						className={`  ${
							isSearching ? " w-[70vw] md:w-[100%] " : "hidden md:flex"
						}   md:relative md:bottom-0 py-[0.1rem] outline-none mx-6 text-center border  border-gray-100 focus:border-b-gray-300 dark:border-gray-800 dark:focus:border-b-gray-600  dark:bg-lightdark transition-all rounded-lg  placeholder:text-gray-400`}
						type="text"
						id="searchInput"
						placeholder="Search"
						value={searchTerm}
						onChange={handleInputChange}
					/>
					<div ref={searchBarIconRef}>
						<BiSearch
							onClick={(e) => {
								e.preventDefault();
								setIsSearching(!isSearching);
							}}
							className={`${
								isSearching
									? "hidden"
									: " md:hidden text-2xl hover:cursor-pointer"
							}`}
						/>
					</div>
				</div>
			)}
			{/* theme  */}
			<div className={`${isSearching ? "hidden md:flex  " : " flex  "}  `}>
				<Theme />
			</div>
			{/* user */}
			<div
				className={`${
					isSearching
						? "hidden md:flex gap-4 items-center mr-2  "
						: " flex gap-4 items-center mr-2 "
				}  `}
			>
				<h3 className=" hidden md:flex text-xs border-l pl-1">
					Hello, {user?.lastName}
				</h3>
				<div className=" flex gap-2 rounded-full w-8 h-8 text-colorPrimary  ">
					<img
						src={user?.profilePhoto}
						alt=""
						className=" rounded-full h-full w-full "
					/>
				</div>
				<Link
					onClick={(e) => {
						e.preventDefault();
						dispatch(setPostToBeEdited([]));
						dispatch(setIsEditingPost(false));
						dispatch(clearSinglesliceState("success"));
						navigate("/post-Create");
					}}
					className=" flex hover:border-gray-300  place-items-center gap-[0.3rem] border border-blue-300 px-1 py-1 md:px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800  transition-all"
				>
					<BsPencilSquare className=" text-inherit" />
					<h3 className="hidden md:flex text-xs">new</h3>
				</Link>

				<div
					ref={iconRef}
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className=" p-1 rounded-full hover:cursor-pointer hover:bg-gray-400  transition-all delay-75 hover:text-white"
				>
					<CiMenuKebab />
				</div>
			</div>
		</div>
	);
};

export default DashboardNavBAr;
