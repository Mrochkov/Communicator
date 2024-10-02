import {AuthServiceProps} from "../@types/auth-service";
import axios from "axios";


export function useAuthService(): AuthServiceProps {

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

        } catch (err: any) {
            return err;
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
            localStorage.setItem("UserId", getUserIdUsingToken(access))

            getUserDetails()

        } catch (err: any) {
            return err;
        }
    }
    return {login};
}