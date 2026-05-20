import axiosInstance from "../../api/axiosInstance";

export const generateXml = async (payload) => {
  const response = await axiosInstance.post("/xml/generate", payload, {
    responseType: "blob",
  });
  return response.data;
};

export const previewXml = async (payload) => {
  const response = await axiosInstance.post("/xml/preview", payload, {
    responseType: "text",
  });
  return response.data;
};
