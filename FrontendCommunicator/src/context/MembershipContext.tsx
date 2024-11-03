import React, {createContext, useContext} from "react";
import {AuthServiceProps} from "../@types/auth-service";
import useMembership from "../service/MembershipService";
import {Simulate} from "react-dom/test-utils";

interface useServerInterface {
    joinServer: (serverId: number) => Promise<void>;
    leaveServer: (serverId: number) => Promise<void>;
    isMember: (serverId: number) => Promise<boolean>;
    isUserMember: boolean;
    error: Error | null;
    isLoading: boolean;
}

const MembershipContext = createContext<useServerInterface | null>(null);

export function MembershipProvider(props: React.PropsWithChildren<{}>) {
    const membership = useMembership();
    return <MembershipContext.Provider value={membership}>{props.children}</MembershipContext.Provider>;
}

export function useMembershipContext(): useServerInterface {
    const context = useContext(MembershipContext);
    if(context === null){
        throw new Error("Error - Use the MembershipProvider");
    }
    return context;
}

export default MembershipProvider;