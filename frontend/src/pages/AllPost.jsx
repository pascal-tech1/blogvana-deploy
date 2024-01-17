import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import {
	ClearSearch,
	PostInfo,
	PostInfoLoadingSkeleton,
	Spinner,
} from "../components";
import {
	IncreasePageNumber,
	fetchPostByCategory,
	setEmptySearch,
} from "../redux/post/allPostSlice";
import { getUserFromLocalStorage } from "../utils/localStorage";

const AllPost = () => {
	const dispatch = useDispatch();
	const { allPost, allPostStatus, searchQuery, hasMore, page } =
		useSelector((store) => store.allPostSlice);
	const token = getUserFromLocalStorage();
	const loadingSkeletonNumber = page == 1 ? 10 : 1;

	const { user } = useSelector((store) => store.userSlice);

	useEffect(() => {
		if (token && !user) return;
		if (allPost.length === 0) {
			console.log("i have fetch all post");
			searchQuery.length === 0 && dispatch(fetchPostByCategory());
		}
	}, [token, user]);

	const observer = useRef();
	const lastPostRef = useCallback(
		(node) => {
			if (allPostStatus === "failed") return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					dispatch(IncreasePageNumber());
					dispatch(fetchPostByCategory());
				}
			});
			if (node) observer.current.observe(node);
		},
		[hasMore, allPostStatus]
	);
	const handleClearSearch = () => {
		dispatch(setEmptySearch());

		dispatch(fetchPostByCategory());
	};

	const handleFetchingPostFailed = (e) => {
		e.preventDefault();
		searchQuery.length === 0 && dispatch(fetchPostByCategory());
	};

	return (
		<>
			<ClearSearch
				searchQuery={searchQuery}
				handleClearSearch={handleClearSearch}
			/>

			{allPost.map((post, index) => {
				return (
					<div
						key={index}
						ref={allPost.length === index + 1 ? lastPostRef : null}
						className=" pr-[2px] "
					>
						{/* The post info's including the user info */}
						<PostInfo post={post} />
					</div>
				);
				//
			})}

			{/* loading Spinner */}
			<div className="grid ">
				{(allPostStatus === "loading" || allPostStatus === "idle") &&
					Array.from({ length: loadingSkeletonNumber }).map((_, index) => (
						<PostInfoLoadingSkeleton key={index} />
					))}
			</div>
			<div className=" grid place-content-center">
				{allPostStatus === "failed" && (
					<div className=" ">
						<h3 className=" text-red-500 -ml-10">fetching post failed</h3>
						<button
							onClick={handleFetchingPostFailed}
							className=" bg-blue-400 text-white px-1 rounded-md"
						>
							refresh
						</button>
					</div>
				)}
			</div>
			<div>
				{allPost.length === 0 &&
					searchQuery &&
					allPostStatus !== "loading" && (
						<div className=" text-yellow-300">No Post found</div>
					)}
			</div>
			<div>
				{!hasMore &&
					searchQuery &&
					allPostStatus !== "loading" &&
					allPost.length > 0 && (
						<h3 className=" text-yellow-300">No more Post</h3>
					)}
			</div>
			<div>
				{!hasMore && !searchQuery && allPostStatus !== "loading" && (
					<h3 className=" text-yellow-300">No more Post</h3>
				)}
			</div>
		</>
	);
};

export default AllPost;
