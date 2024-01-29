const express = require("express");
const {
	createCategoryCtrl,
	fetchAllCategorysCtrl,
	fetchSingleCategorysCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");
const testAuthMiddleWare = require("../../middlewares/authentication/testUserAuth");

const categoryRoutes = express.Router();
categoryRoutes.get("/", fetchAllCategorysCtrl);
categoryRoutes.post(
	"/create",
	authMiddleWare,
	testAuthMiddleWare,
	createCategoryCtrl
);

categoryRoutes.get(
	"/:categoryId",
	authMiddleWare,
	fetchSingleCategorysCtrl
);
categoryRoutes.put(
	"/edit/:categoryId",
	authMiddleWare,
	testAuthMiddleWare,
	updateCategoryCtrl
);
categoryRoutes.put(
	"/delete",
	authMiddleWare,
	testAuthMiddleWare,
	deleteCategoryCtrl
);
module.exports = categoryRoutes;
