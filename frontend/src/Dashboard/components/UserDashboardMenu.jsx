import React from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { BsLock, BsMessenger } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoMdHelp } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";

import {
	logOutUser,
	setChangeEmail,
	setChangePassword,
} from "../../redux/user/userSlice";
import { ContactMe } from "../../components";

const UserDashboardMenu = ({ isMenuOpen, setIsMenuOpen }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleProfileClick = () => {
		navigate("/profile-view");
	};

	const handleUupdatePassword = () => {
		dispatch(setChangePassword());
	};

	const handleChangeEmail = () => {
		dispatch(setChangeEmail());
	};

	const handleFaqClick = () => {};

	const handleLogOut = () => {
		dispatch(logOutUser());
		navigate("/");
	};

	return (
		<>
			<div
				className={`${
					isMenuOpen ? "  " : "hidden "
				} absolute top-4 right-4 py-4 md:text-sm px-4 text-sm  flex justify-between flex-col drop-shadow-lg z-[500] h-[50vh]  rounded-lg  dark:bg-lightdark border dark:border-gray-700   bg-white`}
			>
				<div className=" flex flex-col justify-start whitespace-nowrap  items-start font-inter gap-3 py-3  ">
					<button
						onClick={() => {
							handleProfileClick();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center py-1 px-2 rounded-lg transition-all delay-75"
					>
						<CiUser />
						profile
					</button>
					<button
						onClick={() => {
							handleUupdatePassword();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<BsLock />
						update password
					</button>
					<button
						onClick={() => {
							handleChangeEmail();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<BsMessenger />
						change email
					</button>
					<button
						onClick={() => {
							handleFaqClick();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<IoMdHelp />
						FAQ
					</button>
					<button
						onClick={() => {
							handleLogOut();
							setIsMenuOpen(!isMenuOpen);
						}}
						className=" hover:bg-blue-100 dark:hover:bg-gray-800 flex gap-2 items-center text-red-400  py-1 px-2 rounded-lg transition-all delay-75"
					>
						<FiLogOut />
						logout
					</button>
				</div>
				<div className=" text-xs">
					<ContactMe copyrightNeeded={true} nameNeeded={true} />
				</div>
			</div>
		</>
	);
};

export default UserDashboardMenu;
