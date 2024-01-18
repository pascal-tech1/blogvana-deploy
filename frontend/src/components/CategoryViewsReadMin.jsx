import React from "react";
import { formatNumber } from "../utils/formatNumbersIn1000";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmarkPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { savePost } from "../redux/user/userSlice";

const CategoryViewsReadMin = ({ post }) => {
	const user = useSelector((store) => store?.userSlice?.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	return (
		<div className=" flex items-center gap-2 ">
			<span className="flex gap-1 items-center text-sm flex-nowrap">
				<span className=" ">{formatNumber(post?.numViews)}</span>
				{post?.numViews > 1 ? "views" : "view"}
			</span>
			{post?.readingTime && (
				<span className=" text-sm">{`${post?.readingTime} min read`}</span>
			)}

			<button
				onClick={() => {
					if (!user) {
						navigate("/login");
						return;
					}

					dispatch(savePost(post?._id));
				}}
				aria-label="save post button"
				className=" text-base ml-10rem hover:bg-gray-200 p-[0.3rem] hover:dark:bg-gray-800 mr-1 rounded-full "
			>
				<BsBookmarkPlus className=" text-lg" />
			</button>
		</div>
	);
};

export default CategoryViewsReadMin;
