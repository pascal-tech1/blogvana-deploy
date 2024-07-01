import axios from "axios";

const customFetch = axios.create({
	 // baseURL: "https://blogvana-backend.onrender.com/api",
	baseURL: "https://blogvana-backend-git-main-pascals-projects-4016dc21.vercel.app/api",
	
});

export default customFetch;
// just for local hist development
// const customFetch = axios.create({
// 	baseURL: " http://localhost:5000/api",
// });

// export default customFetch;
