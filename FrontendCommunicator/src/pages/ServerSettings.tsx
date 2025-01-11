import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    List,
    Typography,
    ListItem,
    ListItemAvatar,
    Avatar,
    Modal,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    IconButton,
    CssBaseline,
    Container,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    FormControl, InputLabel, Select, MenuItem,
} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import jwtAxiosInterceptor from "../axios/jwtinterceptor";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MEDIA_URL } from "../config.ts";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";

interface User {
    id: number;
    username: string;
    avatar_url: string | null;
}

interface Server {
    id: number;
    name: string;
    category: string;
    icon: string;
    member: User[];
}

interface ServerChannelsProps {
    data: Server[];
}

type Props = {
    open: boolean;
};

const ServerSettings: React.FC<ServerChannelsProps & Props> = ({ open, data }) => {
  const { serverId } = useParams<{ serverId: string }>();
  const [serverDetails, setServerDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openServerModal, setOpenServerModal] = useState(false);
  const [serverName, setServerName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [serverCategory, setServerCategory] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const jwtAxios = jwtAxiosInterceptor();

  useEffect(() => {
    if (!serverId) {
      setError("Invalid server ID");
      return;
    }
    fetchServerDetails();
    fetchCategories();
  }, [serverId]);


  const fetchCategories = async () => {
  try {
    const response = await jwtAxios.get("http://127.0.0.1:8000/api/server/category/", {
      withCredentials: true,
    });
    setCategories(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  const fetchServerDetails = async () => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.get(
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
    try {
        const response = await jwtAxios.post(
            `http://127.0.0.1:8000/api/membership/${serverId}/membership/remove_member_from_server/${userId}/`,
            {
                data: { member_id: userId },
            }, {withCredentials: true}
        );
        console.log("Member removed:", response.data);
        fetchServerDetails();
    } catch (err: any) {
        console.error("Error removing member:", err.message);
    }
};

  const handleEditServer = () => {
    setOpenServerModal(true);
    setServerName(serverDetails.name);
    setServerCategory(serverDetails.category);
    setServerDescription(serverDetails.description);
  };


  const handleSaveServerDetails = async () => {
  try {
    const response = await jwtAxios.patch(
      `http://127.0.0.1:8000/api/server/select/${serverId}/edit_details/`,
      {
        id: serverId,
        name: serverName,
        category: serverCategory,
        description: serverDescription,
      },
      { withCredentials: true }
    );
    console.log("Server details updated:", response.data);
    fetchServerDetails();
    setOpenServerModal(false);
  } catch (err: any) {
    console.error("Error updating server details:", err.message);
  }
};

  const handleDeleteChannel = async (channelId: number) => {
  try {
    const response = await jwtAxios.delete(
      `http://127.0.0.1:8000/api/server/${serverId}/channels/${channelId}/`,
      {
        data: { id: channelId },
        withCredentials: true,
      }
    );
    console.log("Channel deleted:", response.data);
    fetchServerDetails();
  } catch (err: any) {
    console.error("Error deleting channel:", err.message);
  }
};

  const handleEditChannel = (channel: any) => {
    setSelectedChannel(channel);
    console.log("Editing channel", channel);
  };

  const handleSaveChannel = async () => {
  try {
    const response = await jwtAxios.patch(
      `http://127.0.0.1:8000/api/server/${serverId}/channels/${selectedChannel.id}/`,
      {
        id: selectedChannel.id,
        name: selectedChannel.name,
      },
      { withCredentials: true }
    );
    console.log("Channel updated:", response.data);
    fetchServerDetails();
    setSelectedChannel(null);
  } catch (err: any) {
    console.error("Error updating channel:", err.message);
  }
};

  if (isLoading) return <Typography>Loading server settings...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
  <CssBaseline />
    <Navbar />
    <Draw>
      <Box
          sx={{
              height: 50,
              p: 2,
              display: "flex",
              alignItems: "center",
              flex: "1 1 100%",
          }}
      > Current server
          <Typography sx={{ display: open ? "block" : "none"}}>
              Current server
          </Typography>
      </Box>
        <ListItem disablePadding sx={{ display: "flex", flex: 1 }} dense>
          <Link
            to={`/server/${serverDetails?.id}`}
            style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
          >
            <ListItemAvatar sx={{ minWidth: "50px" }}>
              <Avatar alt="Server Icon" src={`${MEDIA_URL}${serverDetails?.icon}`} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {serverDetails?.name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "textSecondary",
                  }}
                >
                  {serverDetails?.category}
                </Typography>
              }
            />
          </Link>

        </ListItem>
    </Draw>

    <Box sx={{ padding: 2, textAlign: "center", fontSize: 30}}>Manage your server details here!
  {serverDetails ? (
    <>
      {/* Server Details Section */}
      <Box sx={{ marginBottom: 4, padding: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Server Details
        </Typography>
        <Typography variant="body1">Name: {serverDetails.name}</Typography>
        <Typography variant="body1">Category: {serverDetails.category}</Typography>
        <Typography variant="body1">Description: {serverDetails.description}</Typography>
        <Button variant="outlined" color="secondary" onClick={handleEditServer} sx={{ mt: 2 }}>
          Edit Server Details
        </Button>
      </Box>

      {/* Server Members Section */}
      <Box sx={{ marginBottom: 4, padding: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
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
      </Box>

      {/* Server Channels Section */}
      <Box sx={{ marginBottom: 4, padding: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Server Channels
        </Typography>
        {serverDetails.channel_server && serverDetails.channel_server.length > 0 ? (
          <List>
            {serverDetails.channel_server.map((channel: any) => (
              <ListItem
                key={channel.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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

      {/* Edit Server Modal */}
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
            sx={{ input: { color: "white" }, label: { color: "white" } }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={serverCategory}
              onChange={(e) => setServerCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`http://127.0.0.1:8000${category.icon}`}
                      alt={category.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            value={serverDescription}
            onChange={(e) => setServerDescription(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ input: { color: "white" }, label: { color: "white" } }}
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

      {/* Edit Channel Modal */}
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
              sx={{ input: { color: "white" }, label: { color: "white" } }}
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
</Container>
  );
};

export default ServerSettings;
