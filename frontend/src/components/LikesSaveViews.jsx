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
		<div className="  flex gap-2 font-inter items-center   rounded-md px-2  dark:text-slate-300 flex-wrap justify-start  ">
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleLikes(post?._id)}
					aria-label="like button"
					className=" text-base hover:cursor-pointer p-2 transition-all delay-75 hover:dark:bg-gray-800 hover:bg-gray-300 rounded-full "
				>
					<AiOutlineLike className=" text-lg" />
				</button>
				<span className=" text-sm">{post?.likes?.length}</span>
			</span>
			<span className="flex gap-1 items-center">
				<button
					onClick={() => handleDislikes(post?._id)}
					aria-label="dislike button"
					className="text-base hover:cursor-pointer p-2  transition-all delay-75 hover:bg-gray-200 hover:dark:bg-gray-800 rounded-full "
				>
					<AiOutlineDislike className=" text-lg" />
				</button>
				<span className=" text-sm">{post?.disLikes?.length}</span>
			</span>
		</div>
	);
};

export default LikesSaveViews;
