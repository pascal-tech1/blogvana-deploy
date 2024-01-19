export const getUserFromLocalStorage = () => {
	const result = localStorage.getItem("user");
	const user = result ? JSON.parse(result) : null;
	return user;
};

export const addUserToLocalStorage = (userToken, userId) => {
	localStorage.setItem("user", JSON.stringify({ userToken, userId }));
};

export const removeUserFromLocalStorage = () => {
	localStorage.removeItem("user");
};
