import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL; // Accessing the environment variable

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default instance;
