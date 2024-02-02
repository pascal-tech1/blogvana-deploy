import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
	clearCreatorAllPost,
	deletePost,
	fetchCreatorPosts,
	increaseCreatorPostPageNumber,
	setMyPostSelectedFilter,
} from "../../redux/post/generalPostSlice";
import { formatDate } from "../../utils/dataFormatter";
import {
	ClearSearch,
	DashboardCustomDropdown,
	LoadingSpinner,
	Modal,
	Tooltip,
} from "../../components";

import { toast } from "react-toastify";
import {
	setIsSearchBArNeeded,
	setSearchTermInStore,
} from "../../redux/user/userSlice";
import EditPostBtn from "../../components/EditPostBtn";
import { FiDelete } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const MyPosts = () => {
	const {
		creatorPostStatus,
		creatorAllPost,
		creatoPostTotalNumber,
		hasMore,
		MyPostSelectedFilter,
		creatorAllPostPageNumber,
	} = useSelector((store) => store.generalPostSlice);

	const { user, dashboardSearchTerm } = useSelector(
		(store) => store.userSlice
	);
	const id = user?._id;

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		dispatch(setSearchTermInStore(""));
	}, []);

	const lastPostRef = useCallback(
		(node) => {
			if (creatorPostStatus !== "loading") {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting && hasMore) {
						dispatch(increaseCreatorPostPageNumber());
						dispatch(
							fetchCreatorPosts({
								userId: id,
								filter: MyPostSelectedFilter,
							})
						);
					}
				});
				if (node) observer.current.observe(node);
			}
		},
		[creatorPostStatus, hasMore]
	);

	useEffect(() => {
		if (!id) return;
		dispatch(clearCreatorAllPost());
		dispatch(
			fetchCreatorPosts({
				userId: id,
				filter: MyPostSelectedFilter,
			})
		);
	}, [MyPostSelectedFilter, id, dashboardSearchTerm]);

	const handleCheckedItemcsChange = (_id, tableItems) => {
		if (_id === "All") {
			if (checkedItems.length === tableItems.length) {
				setCheckedItemId([]);
			} else {
				const allItemId = tableItems.map((item) => item._id);
				setCheckedItemId(allItemId);
			}
		} else {
			if (checkedItems.includes(_id)) {
				setCheckedItemId((prev) =>
					prev.filter((prevId) => prevId !== _id)
				);
			} else {
				setCheckedItemId((prev) => [...prev, _id]);
			}
		}
	};

	const allFilter = [
		"Highest likes",
		"Lowest likes",
		"Latest",
		"Oldest",
		"A-Z",
		"Z-A",
		"Category",
		"Lowest view",
		"Highest view",
		"Lowest dislikes",
		"Highest dislikes",
	];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		checkedItems.length > 0
			? setIsModalOpen(true)
			: toast.error("select post to delete");
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select Post To delete");
			return;
		}
		dispatch(deletePost(checkedItems));
	};
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
		dispatch(setIsSearchBArNeeded(true));
	};

	return (
		<div className=" font-inter shadow-md  overflow-hidden h-[85vh] dark:bg-dark rounded-lg p-2  ">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{/* modal */}
			<div className="">
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
					onContinue={continueAction}
				>
					<div>
						<h1>
							Do you want to continue to delete {checkedItems.length} post
						</h1>
						<h3>Remember this Action cannot be undone</h3>
					</div>
				</Modal>
			</div>
			{/* table actions buttons */}
			<div className="flex gap-4 flex-wrap items-center  pb-4 ">
				<button
					onClick={openModal}
					className=" flex gap-1 items-center  py-[0.15] rounded-l hover:text-red-300  text-red-400 outline-none"
				>
					<MdDelete />
					delete
				</button>
				<div className="">
					<DashboardCustomDropdown
						allFilters={allFilter}
						setSelectedFilter={setMyPostSelectedFilter}
						selectedFilter={MyPostSelectedFilter}
						dropdownWidth={"w-[40vw] md:w-[23vw]"}
					/>
				</div>
				<h3 className="flex gap-2 items-center ">
					Total Post :<span>{creatoPostTotalNumber}</span>
				</h3>
			</div>
			{/* table */}
			<div className=" max-h-[75vh] overflow-auto custom-scrollbar  min-w-[300px] ">
				<table className="">
					<thead className="tableHeading -top-10 bg-gray-800  text-white">
						<tr className="">
							<th className="bg-gray-800">
								<input
									type="checkbox"
									name="check"
									id="All"
									checked={checkedItems.length === creatorAllPost.length}
									onChange={() =>
										handleCheckedItemcsChange("All", creatorAllPost)
									}
									className="checkboxStyle"
								/>
							</th>
							<th>Post Id</th>
							<th>created At</th>
							<th>number views</th>
							<th>category</th>
							<th>Likes</th>
							<th>DisLikes</th>
							<th className="bg-gray-800">Action</th>
						</tr>
					</thead>

					<tbody>
						{creatorAllPost.map((post, index) => (
							<tr
								key={index}
								ref={
									creatorAllPost.length === index + 1 &&
									creatorAllPost.length > 1
										? lastPostRef
										: null
								}
								className="  transition duration-300 ease-in-out hover:bg-neutral-200   dark:hover:bg-lightdark"
							>
								<td className=" bg-gray-50 tableData dark:bg-lightdark">
									<input
										type="checkbox"
										name="check"
										className="checkboxStyle"
										id={post._id}
										checked={checkedItems.includes(post._id)}
										onChange={() => handleCheckedItemcsChange(post._id)}
									/>
								</td>

								<td className="tableData z-50   ">
									<Link className=" " to={`/single-post/${post._id}`}>
										<Tooltip info={post.title}>{post?.title}</Tooltip>
									</Link>
								</td>
								<td className="tableData ">
									<Tooltip info={formatDate(post.createdAt)}>
										{formatDate(post.createdAt)}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.numViews}>{post.numViews}</Tooltip>
								</td>

								<td className="tableData ">
									<Tooltip info={post.category?.title}>
										{post.category?.title}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.likes.length}>
										{post.likes.length}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={post.likes.length}>
										{post.disLikes.length}
									</Tooltip>
								</td>
								<td className="  flex bg-gray-50 tableData items-center dark:bg-lightdark ">
									<EditPostBtn postId={post._id} />
								</td>
							</tr>
						))}

						{creatorPostStatus === "loading" && (
							<tr>
								<td className="text-yellow-400  stickyBottom   tableData "></td>
								<td className="text-yellow-400  stickyBottom   tableData ">
									<LoadingSpinner />
								</td>
							</tr>
						)}
						{creatorAllPost.length === 0 &&
							creatorPostStatus === "success" && (
								<td className="text-yellow-400  stickyBottom   tableData ">
									No User Found
								</td>
							)}
						{!hasMore &&
							creatorPostStatus === "success" &&
							creatorAllPost.length > 0 && (
								<tr className="   tableData">
									<td></td>
									<td className="text-yellow-400  stickyBottom   tableData ">
										No more post
									</td>
								</tr>
							)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default MyPosts;
