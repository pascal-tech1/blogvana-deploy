import React, { Suspense, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

import DashboardSideBar from "../components/DashboardSidebar";
import DashboardNavBAr from "../components/DashboardNavBAr";
import ChangeEmailForm from "../components/ChangeEmailForm";
import UpdatePassword from "../components/UpdatePassword";

import { useDispatch, useSelector } from "react-redux";
import { useClickOutside, useScreenWidth } from "../../customHooks";
import { setSideBarStateInStore } from "../../redux/category/categorySlice";
import { SuspenseLoadingSpinner } from "../../components";

const Layout = () => {
	const dispatch = useDispatch();
	const screenWidth = useScreenWidth();

	const { token, user } = useSelector((store) => store.userSlice);
	const { isSideBarOpen } = useSelector((store) => store.categorySlice);

	const divRef = useRef();
	const iconRef = useRef();
	const isOutsideClicked = useClickOutside(divRef, iconRef);

	// using custom hook to close the open sidebarmenu

	if (!token) {
		return <Navigate to="/login" />;
	}

	if (user && !user?.isAccountVerified) {
		return <Navigate to="/send-email-verification" />;
	}

	useEffect(() => {
		isSideBarOpen &&
			!isOutsideClicked &&
			dispatch(setSideBarStateInStore(false));
	}, [isOutsideClicked]);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "B") {
				dispatch(setSideBarStateInStore(!isSideBarOpen));
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isSideBarOpen]);

	useEffect(() => {
		dispatch(setSideBarStateInStore(screenWidth < 768 ? false : true));
	}, [screenWidth]);

	return (
		<div className=" overflow-hidden font-inter">
			<section className="dashboardLayout transition-all duration-300 ease-in-out grid-cols-12 bg-gray-50  h-screen overflow-y-hidden  dark:bg-lightdark dark:text-slate-300 text-lg md:text-base  ">
				<Suspense fallback={<SuspenseLoadingSpinner />}>
					<ChangeEmailForm />
					<UpdatePassword />
				</Suspense>
				<div
					className={`${
						isSideBarOpen
							? "md:col-start-4 lg:col-start-3  col-start-1"
							: " col-start-1 md:col-start-1"
					}  col-span-full  row-start-1 row-span-1 `}
				>
					<Suspense fallback={<SuspenseLoadingSpinner />}>
						<DashboardNavBAr refOpt={iconRef} screenWidth={screenWidth} />
					</Suspense>
				</div>

				<div
					className={` ${
						isSideBarOpen
							? "col-start-1 md:col-start-4 lg:col-start-3 "
							: " col-start-1 md:col-start-1 "
					}  col-span-full row-start-2 overflow-y-auto px-4  mt-4 md:px-8 scroll-m-0 z-10 scroll-smooth  custom-scrollbar  `}
				>
					<Suspense fallback={<SuspenseLoadingSpinner />}>
						<Outlet />
					</Suspense>
				</div>
				<div
					ref={screenWidth <= 798 ? divRef : null}
					className={`absolute top-12 md:top-0  md:relative 
					 col-start-1 lg:col-span-2 md:col-span-3 row-start-1 row-span-full z-10`}
				>
					<div
						className={`${
							isSideBarOpen ? "flex" : "hidden"
						} bg-white w-[50vw] max-[350px]:w-[80vw] border-r md:border-none shadow-xl dark:border-gray-800 md:w-full overflow-y-hidden overflow-x-hidden h-screen dark:bg-dark md:shadow-sm rounded-md`}
					>
						<Suspense fallback={<SuspenseLoadingSpinner />}>
							<DashboardSideBar />
						</Suspense>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Layout;
