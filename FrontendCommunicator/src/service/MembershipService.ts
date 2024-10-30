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

    const joinServer = async (serverId: number): Promise<void> =>{
        setIsLoading(true);
        try{
            await jwtAxios.post(`${BASE_URL}/membership/${serverId}/membership/`, {}, {withCredentials: true});
            setIsLoading(false)
            setIsUserMember(true)
        }catch (error: any) {
            setError(error)
            setIsLoading(false)
            throw error;
        }
    }

    const leaveServer = async (serverId: number): Promise<void> =>{
        setIsLoading(true);
        try{
            await jwtAxios.delete(`${BASE_URL}/membership/${serverId}/membership/remove_member/`, {withCredentials: true});
            setIsLoading(false)
            setIsUserMember(false)
        }catch (error: any) {
            setError(error)
            setIsLoading(false)
            throw error;
        }
    }

    const isMember = async (serverId: number): Promise<any> =>{
        setIsLoading(true);
        try{
            const response = await jwtAxios.get(`${BASE_URL}/membership/${serverId}/membership/is_member`, {withCredentials: true});
            setIsLoading(false)
            setIsUserMember(response.data.is_user)
        }catch (error: any) {
            setError(error)
            setIsLoading(false)
            throw error;
        }
    }

    return {joinServer, leaveServer, isMember, isUserMember, isLoading, error}
}
export default useMembership;