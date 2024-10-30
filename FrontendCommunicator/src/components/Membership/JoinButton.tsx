import {useMembershipContext} from "../../context/MembershipContext.tsx";
import {useParams} from "react-router-dom";

const JoinButton = () => {
    const { serverId } = useParams();
    const { joinServer, leaveServer, isLoading, error, isUserMember } = useMembershipContext();



    const handleJoinServer = async () => {
        try{
            await joinServer(Number(serverId));
            console.log("User has joined this server");

        }catch {
            console.log("Error trying to join server", error);
        }
    };

    const handleLeaveServer = async () => {
        try{
            await leaveServer(Number(serverId));
            console.log("User has left this server");

        }catch (error) {
            console.log("Error trying to leave server", error);
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;

    }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }



    return (
        <>
            ismember: {isUserMember.toString()}
            {isUserMember ? (
                <button onClick={handleLeaveServer}>Leave server</button>
            ) : (
                <button onClick={handleJoinServer}>Join server</button>

            )
            }
        </>
    )
}
export default JoinButton;