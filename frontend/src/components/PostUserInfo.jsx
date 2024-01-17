import React from "react";
import { formatDate } from "../utils/dataFormatter";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { LazyLoadImg } from ".";
import { PiDotDuotone } from "react-icons/pi";
import FollowingBtn from "./FollowingBtn";
import EditPostBtn from "./EditPostBtn";

const PostUserInfo = ({ post }) => {
	const loginUser = useSelector((store) => store.userSlice.user);
	const user = post?.user;

	return (
		<>
			{user?.firstName && (
				<div className=" font-inter flex flex-wrap text-xs gap-3 text-gray-600 dark:text-gray-400 ">
					<Link
						to={loginUser?._id ? `/profile/${user._id}` : `/login`}
						className="flex gap-2 self-center"
					>
						{/* lazyloading image */}
						<div>
							<LazyLoadImg
								backgroundClassName={" rounded-full  w-6 h-6  relative"}
								imgClassName={
									"absolute inset-0 w-full h-full  object-cover rounded-full "
								}
								originalImgUrl={post?.user?.profilePhoto}
								blurImageStr={post?.user?.blurProfilePhoto}
								optimizationStr={"q_auto,f_auto,w_100"}
								paddingBottom={"100%"}
							/>
						</div>

						<div className="flex items-center gap-1">
							<p className=" text-xs">{` ${post?.user?.firstName} ${post?.user?.lastName}  `}</p>
							<PiDotDuotone />
							<p className=" text-xs">{formatDate(post?.updatedAt)}</p>
						</div>
					</Link>
					{/* if its not the user that created the post render the follow button else render the edit button */}
				</div>
			)}
		</>
	);
};

export default PostUserInfo;
