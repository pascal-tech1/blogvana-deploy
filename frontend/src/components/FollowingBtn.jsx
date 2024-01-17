import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { followOrUnfollowUser } from "../redux/user/userSlice";

const FollowingBtn = ({ userToFollowOrUnfollow, className }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector((store) => store?.userSlice?.user);

	const handleFollowUser = () => {
		if (!user) {
			navigate("/login");
			return;
		}
		dispatch(followOrUnfollowUser(userToFollowOrUnfollow?._id));
	};

	className = className
		? className
		: `  self-center hover:bg-blue-800 text-center py-[0.2rem] px-2 bg-colorPrimary text-white hover:text-white  transition-all delay-75`;

	return (
		<button onClick={handleFollowUser} className={className}>
			{user?.following?.includes(userToFollowOrUnfollow?._id) ? (
				<p>following</p>
			) : (
				<p>follow</p>
			)}
		</button>
	);
};

export default FollowingBtn;
