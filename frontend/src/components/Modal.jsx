import React, { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({
	isOpen,
	onClose,
	onContinue,
	children,
	Actiontext,
	enterNeeded,
	isButtonNeeded,
}) {
	useEffect(() => {
		const handleKeyPress = (e) => {
			if (isOpen && e.key === "Escape") {
				onClose();
			}

			if (isOpen && e.key === "Enter" && enterNeeded === undefined) {
				onContinue();
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isOpen, onClose, onContinue]);

	const closeModal = () => {
		onClose();
	};

	const continueAction = () => {
		onContinue();
	};
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget && isOpen) {
			onClose();
		}
	};
	return isOpen
		? createPortal(
				<div
					className={`fixed  font-inter top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-[9999] backdrop-blur-sm`}
					onClick={(e) => handleBackdropClick(e)}
				>
					{/* ... modal content ... */}
					<div
						className=" overflow-y-auto bg-white max-h-[100vh]  text-black dark:text-white p-4 w-[90%] rounded-lg md:w-1/2 flex flex-col items-center gap-6 dark:bg-dark border dark:border-gray-800  "
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-4 overflow-y-auto">{children}</div>
						<div className=" flex flex-col items-center gap-2">
							{isButtonNeeded === undefined && (
								<div className="flex gap-4 items-center">
									<div className="">
										<button
											type="submit"
											className="bg-blue-500 hover:bg-blue-700 rounded-md py-1 text-white px-2"
											onClick={continueAction}
										>
											{Actiontext ? Actiontext : "continue"}
										</button>
									</div>
									<div className="">
										<button
											className="text-red-500 hover:text-red-700"
											onClick={closeModal}
										>
											Close
										</button>
									</div>
								</div>
							)}

							<div className=" text-xs">
								<h4>
									pres ESC key on your keyboard or click on the overlay to
									close
								</h4>
								{enterNeeded === undefined && (
									<h4>pres Enter key to continue</h4>
								)}
							</div>
						</div>
					</div>
				</div>,
				document.body
		  )
		: null;

	// return (
	// 	<div
	// 		className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40  z-[9999] backdrop-blur-sm  ${
	// 			isOpen ? "" : "hidden"
	// 		}`}
	// 		onClick={(e) => handleBackdropClick(e)}
	// 	>
	// 		<div
	// 			className="  bg-white  text-black dark:text-white p-4 w-[90%] rounded-lg md:w-1/2 flex flex-col items-center gap-6 dark:bg-[#171717] border dark:border-gray-800  "
	// 			onClick={(e) => e.stopPropagation()}
	// 		>
	// 			<div className="p-4">{children}</div>
	// 			<div className=" flex flex-col items-center gap-2">
	// 				<div className="flex gap-4 items-center">
	// 					<div className="">
	// 						<button
	// 							type="submit"
	// 							className="bg-blue-500 hover:bg-blue-700 rounded-md py-1 text-white px-2"
	// 							onClick={continueAction}
	// 						>
	// 							Continue
	// 						</button>
	// 					</div>
	// 					<div className="">
	// 						<button
	// 							className="text-red-500 hover:text-red-700"
	// 							onClick={closeModal}
	// 						>
	// 							Close
	// 						</button>
	// 					</div>
	// 				</div>
	// 				<div className=" text-xs">
	// 					<h4>
	// 						pres ESC key on your keyboard or click on the overlay to
	// 						close
	// 					</h4>
	// 					<h4>pres Enter key to continue</h4>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
}

export default Modal;
