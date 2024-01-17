import React from "react";

import { LoadingSpinner, UserToFollow } from "../../components";


const FollowUsersList = ({
	list,
	listTotalNumber,
	fetchingListStatus,
	isProfileView,
	fetchAction,
	title,
}) => {
	return (
		<div className=" my-4 flex flex-col font-inter ">
			{list?.map((user, index) => {
				return <UserToFollow key={index} user={user} index={index} />;
			})}

			{fetchingListStatus === "loading" && (
				<div className=" self-center">
					<LoadingSpinner />
				</div>
			)}
			{listTotalNumber !== list?.length &&
				fetchingListStatus !== "loading" && (
					<button
						onClick={(e) => {
							fetchAction(e);
						}}
						className="self-center rounded-md px-2  border dark:border-slate-800 bg-blue-400 drop-shadow-md text-white border-gray-300 hover:bg-blue-600 transition-all delay-75"
					>
						{isProfileView ? `see all ${listTotalNumber}` : "load more"}
					</button>
				)}

			{listTotalNumber === 0 && fetchingListStatus !== "loading" && (
				<div>
					<h1 className="mt-6">{`${title} list is empty`}</h1>
				</div>
			)}
		</div>
	);
};

export default FollowUsersList;
