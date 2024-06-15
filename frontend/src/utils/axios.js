import axios from "axios";

const customFetch = axios.create({
	 baseURL: "https://blogvana-deploy-jm7c-q5z9garcr-pascals-projects-4016dc21.vercel.app/api",
	
	// baseURL: "https://blogvana-deploy-production.up.railway.app/api",
	
});

export default customFetch;
// just for local hist development
// const customFetch = axios.create({
// 	baseURL: " http://localhost:5000/api",
// });

// export default customFetch;
