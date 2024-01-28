const expressAsyncHandler = require("express-async-handler");

// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle admin user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const testAuthMiddleWare = expressAsyncHandler(async (req, res, next) => {
	if (req?.user?.email === "test@blogvana.com") {
		console.log("im here test user");
		throw new Error(
			"sorry test user is not allowed to perform this operation"
		);
	}
	next();
});

module.exports = testAuthMiddleWare;
