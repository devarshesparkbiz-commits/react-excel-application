import axiosInstance from "./axiosInstance";

export const createExcel = async (data) => {
  return await axiosInstance.post("/excel/create", data, {
    responseType: "blob",
  });
};
