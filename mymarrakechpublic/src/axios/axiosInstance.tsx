import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: 'https://qrapi.mymarrakechagency.com/api',
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor (Automatically adds token if available)
//We send token on every request
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("authToken");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// Response Interceptor (Handles errors globally)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
