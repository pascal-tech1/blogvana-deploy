import axios from "axios";

const customFetch = axios.create({
	// baseURL: "https://blogvana-backend.onrender.com/api",
	baseURL: "https://blogvana-deploy-production.up.railway.app/api",
	
});

export default customFetch;

// const customFetch = axios.create({
// 	baseURL: " http://localhost:5000/api",
// });

// export default customFetch;
