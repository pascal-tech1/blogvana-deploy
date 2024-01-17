import React from "react";
import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";

import { likeOrDislikePost } from "../redux/post/generalPostSlice";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { savePost } from "../redux/user/userSlice";
import { SlDislike } from "react-icons/sl";
import { FcLike } from "react-icons/fc";
import { HiOutlineHandThumbUp } from "react-icons/hi2";
import { HiOutlineHandThumbDown } from "react-icons/hi2";
import { GoThumbsdown } from "react-icons/go";
import { GoThumbsup } from "react-icons/go";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";
import { formatNumber } from "../utils/formatNumbersIn1000";
import { CiBookmarkPlus, CiSaveUp2 } from "react-icons/ci";
import { BsBookmarkPlus, BsHandThumbsUp } from "react-icons/bs";

const LikesSaveViews = ({ post }) => {
	const location = useLocation();
	const user = useSelector((store) => store?.userSlice?.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleLikes = (id) => {
		if (!user) {
			navigate("/login");
			return;
		}

		dispatch(likeOrDislikePost({ choice: "like", postId: id }));
	};
	const handleDislikes = (id) => {
		if (!user) {
			navigate("/login");
			return;
		}

		dispatch(likeOrDislikePost({ choice: "disLike", postId: id }));
	};
	return (
		<div className="  flex gap-2 font-inter items-center  dark:text-slate-300 flex-wrap justify-start  ">
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleLikes(post?._id)}
					aria-label="like button"
					className=" text-base hover:cursor-pointer p-2 mr-1 transition-all delay-75 hover:dark:bg-gray-800 hover:bg-gray-300 rounded-full "
				>
					<GoThumbsup className=" text-xl" />
				</button>
				<span>{post?.likes?.length}</span>
			</span>
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleDislikes(post?._id)}
					aria-label="dislike button"
					className="text-base hover:cursor-pointer p-2  transition-all delay-75 hover:bg-gray-200 hover:dark:bg-gray-800 rounded-full "
				>
					<GoThumbsdown className=" text-xl" />
				</button>
				<span>{post?.disLikes?.length}</span>
			</span>

			<button
				onClick={() => {
					if (!user) {
						navigate("/login");
						return;
					}

					dispatch(savePost(post?._id));
				}}
				aria-label="save post button"
				className=" text-base hover:bg-gray-200 p-2 hover:dark:bg-gray-800 mr-1 rounded-full "
			>
				<BsBookmarkPlus  className=" text-lg" />
			</button>
			<span className="flex gap-1 items-center text-sm flex-nowrap">
				<span className=" ">{formatNumber(post?.numViews)}</span>
				{post?.numViews > 1 ? "views" : "view"}
			</span>
			{post?.readingTime && (
				<span className=" text-sm">{`${post?.readingTime} min read`}</span>
			)}

			<Link
				to={"/"}
				onClick={(e) => {
					dispatch(setFetchFirstCategory(post?.categoryText));
					location.pathname === "/" && dispatch(fetchPostByCategory());
				}}
				className="whitespace-nowrap gap-2 text-sm delay-75 cursor-pointer flex bg-gray-200 hover:bg-gray-300 rounded-md dark:text-slate-300 dark:bg-gray-700 hover:dark:bg-gray-800 py-[0.1rem] px-4"
			>
				{post?.categoryText?.charAt(0).toUpperCase() +
					post?.categoryText?.slice(1).toLowerCase()}
			</Link>
		</div>
	);
};

export default LikesSaveViews;
