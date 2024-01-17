import React from "react";

export const TrendingPostSkeleton = () => {
	return (
		<div
			role="status"
			className="max-w-md p-4 space-y-8    rounded shadow animate-pulse md:p-6 "
		>
			<div className="flex items-center gap-4">
				<div className="  gap-1 md:hidden lg:flex items-center text-3xl -mt-10 font-bold text-gray-200 dark:text-lightdark ">
					<h1>0</h1>
					<h1>{1}</h1>
				</div>
				<div className=" flex flex-col gap-2">
					<div className=" flex gap-1 items-center">
						<svg
							className=" w-8 h-8 me-3 text-gray-200 dark:text-gray-700"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
						</svg>
						<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					</div>
					<div className=" flex flex-col gap-2">
						<div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
						<div className="w-[10rem] h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="  gap-1 md:hidden lg:flex items-center text-3xl -mt-10 font-bold text-gray-200 dark:text-lightdark ">
					<h1>0</h1>
					<h1>{2}</h1>
				</div>
				<div className=" flex flex-col gap-2">
					<div className=" flex gap-1 items-center">
						<svg
							className=" w-8 h-8 me-3 text-gray-200 dark:text-gray-700"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
						</svg>
						<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					</div>
					<div className=" flex flex-col gap-2">
						<div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
						<div className="w-[10rem] h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="  gap-1 md:hidden lg:flex items-center text-3xl -mt-10 font-bold text-gray-200 dark:text-lightdark ">
					<h1>0</h1>
					<h1>{3}</h1>
				</div>
				<div className=" flex flex-col gap-2">
					<div className=" flex gap-1 items-center">
						<svg
							className=" w-8 h-8 me-3 text-gray-200 dark:text-gray-700"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
						</svg>
						<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
					</div>
					<div className=" flex flex-col gap-2">
						<div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
						<div className="w-[10rem] h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
				</div>
			</div>
		</div>
	);
};
