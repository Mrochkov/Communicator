import {useAuthServiceContext} from "../context/AuthContext.tsx";
import axios from "axios";
import {useState} from "react";
import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import {useNavigate} from "react-router-dom";

const TestLogin = () => {
    const {isAuthenticated, logout} = useAuthServiceContext();
    const [username, setUsername] = useState("");
    const axiosInstance = jwtAxiosInterceptor();
    const userId = localStorage.getItem("user_id")

    const getUserDetails = async () => {
        try{
            const response = await axiosInstance.get(
                `http://127.0.0.1:8000/api/user/?user_id=${userId}`,
                {
                    withCredentials: true
                }
            );
            const userDetails = response.data
            setUsername(userDetails.username);
        } catch (err: any) {
        return err;
        }
    };

    return <><div>{isAuthenticated.toString()}</div>
    <div>
        <button onClick={logout}>Logout</button>
        <button onClick={getUserDetails}>Get user details</button>
    </div>
        <div>Username: {username}</div>
    </>;
};
export default TestLogin;