const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
	try {
		const objectId = new ObjectId(id);
		return objectId.toString() === id;
	} catch (error) {
		return false;
	}
}

module.exports = isValidObjectId;
