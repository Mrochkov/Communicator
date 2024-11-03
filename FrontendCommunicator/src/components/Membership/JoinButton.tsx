import {useMembershipContext} from "../../context/MembershipContext.tsx";
import {useParams} from "react-router-dom";
import {useState} from "react";

const JoinButton = () => {
    const { serverId } = useParams();
    const { joinServer, leaveServer, isLoading, error, isUserMember } = useMembershipContext();

    const handleJoinServer = async () => {
        try {
            await joinServer(Number(serverId));
        } catch (error) {
            console.error("Error joining server:", error);
        }
    };

    const handleLeaveServer = async () => {
        try {
            await leaveServer(Number(serverId));
        } catch (error) {
            console.error("Error leaving server:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div>isMember: {isUserMember ? "Yes" : "No"}</div>
            {isUserMember ? (
                <button onClick={handleLeaveServer}>Leave server</button>
            ) : (
                <button onClick={handleJoinServer}>Join server</button>
            )}
        </>
    );
};
export default JoinButton;
