import axios from 'axios';

export default axios.create({
  headers: { 'Access-Control-Allow-Origin': '*' },
  baseURL: process.env.NEXT_PUBLIC_HOST_URL,
});
