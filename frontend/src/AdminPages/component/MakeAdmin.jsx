import React, { useEffect, useState } from "react";
import { toggleUserAdmin } from "../../redux/admin/adminSlice";
import { MdAdminPanelSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components";

const MakeAdmin = ({ user }) => {
	const dispatch = useDispatch();
	const [loadingStates, setLoadingStates] = useState({});
	const { toggleUserAdminStatus } = useSelector(
		(store) => store.adminSlice
	);

	const handleMakeAdminClicked = () => {
		setLoadingStates((prevStates) => ({
			...prevStates,
			[user._id]: true,
		}));

		dispatch(
			toggleUserAdmin({
				userId: user._id,
				action: user.isAdmin ? "disableAdmin" : "enableAdmin",
			})
		);
	};

	useEffect(() => {
		if (
			toggleUserAdminStatus === "success" ||
			toggleUserAdminStatus === "failed"
		) {
			setLoadingStates((prevStates) => ({
				...prevStates,
				[user._id]: false,
			}));
		}
	}, [toggleUserAdminStatus, user._id]);

	return (
		<div className=" font-inter">
			<button
				onClick={handleMakeAdminClicked}
				className={`p-[0.3rem] ${
					user.isAdmin ? "hover:bg-blue-100" : "hover:bg-red-100"
				} rounded-full hover:cursor-pointer`}
			>
				{loadingStates[user._id] ? (
					<div className="  items-center flex justify-center">
						<Spinner
							className={
								"w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
							}
						/>
					</div>
				) : (
					<MdAdminPanelSettings
						className={` text-2xl ${
							user.isAdmin ? " text-blue-500" : "text-red-500"
						}`}
					/>
				)}
			</button>
		</div>
	);
};

export default MakeAdmin;
