import React, { Suspense, lazy, useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {
	Home,
	Login,
	Register,
	SinglePost,
	VerifyEmail,
	Error,
	PagesLayout,
} from "./pages";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { loginUserWithToken } from "./redux/user/userSlice";

import {
	InitialSpinner,
	LoadingSpinner,
	SuspenseLoadingSpinner,
} from "./components";

import { useDarkMode } from "./customHooks";

import {
	AdminAllCategory,
	AdminProtectedPage,
	AllUsers,
	AllUsersPost,
} from "./AdminPages/pages";
import {
	CreatePost,
	Followers,
	Following,
	Layout,
	Messages,
	MyPosts,
	PostHistory,
	ProfileView,
	SavedPost,
	Stats,
	WhoViewedMyProfile,
	CropImage,
	ConfirmUserEmail,
	UserPage,
	PasswordReset,
} from "./Dashboard/pages";

const App = () => {
	const { token, user, loginUserTokenStatus } = useSelector(
		(store) => store.userSlice
	);

	useEffect(() => {
		if (token) {
			dispatch(loginUserWithToken());
		}
	}, []);
	const theme = localStorage.getItem("theme");
	const dispatch = useDispatch();
	const isSystemInDakMode = useDarkMode();

	useEffect(() => {
		if (!theme && isSystemInDakMode) {
			document.documentElement.classList.add("dark");
		} else if (!theme && !isSystemInDakMode) {
			document.documentElement.classList.remove("dark");
		} else if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else if (theme === "light") {
			document.documentElement.classList.remove("dark");
		}
	}, [theme, isSystemInDakMode]);

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.key === "Escape") {
			}
			if (e.key === "Enter") {
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<PagesLayout />}>
					<Route path="/" element={<Home />} />
					<Route
						path="login"
						element={token ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="register"
						element={token ? <Navigate to="/" /> : <Register />}
					/>
					<Route path="/image" element={<CropImage />} />
					<Route path="/single-post/:id" element={<SinglePost />} />
					<Route
						path="/reset-password/:token"
						element={<PasswordReset />}
					/>
					<Route
						path="/profile/:userId"
						element={
							token ? (
								<Suspense fallback={<SuspenseLoadingSpinner />}>
									<UserPage />
								</Suspense>
							) : (
								<Login />
							)
						}
					/>

					<Route
						path="/confirm-sent-email/:token"
						element={<ConfirmUserEmail />}
					/>
					<Route
						path="/send-email-verification"
						element={<VerifyEmail />}
					/>
					<Route path="*" element={<Error />} />
				</Route>

				<Route
					element={
						<Suspense fallback={<SuspenseLoadingSpinner />}>
							<Layout />
						</Suspense>
					}
				>
					<Route index path="stats" element={<Stats />} />
					<Route path="profile-details" element={<ProfileView />} />
					<Route path="profile-message" element={<Messages />} />
					<Route path="profile-views" element={<WhoViewedMyProfile />} />
					<Route path="post-my-posts" element={<MyPosts />} />
					<Route path="post-Create" element={<CreatePost />} />
					<Route path="post-history" element={<PostHistory />} />
					<Route path="post-Saved" element={<SavedPost />} />
					<Route path="follows-followers" element={<Followers />} />
					<Route path="follows-following" element={<Following />} />

					<Route
						element={
							<Suspense fallback={<SuspenseLoadingSpinner />}>
								<AdminProtectedPage />
							</Suspense>
						}
					>
						<Route path="Admin-all-users" element={<AllUsers />} />
						<Route path="Admin-all-Posts" element={<AllUsersPost />} />
						<Route path="Admin-category" element={<AdminAllCategory />} />
					</Route>
				</Route>
			</Routes>
			<ToastContainer
				position="top-right"
				draggable={true}
				className={` text-xs max-w-fit font-inter py-0 text-black dark:text-white `}
				theme={theme ? theme : isSystemInDakMode ? "dark" : "light"}
			/>
		</BrowserRouter>
	);
};

export default App;
