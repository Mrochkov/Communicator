import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import {BASE_URL} from "../config.ts";
import {useState} from "react";



interface useServerInterface {
    joinServer: (serverId: number) => Promise<void>;
    leaveServer: (serverId: number) => Promise<void>;
    isMember: (serverId: number) => Promise<boolean>;
    isUserMember: boolean;
    error: Error | null;
    isLoading: boolean;
}


const useMembership = (): useServerInterface => {
    const jwtAxios = jwtAxiosInterceptor()
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUserMember, setIsUserMember] = useState(false)

    const joinServer = async (serverId: number): Promise<void> => {
    setIsLoading(true);
    try {
        await jwtAxios.post(`http://127.0.0.1:8000/api/membership/${serverId}/membership/`,{}, { withCredentials: true });
        setIsUserMember(true);
        console.log("User has joined the server");
    } catch (error: any) {
        setError(error);
        console.error("Error trying to join server:", error.response?.data || error.message);
    } finally {
        setIsLoading(false);
    }
    };

    const leaveServer = async (serverId: number): Promise<void> =>{
        setIsLoading(true);
        try{
            await jwtAxios.delete(`http://127.0.0.1:8000/api/membership/${serverId}/membership/remove_member/`, {withCredentials: true});
            setIsLoading(false)
            setIsUserMember(false)
        }catch (error: any) {
            setError(error)
            setIsLoading(false)
            throw error;
        }
    }

    const isMember = async (serverId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
        const response = await jwtAxios.get(`http://127.0.0.1:8000/api/membership/${serverId}/membership/is_member/`, { withCredentials: true });
        setIsUserMember(response.data.is_member);
        console.log("Updated isUserMember:", response.data.is_member);
        return response.data.is_member;
    } catch (error: any) {
        setError(error);
        console.error("Error checking membership status:", error.response?.data || error.message);
        return false;
    } finally {
        setIsLoading(false);
    }
    };

    return {joinServer, leaveServer, isMember, isUserMember, isLoading, error}
}
export default useMembership;