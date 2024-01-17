import React from "react";
import { Link } from "react-router-dom";

import { LazyLoadImg, Tooltip, LoadingSpinner } from "../../components";

const PostDashboard = ({ posts, status, title, page }) => {
	return (
		<div className=" font-inter">
			<div className="flex justify-between">
				<h3 className=" font-bold text-gray-800 dark:text-slate-200 mb-3 text-sm ">
					{title}
				</h3>
				{posts.length > 0 && (
					<Link
						to={`${page}`}
						className="text-sm font-medium text-blue-500 hover:text-blue-900 transition-all duration-75"
					>
						View All
					</Link>
				)}
			</div>
			<div className="  overflow-x-scroll overflow-y-hidden custom-scrollbar flex gap-4 ">
				{posts.length === 0 && <h3>{`you have no ${title}`}</h3>}
				{posts?.map((item, index) => (
					<Link
						key={index}
						to={`/single-post/${item?.post?._id}`}
						className=" "
					>
						<div className=" hover:cursor-pointer w-36  overflow-y-hidden pb-4 flex gap-1 flex-col  items-center  ">
							<LazyLoadImg
								backgroundClassName={" rounded-lg  w-full  relative"}
								imgClassName={
									"absolute inset-0 w-full h-full rounded-lg  object-cover "
								}
								originalImgUrl={item?.post?.image}
								blurImageStr={item?.post?.blurImageUrl}
								optimizationStr={"q_auto,f_auto,w_200"}
								paddingBottom={"60%"}
							/>

							<div className=" font-medium text-sm w-full self-start ">
								<Tooltip info={item?.post?.title}>
									<h1>{`${item?.post?.title.slice(0, 30)}...`}</h1>
								</Tooltip>
							</div>
						</div>
					</Link>
				))}
				<div className=" grid place-content-center">
					{status === "loading" && <LoadingSpinner />}
				</div>
			</div>
		</div>
	);
};

export default PostDashboard;
