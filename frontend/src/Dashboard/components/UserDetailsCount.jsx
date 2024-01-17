import React from "react";

const UserDetailsCount = ({ count, text, children }) => {
	return (
		<div className=" bg-white dark:bg-dark  drop-shadow-sm  items-center pl-4 flex py-2 space-x-4 font-inter rounded-md ">
			<div className=" ">{children}</div>
			<div>
				<h1 className=" font-bold">{count}</h1>
				<h3 className=" font-light">{text}</h3>
			</div>
		</div>
	);
};

export default UserDetailsCount;
