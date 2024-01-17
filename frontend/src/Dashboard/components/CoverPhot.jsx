import React, { useState } from "react";
import { BiCamera } from "react-icons/bi";
import { uploadProfilePhoto } from "../../redux/user/userSlice";

import { useSelector } from "react-redux";
import { LazyLoadImg, Modal, Spinner } from "../../components";
import CropImage from "../pages/CropImage";

const CoverPhoto = ({ user }) => {
	const [image, setImage] = useState(null);
	const [fileName, setFileName] = useState("blogVanaImage");
	const { profilePictureUploadStatus, whatUploading } = useSelector(
		(store) => store.userSlice
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleFileChange = (e) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;

			if (files[0].name) setFileName(files[0].name);
			else setFileName("blogVanaImage");
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
		};
		reader.readAsDataURL(files[0]);
	};
	const openModal = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className=" w-full relative font-inter">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				isButtonNeeded={false}
			>
				<LazyLoadImg
					backgroundClassName={
						"   w-[85vw] md:w-[47vw]  relative rounded-md"
					}
					imgClassName={"absolute inset-0 w-full h-full rounded-md "}
					originalImgUrl={user?.coverPhoto}
					blurImageStr={user?.blurCoverPhoto}
					optimizationStr={"q_auto,f_auto,w_1000"}
				/>
			</Modal>
			{image && (
				<CropImage
					image={image}
					handleFileChange={handleFileChange}
					setImage={setImage}
					fileName={fileName}
					uploadAction={uploadProfilePhoto}
					whatUploading={"coverPhoto"}
				/>
			)}
			<div onClick={() => openModal()} className=" cursor-pointer">
				<LazyLoadImg
					backgroundClassName={"   w-full h-full  relative rounded-md"}
					imgClassName={"absolute inset-0 w-full h-full rounded-md "}
					originalImgUrl={user?.coverPhoto}
					blurImageStr={user?.blurCoverPhoto}
					optimizationStr={"q_auto,f_auto,w_1000"}
					paddingBottom={"20vh"}
				/>
			</div>

			{profilePictureUploadStatus === "loading" &&
			whatUploading === "coverPhoto" ? (
				<div className="absolute bottom-0 cursor-pointer right-0 text-center px-1 flex items-center justify-center dark:bg-colorPrimary dark:focus:bg-blue-500 bg-blue-200 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-8 w-8 rounded-full">
					<Spinner />
				</div>
			) : (
				<label className=" absolute bottom-0 cursor-pointer right-0 text-center px-1 flex items-center justify-center  dark:bg-colorPrimary dark:hover:bg-blue-500 bg-blue-400 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-8 w-8 rounded-full ">
					<input
						onChange={(e) => handleFileChange(e)}
						type="file"
						name="image"
						accept="image/*"
						id="image"
						className="hidden z-50"
					/>

					<BiCamera className=" text-4xl fill-white -rotate-3" />
				</label>
			)}
		</div>
	);
};

export default CoverPhoto;
