import {AuthServiceProps} from "../@types/auth-service";
import axios from "axios";
import {useState} from "react";
import {BASE_URL} from "../config.ts";
import {useNavigate} from "react-router-dom";

export function useAuthService(): AuthServiceProps {

    const navigate = useNavigate();
    const getAuthenticationValue = () => {
        const authenticated = localStorage.getItem("isAuthenticated");
        return authenticated !== null && authenticated === "true";
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>((getAuthenticationValue))


    const getUserDetails = async () => {
        try{
            const userId = localStorage.getItem("user_id")
            const response = await axios.get(
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
                {withCredentials: true}
            );
            const userDetails = response.data
            localStorage.setItem("username", userDetails.username);
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
        } catch (err: any) {
            setIsAuthenticated(false);
            localStorage.setItem("isAuthenticated", "false");
            return err.response.status;
        }
    }


    const login = async (username: string, password: string) => {
        try{
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/", {
                    username,
                    password,
                }, {withCredentials: true}
            );

            //console.log(response.data)
            const user_id = response.data.user_id
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("user_id", user_id)
            setIsAuthenticated(true)

            getUserDetails()

        } catch (err: any) {
            return err.response.status;
        }
    }


    const signUp = async (username: string, password: string) => {
        try{
            const response = await axios.post(
                "http://127.0.0.1:8000/api/signup/", {
                    username,
                    password,
                }, {withCredentials: true}
            );
            return response.status

        } catch (err: any) {
            return err.response.status;
        }
    }

    const refreshAccessToken = async () => {
        try{
            await axios.post(
                `${BASE_URL}/token/refresh/`, {}, {withCredentials: true}
            )
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    }

    const logout = async () => {
        localStorage.setItem("isAuthenticated", "false")
        localStorage.removeItem("user_id")
        localStorage.removeItem("username")
        setIsAuthenticated(false);
        navigate("/login")

        try{
            await axios.post(
                `${BASE_URL}/logout/`, {}, {withCredentials: true}
            )
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }

    }


    return {login, isAuthenticated, logout, refreshAccessToken, signUp};
}