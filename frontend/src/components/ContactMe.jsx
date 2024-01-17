import React, { useEffect, useState } from "react";
import { BiCopyright } from "react-icons/bi";
import Modal from "./Modal";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { sendPascalMsg } from "../redux/message/messageSlice";

const ContactMe = ({ copyrightNeeded, nameNeeded }) => {
	const { user } = useSelector((store) => store.userSlice);
	const { SendingPascalMsgtatus } = useSelector(
		(store) => store.messageSlice
	);

	const dispatch = useDispatch();
	const formSchema = Yup.object().shape({
		name: Yup.string()
			.required("Name is Required.")
			.min(3, "Name is Too Short at least 3 characters"),
		message: Yup.string().required("messge is Required."),

		email: Yup.string().email().required("Email is Required."),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			message: "",
		},

		onSubmit: (values) => {
			const blogvanaUserDetails = {
				id: user?._id,
				loginFirstName: user?.firstName,
				loginLastName: user?.lastName,
				profilePhoto: user?.profilePhoto,
				loginEmail: user?.email,
				profession: user?.profession,
				location: user?.location,
				language: user?.language,
				nickName: user?.nickName,
				education: user?.education,
				isAccountBlocked: user?.isBlocked,
				isAdmin: user?.isAdmin,
				isAccountVerified: user?.isAccountVerified,
			};

			const sendingData = {
				...values,
				BlogvanaUserDetails: blogvanaUserDetails || "not login",
			};
			dispatch(sendPascalMsg({ sendingData }));
		},
		validationSchema: formSchema,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		closeModal();
		// perform continue action
		formik.submitForm();
	};
	useEffect(() => {
		if (SendingPascalMsgtatus === "success") {
			formik.resetForm({
				values: {
					name: "",
					email: "",
					message: "",
				},
			});
		}
	}, [SendingPascalMsgtatus]);

	return (
		<div className=" text-center  flex flex-col gap-1 font-inter mb-3 ">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
				Actiontext={"send"}
				enterNeeded={false}
			>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col w-full min-w-[60vw] md:min-w-[45vw]  lg:min-w-[36vw]  items-center  px-4  rounded-md p-2 border dark:border-gray-800"
				>
					<h1 className=" relative flex flex-col items-center mb-2">
						Contact me
						<span class=" border-b w-20 mt-[0.2rem] self-center border-b-blue-400"></span>
					</h1>
					<p className=" dark:text-gray-300 text-sm">
						Hi, i'm Adoh Azubike Pascal, the creator of this blog. I'm a
						tech enthusiast actively seeking impactful collaborations and
						exciting opportunities. I'm open to connecting with fellow
						innovators, entrepreneurs, and hiring managers. send a message and Let's push
						boundaries together!
					</p>
					<label className="form-label " htmlFor="name">
						name
					</label>

					<input
						value={formik.values.name}
						onChange={formik.handleChange("name")}
						onBlur={formik.handleBlur("name")}
						aria-label="Enter your name"
						type="text"
						className="form-input"
					/>
					<div className=" relative mb-2 self-start ">
						<h1 className=" form-error-text  ">
							{formik.touched.name && formik.errors.name}
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
					<label className=" form-label font-inter" htmlFor="email">
						Message
					</label>
					<textarea
						value={formik.values.message}
						onChange={formik.handleChange("message")}
						onBlur={formik.handleBlur("message")}
						aria-label="Please enter your message"
						type="text"
						className="form-input  h-[6rem]"
					/>
					<div className=" relative mb-2 self-start ">
						<h1 className=" form-error-text ">
							{formik.touched.message && formik.errors.message}
						</h1>
					</div>
				</form>
			</Modal>
			{copyrightNeeded && (
				<div className=" flex gap-2 items-center justify-center">
					<BiCopyright />
					<h3>2023</h3>
				</div>
			)}
			{nameNeeded && <h3> Made By Adoh Azubike</h3>}
			<button
				onClick={() => setIsModalOpen(true)}
				className=" text-base shadow-sm hover:bg-blue-500  text-white bg-blue-600 px-1 py-[0.15rem]  rounded-lg transition-all duration-75"
			>
				contact me
			</button>
		</div>
	);
};

export default ContactMe;
