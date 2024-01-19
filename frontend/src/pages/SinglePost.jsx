import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchSinglePost,
	setSinglePostStatus,
	setStatus,
} from "../redux/post/singlePostSlice";
import { Link, useParams } from "react-router-dom";

import {
	CategoryViewsReadMin,
	LazyLoadImg,
	LikesSaveViews,
	PostSearch,
	SinglePostSkeleton,
} from "../components";

import { clearUserPost, fetchUserPost } from "../redux/post/morePostSlice";

import { Spinner, MorePost, PostUserInfo } from "../components";
import {
	clearMorePost,
	clearSearchAndCategory,
	fetchPostByCategory,
} from "../redux/post/allPostSlice";
import { addCopyButtons } from "../utils/PostCopyButton";
import {
	addClickEventToTocHeadings,
	addIdsToHeadings,
	createLinksForHeadings,
	handleScroll,
} from "../utils/TocSnippets";
import { setIsTAbleOfContentClick } from "../redux/category/categorySlice";
import MessageUser from "../Dashboard/components/MessageUser";
import loadHighlightJS from "../utils/quil";
import FollowingBtn from "../components/FollowingBtn";
import { updateUserEmbedding } from "../redux/user/userSlice";
import EditPostBtn from "../components/EditPostBtn";
import { PiDotDuotone } from "react-icons/pi";

const SinglePost = ({ singlePost }) => {
	const { id } = useParams();
	const [pageNumber, setPageNumber] = useState(1);
	const dispatch = useDispatch();
	const [scrollTarget, setScrollTarget] = useState(null);
	const { post, status } = useSelector((store) => store.singlePostSlice);
	const [htmlContent, setHtmlContent] = useState("");
	const [toc, setToc] = useState();
	const { morePost, morePostStatus, morePostHasMore, allPostStatus } =
		useSelector((store) => store.allPostSlice);
	const { userPost, userPostStatus } = useSelector(
		(store) => store.morePostSlice
	);
	const { isTableOfContentClciked } = useSelector(
		(store) => store.categorySlice
	);
	const loginUser = useSelector((store) => store.userSlice.user);
	useEffect(() => {
		const contentWithIds = addIdsToHeadings(post?.content);
		setHtmlContent(contentWithIds);
		setToc(createLinksForHeadings(contentWithIds));
	}, [post]);

	// Call the function to add copy buttons after the component renders
	useEffect(() => {
		const copyButton = document.querySelector(".copy-button");
		if (copyButton) return;
		addCopyButtons();
		const links = document.querySelectorAll("a");

		links.forEach((link) => {
			link.addEventListener("click", (event) => {
				const url = link.href;
				if (!url.startsWith(window.location.origin)) {
					window.open(url, "_blank");
					event.preventDefault(); // Prevent default link behavior
				}
			});
		});
	}, [htmlContent]);

	// call the isclicked function
	addClickEventToTocHeadings();

	// Effect to scroll to the target element when it changes
	useEffect(() => {
		if (scrollTarget) {
			// Using scrollIntoView with smooth behavior
			scrollTarget.scrollIntoView({ behavior: "smooth" });
			setScrollTarget(null); // Reset scroll target after scrolling
		}
	}, [scrollTarget]);

	useEffect(() => {
		loadHighlightJS;
	}, [status]);

	useEffect(() => {
		if (!id) return;

		id !== post?._id && dispatch(fetchSinglePost(id));
	}, [id]);

	useEffect(() => {
		dispatch(clearSearchAndCategory());
		pageNumber > 1 &&
			dispatch(
				fetchPostByCategory({
					page: pageNumber,
					postNumberPerPage: 10,
					id,
					where: "morePost",
				})
			);
	}, [pageNumber]);
	useEffect(() => {
		const delayedAction = () => {
			if (!post._id) return;

			dispatch(clearUserPost());
			dispatch(clearMorePost());
			dispatch(clearSearchAndCategory());
			setPageNumber(1);
			dispatch(
				fetchUserPost({ postId: post?._id, userId: post?.user?._id })
			);
			dispatch(
				fetchPostByCategory({
					page: 1,
					postNumberPerPage: 10,
					id,
					where: "morePost",
				})
			);
			dispatch(updateUserEmbedding());
		};

		const timeoutId = setTimeout(delayedAction, 2000);

		// Cleanup the timeout to prevent memory leaks
		return () => clearTimeout(timeoutId);
	}, [post?._id]);

	const userPostWithCurrentPostRemove = userPost?.filter(
		(UserSinglepost) => UserSinglepost?._id != post?._id
	);

	if (status === "loading")
		return (
			<div className=" grid place-content-center mt-8">
				<SinglePostSkeleton />
			</div>
		);
	if (status === "error") {
		return (
			<div className=" grid place-content-center mt-8">
				<h1 className="text-red-600 ">failed to fetch Post try again</h1>
				<button
					onClick={() => dispatch(fetchSinglePost(id))}
					className=" bg-blue-400 px-1 rounded-md hover:bg-blue-500"
				>
					Retry
				</button>
			</div>
		);
	}

	if (post)
		return (
			<div className=" overscroll-y-auto ">
				<div className="post-search">
					<PostSearch categoryNumber={6} isTableOfContent={true} />
				</div>
				<div className="singlePostLayout single-post  lg:gap-12 md:grid md:grid-cols-12 relative">
					<div
						className={`${
							isTableOfContentClciked ? "relative " : "hidden"
						} h-fit md:grid border-x  max-h-[50vh]  md:max-h-[70vh] shadow-lg overflow-auto custom-scrollbar dark:border-gray-800 col-start-1 z-10 md:z-0 col-span-4 lg:col-span-3 bg-white dark:bg-lightdark rounded-lg p-4 md:mt-4`}
					>
						<h3 className=" relative flex flex-col items-center mb-2">
							Table of Contents
							<span class=" border-b w-20 mt-[0.2rem] self-center border-b-blue-400"></span>
						</h3>
						<div
							dangerouslySetInnerHTML={{ __html: toc }}
							className=" toc flex overflow-y-auto flex-col  "
						/>
					</div>

					<div
						onScroll={handleScroll}
						className=" col-start-5 lg:col-start-4 col-span-full font-inter  overflow-x-hidden overflow-y-auto custom-scrollbar max-w-[50rem]  gap-[0.5rem]  px-2  md:px-10 "
					>
						<div className=" flex flex-col gap-2">
							<div>
								<h1
									id="title"
									className=" font-bold text-xl  lg:text-3xl  my-2 md:my-4 dark:text-slate-200"
								>
									{post?.title}
								</h1>
							</div>
							{/* about the user who created the post and post likes and views */}
							<div className="flex flex-wrap flex-col gap-1 ">
								<PostUserInfo post={post} />

								<div className=" flex gap-1 flex-wrap">
									<LikesSaveViews post={post} />
									<CategoryViewsReadMin post={post} />
									<div className=" mt-1">
										{loginUser?._id !== post?.user?._id ? (
											<FollowingBtn
												userToFollowOrUnfollow={post?.user}
												className="  text-blue-600 shadow-sm hover:shadow-lg focus:shadow-sm px-2  rounded-lg hover:text-blue-500 transition-all delay-75  "
											/>
										) : (
											<EditPostBtn post={post} postId={post?._id} />
										)}
									</div>
								</div>
							</div>
							<div>
								<p className="text-sm text-gray-500 my-2 ">
									{post?.description}
								</p>
							</div>

							<div className=" flex items-center ">
								<LazyLoadImg
									backgroundClassName={
										" w-full h-auto rounded-md relative overflow-hidden"
									}
									imgClassName={
										"absolute inset-0 w-full h-auto object-cover rounded-md"
									}
									originalImgUrl={post?.image}
									blurImageStr={post?.blurImageUrl}
									optimizationStr={`q_auto,f_auto,w_800`}
								/>
								{/* <img src={post?.image} alt="" className=" w-full h-auto" /> */}
							</div>

							<div
								className="post-content mt-4 dark:text-slate-300 font-inter "
								dangerouslySetInnerHTML={{ __html: htmlContent }}
							/>
						</div>

						<div className=" border-y dark:border-y-lightdark py-4 my-4 ">
							<div className="flex justify-between flex-col my-4">
								<Link
									to={`/profile/${post?.user?._id}`}
									className=" cursor-pointer "
								>
									<LazyLoadImg
										backgroundClassName={"w-20 h-20 rounded-full relative"}
										imgClassName={
											"absolute inset-0 w-full h-full object-cover rounded-full"
										}
										originalImgUrl={post?.user?.profilePhoto}
										blurImageStr={post?.user?.blurProfilePhoto}
										optimizationStr={`q_auto,f_auto,w_400`}
										paddingBottom={"6%"}
									/>
								</Link>

								<div className=" flex justify-between gap-4 items-center flex-wrap">
									<p className=" flex gap-2 items-center font-md text-xl dark:text-slate-200">
										Written by
										<span>
											{post?.user?.firstName} {post?.user?.lastName}
										</span>
									</p>
									<div className="flex items-center gap-2">
										{/* followingBtn component */}
										<FollowingBtn
											userToFollowOrUnfollow={post?.user}
											className={` border hover:bg-blue-800 text-center px-2 bg-blue-900 text-white hover:text-white rounded-lg transition-all delay-75`}
										/>

										{/* message component */}
										<MessageUser
											receiverId={post?.user?._id}
											mssageiconSize={"text-2xl"}
										/>
									</div>
								</div>
								<div className="flex gap-3 flex-wrap">
									<p>
										{post?.user?.followers?.length}
										<span className=" ml-1">Followers</span>
									</p>
									<p>{post?.user?.profession}</p>
								</div>
							</div>
						</div>

						{/* more post from the user */}

						<div className=" my-6">
							<h1
								id="userPost"
								className=" text-center font-bold text-xl dark:text-slate-200"
							>
								More Posts from{" "}
								{`${post?.user?.firstName} ${post?.user?.lastName}`}
							</h1>
						</div>

						<div className=" border-b dark:border-b-gray-800 py-4 font-inter grid grid-cols-1 max-[650px]:grid-cols-1 max-[768px]:grid-cols-2  gap-20 lg:grid-cols-2 w-[100%]">
							{userPost && (
								<MorePost
									post={userPostWithCurrentPostRemove}
									status={userPostStatus}
									titleLength={43}
								/>
							)}
						</div>

						{/* more post from blogvana */}
						<div className=" py-4 flex flex-col justify-center items-center mx-auto ">
							<h1
								id="morePost"
								className=" flex items-center gap-3   justify-center font-bold text-xl mb-10 dark:text-slate-200"
							>
								More Posts from Blogvana{" "}
								<span>
									<img
										src="../../public/blogvana.png"
										alt=""
										className="w-12 "
									/>
								</span>
							</h1>
							<div className="  font-inter grid max-[650px]:grid-cols-1 max-[768px]:grid-cols-2   gap-20 lg:grid-cols-2 w-[100%]">
								{morePost && (
									<MorePost
										post={morePost}
										status={allPostStatus === "loading"}
									/>
								)}
							</div>

							<div className=" ">
								{morePostHasMore ? (
									<button
										onClick={() => {
											setPageNumber((prev) => prev + 1);
										}}
										className=" bg-blue-400  text-white px-2 my-4  rounded-md hover:bg-blue-600 transition-all delay-75"
									>
										{allPostStatus === "loading" ? (
											<Spinner />
										) : (
											"load more"
										)}
									</button>
								) : (
									<p className=" text-yellow-400">NO more Post</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
};

export default SinglePost;
