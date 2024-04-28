import jwtAxiosInterceptor from "../axios/jwtinterceptor";
import { BASE_URL } from "../config";
import { useState } from 'react';

interface ThisUseCrudInterface<T>{
    dataCRUD: T[];
    fetchData: () => Promise<void>;
    error: Error | null;
    isLoading: boolean;
}

const thisUseCRUD = <T>(initialData: T[], apiURL: string): ThisUseCrudInterface<T> => {
    const [dataCRUD, setDataCRUD] = useState<T[]>(initialData);
    const [error, setError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const fetchData = async () => {
        setIsLoading(true)
        try{
            const response = await jwtAxiosInterceptor.get(`${BASE_URL}${apiURL}`, {})
            const data = response.data;
            setDataCRUD(data);
            setError(null);
            setIsLoading(false);
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
export default thisUseCRUD;