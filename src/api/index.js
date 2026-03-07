import axios from "axios";

export let baseUrl = "http://localhost:8003/api/"
// export let baseUrl = "https://wg-tech-sol-backend.vercel.app/api/";
// export let baseUrl = "https://9zm5wcv8-8003.asse.devtunnels.ms/api/";




const api = async (path, params, method, isMultipart = false) => {
  let userToken = localStorage.getItem("token");
  const options = {
    headers: {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
      ...(userToken && {
        Authorization: `Bearer ${userToken}`,
      }),
    },
    method: method,
    ...(params && { data: isMultipart ? params : JSON.stringify(params) }),
  };

  try {
    const response = await axios(baseUrl + path, options);
    return response;
  } catch (error) {
    console.error("❌ API Error:", error);
    return (
      error.response || { status: 500, data: { message: "Unknown error" } }
    );
  }
};

export default api;
