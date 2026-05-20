import axiosInstance from "../../api/axiosInstance";

export const getForms        = ()           => axiosInstance.get("/forms");
export const getFormById     = (id)         => axiosInstance.get(`/forms/${id}`);
export const createForm      = (data)       => axiosInstance.post("/forms", data);
export const updateForm      = (id, data)   => axiosInstance.put(`/forms/${id}`, data);
export const deleteForm      = (id)         => axiosInstance.delete(`/forms/${id}`);
export const downloadFormPdf = (id)         => axiosInstance.get(`/forms/${id}/pdf`,   { responseType: "blob" });
export const printFormPdf    = (id)         => axiosInstance.get(`/forms/${id}/print`, { responseType: "blob" });
