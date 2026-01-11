import axios from "axios";

const API_BASE_URL = "http://localhost:8080";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/notes/upload", formData);
};

export const getAllNotes = () => {
  return api.get("/notes");
};

export const getNoteDetail = (id) => {
  return api.get(`/notes/${id}`);
};

export default api;
