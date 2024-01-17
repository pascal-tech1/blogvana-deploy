import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Spinner } from "../../components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPassword } from "../../redux/user/userSlice";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const PasswordReset = () => {
	const { token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	const formSchema = Yup.object().shape({
		password: Yup.string()
			.min(6, "Password must be at least 6 characters")
			.required("Password is required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm Password is required"),
	});

	const formik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
		},
		validationSchema: formSchema,
		onSubmit: (values) => {
			const user = { token: token, newPassword: values.password };
			dispatch(resetPassword(user));
		},
	});

	const { resetPasswordStatus } = useSelector((store) => store.userSlice);

	if (resetPasswordStatus === "failed") {
		return (
			<div>
				<div className="flex items-center justify-center h-[80vh] w-screen flex-col">
					<h1>Token is expired or invalid</h1>
				</div>
			</div>
		);
	}

	if (resetPasswordStatus === "success") {
		return (
			<div>
				<div className="flex items-center justify-center h-[80vh] w-screen flex-col">
					<h1>your password have been changed successfully</h1>
					<button
						className=" py-2  mt-4self-center bg-blue-400 rounded-md px-3  text-white hover:bg-blue-600 transition-all delay-75 my-3"
						onClick={() => navigate("/login")}
					>
						login
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className=" font-inter">
			
			<div className=" flex items-center justify-center h-[80vh] w-screen">
				
				<form className="flex flex-col" onSubmit={formik.handleSubmit}>
					<label className=" form-label" htmlFor="password">
						new password
					</label>
					<div className=" relative">
						<input
							type={showPassword ? "text" : "password"}
							className="form-input "
							value={formik.values.password}
							onChange={formik.handleChange("password")}
							onBlur={formik.handleBlur("password")}
						/>
						<span
							className=" absolute top-[30%] right-2"
							onClick={togglePasswordVisibility}
						>
							{showPassword ? <BsEye /> : <BsEyeSlash />}
						</span>
					</div>
					<div className=" relative mb-2 self-start">
						<h1 className=" form-error-text">
							{formik.touched.password && formik.errors.password}
						</h1>
					</div>
					<div>
					<label className=" form-label" htmlFor="password">
						confirm password
					</label>
						<input
							type={showPassword ? "text" : "password"}
							className="form-input "
							value={formik.values.confirmPassword}
							onChange={formik.handleChange("confirmPassword")}
							onBlur={formik.handleBlur("confirmPassword")}
						/>
					</div>
					<div className=" relative mb-2 self-start">
						<h1 className=" form-error-text">
							{formik.touched.confirmPassword &&
								formik.errors.confirmPassword}
						</h1>
					</div>
					<button
						className=" bg-blue-400 mt-4 px-2 rounded-lg text-white hover:bg-blue-600 transition-all duration-75"
						type="submit"
					>
						{resetPasswordStatus === "loading" ? <Spinner /> : "Submit"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default PasswordReset;
