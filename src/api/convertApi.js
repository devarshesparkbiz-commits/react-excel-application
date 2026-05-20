import axiosInstance from "./axiosInstance";

export const convertToWord = async (data) => {
  return await axiosInstance.post("/convert/word", data, { responseType: "blob" });
};

export const convertToPdf = async (data) => {
  return await axiosInstance.post("/convert/pdf", data, { responseType: "blob" });
};
