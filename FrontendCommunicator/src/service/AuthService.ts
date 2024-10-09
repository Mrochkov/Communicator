import {AuthServiceProps} from "../@types/auth-service";
import axios from "axios";
import {useState} from "react";


export function useAuthService(): AuthServiceProps {
    const getAuthenticationValue = () => {
        const authenticated = localStorage.getItem("isAuthenticated");
        return authenticated !== null && authenticated === "true";
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>((getAuthenticationValue))


    const getUserDetails = async () => {
        try{
            const userId = localStorage.getItem("userId")
            const accessToken = localStorage.getItem("access_token")
            const response = await axios.get(
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            const userDetails = response.data
            localStorage.setItem("username", userDetails.username);
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
        } catch (err: any) {
            //setIsAuthenticated(false);
            //localStorage.setItem("isAuthenticated", "false");
            return err.response.status;
        }
    }

    const getUserIdUsingToken = (access : string) => {
        const token = access
        const tokenComponents = token.split('.')
        const encodedPayload = tokenComponents[1]
        const decodedPayload = atob(encodedPayload)
        const payloadData = JSON.parse(decodedPayload)
        const userId = payloadData.user_id

        return userId;
    }

    const login = async (username: string, password: string) => {
        try{
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/", {
                    username,
                    password,
                }
            );

            const {access, refresh} = response.data;

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("userId", getUserIdUsingToken(access))
            localStorage.setItem("username", username)
            localStorage.setItem("isAuthenticated", "true")
            setIsAuthenticated(true)
            getUserDetails()

        } catch (err: any) {
            return err.response.status;
        }
    }

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userId")
        localStorage.removeItem("username")
        localStorage.setItem("isAuthenticated", "false")
        setIsAuthenticated(false);
    }


    return {login, isAuthenticated, logout};
}