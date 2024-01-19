import React, { useEffect, useState } from "react";
import {
	Category,
	CategoryListSkeleton,
	ContactMe,
	PostSearch,
	TrendingPost,
	TrendingPostSkeleton,
} from "../components";
import AllPost from "./AllPost";
import { useDispatch, useSelector } from "react-redux";

import {
	fetchPostByCategory,
	fetchTrendingPost,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

import { useNavigate } from "react-router-dom";
import { MdCategory, MdExpandMore } from "react-icons/md";
import { IoIosTrendingUp } from "react-icons/io";
import { useScreenWidth } from "../customHooks";

const Home = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { trendingPost, trendingPostStatus } = useSelector(
		(store) => store.allPostSlice
	);
	const { allCategory, status } = useSelector(
		(store) => store.categorySlice
	);

	let allCategoryArray = allCategory.map((category) => category.title);
	allCategoryArray = ["all", ...allCategoryArray];

	const [numberOfDisplayCategory, setNumberOfDisplayCategory] =
		useState(10);
	const screenWidth = useScreenWidth();
	useEffect(() => {
		if (trendingPost?.length > 0 || screenWidth <= 768) return;
		dispatch(fetchTrendingPost(4));
		console.log("i have run");
	}, []);

	const handleSelected = (filter) => {
		dispatch(setFetchFirstCategory(filter));
		dispatch(fetchPostByCategory());
		navigate("/");
	};
	const handleAddMoreCategoryToDisplay = () => {
		setNumberOfDisplayCategory((prev) => prev + 10);
	};

	return (
		<div className={`font-inter text-lg lg:text-base `}>
			<div className=" md:grid grid-cols-5 gap-10 ">
				{/* right section */}
				<main className=" col-span-3  ">
					<div className="">
						<PostSearch />

						<AllPost />
					</div>
				</main>
				{/* left section */}

				<div className="hidden py-4 md:flex flex-col font-inter justify-between col-start-4 col-span-full px-6  stickyRight custom-scrollbar border-l dark:bg-dark  dark:border-l-lightdark  !h-[88vh] ">
					<div className=" flex flex-col gap-4 ">
						<section>
							<div className=" dark:text-slate-200 mb-2 md:text-sm min-[800px]:text-base flex gap-3 items-center">
								<h1 className="border font-semibold rounded-full p-[2px] ">
									<IoIosTrendingUp />
								</h1>
								<h1 className=" font-semibold">Trending on BlogVana </h1>
							</div>

							{trendingPostStatus === "loading" ? (
								<TrendingPostSkeleton />
							) : (
								trendingPost?.slice(0, 3).map((post, index) => {
									return (
										<div key={index} className=" pr-[2px] my-6 ">
											{/* The post info's including the user info */}
											<TrendingPost post={post} index={index} />
										</div>
									);
									//
								})
							)}
						</section>

						<section className="flex justify-center flex-col">
							<div className=" dark:text-slate-200 md:text-sm min-[800px]:text-base flex gap-3 items-center mb-4">
								<h1 className="border font-semibold rounded-full p-[2px]">
									<MdCategory className="" />
								</h1>
								<h1 className="font-semibold ">More interesting topics</h1>
							</div>
							{status === "loading" ? (
								<CategoryListSkeleton />
							) : (
								<Category
									allCategory={allCategoryArray.slice(
										0,
										numberOfDisplayCategory
									)}
									handleSelected={handleSelected}
								/>
							)}

							{numberOfDisplayCategory <= allCategoryArray.length && (
								<button
									onClick={handleAddMoreCategoryToDisplay}
									aria-label="view more categories"
									className=" bg-blue-500 rounded-md px-1 mt-3 hover:bg-blue-600 shadow-md hover:shadow-none self-center text-white my-2"
								>
									<MdExpandMore className=" text-2xl" />
								</button>
							)}
						</section>
					</div>
					<section className=" text-sm self-center justify-self-end dark:text-slate-200 mt-10 ">
						<ContactMe copyrightNeeded={true} nameNeeded={true} />
					</section>
				</div>
			</div>
		</div>
	);
};

export default Home;
