import { useMembershipContext } from "../../context/MembershipContext.tsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Snackbar, TextField } from "@mui/material";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";

const JoinButton = () => {
    const { serverId } = useParams();
    const { joinServer, leaveServer, isLoading, error, isUserMember } = useMembershipContext();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [serverDetails, setServerDetails] = useState<any | null>(null); // State for server details
    const [password, setPassword] = useState<string>("");  // State for password input
    const [passwordError, setPasswordError] = useState<string | null>(null); // State for password error
    const jwtAxios = jwtAxiosInterceptor();

    // Fetch server details on component mount
    useEffect(() => {
        const fetchServerDetails = async () => {
            try {
                const response = await jwtAxios.get(`http://127.0.0.1:8000/api/server/select/?by_server_id=${serverId}`, {withCredentials: true});
                setServerDetails(response.data[0]);
                console.log(response.data[0]);
            } catch (error) {
                console.error("Error fetching server details:", error);
            }
        };
        fetchServerDetails();
    }, [serverId]);

    const handleValidatePassword = async (): Promise<boolean> => {
    try {
        const response = await jwtAxios.post(
            `http://127.0.0.1:8000/server/${serverId}/validate_password/`,
            { password },
            { withCredentials: true }
        );
        if (response.data.valid) {
            setPasswordError(null);
            return true; // Validation successful
        } else {
            setPasswordError("Incorrect password. Please try again.");
            return false; // Validation failed
        }
    } catch (error) {
        console.error("Error validating password:", error);
        setPasswordError("An error occurred. Please try again.");
        return false;
    }
    };

    const handleJoinServer = async () => {
        if (serverDetails?.private) {
            const isValidPassword = await handleValidatePassword();
            if (!isValidPassword) return;
        }

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
        if (!isUserMember) {
            setOpenSnackbar(true);
        }
    }, [isUserMember]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <div>Membership: {isUserMember ? "Yes" : "No"}</div>
            {serverDetails?.private && !isUserMember && (
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                    sx={{ marginBottom: 2 }}
                />
            )}
            {isUserMember ? (
                <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white', mt: 2 }} onClick={handleLeaveServer}>
                    Leave server
                </Button>
            ) : (
                <Button variant="outlined" sx={{ backgroundColor: 'green', color: 'white', mt: 2 }} onClick={handleJoinServer}>
                    Join server
                </Button>
            )}

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
