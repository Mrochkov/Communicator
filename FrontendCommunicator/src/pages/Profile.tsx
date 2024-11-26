import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Avatar,
  IconButton,
  Typography,
  Input,
  Button,
  CssBaseline,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import { useAuthServiceContext } from "../context/AuthContext.tsx";
import TrendingChannels from "../components/Draw/TrendingChannels.tsx";
import Draw from "./templates/Draw.tsx";
import Navbar from "./templates/Navbar.tsx";

const Profile = () => {
  const { username: contextUsername } = useAuthServiceContext();
  const userId = localStorage.getItem("user_id");
  const [avatarUrl, setAvatarUrl] = useState(`/media/avatars/${userId}/avatar.jpg`);
  const [username, setUsername] = useState(contextUsername);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const jwtAxios = jwtAxiosInterceptor();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await jwtAxios.get(`http://127.0.0.1:8000/api/user/${userId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const { username: fetchedUsername, avatar_url } = response.data;
          console.log("Fetched User Data:", response.data);
          setUsername(fetchedUsername);
          setAvatarUrl(avatar_url || `/media/avatars/${userId}/avatar.jpg`);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  };

  const handleAvatarUpload = async () => {
    console.log("Upload button clicked!");
    if (!avatarFile) {
      console.error("No file selected.");
      alert("Please select a file before uploading.");
      return;
    }
    if (!userId) {
      console.error("No userId found.");
      alert("User information not loaded yet. Please try again later.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await jwtAxios.patch(
        `http://127.0.0.1:8000/user/avatar/${userId}/`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload response:", response);
      if (response.status === 200) {
        setSnackbarMessage("Avatar updated successfully!");
        setError("");
        setOpenSnackbar(true);
        setAvatarUrl(response.data.avatar_url);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to update avatar.");
      setSnackbarMessage("Failed to update avatar.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <CssBaseline />
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mt: 10 }}>
          My Profile
        </Typography>

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
            onClick={() => document.getElementById("avatar-upload")?.click()}
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

        <Typography variant="h5">Username: {username || "Loading..."}</Typography>
        <Typography variant="h6">Email: {username ? `${username}@example.com` : "Loading..."}</Typography>
        <Typography variant="body1" sx={{ my: 2 }}>
          Welcome to your profile page. You can update your avatar and manage your account settings here.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" color="secondary">
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
