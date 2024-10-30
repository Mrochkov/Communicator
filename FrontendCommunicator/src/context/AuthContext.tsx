import React, {createContext, useContext} from "react";
import {AuthServiceProps} from "../@types/auth-service";
import {useAuthService} from "../service/AuthService.ts";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const AuthServiceContext = createContext<AuthServiceProps | null>(null);

export function AuthServiceProvider(props: React.PropsWithChildren<{}>) {
    const authService = useAuthService();
    return <AuthServiceContext.Provider value={authService}>{props.children}</AuthServiceContext.Provider>;
}

export function useAuthServiceContext(): AuthServiceProps {
    const context = useContext(AuthServiceContext);
    if(context === null){
        throw new Error("Error - Use the AuthServiceProvider");
    }
    return context;
}
export default AuthServiceProvider;