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
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import jwtAxiosInterceptor from "../axios/jwtinterceptor.ts";
import { useAuthServiceContext } from "../context/AuthContext.tsx";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import TrendingChannels from "../components/Draw/TrendingChannels.tsx";

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
  const [language, setLanguage] = useState("en"); // Default language
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const jwtAxios = jwtAxiosInterceptor();

  const availableLanguages = [
    { code: "en", label: "English" },
    { code: "pl", label: "Polish" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await jwtAxios.get(`http://127.0.0.1:8000/api/user/${userId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const { username: fetchedUsername, avatar_url, language: fetchedLanguage } = response.data;
          setUsername(fetchedUsername);
          setAvatarUrl(avatar_url || `/media/avatars/${userId}/avatar.jpg`);
          setLanguage(fetchedLanguage || "en");
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const saveLanguagePreference = async () => {
    try {
      const response = await jwtAxios.patch(
        `http://127.0.0.1:8000/api/user/${userId}/`,
        { language },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSnackbarMessage("Language preference updated!");
        setError("");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Failed to update language preference", error);
      setSnackbarMessage("Failed to update language preference.");
      setError("Failed to update language preference.");
      setOpenSnackbar(true);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
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
    if (!avatarFile) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!userId) {
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
      if (response.status === 200) {
        setSnackbarMessage("Avatar updated successfully!");
        setError("");
        setOpenSnackbar(true);
        setAvatarUrl(response.data.avatar_url);
      }
    } catch (error) {
      setError("Failed to update avatar.");
      setSnackbarMessage("Failed to update avatar.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSnackbarMessage("Passwords do not match.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await jwtAxios.patch(
        `http://127.0.0.1:8000/api/user/${userId}/update_password/`,
        { password: newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setSnackbarMessage("Password updated successfully!");
        setError("");
        setOpenSnackbar(true);
        setOpenPasswordModal(false);
      }
    } catch (error) {
      console.error("Failed to change password", error);
      setSnackbarMessage("Password must be at least 8 characters long.");
      setError("Failed to change password.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Navbar />
      <CssBaseline />
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: "center", mt: 20 }}>
        My Profile
      </Typography>
      <Draw>
        <TrendingChannels open={false} />
      </Draw>
      <Grid container spacing={4}>
        {/* Avatar and Actions Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 1.7, textAlign: "center", height: "100%" }}>
            <Avatar
              alt={username}
              src={avatarUrl}
              sx={{ width: 150, height: 150, mx: "auto", mb: 2 }}
            />
            <IconButton
              sx={{
                position: "relative",
                display: "flex",
                bottom: 60,
                marginLeft: 5,
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleAvatarUpload}
              disabled={loading || !avatarFile}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Upload Avatar"}
            </Button>
          </Card>
        </Grid>

        {/* Profile Details Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Username:</strong> {username || "Loading..."}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {username ? `${username}@example.com` : "Loading..."}
              </Typography>
            </CardContent>
            <Box sx={{ textAlign: "center" }}>
              <Button variant="outlined" color="secondary" sx={{ mt: 2, width: "80%" }} onClick={() => setOpenPasswordModal(true)}>
                Edit Password
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Language Preference Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Language Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <FormControl fullWidth>
                <InputLabel id="language-select-label">Preferred Language</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  label="Preferred Language"
                  onChange={handleLanguageChange}
                >
                  {availableLanguages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" color="secondary" onClick={saveLanguagePreference} sx={{ mt: 2 }}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={error ? "error" : "success"} sx={{ width: "100%" }} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Edit Password Modal */}
      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
