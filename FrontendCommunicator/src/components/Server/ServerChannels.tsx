import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useMembershipContext } from "../../context/MembershipContext.tsx";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";
import { Server } from "../../@types/server";

interface ServerChannelsProps {
  data: Server[];
}

const ServerChannels = (props: ServerChannelsProps) => {
  const jwtAxios = jwtAxiosInterceptor();
  const { data } = props;
  const theme = useTheme();
  const { serverId } = useParams();
  const navigate = useNavigate();
  const { isUserMember } = useMembershipContext();

  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channels, setChannels] = useState(data?.[0]?.channel_server || []);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setChannelName("");
  };

  const handleChannelNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(event.target.value);
  };

  const handleAddChannel = async () => {
    try {
      const response = await jwtAxios.post(
        `http://127.0.0.1:8000/api/server/${serverId}/channels/`,
        { name: channelName },
        { withCredentials: true }
      );
      console.log("Channel added:", response.data);
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error("Error adding channel:", error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await jwtAxios.get(
        `http://127.0.0.1:8000/api/server/${serverId}/channels/`,
        { withCredentials: true }
      );
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    if (!isUserMember) {
      navigate(`/server/${serverId}`);
    }
  }, [isUserMember, navigate, serverId]);

  useEffect(() => {
    fetchChannels();
  }, [serverId]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setLoggedInUserId(Number(userId));
    }
  }, []);

  const isOwner = loggedInUserId === data?.[0]?.owner?.id;

  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="body1"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {data?.[0]?.name || "Server"}
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {channels.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>No channels available.</Typography>
        ) : (
          channels.map((item) => (
            <ListItem disablePadding key={item.id} sx={{ display: "block", maxHeight: "40px" }} dense={true}>
              {isUserMember ? (
                <Link to={`/server/${serverId}/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItemButton sx={{ minHeight: 48 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" textAlign="start" paddingLeft={1}>
                          {item.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </Link>
              ) : (
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" textAlign="start" paddingLeft={1}>
                        {item.name} (Members Only)
                      </Typography>
                    }
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))
        )}
      </List>
      {isOwner && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          <Button
            onClick={handleOpen}
            variant="contained"
            sx={{ backgroundColor: "gray", color: "white" }}
          >
            Add Channel
          </Button>
        </Box>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Channel
          </Typography>
          <TextField
            label="Channel Name"
            variant="outlined"
            fullWidth
            value={channelName}
            onChange={handleChannelNameChange}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddChannel} disabled={!channelName}>
            Add Channel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ServerChannels;
