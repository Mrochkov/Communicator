import {useAuthServiceContext} from "../context/AuthContext.tsx";

const TestLogin = () => {
    const {isAuthenticated} = useAuthServiceContext();
    return <>{isAuthenticated.toString()}</>;
};
export default TestLogin;