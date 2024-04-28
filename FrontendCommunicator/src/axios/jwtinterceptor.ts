import axios, {AxiosInstance} from 'axios';
import { BASE_URL } from "../config.ts";

const API_BASE_URL = BASE_URL


const jwtAxiosInterceptor = (): AxiosInstance => {
    const jwtAxios = axios.create({ baseURL: API_BASE_URL });

    jwtAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if(error.response?.status === 403) {
            }
            throw error;
        }
    )
    return jwtAxios;
}
export default jwtAxiosInterceptor();