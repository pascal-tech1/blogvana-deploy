import React from "react";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../../redux/user/userSlice";

import {
	MdEdit,
	MdOutlineLanguage,
	MdOutlineVerifiedUser,
	MdOutlineDateRange,
	MdOutlineSchool,
	MdOutlineEmail,
} from "react-icons/md";
import { formatDate } from "../../utils/dataFormatter";

const AdditionalUserProfile = () => {
	const user = useSelector((store) => store?.userSlice?.user);
	const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);

	const dispatch = useDispatch();
	// yup Schema
	const formSchema = Yup.object().shape({
		language: Yup.string().min(3, "language is Too Short."),
		nickName: Yup.string().min(3, "Nick Name is Too Short."),
		education: Yup.string().min(3, "education is too short"),
	});

	const formik = useFormik({
		initialValues: {
			language: user?.language,
			nickName: user?.nickName,
			education: user?.education,
		},

		onSubmit: (values) => {
			setIsUserProfileClicked(!isUserProfileClicked);
			if (!isUserProfileClicked) return;
			const { language, nickName, education } = user;
			

			if (
				language === values.language &&
				nickName === values.nickName &&
				education === values.education
			) {
				
				return;
			}
			const userData = {
				language: values.language,
				nickName: values.nickName,
				education: values.education,
			};
			dispatch(updateUser(userData));
		},
		validationSchema: formSchema,
	});

	return (
		<form
			onSubmit={formik.handleSubmit}
			className=" col-start-5 col-span-2 px-4 bg-white row-start-1 lg:shadow-sm font-inter lg:rounded-md custom-scrollbar dark:bg-dark overflow-x-auto"
		>
			<div className=" flex justify-between mr-4 ">
				<h1 className=" font-bold dark:text-colorPrimary text-blue-400 ">
					Additional Details
				</h1>
				<button type="submit" className="flex gap-1">
					<MdEdit className=" text-blue-500" />
					<h3 className="font-bold text-gray-600 hover:text-gray-900 md:text-sm dark:hover:text-gray-400">
						{isUserProfileClicked ? "Save " : "Edit"}
					</h3>
				</button>
			</div>
			{isUserProfileClicked ? (
				// Additional user details form input
				<div className="flex flex-col mt-2">
					<div className="flex gap-2 flex-col ">
						<label htmlFor="language">Languages</label>
						<input
							value={formik.values.language}
							onChange={formik.handleChange("language")}
							onBlur={formik.handleBlur("language")}
							type="language"
							name="language"
							id="language"
							className="  form-input"
						/>
						<div className=" text-red-500">
							{formik.touched.language && formik.errors.language}
						</div>
					</div>
					<div className="flex gap-2 flex-col  ">
						<label htmlFor="nickName">Nick Name</label>
						<input
							value={formik.values.nickName}
							onChange={formik.handleChange("nickName")}
							onBlur={formik.handleBlur("nickName")}
							type="nickName"
							name="nickName"
							id="nickName"
							className="  form-input"
						/>
						<div className=" text-red-500">
							{formik.touched.nickName && formik.errors.nickName}
						</div>
					</div>
					<div className="flex gap-2 flex-col  ">
						<label htmlFor="education">Education</label>
						<input
							value={formik.values.education}
							onChange={formik.handleChange("education")}
							onBlur={formik.handleBlur("")}
							type="education"
							name="education"
							id="education"
							className="  form-input "
						/>
						<div className=" text-red-500">
							{formik.touched.education && formik.errors.education}
						</div>
					</div>
				</div>
			) : (
				// display
				<div className="flex flex-col gap-4 mt-2">
					<div className=" flex gap-3 items-center">
						<MdOutlineLanguage className=" dark:text-colorPrimary text-blue-400  " />
						<div>
							<h2 className=" dark:text-colorPrimary text-blue-400 ">
								Languages
							</h2>
							<h3 className=" text-gray-400">{user?.language}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineVerifiedUser className=" dark:text-colorPrimary text-blue-400  " />
						<div>
							<h2 className=" dark:text-colorPrimary text-blue-400 ">
								Nick name
							</h2>
							<h3 className=" text-gray-400 ">{user?.nickName}</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineDateRange className=" dark:text-colorPrimary text-blue-400  " />
						<div>
							<h2 className=" dark:text-colorPrimary text-blue-400 ">
								Join Date
							</h2>
							<h3 className=" text-gray-400 ">
								{formatDate(user?.createdAt)}
							</h3>
						</div>
					</div>
					<div className=" flex gap-3 items-center">
						<MdOutlineSchool className=" dark:text-colorPrimary text-blue-400  " />
						<div>
							<h2 className=" dark:text-colorPrimary text-blue-400 ">
								Education
							</h2>
							<h3 className=" text-gray-400 ">{user?.education}</h3>
						</div>
					</div>
				</div>
			)}
		</form>
	);
};

export default AdditionalUserProfile;
