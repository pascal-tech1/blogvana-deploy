import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import {
	clearAdminAllUser,
	deleteUserAdmin,
	fetchAllUsers,
	increaseAdminAllUsersPageNumber,
	setAllUsersSelectedFilter,
} from "../../redux/admin/adminSlice";
import Modal from "../../components/Modal";

import { formatDate } from "../../utils/dataFormatter";

import {
	ClearSearch,
	DashboardCustomDropdown,
	LoadingSpinner,
	Tooltip,
} from "../../components";
import {
	setIsSearchBArNeeded,
	setSearchTermInStore,
} from "../../redux/user/userSlice";
import BlockOrUnblockUser from "../component/BlockOrUnblockUser";

import MakeAdmin from "../component/MakeAdmin";
import MessageUser from "../../Dashboard/components/MessageUser";
import { MdDelete } from "react-icons/md";

const AllUsers = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
		dispatch(setSearchTermInStore(""));
	}, []);
	const {
		allUsers,
		AdminAllUserSelectedFilter,
		adminAllUsersStatus,
		adminAllUsersTotalNumber,
		adminFetchUsersHasMore,
		adminAllUsersPageNumber,
	} = useSelector((store) => store.adminSlice);
	const { user, dashboardSearchTerm } = useSelector(
		(store) => store.userSlice
	);
	const id = user?._id;

	const dispatch = useDispatch();
	const observer = useRef();
	const [checkedItems, setCheckedItemId] = useState([]);

	const lastPostRef = useCallback(
		(node) => {
			if (adminAllUsersStatus !== "loading") {
				if (observer.current) observer.current.disconnect();
				observer.current = new IntersectionObserver((entries) => {
					if (entries[0].isIntersecting && adminFetchUsersHasMore) {
						dispatch(increaseAdminAllUsersPageNumber());
						dispatch(
							fetchAllUsers({
								filter: AdminAllUserSelectedFilter,
							})
						);
					}
				});
				if (node) observer.current.observe(node);
			}
		},
		[adminAllUsersStatus, adminFetchUsersHasMore]
	);

	useEffect(() => {
		if (adminAllUsersStatus === "loading") return;

		dispatch(clearAdminAllUser());
		dispatch(
			fetchAllUsers({
				filter: AdminAllUserSelectedFilter,
			})
		);
	}, [AdminAllUserSelectedFilter, dashboardSearchTerm]);

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
		,
		"Newest User",
		"Oldest User",
		"highest Followers",
		"lowest followers",
		"highest No Post",
		"lowest No Post",
		"highest Following",
		"lowest Following",
	];
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));

		checkedItems.length > 0
			? setIsModalOpen(true)
			: toast.error("please select users to delete");
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select Users To delete");
			return;
		}

		dispatch(deleteUserAdmin(checkedItems));
	};
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<div className="font-inter overflow-hidden shadow-md relative h-[85vh] dark:bg-dark p-2 rounded-lg">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			{/* modal */}
			<div className=" z-[1000]">
				<Modal
					isOpen={isModalOpen}
					onClose={closeModal}
					onContinue={continueAction}
				>
					<div>
						<h1>
							Do you want to continue to delete {checkedItems.length} user
						</h1>
						<h3>Remember this Action cannot be undone</h3>
					</div>
				</Modal>
			</div>
			{/* table actions buttons */}
			<div className="flex gap-4 flex-wrap items-center pb-4 ">
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
						setSelectedFilter={setAllUsersSelectedFilter}
						selectedFilter={AdminAllUserSelectedFilter}
						dropdownWidth={"w-[40vw] md:w-[23vw]"}
					/>
				</div>
				<h3 className="flex gap-2 items-center ">
					Total Users :<span>{adminAllUsersTotalNumber}</span>
				</h3>
			</div>
			{/* table */}
			<div className=" max-h-[75vh] overflow-auto  min-w-[300px] custom-scrollbar mx-3">
				<table className="">
					<thead className="tableHeading -top-10 bg-gray-800  text-white z-50 ">
						<tr>
							<th className=" bg-gray-800">
								<input
									type="checkbox"
									name="check"
									id="All"
									checked={checkedItems.length === allUsers.length}
									onChange={() =>
										handleCheckedItemcsChange("All", allUsers)
									}
									className="checkboxStyle"
								/>
							</th>
							<th>User Id</th>
							<th>Verified</th>
							<th>Frst Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Join Date</th>
							<th>No Posts</th>
							<th>No followers</th>
							<th>No following</th>
							<th className="bg-gray-800">Action</th>
						</tr>
					</thead>

					<tbody className="">
						{allUsers.map((singleUser, index) => (
							<tr
								key={index}
								ref={
									allUsers.length === index + 1 && allUsers.length > 1
										? lastPostRef
										: null
								}
								className="transition duration-300 ease-in-out hover:bg-neutral-200   dark:hover:bg-lightdark"
							>
								<td className="bg-gray-50 tableData  dark:bg-lightdark">
									<input
										type="checkbox"
										name="check"
										className="checkboxStyle"
										id={singleUser._id}
										checked={checkedItems.includes(singleUser._id)}
										onChange={() =>
											handleCheckedItemcsChange(singleUser._id)
										}
									/>
								</td>

								<td className="tableData ">
									<Link to={`/profile/${singleUser._id}`}>
										<Tooltip info={singleUser._id}>
											{singleUser._id}
										</Tooltip>
									</Link>
								</td>
								<td className="tableData ">
									<Tooltip
										info={singleUser.isAccountVerified ? "Yes" : "NO"}
									>
										{singleUser.isAccountVerified ? "Yes" : "NO"}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.firstName}>
										{singleUser.firstName}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.lastName}>
										{singleUser.lastName}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={singleUser.email}>
										{singleUser.email}
									</Tooltip>
								</td>
								<td className="tableData ">
									<Tooltip info={formatDate(singleUser.createdAt)}>
										{formatDate(singleUser.createdAt)}
									</Tooltip>
								</td>
								<td className="tableData ">{singleUser.postsCount}</td>
								<td className="tableData ">{singleUser.followersCount}</td>
								<td className="tableData ">{singleUser.followingCount}</td>

								<td className="flex   bg-gray-50 tableData dark:bg-lightdark  items-center ">
									<MessageUser receiverId={singleUser._id} />

									<BlockOrUnblockUser user={singleUser} />
									{user?.isOwner && <MakeAdmin user={singleUser} />}
								</td>
							</tr>
						))}

						{/* conditionary rendering user status */}
						{adminAllUsersStatus === "loading" && (
							<tr>
								<td className=" tableData "></td>
								<td className=" tableData ">
									<LoadingSpinner />
								</td>
							</tr>
						)}

						{!adminFetchUsersHasMore &&
							adminAllUsersStatus === "success" &&
							allUsers.length > 0 && (
								<tr className="  ">
									<td className="tableData "></td>
									<td className=" text-yellow-400 tableData  stickyBottom  ">
										No more User
									</td>
								</tr>
							)}

						{allUsers.length === 0 &&
							adminAllUsersStatus === "success" && (
								<td className=" text-yellow-400 tableData stickyBottom  ">
									No User Found
								</td>
							)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AllUsers;
