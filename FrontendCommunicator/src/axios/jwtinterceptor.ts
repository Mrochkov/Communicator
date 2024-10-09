import axios, {AxiosInstance} from 'axios';
import { BASE_URL } from "../config.ts";
import {useNavigate} from "react-router-dom";

const API_BASE_URL = BASE_URL


const jwtAxiosInterceptor = (navigate: ReturnType<typeof useNavigate>): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: API_BASE_URL });

    jwtAxios.interceptors.response.use(
        (response) => { return response;},

        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 || error.response?.status === 403) {
                const refreshToken = localStorage.getItem("refresh_token")
                if (refreshToken) {
                    try {
                        const refreshResponse = await axios.post(
                            "http://127.0.0.1:8000/api/token/refresh/",
                            { refresh: refreshToken }
                        );
                        const newAccessToken = refreshResponse.data.access;
                        localStorage.setItem("access_token", newAccessToken)
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                        return jwtAxios(originalRequest);
                    } catch (refreshError) {
                        //localStorage.removeItem("access_token");
                        //localStorage.removeItem("refresh_token");
                        navigate('/login');
                        throw refreshError;
                    }
                } else {
                    navigate('/login');
                }
            }
            throw error;
        }
    );

    return jwtAxios;
};
export default jwtAxiosInterceptor;