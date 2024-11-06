import { useMembershipContext } from "../../context/MembershipContext.tsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Snackbar } from "@mui/material"; // Snackbar for notifications

const JoinButton = () => {
    const { serverId } = useParams();
    const { joinServer, leaveServer, isLoading, error, isUserMember } = useMembershipContext();
    const [openSnackbar, setOpenSnackbar] = useState(false);

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

    useEffect(() => {
        // Display a reminder message when user is not a member
        if (!isUserMember) {
            setOpenSnackbar(true);
        }
    }, [isUserMember]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div>isMember: {isUserMember ? "Yes" : "No"}</div>
            {isUserMember ? (
                <Button variant="contained" onClick={handleLeaveServer}>
                    Leave server
                </Button>
            ) : (
                <Button variant="contained" onClick={handleJoinServer}>
                    Join server
                </Button>
            )}

            {/* Snackbar to show a reminder to join */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                message="You must join the server to interact with the channels!"
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
};

export default JoinButton;
