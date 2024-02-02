import React, { useState, useRef } from "react";
import { BiDownload, BiReset, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { IoCloudDoneSharp } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import {
	MdCancel,
	MdPreview,
	MdRotateLeft,
	MdRotateRight,
} from "react-icons/md";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useDispatch } from "react-redux";

export const CropImage = ({
	handleFileChange,
	image,
	setImage,
	fileName,
	uploadAction,
	whatUploading,
}) => {
	const [cropData, setCropData] = useState("#");
	const [isPreview, setIsPreview] = useState(false);
	const cropperRef = useRef(null);
	const dispatch = useDispatch();

	const handleCropEnd = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
				fillColor: "transparent",
			});

			// Convert the canvas to a data URL

			setCropData(croppedCanvas.toDataURL("image/jpeg"));
		}
	};
	const handleImageUpload = async () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
				fillColor: "transparent",
			});

			const blobPromise = new Promise((resolve) => {
				croppedCanvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					"image/png",
					1
				);
			});

			const blob = await blobPromise;

			const file = new File([blob], fileName, {
				type: "image/png",
			});

			dispatch(uploadAction({ file, whatUploading }));
			setImage(null);
		}
	};
	const handleDownload = () => {
		const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
			fillColor: "transparent",
		});

		// Create a download link
		const downloadLink = document.createElement("a");
		downloadLink.href = croppedCanvas.toDataURL("image/jpeg");
		downloadLink.download = fileName || "cropped_image.jpeg";

		// Trigger a click event on the download link
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up and remove the download link
		document.body.removeChild(downloadLink);
	};

	const handleZoomIn = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.zoom(0.1);
		}
	};
	const handleZoomOut = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.zoom(-0.1);
		}
	};
	const handleRotateLeft = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.rotate(-10);
		}
	};
	const handleRotateRight = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.rotate(10);
		}
	};
	const handleReset = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.reset();
			handleSetCustomCropping();
		}
	};
	const handleSetCoverCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(5);
		}
	};
	const handleSetProfileCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(1);
			cropperRef.current?.cropper.rounded(true);
		}
	};
	const handleSetCustomCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(NaN);
		}
	};
	return (
		<div className=" z-[1000] fixed left-0 top-10 w-full h-screen   overscroll-y-auto md:flex md:justify-end  bg-black bg-opacity-80 backdrop-blur-sm font-inter   ">
			<div
				className={` ${
					!isPreview && "justify-between"
				}  flex items-center  flex-col bg-white h-[90vh] overscroll-y-auto dark:bg-dark mt-4 dark:border  md:mx-4 dark:border-gray-900 w-[100vw] md:w-[80vw] shadow-lg rounded-lg overflow-auto custom-scrollbar relative  `}
			>
				<button
					onClick={(e) => {
						e.preventDefault();
						setImage(null);
					}}
					className="right-3 absolute top-2 drop-shadow-lg "
				>
					<MdCancel className=" fill-red-400 shadow-md hover:shadow-none text-xl " />
				</button>
				{/* cropper action button */}
				<div className="flex justify-center items-center  gap-8 pt-10 pb-3  px-4  flex-wrap self-stretch">
					<label className="  cursor-pointer ">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleFileChange(e)}
							className=" hidden z-50"
						/>
						<h1 className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3">
							<LuImagePlus />
						</h1>
					</label>
					<button
						onClick={() => setIsPreview(!isPreview)}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<MdPreview />
					</button>
					<button
						onClick={handleDownload}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<BiDownload />
					</button>
					<button
						// onClick={() => uploadCroppedImage()}
						onClick={handleImageUpload}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<IoCloudDoneSharp />
					</button>
				</div>
				{/* cropper image */}
				<div className={`${isPreview && "hidden"}  `}>
					<div className="flex gap-4  md:text-sm   py-4">
						<button
							onClick={handleSetCoverCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex items-center justify-center flex-col"
						>
							cover
						</button>
						<button
							onClick={handleSetProfileCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex flex-col"
						>
							profile
						</button>
						<button
							onClick={handleSetCustomCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex flex-col"
						>
							custom
						</button>
					</div>

					<Cropper
						initialAspectRatio={1}
						src={image}
						ref={cropperRef}
						viewMode={1}
						guides={true}
						minCropBoxHeight={10}
						minCropBoxWidth={10}
						background={false}
						responsive={true}
						checkOrientation={false}
						className="  max-w-[80vw] h-[60vh]  lg:max-w-[60vw] "
						cropend={handleCropEnd}
						restore={true}
					/>
				</div>

				{/* cropper tool bar */}
				<div
					className={`${
						isPreview ? "hidden" : ""
					}  flex gap-4 flex-wrap   bg-slate-200 dark:bg-lightdark drop-shadow-md border dark:border-gray-900 px-8 py-2 mb-4 rounded-md items-center mt-4  text-lg `}
				>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleZoomIn}
					>
						<BiZoomIn className=" text-2xl" />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleZoomOut}
					>
						<BiZoomOut className=" text-2xl" />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleRotateLeft}
					>
						<MdRotateLeft className=" text-2xl" />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleRotateRight}
					>
						<MdRotateRight className=" text-2xl" />
					</button>
					<button
						onClick={handleReset}
						className=" shadow-md hover:shadow-none rounded-md px-1"
					>
						<BiReset className=" text-2xl" />
					</button>
				</div>
				{/* cropped image preview */}

				{/* Canvas to display cropped image */}
				<div className={` ${!isPreview && "hidden "}  my-auto `}>
					<img src={cropData} alt="cropped" className="  max-h-[50vh]" />
				</div>
			</div>
		</div>
	);
};

export default CropImage;
