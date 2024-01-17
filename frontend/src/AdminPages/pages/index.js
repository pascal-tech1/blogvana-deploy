import { lazy } from "react";

const AllUsersPost = lazy(() => import("./AllUsersPosts"));
const AllUsers = lazy(() => import("./AllUsers"));
const AdminAllCategory = lazy(() => import("./Category"));

const AdminProtectedPage = lazy(() => import("./AdminProtectedPage"));
export { AllUsersPost, AllUsers, AdminAllCategory, AdminProtectedPage };
