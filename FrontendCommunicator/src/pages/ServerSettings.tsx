import React, { useEffect, useState } from "react";
import {Box, Button, Divider, List, Typography, ListItem, ListItemAvatar, Avatar, Modal, TextField, DialogActions, DialogContent, DialogTitle, Dialog, IconButton, } from "@mui/material";
import { useParams } from "react-router-dom";
import jwtAxiosInterceptor from "../axios/jwtinterceptor";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MEDIA_URL } from "../config.ts";

const ServerSettings: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const [serverDetails, setServerDetails] = useState<any>(null); // Any type for simplicity
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openServerModal, setOpenServerModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [serverCategory, setServerCategory] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<any>(null); // Channel for editing
  const axiosInstance = jwtAxiosInterceptor();

  useEffect(() => {
    if (!serverId) {
      setError("Invalid server ID");
      return;
    }
    fetchServerDetails();
  }, [serverId]);

  const fetchServerDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `http://127.0.0.1:8000/api/server/select/?by_server_id=${serverId}`,
        { withCredentials: true }
      );
      console.log('Fetched server details:', response.data);
      setServerDetails(response.data[0]);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch server details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    console.log("Removing member with ID: ", userId);
  };

  const handleEditServer = () => {
    setOpenServerModal(true);
    setServerName(serverDetails.name);
    setServerCategory(serverDetails.category);
    setServerDescription(serverDetails.description);
  };

  const handleSaveServerDetails = () => {
    console.log("Saving server details", { serverName, serverCategory, serverDescription });
    setOpenServerModal(false);
  };

  const handleDeleteChannel = async (channelId: number) => {
    console.log("Deleting channel with ID:", channelId);
  };

  const handleEditChannel = (channel: any) => {
    setSelectedChannel(channel);
    console.log("Editing channel", channel);
  };

  const handleSaveChannel = () => {
    console.log("Saving channel", selectedChannel);
    setSelectedChannel(null);
  };

  if (isLoading) return <Typography>Loading server settings...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      {serverDetails ? (
        <>
          <Typography variant="h6" gutterBottom>
            Server Details
          </Typography>
          <Typography variant="body1">ID: {serverDetails.id}</Typography>
          <Typography variant="body1">Name: {serverDetails.name}</Typography>
          <Typography variant="body1">Category: {serverDetails.category}</Typography>
          <Typography variant="body1">Description: {serverDetails.description}</Typography>
          <Button variant="contained" color="primary" onClick={handleEditServer}>
            Edit Server Details
          </Button>
          <Divider sx={{ margin: '20px 0' }} />

          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Server Members
            </Typography>
            {serverDetails.member && serverDetails.member.length > 0 ? (
              <List>
                {serverDetails.member.map((member: any) => (
                  <ListItem
                    key={member.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemAvatar>
                        <Avatar
                          src={
                            member.avatar_url
                              ? `${MEDIA_URL}${member.avatar_url}`
                              : `${MEDIA_URL}default-avatar.jpg`
                          }
                          alt={member.username}
                        />
                      </ListItemAvatar>
                      <Typography variant="body1">{member.username}</Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No members found.</Typography>
            )}
            <Divider sx={{ margin: '20px 0' }} />
          </Box>

          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Server Channels
            </Typography>
            {serverDetails.channel_server && serverDetails.channel_server.length > 0 ? (
              <List>
                {serverDetails.channel_server.map((channel: any) => (
                  <ListItem key={channel.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body1">{channel.name}</Typography>
                    <Box>
                      <IconButton onClick={() => handleEditChannel(channel)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteChannel(channel.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No channels found.</Typography>
            )}
          </Box>

          <Modal open={openServerModal} onClose={() => setOpenServerModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "#121212",
                color: "white",
                padding: 3,
                borderRadius: 2,
                boxShadow: 24,
                width: 400,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Edit Server Details
              </Typography>
              <TextField
                label="Server Name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ input: { color: 'white' }, label: { color: 'white' } }}  // Input field colors
              />
              <TextField
                label="Category"
                value={serverCategory}
                onChange={(e) => setServerCategory(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
              />
              <TextField
                label="Description"
                value={serverDescription}
                onChange={(e) => setServerDescription(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ input: { color: 'white' }, label: { color: 'white' } }}
              />
              <DialogActions>
                <Button onClick={() => setOpenServerModal(false)} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSaveServerDetails} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Box>
          </Modal>

          {selectedChannel && (
            <Modal
              open={!!selectedChannel}
              onClose={() => setSelectedChannel(null)}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "#121212",
                  color: "white",
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 24,
                  width: 400,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Edit Channel
                </Typography>
                <TextField
                  label="Channel Name"
                  value={selectedChannel.name}
                  onChange={(e) =>
                    setSelectedChannel({ ...selectedChannel, name: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                  sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                />
                <DialogActions>
                  <Button onClick={() => setSelectedChannel(null)} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChannel} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Box>
            </Modal>
          )}
        </>
      ) : (
        <Typography>Server details not found.</Typography>
      )}
    </Box>
  );
};

export default ServerSettings;
