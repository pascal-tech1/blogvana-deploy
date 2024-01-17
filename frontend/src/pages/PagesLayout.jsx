import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

const PagesLayout = () => {
	return (
		<section className=" font-inter dashboardLayout  dark:bg-dark  dark:text-slate-400">
			<div className=" row-start-1 row-span-1  ">
				<NavBar />
			</div>

			<div className="row-start-2 mt-1 row-span-full overflow-y-auto custom-scrollbar w-full z-10 px-3 md:px-8 ">
				<Outlet />
			</div>
		</section>
	);
};

export default PagesLayout;
