import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useClickOutside } from "../customHooks";

const DashboardCustomDropdown = ({
	allFilters,
	selectedFilter,
	dropdownWidth,
	left,
	handleSelected,
	setSelectedFilter,
	buttonBorder,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	// using custom hook to close the open UserDashboardMenu
	const divRef = useRef();
	const iconRef = useRef();

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectedFilter = (filter) => {
		dispatch(setSelectedFilter(filter));
	};
	useEffect(() => {
		const handleClick = (event) => {
			if (
				(divRef.current && divRef.current.contains(event.target)) ||
				(iconRef?.current && iconRef?.current.contains(event.target))
			) {
				// Click occurred inside the div
				
			} else {
				// Click occurred outside the div
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			// Cleanup: Remove event listener when component unmounts
			document.removeEventListener("click", handleClick);
		};
	}, [divRef, iconRef]);

	handleSelected = handleSelected ? handleSelected : handleSelectedFilter;

	return (
		<div className="relative z-[50] flex flex-col font-inter text-sm ">
			<div
				ref={iconRef}
				type="button"
				onClick={toggleDropdown}
				className={`${
					buttonBorder === undefined ? "border" : ""
				} bg-white gap-1 cursor-pointer dark:bg-lightdark text-sm  dark:text-slate-200  dark:border-gray-700 justify-center py-[0.3rem] md:text-sm outline-none focus:border-gray-400 capitalize whitespace-nowrap  px-3 flex font-inter  items-center rounded-lg text-gray-700 focus:outline-none`}
			>
				{selectedFilter}
				{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
			</div>

			<div
				ref={divRef}
				className={`${left ? left : "-left-12"} ${
					dropdownWidth ? dropdownWidth : " w-[40vw]"
				} ${
					// isOpen ? " translate-y-1 duration-300 ease-in-out" : " -translate-y-2 duration-300 ease-in-out opacity-0 "
					isOpen ? "" : "hidden"
				} absolute flex top-10 self-center md:text-sm gap-1 flex-wrap max-h-[50vh] z-50 overflow-y-auto custom-scrollbar justify-evenly  px-2  items-center  rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-lightdark shadow-lg`}
			>
				{allFilters.map((filter, index) => (
					<div
						key={index}
						className={`${
							selectedFilter === filter && " border-b border-b-blue-600"
						} bg-gray-100 cursor-pointer dark:bg-lightdark hover:bg-gray-200 dark:hover:bg-gray-800 transition-all delay-75 rounded-md md:text-sm px-2 py-[0.12rem] my-1 `}
						onClick={() => {
							handleSelected(filter);
							setIsOpen(false);
						}}
					>
						{filter?.charAt(0).toUpperCase() +
							filter?.slice(1).toLowerCase()}
					</div>
				))}
			</div>
		</div>
	);
};

export default DashboardCustomDropdown;
