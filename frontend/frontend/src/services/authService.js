import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (loginData) => {
    return await axios.post(`${API_URL}/login`, loginData);
};



// import axios from "axios";

// // ❌ பழைய கோடு: const API_URL = "http://localhost:8080/api/auth";
// // 🌟 புதிய கோடு: பேக்-எண்ட்க்கு ஏத்த மாதிரி மாத்தியாச்சு!
// const API_URL = "http://localhost:8080/api";

// export const registerUser = async (userData) => {
//     return await axios.post(`${API_URL}/register`, userData);
// };

// export const loginUser = async (loginData) => {
//     return await axios.post(`${API_URL}/login`, loginData);
// };