import React, { useState } from "react";
import { BiCamera } from "react-icons/bi";
import { uploadProfilePhoto } from "../../redux/user/userSlice";
import { LazyLoadImg, Modal, Spinner } from "../../components";
import { useSelector } from "react-redux";
import CropImage from "../pages/CropImage";
const ProfilePhoto = ({ user }) => {
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

			if (files[0]?.name) setFileName(files[0]?.name + new Date());
			else setFileName("blogVanaImage");
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
			setFileName(
				fileName !== "blogVanaImage" && fileName + "blogVanaImage"
			);
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
		<div className=" w-full relative">
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				isButtonNeeded={false}
			>
				
				<LazyLoadImg
					backgroundClassName={"   w-[85vw] md:w-[47vw]  relative rounded-md"}
					imgClassName={"absolute inset-0 w-full h-full rounded-md "}
					originalImgUrl={user?.profilePhoto}
					blurImageStr={user?.blurProfilePhoto}
					optimizationStr={"q_auto,f_auto,w_600"}
				/>
			</Modal>
			{image && (
				<CropImage
					image={image}
					handleFileChange={handleFileChange}
					setImage={setImage}
					fileName={fileName}
					uploadAction={uploadProfilePhoto}
					whatUploading={"profilePhoto"}
				/>
			)}

			<div onClick={() => openModal()} className=" cursor-pointer font-inter absolute -mt-[10%] rounded-full border border-blue-600">
				<LazyLoadImg
					backgroundClassName={
						"  rounded-full w-[7rem] lg:w-[8rem]  h-[7rem] lg:h-[8rem]  relative"
					}
					imgClassName={
						"absolute inset-0 w-full h-full  object-cover rounded-full "
					}
					originalImgUrl={user?.profilePhoto}
					blurImageStr={user?.blurProfilePhoto}
					optimizationStr={"q_auto,f_auto,w_200"}
				/>
			</div>

			{profilePictureUploadStatus === "loading" &&
			whatUploading === "profilePhoto" ? (
				<Spinner />
			) : (
				<label className=" absolute cursor-pointer  text-center px-1 flex items-center justify-center bg-blue-400 dark:bg-colorPrimary dark:hover:bg-blue-500 drop-shadow-md hover:drop-shadow-sm  hover:bg-blue-600 transition-all delay-75  h-8 w-8 rounded-full ">
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

export default ProfilePhoto;
