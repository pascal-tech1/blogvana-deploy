import { FaUser, FaUsers } from "react-icons/fa";

import { LuLayoutDashboard } from "react-icons/lu";
import { FaUsersGear } from "react-icons/fa6";

import {
	BiBookContent,
	BiHistory,
	BiInfoCircle,
	BiMessage,
} from "react-icons/bi";
import { CiSaveDown1, CiSettings } from "react-icons/ci";
import { RiBookReadLine, RiUserFollowFill } from "react-icons/ri";
import {
	MdAdminPanelSettings,
	MdCategory,
	MdOutlineArrowDropDown,
	MdOutlineCreate,
} from "react-icons/md";
import { GiShadowFollower } from "react-icons/gi";
import { BsEye } from "react-icons/bs";


export const sideBarItems = {
	children: [
		{
			title: "Stats",
			icon: LuLayoutDashboard,
		},
		{
			title: "Profile",
			icon: FaUser,

			children: [
				{
					title: "details",
					icon: BiInfoCircle,
				},
				{
					title: "message",
					icon: BiMessage,
				},
				{
					title: "views",
					icon: BsEye,
				},
			],
		},
		{
			title: "Post",
			icon: BiBookContent,

			children: [
				{
					title: "my posts",
					icon: CiSettings,
				},
				{
					title: "create",
					icon: MdOutlineCreate,
				},
				{
					title: "history",
					icon: BiHistory,
				},
				{
					title: "saved",
					icon: CiSaveDown1,
				},
			],
		},
		{
			title: "Follows",
			icon: GiShadowFollower,
			children: [
				{
					title: "followers",
					icon: FaUsers,
				},
				{
					title: "following",
					icon: RiUserFollowFill,
				},
			],
		},
	],
};

export const AdminSideBarItems = {
	title: "Admin",
	icon: MdAdminPanelSettings,

	children: [
		{
			title: "all users",
			icon: FaUsersGear,
		},

		{
			title: "category",
			icon: MdCategory,
		},
		{
			title: "all posts",
			icon: RiBookReadLine,
		},
	],
};
