import React, { useEffect, useState } from "react";
import { ClearSearch, Modal, Spinner } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import {
	createCategory,
	deleteCategory,
	editCategory,
	fetchAllCategorys,
	setIsCategoryEdting,
} from "../../redux/category/categorySlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDelete, MdDoneAll, MdEdit } from "react-icons/md";

import { toast } from "react-toastify";
import {
	setIsSearchBArNeeded,
	setSearchTermInStore,
} from "../../redux/user/userSlice";
import AdminCategory from "../component/AdminCategory";

const AdminAllCategory = () => {
	useEffect(() => {
		dispatch(setIsSearchBArNeeded(true));
	}, []);
	const { dashboardSearchTerm } = useSelector((store) => store.userSlice);
	const dispatch = useDispatch();
	const {
		allCategory,
		categorystatus,
		isCategoryEditing,
		activeEditingCategory,
	} = useSelector((store) => store.categorySlice);
	const [checkedItems, setCheckedItemId] = useState([]);

	useEffect(() => {
		dispatch(fetchAllCategorys());
	}, [dashboardSearchTerm]);

	const formSchema = Yup.object().shape({
		activeEditingCategory: Yup.string()
			.required("Category is Required.")
			.min(2, "Category is too short - should be 2 chars minimum."),
	});

	const formik = useFormik({
		initialValues: {
			activeEditingCategory: activeEditingCategory,
		},
		validationSchema: formSchema,
		onSubmit: (values) => {
			isCategoryEditing
				? dispatch(
						editCategory({
							id: activeEditingCategory._id,
							title: values.activeEditingCategory,
						})
				  )
				: dispatch(createCategory(values));
			formik.resetForm({
				values: {
					activeEditingCategory: "",
				},
			});
		},
	});
	useEffect(() => {
		formik.setValues({
			activeEditingCategory: activeEditingCategory.title,
		});
	}, [activeEditingCategory]);

	const tableItems = allCategory?.map((category) => category?._id);
	// handling checks
	const handleCheckedItemcsChange = (_id) => {
		if (_id === "allCategory") {
			if (checkedItems.length === tableItems.length) {
				setCheckedItemId([]);
			} else {
				setCheckedItemId(tableItems);
			}
		} else {
			checkedItems.includes("allCategory") &&
				setCheckedItemId((prev) =>
					prev.filter((item) => item !== "allCategory")
				);
			if (checkedItems.includes(_id)) {
				setCheckedItemId((prev) =>
					prev.filter((prevId) => prevId !== _id)
				);
			} else {
				setCheckedItemId((prev) => [...prev, _id]);
			}
		}
	};

	// modal controll
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => {
		if (checkedItems.length > 0) {
			setIsModalOpen(true);
			setCheckedItemId((prev) =>
				prev.filter((item) => item !== "User Id")
			);
		} else {
			toast.error("select category to delete");
		}
		formik.resetForm({
			values: {
				activeEditingCategory: "",
			},
		});
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const continueAction = () => {
		setCheckedItemId((prev) => prev.filter((item) => item !== "User Id"));
		closeModal();
		if (checkedItems.length === 0) {
			toast.warning("Please Select category To delete");
			return;
		}

		dispatch(deleteCategory({ categoryIds: checkedItems }));
	};
	const handleClearSearch = () => {
		dispatch(setSearchTermInStore(""));
	};

	return (
		<section className="flex  flex-col py-3  items-center h-screen font-inter dark:bg-dark rounded-lg p-4">
			{/* clear search */}
			<ClearSearch
				searchQuery={dashboardSearchTerm}
				handleClearSearch={handleClearSearch}
			/>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onContinue={continueAction}
			>
				<div>
					<h1>
						Do you want to continue to delete {checkedItems.length}{" "}
						Category
					</h1>
					<h3>Remember this Action cannot be undone</h3>
				</div>
			</Modal>
			<h2 className=" text-gray-900 font-medium dark:text-colorPrimary   text-center">
				All Categories
			</h2>
			<div className="flex items-center justify-between w-full px-11 mb-2 mt-4">
				{isCategoryEditing && (
					<button
						onClick={openModal}
						className=" flex gap-1 items-center  py-[0.15] rounded-l hover:text-red-300  text-red-400 outline-none"
					>
						<MdDelete />
						delete
					</button>
				)}
				{isCategoryEditing && (
					<div className="flex items-center gap-1">
						<input
							type="checkbox"
							name="check"
							id="allCategoryId"
							checked={checkedItems.length === tableItems.length}
							onChange={() => handleCheckedItemcsChange("allCategory")}
							className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
						/>
						<h3>select all</h3>
					</div>
				)}
				<button
					onClick={() => {
						dispatch(setIsCategoryEdting(!isCategoryEditing));
						isCategoryEditing && setCheckedItemId([]);
					}}
					className={` text-colorPrimary  hover:text-blue-600 drop-shadow-md hover:drop-shadow-none ${
						!isCategoryEditing && "ml-auto"
					}  `}
				>
					{isCategoryEditing ? (
						<div className="flex items-center gap-1">
							<MdDoneAll /> done
						</div>
					) : (
						<div className="flex gap-1 items-center">
							<MdEdit /> Edit
						</div>
					)}
				</button>
			</div>
			<div className=" h-full flex flex-col gap-6 px-6  ">
				<div className="border dark:border-gray-800 rounded-lg px-2 py-2 mx-3 drop-shadow-md  h-[50%] overflow-y-auto custom-scrollbar dark:bg-lightdark">
					<AdminCategory
						checkedItems={checkedItems}
						handleCheckedItemcsChange={handleCheckedItemcsChange}
						setCheckedItemId={setCheckedItemId}
						allCategory={allCategory}
						className="flex justify-between gap-2 flex-wrap"
					/>
				</div>
				<form
					onSubmit={formik.handleSubmit}
					className=" self-center flex flex-col gap-3"
				>
					<div>
						<input
							value={formik.values.activeEditingCategory}
							onChange={formik.handleChange("activeEditingCategory")}
							onBlur={formik.handleBlur("activeEditingCategory")}
							placeholder="Enter category"
							type="text"
							name="category"
							id="category"
							className="border  px-4 py-2 rounded-lg outline-none dark:bg-dark bg-gray-100 focus:border-b-gray-300 dark:focus:border-b-gray-600 dark:border-gray-800 border-gray-200  "
						/>
						<div className=" relative mb-2 self-start">
							<h1 className=" form-error-text ">
								{formik.touched.activeEditingCategory &&
									formik.errors.activeEditingCategory}
							</h1>
						</div>
					</div>
					{categorystatus === "loading" ? (
						<Spinner />
					) : isCategoryEditing ? (
						<input
							type="submit"
							value="Edit"
							className=" px-2 py-1 bg-colorPrimary hover:bg-blue-300 text-white drop-shadow-md rounded-lg self-center hover:drop-shadow-none cursor-pointer"
						/>
					) : (
						<input
							type="submit"
							value="submit"
							className=" px-2 py-1 bg-colorPrimary hover:bg-blue-300 text-white drop-shadow-md rounded-lg self-center hover:drop-shadow-none cursor-pointer"
						/>
					)}
				</form>
			</div>
		</section>
	);
};

export default AdminAllCategory;
