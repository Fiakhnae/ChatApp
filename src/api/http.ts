import axios from "axios";

const API_BASE = "https://localhost:7118";

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});