import React, { useState } from "react";

const Tooltip = ({ children, info, relative }) => {
	const [isVisible, setIsVisible] = useState(false);

	const showTooltip = () => {
		setIsVisible(true);
	};

	const hideTooltip = () => {
		setIsVisible(false);
	};
	

	return (
		<div
			className={`${relative ? "relative" : ""}`}
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
		>
			<div className=" cursor-pointer">{children}</div>
			{isVisible && (
				<div className=" shadow-md whitespace-normal z-50 max-w-[10rem] md:max-w-[30rem] text-sm rounded-md absolute  -top-[2rem] dark:bg-gray-800 bg-gray-300 text-black dark:text-white  px-2 py-3 ">
					{info}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
