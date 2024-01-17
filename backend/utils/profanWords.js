// creating an instance of the bad words

const Filter = require("bad-words");

filter = new Filter();
const checkProfanity = (string) => {
	return filter.isProfane(string);
};
module.exports = checkProfanity;
