import React from "react";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";

const ClearSearch = ({ searchQuery, handleClearSearch, where }) => {
	const { activeCategory } = useSelector((store) => store.allPostSlice);
	return (
		<div>
			{searchQuery.length !== 0 && (
				<div className="flex gap-2 my-2 font-inter">
					<h3>
						All Search result for
						<span className=" ml-1 text-colorPrimary ">
							{searchQuery}{" "}
						</span>
					</h3>
					<h3>{`in ${activeCategory} category`}</h3>
					<button
						onClick={handleClearSearch}
						className=" text-2xl text-red-400 px-1  rounded-lg hover:text-red-600 drop-shadow-md transition-all delay-75"
					>
						<MdCancel />
					</button>
				</div>
			)}
		</div>
	);
};

export default ClearSearch;
