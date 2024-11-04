import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const request = axios.create({
    baseURL: apiUrl,
});

export default request;