import useAxiosInterceptor from "../axios/jwtinterceptor";
import { BASE_URL } from "../config";
import { useState } from 'react';
interface UseCrudInterface<T>{
    dataCRUD: T[];
    fetchData: () => Promise<void>;
    error: Error | null;
    isLoading: boolean;
}

const useCRUD = <T>(initialData: T[], apiURL: string): UseCrudInterface<T> => {
    const jwtAxios = useAxiosInterceptor();
    const [dataCRUD, setDataCRUD] = useState<T[]>(initialData);
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const fetchData = async () => {
        setIsLoading(true)
        try{
            const response = await jwtAxios.get(`${BASE_URL}${apiURL}`, {})
            const data = response.data
            setDataCRUD(data)
            setError(null)
            setIsLoading(false)
            return data;
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setError(new Error("400"))
            }
            setIsLoading(false)
            throw error;
        }
    };

    return {fetchData, dataCRUD, error, isLoading}
}
export default useCRUD;