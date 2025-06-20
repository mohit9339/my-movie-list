import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // uses the environment variable
});

export default API;
