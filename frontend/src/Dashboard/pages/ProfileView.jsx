import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdditionalUserProfile from "../components/AdditionalUserProfile";
import CoverPhoto from "../components/CoverPhot";
import FollowUsersList from "../components/FollowUsersList";
import ProfilePhoto from "../components/ProfilePhoto";
import UserBio from "../components/UserBio";
import UserProfile from "../components/UserProfile";

import {
	fetchUserFollowingList,
	fetchUserFollowersList,
	updateFollowingListPageNumber,
	setFirstFetchFollowersUser,
	setFirstFetchFollowingUser,
	setIsSearchBArNeeded,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		userFollowerslist,
		followerslistTotalNumber,
		fetchingFollowersListStatus,
	} = useSelector((store) => store?.userSlice);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const _id = user?.id;

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
		dispatch(setFirstFetchFollowersUser());
		dispatch(fetchUserFollowersList());
	}, [_id]);
	const handleNavigateToFollowing = (e) => {
		e.preventDefault();
		navigate("/follows-following");
	};
	const handleNavigateToFollower = (e) => {
		e.preventDefault();
		navigate("/follows-followers");
	};
	if (!user) {
		return <h3 className=" text-black text-3xl">Loading ....</h3>;
	}

	return (
		<>
			<div className=" flex flex-col row-span-2 md:grid grid-cols-6 col-start-1 col-span-4  rounded-lg lg:mb-6 lg:shadow-sm lg:rounded-md lg:ml-0  font-inter gap-5  ">
				<div className=" col-start-1 col-span-4  bg-white dark:bg-dark lg:shadow-sm lg:rounded-md">
					<div className="w-full relative ">
						<div className=" w-full  ">
							<CoverPhoto
							 user={user} />
						</div>
						<ProfilePhoto user={user} />
						<div className="  mt-[6rem]  ">
							<UserProfile />
						</div>
					</div>
					{/* summary */}
					<UserBio />
				</div>

				{/* profile Additional details */}
				<AdditionalUserProfile />

				{/* following  */}
				<div className=" md:col-start-1 col-span-3 px-4 font-inter bg-white dark:bg-dark rounded-md ">
					<h1 className="font-semibold  max-w-max pt-3 pb-1 dark:text-colorPrimary  ">
						following
					</h1>

					<FollowUsersList
						list={userfollowinglist}
						listTotalNumber={followinglistTotalNumber}
						fetchingListStatus={fetchingFollowingListStatus}
						_id={_id}
						isProfileView={true}
						fetchAction={handleNavigateToFollowing}
						title={"following"}
					/>
				</div>
				{/* followers  */}
				<div className=" md:col-start-4 col-span-full font-inter bg-white dark:bg-dark px-4 rounded-md">
					<h1 className="font-semibold  max-w-max pt-3 pb-1 dark:text-colorPrimary  ">
						followers
					</h1>

					<FollowUsersList
						list={userFollowerslist}
						listTotalNumber={followerslistTotalNumber}
						fetchingListStatus={fetchingFollowersListStatus}
						_id={_id}
						isProfileView={true}
						fetchAction={handleNavigateToFollower}
						title={"followers"}
					/>
				</div>
			</div>
		</>
	);
};

export default ProfileView;
