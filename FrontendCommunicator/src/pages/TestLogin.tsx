import {useAuthServiceContext} from "../context/AuthContext.tsx";

const TestLogin = () => {
    const {isAuthenticated, logout} = useAuthServiceContext();
    return <><div>{isAuthenticated.toString()}</div>
    <div>
        <button onClick={logout}>Logout</button>
    </div>
    </>;
};
export default TestLogin;