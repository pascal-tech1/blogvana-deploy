const filterUserCriteria = (filter) => {
	if (filter === "Newest User") return { createdAt: -1 };
	if (filter === "Oldest User") return { createdAt: 1 };
	if (filter === "highest Followers") return { followersCount: -1 };
	if (filter === "lowest followers") return { followersCount: 1 };
	if (filter === "highest No Post") return { postsCount: -1 };
	if (filter === "lowest No Post") return { postsCount: 1 };
	if (filter === "highest Following") return { followingCount: -1 };
	if (filter === "lowest Following") return { followingCount: 1 };

	return {}; // Default case: no sorting
};

const filterCriteria = (filter) => {
	if (filter === "Highest likes") return { likesCount: -1 };
	if (filter === "Lowest likes") return { likesCount: 1 };
	if (filter === "Latest") return { createdAt: -1 };
	if (filter === "Oldest") return { createdAt: 1 };
	if (filter === "A-Z") return { title: 1 };
	if (filter === "Z-A") return { title: -1 };
	if (filter === "Lowest view") return { numViews: 1 };
	if (filter === "Highest view") return { numViews: -1 };
	if (filter === "Highest dislikes") return { disLikesCount: -1 };
	if (filter === "Lowest dislikes") return { disLikesCount: 1 };
	if (filter === "Category") return { category: 1 };

	return {}; // Default case: no sorting
};

module.exports = { filterUserCriteria, filterCriteria };
