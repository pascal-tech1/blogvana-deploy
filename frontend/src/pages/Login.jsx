import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/user/userSlice";

import { ForgotPassword, LoadingSpinner } from "../components";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { prefetchComponents } from "../Dashboard/pages";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	const { user, isLoading } = useSelector((store) => store.userSlice);

	const [showPassword, setShowPassword] = useState(false);

	const formSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is Required."),
		password: Yup.string().required("No password provided."),
	});

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);
	useEffect(() => {
		const comp = prefetchComponents();
		console.log(comp);
	}, []);

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},

		onSubmit: (values) => {
			const user = {
				email: values.email,
				password: values.password,
			};
			dispatch(loginUser(user));
		},
		validationSchema: formSchema,
	});

	return (
		<div className=" flex justify-center md:grid place-items-center  grid-cols-2  font-inter h-[90vh] dark:text-slate-200">
			<div
				className={` z-[1000] fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40  ${
					isOpen ? "" : "hidden"
				}`}
			>
				<ForgotPassword setIsOpen={setIsOpen} />
			</div>

			<div className=" hidden md:flex flex-col p-9 bg-gray-100 mr-6 shadow-sm justify-center items-center dark:bg-dark border dark:border-gray-800 ">
				<h1 className=" font-medium">Get Ready to Be Inspired</h1>
				<p className=" font-light text-gray-400 text-xs mt-5 mb-[3.5rem] max-w-md">
					Explore our latest blog posts and embark on a journey of
					discovery
				</p>
				<img
					className=" h-[11rem] rounded-lg"
					src="/blogvana.png"
					alt="blogvana-imgage"
				/>
			</div>

			{/* form starts here */}
			<form
				onSubmit={formik.handleSubmit}
				className="flex flex-col w-full  items-center px-8 lg:px-20 dark:bg-dark rounded-md p-2 border dark:border-gray-800"
			>
				<div className=" items-center flex flex-col  mb-6">
					<p className=" text-lg font-medium mb-3">Welcome Back</p>
					<p className=" text-gray-400 text-sm text-center">
						Login to access your personalized journey
					</p>
				</div>

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
				<div className=" relative mb-2 self-start">
					<h1 className=" form-error-text">
						{formik.touched.password && formik.errors.password}
					</h1>
				</div>
				{console.log(isLoading)}
				<button
					disabled={isLoading}
					type="submit"
					className="form-btn mt-4 font-inter text-white"
				>
					{isLoading ? <LoadingSpinner /> : <h3>login</h3>}
				</button>

				<h3
					onClick={() => setIsOpen(true)}
					className=" cursor-pointer mt-2 self-end text-blue-600 hover:text-blue-500 transition-all delay-75"
				>
					forget password
				</h3>

				<div className=" mt-8 ">
					<h3 className=" font-light text-gray-500 font-inter">
						Don't Have an account?
						<span>
							<Link
								to="/register"
								className=" text-blue-600  ml-2 hover:text-blue-500 transition-all"
							>
								Register
							</Link>
						</span>
					</h3>
				</div>
			</form>
		</div>
	);
};

export default Login;
