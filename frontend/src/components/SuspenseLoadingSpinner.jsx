import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

const SuspenseLoadingSpinner = () => {
	return (
		<div className=" grid bg-white dark:bg-dark place-content-center place-items-center h-screen">
			<LoadingSpinner />
		</div>
	);
};

export default SuspenseLoadingSpinner;
