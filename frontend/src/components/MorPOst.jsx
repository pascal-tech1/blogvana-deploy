import React from "react";

import { Link } from "react-router-dom";

import {
	Spinner,
	Tooltip,
	LazyLoadImg,
	LikesSaveViews,
	PostUserInfo,
	LoadingSpinner,
	CategoryViewsReadMin,
} from "../components";

const MorePost = ({ post, status }) => {
	return (
		<>
			{post?.map((post, index) => (
				<div
					key={index}
					className="  rounded-lg
					"
				>
					<Link
						to={`/single-post/${post?._id}`}
						className=" hover:cursor-pointer"
						aria-label={`${post?.title}-link`}
					>
						<LazyLoadImg
							backgroundClassName={" w-30% rounded-t-md  relative "}
							imgClassName={
								"absolute inset-0 w-full h-full object-cover rounded-t-md"
							}
							originalImgUrl={post?.image}
							blurImageStr={post?.blurImageUrl}
							optimizationStr={`q_auto,f_auto,w_800`}
							paddingBottom={"48%"}
						/>
					</Link>

					<div className=" pb-2 mt-4 flex flex-col gap-2">
						<div className=" font-bold dark:text-slate-300 mt-1 mb-2">
							<Tooltip relative={true} info={post?.title}>
								<h3>
									{post.title.length > 70
										? `${post.title.slice(0, 70)}...`
										: post.title}
								</h3>
							</Tooltip>
						</div>

						<PostUserInfo post={post} />
						<div className=" flex justify-between flex-wrap">
							<CategoryViewsReadMin post={post} />
							<LikesSaveViews post={post} />
						</div>
					</div>
				</div>
			))}
			<div className=" ">{status === "loading" && <LoadingSpinner />}</div>
		</>
	);
};

export default MorePost;
