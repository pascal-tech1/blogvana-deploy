const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const jwt = require("jsonwebtoken");

// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const authMiddleWare = expressAsyncHandler(async (req, res, next) => {
	// checking if the user entered header for authorization

	const enteredHeader = req.headers.authorization;

	if (!enteredHeader)
		throw new Error("Request unAuthorize Enter a valid Token");
	if (!enteredHeader?.startsWith("Bearer"))
		throw new Error("Request header must start with Bearer");

	const enteredToken = enteredHeader?.split(" ")[1];
	if (!enteredToken) throw new Error("Request must contain a valid token");
	let foundUser;
	try {
		//   verify the user entered token with jwt
		const decodedToken = jwt.verify(enteredToken, process.env.JWT_KEY);
		const userId = decodedToken?.id;
		// found the user with the enterd token and return it without the password
		foundUser = await User.findById(userId);
	} catch (error) {
		console.log(error.Error);
		throw new Error("invalid token or Expired login Again");
	}
	if (foundUser.isBlocked) {
		throw new Error(
			" you can't access this resource, your Account is blocked contact Admin"
		);
	}

	req.user = foundUser;

	next();
});

module.exports = authMiddleWare;
