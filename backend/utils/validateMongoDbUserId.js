const mongoose = require("mongoose");

const validateMongoDbUserId = (userId) => {
  const isUserIdValid = mongoose.Types.ObjectId.isValid(userId);
  if (!isUserIdValid) throw new Error("The ID is not valid or found");
};




module.exports = validateMongoDbUserId