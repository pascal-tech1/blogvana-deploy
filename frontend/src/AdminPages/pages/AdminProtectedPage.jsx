import React, { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Error from "../../pages/Error";

const AdminProtectedPage = () => {
	const { user, token } = useSelector((store) => store.userSlice);
	if (!token) {
		return <Navigate to="/login" />;
	}

	if (user && !user?.isAdmin) {
		return <Error />;
	}
	return (
		<div>
			<Outlet />
		</div>
	);
};

export default AdminProtectedPage;
