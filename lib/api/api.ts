import axios from 'axios';

const publicUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const baseURL = `${publicUrl}/api`;

export const nextServer = axios.create({
  baseURL,
  withCredentials: true,
});
