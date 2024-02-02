import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../../redux/user/userSlice";

import { MdEdit, MdOutlineEmail, MdWork } from "react-icons/md";
import { BiMap } from "react-icons/bi";

const UserProfile = () => {
	const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
	const user = useSelector((store) => store?.userSlice?.user);
	const dispatch = useDispatch();
	// yup Schema
	const formSchema = Yup.object().shape({
		firstName: Yup.string()
			.required("First Name is Required.")
			.min(2, "First Name is Too Short."),
		lastName: Yup.string()
			.required("Last Name is Required.")
			.min(2, "Last Name is Too Short."),
		profession: Yup.string().min(3, "profession is Too Short."),
		location: Yup.string().min(3, "location is Too Short."),
	});

	const formik = useFormik({
		initialValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			profession: user?.profession,
			location: user?.location,
		},

		onSubmit: (values) => {
			const { firstName, lastName, profession, location } = user;

			if (
				firstName === values.firstName &&
				lastName === values.lastName &&
				profession === values.profession &&
				location === values.location
			) {
				return;
			}

			const userData = {
				firstName: values.firstName,
				lastName: values.lastName,
				location: values.location || "None",
				profession: values.profession || "none",
			};
			!isUserProfileClicked && dispatch(updateUser(userData));
		},
		validationSchema: formSchema,
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className=" relative flex flex-col gap-2 items-center transition-all px-4 font-inter "
		>
			{isUserProfileClicked ? (
				<div className="flex gap-2 flex-col transition-all self-start">
					<div className=" relative">
						<input
							className=" form-input"
							value={formik.values.firstName}
							onChange={formik.handleChange("firstName")}
							onBlur={formik.handleBlur("firstName")}
							type="text"
							placeholder="firstName"
						/>
						<p className="  bottom-[-0.5rem] text-red-400">
							{formik.touched.firstName && formik.errors.firstName}
						</p>
					</div>
					<div className=" relative">
						<input
							className=" form-input"
							value={formik.values.lastName}
							onChange={formik.handleChange("lastName")}
							onBlur={formik.handleBlur("lastName")}
							type="text"
							// placeholder="lastName"
						/>
						<p className="  bottom-[-0.5rem] text-red-400">
							{formik.touched.lastName && formik.errors.lastName}
						</p>
					</div>
					<div className=" relative">
						<input
							className=" form-input"
							value={formik.values.profession}
							onChange={formik.handleChange("profession")}
							onBlur={formik.handleBlur("profession")}
							type="text"
						/>
						<p className=" bottom-0 text-red-400">
							{formik.touched.profession && formik.errors.profession}
						</p>
					</div>

					<div className=" relative">
						<input
							className=" form-input"
							value={formik.values.location}
							onChange={formik.handleChange("location")}
							onBlur={formik.handleBlur("location")}
							type="text"
							placeholder="location"
						/>
						<p className="  bottom-0 text-red-400">
							{formik.touched.location && formik.errors.location}
						</p>
					</div>
				</div>
			) : (
				<div className="transition-all self-start ">
					<h1 className=" font-bold  md:text-lg">{`${user?.firstName} ${user?.lastName}`}</h1>
					<div className=" font-bold text-gray-500 text-sm flex gap-2 items-center">
						<MdWork className=" text-blue-400" /> {user?.profession}
					</div>
					<div className="font-bold text-gray-500 text-sm flex gap-2 items-center">
						<BiMap className=" text-blue-400" /> {user?.location}
					</div>
					<div className="font-bold text-gray-500 text-sm flex gap-2 items-center">
						<MdOutlineEmail className=" text-blue-400" /> {user?.email}
					</div>
				</div>
			)}

			<button
				onClick={() => setIsUserProfileClicked(!isUserProfileClicked)}
				type="submit"
				className="absolute top-0 right-3 flex hover:shadow-sm  items-center text-sm transition-all "
			>
				<MdEdit className=" text-blue-500 " />
				<h3 className="font-bold text-gray-600 hover:text-gray-900 dark:hover:text-gray-400 md:text-sm">
					{isUserProfileClicked ? "Save" : "Edit"}
				</h3>
			</button>
		</form>
	);
};

export default UserProfile;
