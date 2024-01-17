import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { setChangeEmail } from "../../redux/user/userSlice";
import { changeEmail } from "../../redux/user/userSlice";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Modal } from "../../components";

const ChangeEmailForm = () => {
	const dispatch = useDispatch();
	const { changeEmailStatus } = useSelector((store) => store.userSlice);
	const [showPassword, setShowPassword] = useState(false);

	const formSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string()
			.required("No password provided.")

			// .matches(
			// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			// 	"Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
			// ),
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
			newEmail: "",
		},

		onSubmit: (values) => {
			dispatch(changeEmail(values));
		},
		validationSchema: formSchema,
	});
	const handleclose = () => {
		dispatch(setChangeEmail());
	};

	return (
		<Modal
			isOpen={changeEmailStatus}
			onClose={handleclose}
			onContinue={formik.handleSubmit}
		>
			<label className=" form-label  " htmlFor="email">
				Email
			</label>
			<input
				aria-label="Enter your email"
				type="email"
				className=" form-input"
				value={formik.values.email}
				onChange={formik.handleChange("email")}
				onBlur={formik.handleBlur("email")}
			/>
			<div className=" relative mb-2 self-start">
				<h1 className=" form-error-text">
					{formik.touched.email && formik.errors.email}
				</h1>
			</div>
			<label className=" form-label" htmlFor="password">
				Password
			</label>
			<div className=" self-stretch relative">
				<input
					type={showPassword ? "text" : "password"}
					className="form-input "
					value={formik.values.password}
					onChange={formik.handleChange("password")}
					onBlur={formik.handleBlur("password")}
				/>
				<span
					className=" absolute top-[30%] right-2  hover:cursor-pointer"
					onClick={() => {
						setShowPassword((prev) => !prev);
					}}
				>
					{showPassword ? <BsEye /> : <BsEyeSlash />}
				</span>
			</div>
			<div className=" relative mb-2 self-start ">
				<div className=" text-sm text-red-400">
					{formik.touched.password && formik.errors.password}
				</div>
			</div>
			<label className=" form-label  " htmlFor="email">
				New Email
			</label>
			<input
				aria-label="Enter your email"
				type="email"
				className=" form-input"
				value={formik.values.newEmail}
				onChange={formik.handleChange("newEmail")}
				onBlur={formik.handleBlur("newEmail")}
			/>
			<div className=" relative mb-2 self-start">
				<h1 className=" form-error-text">
					{formik.touched.newEmail && formik.errors.newEmail}
				</h1>
			</div>
		</Modal>
	);
};

export default ChangeEmailForm;
