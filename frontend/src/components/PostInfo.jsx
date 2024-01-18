import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	PostUserInfo,
	LazyLoadImg,
	Tooltip,
	CategoryViewsReadMin,
	LikesSaveViews,
} from ".";
import { useScreenWidth } from "../customHooks";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

//

const PostInfo = ({ post }) => {
	const user = useSelector((store) => store?.userSlice?.user);
	const screenWidth = useScreenWidth();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<div className="flex flex-col mb-2 justify-self-center py-8 md:py-6 border-b dark:border-b dark:border-b-lightdark mt-1 rounded-md ">
			<div className="flex flex-col  min-[351px]:flex-row  justify-between gap-4 mt-1">
				{/* user who created the post  */}

				<div>
					<div className=" mb-1">
						<PostUserInfo post={post} />
					</div>
					<div className=" self-start flex flex-col  ">
						<Link
							to={`/single-post/${post?._id}`}
							aria-label={`${post?.title}-link`}
						>
							<h3 className=" font-bold  text-sm mt-2 lg:text-lg dark:text-slate-100 ">
								{screenWidth < 1200 ? (
									post.title.length > 60 ? (
										<div className=" relative">
											<Tooltip info={post.title}>{`${post?.title?.slice(
												0,
												60
											)}...`}</Tooltip>
										</div>
									) : (
										post.title
									)
								) : post.title.length > 116 ? (
									<div className=" relative">
										<Tooltip info={post.title}>{`${post?.title?.slice(
											0,
											116
										)}...`}</Tooltip>
									</div>
								) : (
									post.title
								)}
							</h3>
						</Link>
						<div className=" hidden min-[600px]:flex items-center ">
							<p className="text-sm flex gap-2 items-center pb-2">
								{post?.description > 120
									? `${post?.description?.slice(0, 120)}...`
									: post.title}
							</p>
						</div>
						<Link
							to={"/"}
							onClick={(e) => {
								dispatch(setFetchFirstCategory(post?.categoryText));
								location.pathname === "/" &&
									dispatch(fetchPostByCategory());
							}}
							className="whitespace-nowrap  text-center text-sm delay-75 cursor-pointer self-start  flex items-center bg-gray-200 hover:bg-gray-300 rounded-md dark:text-slate-300 dark:bg-gray-700 hover:dark:bg-gray-800 py-[0.1rem] px-2"
						>
							{post?.categoryText?.charAt(0).toUpperCase() +
								post?.categoryText?.slice(1).toLowerCase()}
						</Link>
					</div>
				</div>
				<Link
					to={`/single-post/${post?._id}`}
					aria-label={`${post?.title}-link`}
					className=" self-center  "
				>
					{screenWidth > 350 ? (
						<LazyLoadImg
							backgroundClassName={
								"w-[85vw] !h-[0.2rem] min-[351px]:w-[80px] lg:w-[120px] rounded-md relative border dark:border-slate-900"
							}
							imgClassName={
								"absolute inset-0 w-full h-full object-cover rounded-md"
							}
							originalImgUrl={post?.image}
							blurImageStr={post.blurImageUrl}
							optimizationStr={"q_auto,f_auto,w_400"}
							paddingBottom={"100%"}
						/>
					) : (
						<LazyLoadImg
							backgroundClassName={
								"w-[85vw] !h-[0.2rem] min-[351px]:w-[120px] lg:w-[120px] rounded-md relative border dark:border-slate-900"
							}
							imgClassName={
								"absolute inset-0 w-full h-full object-cover rounded-md"
							}
							originalImgUrl={post?.image}
							blurImageStr={post.blurImageUrl}
							optimizationStr={"q_auto,f_auto,w_400"}
							paddingBottom={"50%"}
						/>
					)}
				</Link>
			</div>
			<div className=" flex justify-between flex-wrap lg:mr-4 mt-2">
				<CategoryViewsReadMin post={post} />

				<LikesSaveViews post={post} />
			</div>
		</div>
	);
};

export default PostInfo;
