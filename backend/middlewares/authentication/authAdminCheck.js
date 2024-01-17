const expressAsyncHandler = require("express-async-handler");

// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle admin user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const adminMiddleWare = expressAsyncHandler(async (req, res, next) => {
	if (!req.user.isAdmin) {
		throw new Error("only admin allow");
	}
	next();
});

module.exports = adminMiddleWare;
