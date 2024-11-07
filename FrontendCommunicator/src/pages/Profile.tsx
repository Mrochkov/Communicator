import React, { useState, useEffect } from "react";
import { Container, Box, Avatar, IconButton, Typography, Input, Button, CssBaseline, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios"; // Using axios for API requests
import { useAuthServiceContext } from "../context/AuthContext.tsx";
import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import TrendingChannels from "../components/Draw/TrendingChannels.tsx";
import Draw from "./templates/Draw.tsx";
import Navbar from "./templates/Navbar.tsx";

const Profile = () => {
    const { username } = useAuthServiceContext();
    const [userId, setUserId] = useState(null); // Use state to store userId
    const [avatarUrl, setAvatarUrl] = useState("/path/to/default-avatar.jpg");
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const jwtAxios = jwtAxiosInterceptor();

    // Fetch userId when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await jwtAxios.get("http://127.0.0.1:8000/api/user/profile", {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    const { userId } = response.data;
                    setUserId(userId);
                    setAvatarUrl(`http://127.0.0.1:8000/media/avatars/${userId}/avatar.jpg`);
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
                //setError("Failed to load user data.");
                setOpenSnackbar(true);
            }
        };
        fetchUserData();
    }, []);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = async () => {
        if (avatarFile && userId) {
            setLoading(true);
            const formData = new FormData();
            formData.append("avatar", avatarFile);

            try {
                const response = await jwtAxios.patch(`http://127.0.0.1:8000/api/user/avatar/${userId}/`, formData, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200) {
                    setError("");
                    //setOpenSnackbar(true);
                    //alert("Avatar updated successfully!");
                    // Optionally, refresh the avatar URL here
                }
            } catch (error) {
                console.error("Failed to update avatar", error);
                setError("Failed to update avatar.");
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePasswordChange = () => {
        // Add functionality for password change
        //alert("Password change feature coming soon!");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <CssBaseline />
            <Navbar />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mt: 10 }}>My Profile</Typography>

                <Draw>
                    <TrendingChannels open={false} />
                </Draw>

                <Box sx={{ position: "relative", mb: 3 }}>
                    <Avatar alt={username} src={avatarUrl} sx={{ width: 100, height: 100 }} />
                    <IconButton
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            bgcolor: "primary.main",
                            color: "white",
                        }}
                        onClick={() => document.getElementById("avatar-upload").click()}
                    >
                        <Edit />
                    </IconButton>
                    <Input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        sx={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </Box>

                <Typography variant="h5">Username: {username}</Typography>
                <Typography variant="h6">Email: {username}@example.com</Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    Welcome to your profile page. You can update your avatar and manage your account settings here.
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Button variant="outlined" color="secondary" onClick={() => setPasswordDialogOpen(true)}>
                        Change Password
                    </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAvatarUpload}
                        disabled={loading || !avatarFile}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Avatar"}
                    </Button>
                </Box>
            </Box>

            {/* Snackbar for error or success messages */}
            {/*<Snackbar*/}
            {/*    open={openSnackbar}*/}
            {/*    autoHideDuration={6000}*/}
            {/*    onClose={() => setOpenSnackbar(false)}*/}
            {/*>*/}
            {/*    /!*<Alert severity={error ? "error" : "success"} sx={{ width: "100%" }}>*!/*/}
            {/*    /!*    {error || "Avatar updated successfully!"}*!/*/}
            {/*    /!*</Alert>*!/*/}
            {/*</Snackbar>*/}
        </Container>
    );
};

export default Profile;
