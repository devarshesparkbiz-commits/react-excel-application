import axiosInstance from "../../api/axiosInstance";

export const convertToWord = async (data) => {
  return await axiosInstance.post("/convert/word", data, { responseType: "blob" });
};

export const convertToPdf = async (data) => {
  return await axiosInstance.post("/convert/pdf", data, { responseType: "blob" });
};

export const postData = (url, data) => axiosInstance.post(url, data);
export const getData  = (url, config = {}) => axiosInstance.get(url, config);
export const saveData = (url) => axiosInstance.get(url);
