import React, { useEffect, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";

import { RegisterUser } from "../redux/user/userSlice";
import { useSelector, useDispatch } from "react-redux";

import { Carousel, LoadingSpinner } from "../components";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const Register = () => {
	const { registerUserStatus } = useSelector((store) => store.userSlice);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isRegistering, setIsRegistering] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		registerUserStatus === "success" &&
			isRegistering &&
			navigate("/send-email-verification");
	}, [registerUserStatus]);

	const formSchema = Yup.object().shape({
		firstName: Yup.string()
			.required("First Name is Required.")
			.min(1, "First Name is Too Short."),
		lastName: Yup.string()
			.required("Last Name is Required.")
			.min(1, "Last Name is Too Short."),
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string()
			.required("No password provided.")

			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
			),
	});

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},

		onSubmit: (values) => {
			dispatch(RegisterUser(values));
		},
		validationSchema: formSchema,
	});

	return (
		<div className="h-[90vh] flex justify-center md:grid place-items-center place-content-center grid-cols-2 font-inter font-light dark:text-slate-200">
			<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-sm justify-center items-center dark:bg-dark  border dark:border-gray-800">
				<h1 className=" font-medium">
					Join Our Community and Start Sharing Your Story!
				</h1>
				<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
					Be a part of our vibrant community where your voice matters. Sign
					up now and let your journey as a blogger begin!
				</p>
				<Carousel />
			</div>

			{/* form starts here */}
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col w-full  items-center px-8 lg:px-20  rounded-md p-2 border dark:border-gray-800"
			>
				<div className=" items-center flex flex-col  mb-6">
					<p className=" text-lg font-medium mb-3">Get Started</p>
					<p className=" text-gray-400 text-sm">
						Create your free Account
					</p>
				</div>

				<label className="form-label " htmlFor="name">
					First Name
				</label>
				<input
					value={formik.values.firstName}
					onChange={formik.handleChange("firstName")}
					onBlur={formik.handleBlur("firstName")}
					aria-label="Enter your first name"
					type="text"
					className="form-input"
				/>
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text  ">
						{formik.touched.firstName && formik.errors.firstName}
					</h1>
				</div>
				<label className=" form-label" htmlFor="name">
					Last Name
				</label>
				<input
					value={formik.values.lastName}
					onChange={formik.handleChange("lastName")}
					onBlur={formik.handleBlur("lastName")}
					aria-label="Enter your last name"
					type="text"
					className=" form-input"
				/>
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text  ">
						{formik.touched.lastName && formik.errors.lastName}
					</h1>
				</div>
				<label className=" form-label font-inter" htmlFor="email">
					Email
				</label>
				<input
					value={formik.values.email}
					onChange={formik.handleChange("email")}
					onBlur={formik.handleBlur("email")}
					aria-label="Enter your email"
					type="email"
					className=" form-input"
				/>
				<div className=" relative mb-2 self-start ">
					<h1 className=" form-error-text ">
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
				<button
					onClick={() => setIsRegistering(true)}
					type="submit"
					className="form-btn mt-4"
				>
					{registerUserStatus === "loading" ? (
						<LoadingSpinner />
					) : (
						"Register"
					)}
				</button>

				<div className=" mt-8">
					<h3 className=" font-light font-inter text-gray-500">
						Already Have an account?
						<span>
							<Link
								className=" text-blue-600 ml-2 hover:text-blue-500 transition-all"
								href="#"
								to="/login"
							>
								Login
							</Link>
						</span>
					</h3>
				</div>
			</form>
		</div>
	);
};

export default Register;
