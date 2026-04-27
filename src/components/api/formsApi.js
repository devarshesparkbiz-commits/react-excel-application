import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

export const getForms    = ()           => API.get("/forms");
export const getFormById = (id)         => API.get(`/forms/${id}`);
export const createForm  = (data)       => API.post("/forms", data);
export const updateForm  = (id, data)   => API.put(`/forms/${id}`, data);
export const deleteForm  = (id)         => API.delete(`/forms/${id}`);
export const downloadFormPdf = (id)     => API.get(`/forms/${id}/pdf`,   { responseType: "blob" });
export const printFormPdf    = (id)     => API.get(`/forms/${id}/print`, { responseType: "blob" });