import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const convertToWord = async (data) => {
  return await API.post("/convert/word", data, { responseType: "blob" });
};

export const convertToPdf = async (data) => {
  return await API.post("/convert/pdf", data, { responseType: "blob" });
};

export const postData = (url, data) => API.post(url, data);
export const getData = (url, config = {}) => API.get(url, config);
export const saveData = (url) => API.get(url);

