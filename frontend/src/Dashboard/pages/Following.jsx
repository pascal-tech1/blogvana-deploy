import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserFollowingList,
	setFirstFetchFollowingUser,
	setIsSearchBArNeeded,
	setSearchTermInStore,
	updateFollowingListPageNumber,
} from "../../redux/user/userSlice";
import { ClearSearch } from "../../components";
import FollowUsersList from "../components/FollowUsersList";

const Following = ({ id }) => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		dispatch(setSearchTermInStore(""));
	}, []);
	const {
		user,
		userfollowinglist,
		followinglistTotalNumber,
		fetchingFollowingListStatus,
		followingUserListForNonLoginUser,
		followingUserListForNonLoginUserTotalNumber,
	} = useSelector((store) => store?.userSlice);

	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);

	const dispatch = useDispatch();
	const _id = id || user?.id;
	const userLists = id
		? followingUserListForNonLoginUser
		: userfollowinglist;
	const toalFollowing = id
		? followingUserListForNonLoginUserTotalNumber
		: followinglistTotalNumber;

	const handleFetchMoreButtonClicked = () => {
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
	};

	useEffect(() => {
		if (!_id) return;
		dispatch(setFirstFetchFollowingUser());
		dispatch(fetchUserFollowingList(_id));
		dispatch(updateFollowingListPageNumber());
	}, [_id, dashboardSearchTerm]);
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<div className="dark:bg-dark rounded-lg p-4">
			<div className=" grid max-w-md w-full font-inter ">
				{/* clear search */}
				<ClearSearch
					searchQuery={dashboardSearchTerm}
					handleClearSearch={handleClearSearch}
				/>
				{!id && (
					<h1 className="font-semibold place-self-center text-colorPrimary   max-w-max pb-1 ">
						Users you are following
					</h1>
				)}
				<div>
					<h3 className=" font-medium text-gray-900 drop-shadow-md dark:text-slate-200">
						total following user: <span>{toalFollowing} </span>{" "}
					</h3>
				</div>

				<FollowUsersList
					list={userLists}
					listTotalNumber={toalFollowing}
					fetchingListStatus={fetchingFollowingListStatus}
					fetchAction={handleFetchMoreButtonClicked}
					_id={_id}
					title={"following"}
				/>
			</div>
		</div>
	);
};

export default Following;
