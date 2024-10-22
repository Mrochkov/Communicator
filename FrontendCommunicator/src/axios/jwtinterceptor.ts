import axios, {AxiosInstance} from 'axios';
import { BASE_URL } from "../config.ts";
import {useNavigate} from "react-router-dom";
import {useAuthService} from "../service/AuthService.ts";

//const API_BASE_URL = BASE_URL


const jwtAxiosInterceptor = () => {
    const jwtAxios = axios.create({});
    const navigate = useNavigate();
    const {logout} = useAuthService();
    jwtAxios.interceptors.response.use(
        (response) => { return response;},

        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 || error.response?.status === 403) {
                axios.defaults.withCredentials = true;
                    try {
                        const response = await axios.post(
                            "http://127.0.0.1:8000/api/token/refresh/",
                        );
                        if (response["status"] == 200){
                            return jwtAxios(originalRequest);
                        }
                    } catch (refreshError) {
                        logout()
                        const goLogin = () => navigate("/login");
                        goLogin();
                        return Promise.reject(refreshError);
                    }
            }
            throw error;
        }
    );

    return jwtAxios;
};
export default jwtAxiosInterceptor;