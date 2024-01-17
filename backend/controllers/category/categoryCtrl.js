const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
// '''''''''''''''''''''''''''''''''''''''''
//   creating a category
// '''''''''''''''''''''''''''''''''''''''''''

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	let category = req?.body.activeEditingCategory;

	const categoryAlreadyExist = await Category.findOne({
		title: category.toLocaleLowerCase(),
	});

	if (categoryAlreadyExist) throw new Error("Category Already exist");

	const loginAdmin = req?.user;

	try {
		const createdCategory = await Category.create({
			user: loginAdmin?._id,
			title: category.toLocaleLowerCase(),
		});

		res
			.status(201)
			.json({ message: `category ${category} `, createdCategory });
	} catch (error) {
		res.json({ message: "faliled to create Category" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch all categorys
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchAllCategorysCtrl = expressAsyncHandler(async (req, res) => {
	const { searchTerm } = req.query;

	const regexPattern = new RegExp(`.*${searchTerm}.*`, "i");
	let searchQuery;

	if (searchTerm) {
		searchQuery = { title: { $regex: regexPattern } };
	} else {
		searchQuery = {};
	}

	try {
		const allCategory = await Category.find(searchQuery).select("title");
		res.status(200).json({ status: "success", allCategory });
	} catch (error) {
		res
			.status(500)
			.json({ message: "faliled to fetch All Category try again" });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   fetch single category
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchSingleCategorysCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;
	validateMongoDbUserId(categoryId);
	try {
		const category = await Category.findById(categoryId);
		res.json(category);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update category cocntroller
// ''''''''''''''''''''''''''''''''''''''''''''
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req.params;
	const { title } = req.body;

	// // check if title exist

	const titleExist = await Category.findOne({ title });
	if (titleExist) {
		throw new Error("Category with this title exist try a different one");
	}

	const categoryAlreadyExist = await Category.findOne({ _id: categoryId });

	if (!categoryAlreadyExist) {
		throw new Error("No category found try again");
	}
	if (categoryAlreadyExist.title === title) {
		throw new Error("category is the same make changes");
	}
	validateMongoDbUserId(categoryId);
	try {
		const category = await Category.findByIdAndUpdate(
			categoryId,
			{
				title:
					title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
			},
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			message: `Category ${categoryAlreadyExist.title} is successfully modified to ${title}`,
			category,
		});
	} catch (error) {
		res.status(500).json({ status: "failed", message: error.messasge });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   delete category controller
// ''''''''''''''''''''''''''''''''''''''''''''
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryIds } = req.body;

	try {
		const deletedCategory = await Category.deleteMany({
			_id: { $in: categoryIds },
		});

		res.status(200).json({
			message: `successfully deleted ${deletedCategory.deletedCount} category`,
			categoryIds,
		});
	} catch (error) {
		res.status(400).json({ message: "failed to delete category" });
	}
});

module.exports = {
	createCategoryCtrl,
	fetchAllCategorysCtrl,
	fetchSingleCategorysCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
};
