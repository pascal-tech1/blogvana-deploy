const express = require("express");
const {
	createCategoryCtrl,
	fetchAllCategorysCtrl,
	fetchSingleCategorysCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const categoryRoutes = express.Router();
categoryRoutes.get("/", fetchAllCategorysCtrl);
categoryRoutes.post("/create", authMiddleWare, createCategoryCtrl);

categoryRoutes.get(
	"/:categoryId",
	authMiddleWare,
	fetchSingleCategorysCtrl
);
categoryRoutes.put(
	"/edit/:categoryId",
	authMiddleWare,
	updateCategoryCtrl
);
categoryRoutes.put("/delete", authMiddleWare, deleteCategoryCtrl);
module.exports = categoryRoutes;
