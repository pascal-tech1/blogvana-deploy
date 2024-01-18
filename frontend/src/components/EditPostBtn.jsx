import {
	fetchPostToBeEdited,
	setIsEditingPost,
} from "../redux/post/singlePostSlice";
import { Spinner } from ".";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const EditPostBtn = ({ postId }) => {
	const { postEditingFetchingStatus } = useSelector(
		(store) => store.singlePostSlice
	);
	const [clickId, setClickId] = useState();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleEditPost = async () => {
		dispatch(setIsEditingPost(true));
		setClickId(postId);
		const isPostFetch = await dispatch(fetchPostToBeEdited(postId));
		if (isPostFetch) {
			navigate("/post-Create");
		}
	};
	return (
		<div className=" font-inter">
			<button
				onClick={handleEditPost}
				className="border self-center font-inter px-1 hover:bg-blue-400 text-center  hover:text-white rounded-md transition-all delay-75 border-blue-400 "
			>
				{postEditingFetchingStatus === "loading" && clickId === postId ? (
					<Spinner className="h-[1.2rem] w-[1.2rem] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
				) : (
					<h3 className="text-sm">Edit</h3>
				)}
			</button>
		</div>
	);
};

export default EditPostBtn;
