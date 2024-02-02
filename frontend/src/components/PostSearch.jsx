import React, { useEffect } from "react";
import { useSearchWithDebounce } from "../customHooks/SearchWithDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
	fetchAllCategorys,
	setIsTAbleOfContentClick,
} from "../redux/category/categorySlice";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

import { TfiMenuAlt } from "react-icons/tfi";

import { Category, DashboardCustomDropdown, Tooltip } from ".";

const PostSearch = ({ categoryNumber, isTableOfContent }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { allCategory, isTableOfContentClciked } = useSelector(
		(store) => store.categorySlice
	);

	const { activeCategory } = useSelector((store) => store.allPostSlice);

	let allCategoryArray = allCategory.map((category) => category.title);
	allCategoryArray = ["all", ...allCategoryArray];

	const displayedCategoryArray = [
		activeCategory,
		...allCategoryArray
			.filter((category) => category != activeCategory)
			.slice(0, categoryNumber || 5),
	];

	useEffect(() => {
		allCategory.length === 0 && dispatch(fetchAllCategorys());
	}, []);

	const handleSelected = (filter) => {
		
		dispatch(setFetchFirstCategory(filter));

		location.pathname === "/" && dispatch(fetchPostByCategory());

		navigate("/");
	};

	const { searchTerm, handleInputChange } = useSearchWithDebounce();

	return (
		<div className=" bg-white dark:bg-lightdark border-b dark:border-b-gray-800  gap-4 categorySticky ">
			<div className=" hidden md:flex gap-4 justify-center">
				<Category
					allCategory={displayedCategoryArray}
					handleSelected={handleSelected}
					isActive={activeCategory}
				/>
			</div>
			{/* <Scraper /> */}

			<div className="  md:hidden flex items-center justify-between gap-4 mx-3">
				{isTableOfContent && (
					<div
						onClick={() =>
							dispatch(setIsTAbleOfContentClick(!isTableOfContentClciked))
						}
						className=" p-2 hover:bg-gray-300 hover:dark:bg-dark hover:cursor-pointer  transition-colors delay-75 rounded-full"
					>
						<Tooltip info={""}>
							<TfiMenuAlt className=" text-2xl " />
						</Tooltip>
					</div>
				)}

				<div className="z-10000">
					<DashboardCustomDropdown
						allFilters={allCategoryArray}
						selectedFilter={activeCategory}
						handleSelected={handleSelected}
						left={"-left-4"}
						dropdownWidth={"w-[60vw]"}
					/>
				</div>

				<form className="relative z-50   w-[50vw]">
					<input
						className={` text-xs  px-1 font-sm rounded-lg shadow-sm bg-gray-100 border dark:border-gray-600 focus:border-b-gray-500 dark:bg-lightdark py-2  text-center focus:outline-none w-full  dark:focus:border-b-blue-400`}
						type="text"
						id="searchInputPostMobile"
						placeholder="Search"
						value={searchTerm}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleInputChange();
							}
						}}
					/>
				</form>
			</div>
		</div>
	);
};

export default PostSearch;
