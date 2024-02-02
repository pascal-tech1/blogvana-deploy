import axios from "axios";

// const customFetch = axios.create({
// 	baseURL: "https://blogvana-backend.onrender.com/api",
// });

// export default customFetch;

const customFetch = axios.create({
	baseURL: " http://localhost:5000/api",
});

export default customFetch;
