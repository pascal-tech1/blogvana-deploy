import React from "react";

import { useDispatch, useSelector } from "react-redux";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../../redux/post/allPostSlice";
import { useNavigate } from "react-router-dom";
import { setActiveEditingCategory } from "../../redux/category/categorySlice";

const AdminCategory = ({
	allCategory,
	className,
	checkedItems,
	handleCheckedItemcsChange,
}) => {
	const { isCategoryEditing } = useSelector(
		(store) => store.categorySlice
	);

	const dispatch = useDispatch();
	className = className || " flex justify-between gap-2 flex-wrap ";
	const navigate = useNavigate();

	return (
		<div className={className}>
			{allCategory?.map((category, index) => {
				return (
					<div key={index} className="flex gap-1 items-center font-inter">
						{isCategoryEditing && (
							<input
								type="checkbox"
								name="check"
								id={category._id}
								checked={checkedItems.includes(category._id)}
								onChange={() => handleCheckedItemcsChange(category._id)}
								className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
						)}

						<button
							key={index}
							onClick={(e) => {
								if (!isCategoryEditing) {
									dispatch(setFetchFirstCategory(category.title));
									dispatch(fetchPostByCategory());
									navigate("/");
								} else {
									dispatch(setActiveEditingCategory(category));
								}
							}}
							className={`whitespace-nowrap gap-2 mt-1 md:text-sm delay-75 cursor-pointer flex text-white bg-blue-400 hover:bg-blue-200 rounded-xl py-[0.2rem] px-4`}
						>
							{category.title.charAt(0).toUpperCase() +
								category.title.slice(1).toLowerCase()}
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default AdminCategory;
