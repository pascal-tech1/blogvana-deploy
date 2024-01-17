import React from "react";
import {  LazyLoadImg } from ".";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { formatDate } from "../utils/dataFormatter";
import MessageUser from "../Dashboard/components/MessageUser";
import FollowingBtn from "./FollowingBtn";

// import { MessageUser } from "../Dashboard/components";

const UserToFollow = ({ user, index, date }) => {
	const loginUser = useSelector((store) => store.userSlice?.user);
	return (
		<div
			key={index}
			className="flex justify-between pb-4 items-start font-inter  dark:text-slate-300  "
		>
			<Link
				to={loginUser?._id ? `/profile/${user._id}` : `/login`}
				className="flex gap-6  justify-start "
			>
				{/* lazy loading image */}
				<div>
					<LazyLoadImg
						backgroundClassName={" rounded-md  w-8 h-8  relative"}
						imgClassName={
							"absolute inset-0 w-full h-full  object-cover rounded-md "
						}
						originalImgUrl={user?.profilePhoto}
						blurImageStr={user?.blurProfilePhoto}
						optimizationStr={"q_auto,f_auto,w_100"}
						paddingBottom={"100%"}
					/>
				</div>

				<div className="flex flex-col">
					<div className=" flex items-center  gap-2 ">
						<div className=" flex flex-wrap gap-1">
							<h1 className=" capitalize">{user?.firstName}</h1>
							<h1 className=" capitalize">{user?.lastName}</h1>
						</div>
					</div>

					{date && (
						<div>
							<h3 className=" text-gray-400 lowercase">{` ${formatDate(
								date
							)}`}</h3>
						</div>
					)}
				</div>
			</Link>

			{/* checking to either render the messageUser commponent or followingBtn component
			 using the date since i will be returning the date only if im rending who viewed use portfolio */}
			{date ? (
				<div className="">
					<MessageUser receiverId={user?._id} />
				</div>
			) : (
				<div>
					<FollowingBtn
						userToFollowOrUnfollow={user}
						className=" dark:text-colorPrimary text-base text-blue-600  hover:dark:bg-gray-700  px-2 my-[0.2rem] rounded-lg hover:bg-blue-200 transition-all delay-75   "
					/>
				</div>
			)}
		</div>
	);
};

export default UserToFollow;
