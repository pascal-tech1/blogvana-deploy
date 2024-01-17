import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../../redux/user/userSlice";
import { MdEdit } from "react-icons/md";

const UserBio = () => {
	const [isUserProfileClicked, setIsUserProfileClicked] = useState(false);
	const user = useSelector((store) => store?.userSlice?.user);
	const dispatch = useDispatch();
	// yup Schema
	const formSchema = Yup.object().shape({
		bio: Yup.string()
			.min(10, "bio must not be less than 10 characters")
			.max(600, "bio must be less than 600 characters"),
	});

	const formik = useFormik({
		initialValues: {
			bio: user?.bio,
		},

		onSubmit: (values) => {
			setIsUserProfileClicked(!isUserProfileClicked);
			if (!isUserProfileClicked) return;
			if (user.bio === values.bio) {
				return;
			}
			const userData = {
				bio: values.bio,
			};
			dispatch(updateUser(userData));
		},
		validationSchema: formSchema,
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="  rounded-xl flex flex-col px-4 mt-4 mb-4 font-inter"
		>
			<div className=" flex justify-between mr-4 mt-4">
				<h1 className=" font-bold  text-blue-400 dark:text-colorPrimary ">
					Bio
				</h1>
				<button type="submit" className="flex gap-1">
					<MdEdit className="  text-blue-400 dark:text-colorPrimary " />
					<h3 className="font-bold text-gray-600 md:text-sm hover:text-gray-900  dark:hover:text-gray-400">
						{isUserProfileClicked ? "save" : "Edit"}
					</h3>
				</button>
			</div>
			{isUserProfileClicked ? (
				<textarea
					value={formik.values.bio}
					onChange={formik.handleChange("bio")}
					onBlur={formik.handleBlur("bio")}
					name="summary"
					id="summary"
					cols="30"
					rows="5"
					className="  form-input"
				></textarea>
			) : (
				<h2 className=" text-sm md:text-base">{user.bio}</h2>
			)}
			<div className=" text-red-500">
				{formik.touched.bio && formik.errors.bio}
			</div>
		</form>
	);
};

export default UserBio;
