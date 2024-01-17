import React, { useEffect } from "react";

import BarChart from "../components/BarChart";
import MessagesComp from "../components/MessagesComp";
import PostDashboard from "../components/PostDashboard";
import UserDetailsCount from "../components/UserDetailsCount";

import { useDispatch, useSelector } from "react-redux";
import {
	fetchUserPostHistory,
	fetchSavedPosts,
	setSavedPostFirstSearch,
	setHistoryFirstSearch,
} from "../../redux/post/morePostSlice";

import { clearMsg, fetchMsg } from "../../redux/message/messageSlice";
import {
	clearWhoViewedUserProfile,
	fetchPostImpressionsCount,
	fetchUserDetailsCounts,
	fetchWhoViewedUserProfile,
	setIsSearchBArNeeded,
} from "../../redux/user/userSlice";
import { GiShadowFollower } from "react-icons/gi";
import { BsEye, BsPostcardFill } from "react-icons/bs";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import { formatNumber } from "../../utils/formatNumbersIn1000";
import {
	LoadingSkeleton,
	LoadingSpinner,
	Tooltip,
	UserToFollow,
} from "../../components";
import { formatDate } from "../../utils/dataFormatter";

const Stats = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(false));
	}, []);
	const dispatch = useDispatch();
	const {
		user,
		userDetailsCount,
		whoViewUserProfile,
		chartSelectedFilter,
		whoViewUserProfileStatus,
		whoViewUserProfileCount,
	} = useSelector((store) => store?.userSlice);

	const {
		userPostHistory,
		userPostHistoryStatus,
		userSavedPost,
		userSavedPostStatus,
		savedPostHasMore,
		historyHasMore,
	} = useSelector((store) => store?.morePostSlice);
	const { msg, fetchMessageStatus, receivedMessageCount } = useSelector(
		(store) => store?.messageSlice
	);
	const _id = user?._id;

	useEffect(() => {
		if (!_id) return;

		dispatch(fetchUserDetailsCounts());
		dispatch(clearMsg());
		dispatch(fetchMsg({ page: 1, limit: 5 }));
		dispatch(clearWhoViewedUserProfile());
		dispatch(fetchWhoViewedUserProfile({ page: 1, limit: 5 }));

		if (userSavedPost.length < 10 && savedPostHasMore) {
			dispatch(setSavedPostFirstSearch());
			dispatch(fetchSavedPosts(1));
		}
		if (userPostHistory.length < 10 && historyHasMore) {
			dispatch(setHistoryFirstSearch());
			dispatch(fetchUserPostHistory(1));
		}
	}, [_id]);

	useEffect(() => {
		if (!_id) return;

		dispatch(fetchPostImpressionsCount({ page: 1, numberPerPage: 10 }));
	}, [chartSelectedFilter, _id]);

	return (
		<div className=" flex flex-col gap-4  min-[1200px]:grid grid-cols-12 lg:gap-8  lg:mx-0 font-inter antialiased dark:text-slate-200  md:text-sm">
			<div className="col-start-1 row-start-1 col-span-9 ">
				<div className=" grid grid-cols-1 min-[350px]:grid-cols-2 min-[500px]:grid-cols-3 gap-2 ">
					<div className="">
						<UserDetailsCount
							text="post"
							count={formatNumber(userDetailsCount?.postCount)}
						>
							<BsPostcardFill className="text-purple-600 font-bold text-4xl  bg-purple-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className="  ">
						<UserDetailsCount
							text="likes"
							count={formatNumber(userDetailsCount?.likesCount)}
						>
							<AiFillLike className="text-orange-600 font-bold text-4xl  bg-orange-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" ">
						<UserDetailsCount
							text="views"
							count={formatNumber(userDetailsCount?.viewsCount)}
						>
							<BsEye className="text-green-600 font-bold text-4xl  bg-green-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>

					<div className="">
						<UserDetailsCount
							text="dislikes"
							count={formatNumber(userDetailsCount?.disLikesCount)}
						>
							<AiFillDislike className="text-red-600 font-bold text-4xl  bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className="  ">
						<UserDetailsCount
							bgColor={"bg-green-100"}
							textColor={"text-green-600"}
							text={"followers"}
							count={formatNumber(userDetailsCount?.followersCount)}
						>
							<GiShadowFollower className="text-yellow-600 font-bold text-4xl  bg-yellow-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
					<div className=" ">
						<UserDetailsCount
							text="following"
							count={formatNumber(userDetailsCount?.followingCount)}
						>
							<MdOutlineFollowTheSigns className="text-blue-600 font-bold text-4xl  bg-blue-100 rounded-md py-1 px-1" />
						</UserDetailsCount>
					</div>
				</div>

				{/* chart  */}
				<div className=" pt-4  flex flex-col gap-4 lg:flex-row justify-between">
					<div className="lg:w-[60%] bg-white dark:bg-dark pt-2 pb-8 rounded-md drop-shadow-sm px-2 ">
						<h1 className=" font-bold  text-gray-800 mb-3 dark:text-slate-300">
							post Charts
						</h1>

						<BarChart />
					</div>
					{/* viewedBy */}
					<div className=" col-start-8 col-span-4 font-inter  lg:w-[37%]  bg-white dark:bg-dark py-2  rounded-md shadow-sm px-4 ">
						<h1 className=" font-bold text-gray-800 mb-3 mt-4 lg:mt-0 dark:text-slate-300 ">
							Who's Viewed your profile
						</h1>
						<h3 className=" mb-3">{`${whoViewUserProfileCount} people have view your profile`}</h3>
						{whoViewUserProfileStatus === "loading" ? (
							<LoadingSkeleton />
						) : (
							whoViewUserProfile.map((users, index) => {
								if (users?.viewedBy?.length === 0) {
									return (
										<div key={index} className=" flex gap-6 pb-4  ">
											<img
												src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blq…auto,w_200/ank-profile-picture-973460_960_720.png"
												alt=""
												className=" rounded-md  w-8 h-8 "
											/>
											<div className=" flex flex-col">
												<Tooltip
													relative={true}
													info={
														"this user is deleted contact admin for more info"
													}
												>
													<h3 className=" text-pink-400 gap-2 font-light capitalize">
														deleted user
													</h3>
												</Tooltip>
												<h3>{formatDate(users.updatedAt)}</h3>
											</div>
										</div>
									);
								} else
									return users?.viewedBy?.slice(0,5)?.map((viewedBy, index) => {
										return (
											<div key={index}>
												<UserToFollow
													user={viewedBy}
													index={index}
													date={users.updatedAt}
													numberOfView={users.numberOfView}
												/>
											</div>
										);
									});
							})
						)}
					</div>
				</div>
			</div>

			{/* messages */}
			<div className=" lg:col-start-10 lg:col-span-full row-start-1  bg-white dark:bg-dark py-2 rounded-md drop-shadow-sm px-2  ">
				<h1 className=" font-bold text-gray-800 mb-3 dark:text-slate-200">
					Recent Mesaages
				</h1>
				<h3 className=" my-3">{`you have ${receivedMessageCount} messages `}</h3>
				{fetchMessageStatus === "loading" ? (
					<LoadingSkeleton />
				) : (
					<MessagesComp msg={msg?.slice(0, 5)} />
				)}
			</div>
			{/* post history */}
			<div className=" col-start-1 col-span-full  flex gap-8 flex-col bg-white dark:bg-dark py-2  rounded-md drop-shadow-sm px-4 ">
				<PostDashboard
					posts={userPostHistory.slice(0, 10)}
					status={userPostHistoryStatus}
					title={"Post View History"}
					page={"/post-History"}
				/>
			</div>
			<div className=" col-start-1 col-span-full mb-6 flex gap-8 flex-col   bg-white dark:bg-dark py-2  rounded-md drop-shadow-sm px-4 ">
				<PostDashboard
					posts={userSavedPost.slice(0, 10)}
					status={userSavedPostStatus}
					title={"Saved Post"}
					page={"/post-Saved"}
				/>
			</div>
		</div>
	);
};

export default Stats;
