// import axiosInstance from "../index"; // tumhara existing axios

// export const registerUser = (data) =>
//    axiosInstance.post("/api/v1/auth/register", data);

// export const loginUser = (data) =>
//   axiosInstance.post("/api/v1/auth/login", data); 

import api from "../index";  // ✅ correct import

export const registerUser = (data) =>
  api("v1/auth/register", data, "POST");  // ✅ baseUrl already /api/ hai

export const loginUser = (data) =>
  api("v1/auth/login", data, "POST");  // ✅