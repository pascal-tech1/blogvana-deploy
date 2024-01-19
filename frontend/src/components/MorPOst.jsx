import React from "react";

import { Link, useLocation } from "react-router-dom";

import {
	Spinner,
	Tooltip,
	LazyLoadImg,
	LikesSaveViews,
	PostUserInfo,
	LoadingSpinner,
	CategoryViewsReadMin,
} from "../components";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";
import { useDispatch } from "react-redux";

const MorePost = ({ post, status }) => {
	const location = useLocation();

	const dispatch = useDispatch();
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

						<div className=" flex min-[300px]:gap-2 gap-4 items-center flex-wrap mr-2">
							<Link
								to={"/"}
								onClick={(e) => {
									dispatch(setFetchFirstCategory(post?.category?.title));
									location.pathname === "/" &&
										dispatch(fetchPostByCategory());
								}}
								className="whitespace-nowrap  text-center text-sm delay-75 cursor-pointer  flex items-center bg-gray-200 hover:bg-gray-300 rounded-md dark:text-slate-300 dark:bg-gray-700 hover:dark:bg-gray-800 py-[0.1rem] px-2"
							>
								{post?.category?.title?.charAt(0).toUpperCase() +
									post?.category?.title?.slice(1).toLowerCase()}
							</Link>
							<LikesSaveViews post={post} />
							<CategoryViewsReadMin post={post} />
						</div>
					</div>
				</div>
			))}
			<div className=" ">{status === "loading" && <LoadingSpinner />}</div>
		</>
	);
};

export default MorePost;
