import React from "react";
import { formatDate } from "../utils/dataFormatter";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { LazyLoadImg } from ".";

import { BsDot } from "react-icons/bs";

const TrendingPost = ({ post, index }) => {
	const loginUser = useSelector((store) => store.userSlice.user);
	const user = post?.user;

	return (
		<>
			<div className=" font-inter flex gap-6 items-start justify-start ">
				<div className="  gap-1 md:hidden lg:flex items-center text-3xl font-bold text-gray-200 dark:text-lightdark ">
					<h1>0</h1>
					<h1>{index + 1}</h1>
				</div>
				<div className="  mt-1">
					<Link
						to={loginUser?._id ? `/profile/${user._id}` : `/login`}
						className="flex gap-2 mb-2 justify-start items-center"
					>
						{/* lazyloading image */}
						<div className=" flex items-center ">
							<LazyLoadImg
								backgroundClassName={" rounded-full  w-6 h-6  relative"}
								imgClassName={
									"absolute inset-0 w-full h-full  object-cover rounded-full "
								}
								originalImgUrl={post?.user?.profilePhoto}
								blurImageStr={post?.user?.blurProfilePhoto}
								optimizationStr={"q_auto,f_auto,w_100"}
							/>
						</div>
						<p className=" text-sm ">{` ${post?.user?.firstName} ${post?.user?.lastName}  `}</p>
					</Link>
					<Link
						to={`/single-post/${post?._id}`}
						className=" font-bold text-sm lg:text-base dark:text-gray-300"
					>
						{post?.title}
					</Link>
					<div className=" flex gap-1 items-center text-[0.8rem] text-gray-500">
						<h3>{formatDate(post?.updatedAt)}</h3>
						<BsDot />
						<h3>{`${post?.readingTime} min read`}</h3>
					</div>
					{/* if its not the user that created the post render the follow button else render the edit button */}
				</div>
			</div>
		</>
	);
};

export default TrendingPost;
