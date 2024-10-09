import {useAuthServiceContext} from "../context/AuthContext.tsx";
import axios from "axios";
import {useState} from "react";
import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import {useNavigate} from "react-router-dom";

const TestLogin = () => {
    const {isAuthenticated, logout} = useAuthServiceContext();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const jwtAxios = jwtAxiosInterceptor(navigate);

    const getUserDetails = async () => {
        try{


            const userId = localStorage.getItem("userId")
            const accessToken = localStorage.getItem("access_token")

            const response = await jwtAxios.get(
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            const userDetails = response.data
            setUsername(userDetails.username);
        } catch (err: any) {
        console.error("Error fetching user details:", err);
        }
    }

    return <><div>{isAuthenticated.toString()}</div>
    <div>
        <button onClick={logout}>Logout</button>
        <button onClick={getUserDetails}>Get user details</button>
    </div>
        <div>Username: {username}</div>
    </>;
};
export default TestLogin;