import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";
import * as Yup from "yup";

import { LuSendHorizonal } from "react-icons/lu";

import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../../components";
import { sendMsg } from "../../redux/message/messageSlice";
import { logOutUser } from "../../redux/user/userSlice";

const MessageUser = ({ receiverId, mssageiconSize }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	const { SendingMessageStatus, isBlocked } = useSelector(
		(store) => store.messageSlice
	);
	const { user } = useSelector((store) => store.userSlice);

	const formSchema = Yup.object().shape({
		message: Yup.string().required("messge is Required."),
	});

	const formik = useFormik({
		initialValues: {
			message: "",
		},

		onSubmit: (values) => {
			dispatch(sendMsg({ receiverId, message: values.message }));
		},
		validationSchema: formSchema,
	});

	useEffect(() => {
		if (SendingMessageStatus === "success") {
			formik.resetForm({
				values: {
					message: "",
				},
			});
		}
	}, [SendingMessageStatus]);

	useEffect(() => {
		if (isBlocked) {
			dispatch(logOutUser());
			navigate("/");
		}
	}, [isBlocked]);

	const openModal = () => {
		if (!user) {
			navigate("/login");
			return;
		}
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		formik.submitForm();
		closeModal();
		setMessage("");
	};

	return (
		<div className=" font-inter">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
				enterNeeded={false}
			>
				<form
					onSubmit={formik.handleSubmit}
					className=" min-w-[60vw] md:min-w-[30vw] "
				>
					<textarea
						value={formik.values.message}
						onChange={formik.handleChange("message")}
						onBlur={formik.handleBlur("message")}
						aria-label="Please enter your message"
						type="text"
						placeholder="Enter your message"
						className="form-input h-[10rem]"
					/>
					<div className=" relative mb-2 self-start  ">
						<h1 className=" form-error-text ">
							{formik.touched.message && formik.errors.message}
						</h1>
					</div>
				</form>
			</Modal>
			<div
				onClick={openModal}
				className=" cursor-pointer p-2 rounded-full hover:bg-gray-500 hover:rounded-full flex items-center justify-center dark:text-white text-gray-600 transition-all delay-75 "
			>
				<LuSendHorizonal
					className={`${mssageiconSize ? mssageiconSize : "text-lg"} `}
				/>
			</div>
		</div>
	);
};

export default MessageUser;
