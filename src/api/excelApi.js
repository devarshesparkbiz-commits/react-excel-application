import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const createExcel = async (data) => {
  const response = await API.post("/excel/create", data, {
    responseType: "blob",
  });
  return response;
};