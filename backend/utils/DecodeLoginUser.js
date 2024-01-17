const expressAsyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
const User = require("../model/user/User");

// '''''''''''''''''''''''''''''''''''''''''
//     creating a midddle ware that will hadnle user authorization
// '''''''''''''''''''''''''''''''''''''''''''''

const decodeToken = async (token) => {
	
	// checking if the user entered header for authorization
	try {
		//   verify the user entered token with jwt
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		const userId = decodedToken?.id;
		// found the user with the enterd token and return it without the password
		const foundUser = await User.findById(userId).select("-password");

		return foundUser;
	} catch (error) {
		throw new Error("user not found login again");
	}
};

module.exports = decodeToken;
