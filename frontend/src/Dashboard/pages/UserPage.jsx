//////////////////////// import /////////////////////////////////////

import React, { useState, useEffect } from "react";
import { LazyLoadImg, Modal, PostSearch, Spinner } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	clearCreatorAllPost,
	fetchCreatorPosts,
	fetchPostCreatorProfile,
} from "../../redux/post/generalPostSlice";

import { MdOutlineLanguage, MdWork } from "react-icons/md";
import { BiMap, BiSolidUserAccount } from "react-icons/bi";

import MessageUser from "../components/MessageUser";
import Following from "./Following";
import FollowingBtn from "../../components/FollowingBtn";
import MorePost from "../../components/MorPOst";

/////////////////////////////////////////////////////////////
const UserPage = () => {
	const {
		postCreatorProfile,
		postCreatorProfileStatus,
		creatorPostStatus,
		creatorAllPost,
		hasMore,
	} = useSelector((store) => store.generalPostSlice);
	const loginUserId = useSelector((store) => store.userSlice?.user?._id);
	const dispatch = useDispatch();
	const { userId } = useParams();
	const [page, setPage] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [imageToShow, setImageToShow] = useState(null);
	const [blurImageToShow, setBlurImageToShow] = useState(null);

	useEffect(() => {
		dispatch(clearCreatorAllPost());
		dispatch(fetchPostCreatorProfile(userId));
		setPage(1);
	}, [userId]);

	useEffect(() => {
		if (userId) {
			page === 1 && dispatch(clearCreatorAllPost(userId));
			dispatch(fetchCreatorPosts({ userId: userId, page }));
		}
	}, [page, userId]);

	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	if (postCreatorProfileStatus === "loading") {
		return (
			<div className=" grid place-content-center">
				<Spinner />
			</div>
		);
	}

	if (postCreatorProfileStatus === "failed") {
		return (
			<div className=" grid place-content-center">
				<h1 className=" text-red-500">
					Fetching User Profile Failed try again
				</h1>
				<button
					className=" bg-blue-400 rounded-lg px-1 py-1 hover:bg-blue-200 transition-all delay-75 place-self-center "
					onClick={(e) => {
						e.preventDefault();
						dispatch(fetchPostCreatorProfile(userId));
					}}
				>
					Retry
				</button>
			</div>
		);
	}

	if (postCreatorProfileStatus === "success") {
		return (
			<div>
				<PostSearch />
				<div className=" md:grid lg:grid-cols-3 mt-2  font-inter  gap-[5rem]  ">
					<Modal
						isOpen={isModalOpen}
						onClose={closeModal}
						isButtonNeeded={false}
					>
						<LazyLoadImg
							backgroundClassName={"  w-[85vw] md:w-[47vw]   relative rounded-md"}
							imgClassName={"absolute inset-0 w-full h-full rounded-md "}
							originalImgUrl={imageToShow}
							blurImageStr={blurImageToShow}
							optimizationStr={"q_auto,f_auto,w_1000"}
						/>
					</Modal>
					<div className=" flex flex-col gap-4 col-start-1 col-span-2   md:pt-4 h-max ">
						<div className="w-full">
							<div className=" w-ful mb-5  relative">
								
								{postCreatorProfile?.blurCoverPhoto && (
									<div
										onClick={() => {
											setBlurImageToShow(
												postCreatorProfile.blurCoverPhoto
											);
											setImageToShow(postCreatorProfile?.coverPhoto);

											openModal();
										}}
										className=" cursor-pointer h-[30vw] min-[400px]:h-[27vw] md:h-[16vw] lg:h-[15vw]  w-full rounded-md"
									>
										<LazyLoadImg
											backgroundClassName={
												"   w-full h-full  relative rounded-md"
											}
											imgClassName={
												"absolute inset-0 w-full h-full rounded-md "
											}
											originalImgUrl={postCreatorProfile?.coverPhoto}
											blurImageStr={postCreatorProfile?.blurCoverPhoto}
											optimizationStr={"q_auto,f_auto,w_1000"}
											paddingBottom={"10%"}
										/>
									</div>
								)}
								{/* lazy loading image? */}
								<div
									onClick={() => {
										setBlurImageToShow(postCreatorProfile.blurProfilePhoto);
										setImageToShow(postCreatorProfile?.profilePhoto);

										openModal();
									}}
									className=" cursor-pointer absolute top-1/4  h-[21vw] w-[21vw] md:h-[15vw] md:w-[15vw] lg:h-[10vw] lg:w-[10vw]   rounded-full border border-blue-600"
								>
									<LazyLoadImg
										backgroundClassName={
											" rounded-full  w-full h-full  relative"
										}
										imgClassName={
											"absolute inset-0 w-full h-full  object-cover rounded-full "
										}
										originalImgUrl={postCreatorProfile?.profilePhoto}
										blurImageStr={postCreatorProfile?.blurProfilePhoto}
										optimizationStr={"q_auto,f_auto,w_200"}
										paddingBottom={"100%"}
									/>
								</div>
							</div>
						</div>

						{/* large screen more posts */}

						<div className=" mt-3 md:mt-8 ">
							<h1 className="font-semibold  max-w-max dark:text-slate-200 ">
								Bio
							</h1>
							<p className=" pr-4 py-2">{postCreatorProfile?.bio}</p>
						</div>
						<div className=" hidden lg:flex flex-col col-start-1 col-span-2   border-t dark:border-t-slate-700 ">
							<h1 className="font-semibold  max-w-max py-4  dark:text-slate-200 ">
								{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
							</h1>
							<div className="  font-inter grid grid-cols-1   gap-[5rem] lg:grid-cols-2 w-[100%]">
								<MorePost
									titleLength={30}
									post={creatorAllPost}
									status={creatorPostStatus}
								/>
							</div>
							{creatorAllPost?.length === 0 ? (
								<h1 className=" text-yellow-600 my-4">
									This user have no Post
								</h1>
							) : hasMore ? (
								<button
									onClick={(event) => {
										event.preventDefault();
										setPage(page + 1);
									}}
									className=" self-center rounded-md px-2 mb-4 border dark:border-slate-800 shadow-sm hover:shadow-none bg-blue-600 drop-shadow-md text-white border-gray-300 hover:bg-blue-500 transition-all delay-75"
								>
									load more
								</button>
							) : (
								<h1 className=" text-yellow-600 my-4">
									No More Post from this user
								</h1>
							)}
						</div>
					</div>
					{/* left */}

					<div className="  flex gap-3 lg:px-4 flex-col lg:sticky lg:top-0  overflow-y-auto custom-scrollbar lg:pb-6 lg:dark:bg-lightdark rounded-lg lg:h-[80vh] ">
						<div className="flex gap-3 items-center lg:pt-4 ">
							<h1 className="font-semibold   text-black  dark:text-slate-200 ">
								{`${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName} Profile`}
							</h1>
							<FollowingBtn
								className="self-center text-colorPrimary  text-center  hover:text-blue-600 rounded-lg transition-all delay-75"
								userToFollowOrUnfollow={postCreatorProfile}
							/>
							<MessageUser receiverId={postCreatorProfile?._id} />
						</div>

						<h1 className=" ">{`${postCreatorProfile?.followersCount} followers`}</h1>
						<div className=" mb-2  flex gap-1 items-center">
							<MdWork className="text-colorPrimary " />{" "}
							{postCreatorProfile?.profession}
						</div>
						<div className=" mb-2  flex gap-1 items-center">
							<MdOutlineLanguage className="text-colorPrimary " />{" "}
							{postCreatorProfile?.language}
						</div>
						<div className="  mb-2  flex gap-1 items-center">
							<BiSolidUserAccount className="text-colorPrimary " />{" "}
							{postCreatorProfile?.nickName}
						</div>

						<div className=" mb-2  flex gap-1 items-center">
							<BiMap className="text-colorPrimary " />{" "}
							{postCreatorProfile?.location}
						</div>

						<h1 className="font-semibold  max-w-max pt-3 ">following</h1>

						<div className="">
							{postCreatorProfile?._id && (
								<Following
									id={
										loginUserId !== postCreatorProfile?._id &&
										postCreatorProfile?._id
									}
								/>
							)}
						</div>
					</div>
					{/* small screen more post */}

					<div className=" lg:hidden flex flex-col col-start-1 col-span-2   px-4 rounded-md drop-shadow-sm  ">
						<h1 className="max-w-max font-semibold py-4 dark:text-slate-200 ">
							{`Posts By ${postCreatorProfile?.firstName} ${postCreatorProfile?.lastName}`}
						</h1>
						<div className="  font-inter grid max-[650px]:grid-cols-1 max-[768px]:grid-cols-2 grid-cols-1 md:grid-cols-2  gap-12 lg:grid-cols-2 w-[100%]">
							<MorePost
								titleLength={30}
								post={creatorAllPost}
								status={creatorPostStatus}
							/>
						</div>

						{creatorAllPost?.length === 0 ? (
							<h1 className=" text-yellow-600 my-4">
								This user have no Post
							</h1>
						) : hasMore ? (
							<button
								onClick={(event) => {
									event.preventDefault();
									setPage(page + 1);
								}}
								className=" self-center mb-4 rounded-md px-2  border dark:border-slate-800 bg-blue-400 drop-shadow-md text-white border-gray-300 hover:bg-blue-600 transition-all delay-755"
							>
								load more
							</button>
						) : (
							<h1 className=" text-yellow-600 my-4">
								{/* No More Post from this user */}
							</h1>
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default UserPage;
