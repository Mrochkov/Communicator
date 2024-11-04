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
import { Link, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Server } from "../../@types/server";
import axios from "axios";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";
import {withConverter} from "js-cookie";

interface ServerChannelsProps {
  data: Server[];
}

const ServerChannels = (props: ServerChannelsProps) => {
  const jwtAxios = jwtAxiosInterceptor();
  const { data } = props;
  const theme = useTheme();
  const server_name = data?.[0]?.name ?? "Server";
  const { serverId } = useParams();

  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");

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
        const response = await jwtAxios.post(`http://127.0.0.1:8000/api/server/${serverId}/channels/`, {
            name: channelName,
        }, { withCredentials: true });
        console.log('Channel added:', response.data);
        handleClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error adding channel:', error.response?.data || error.message);
            if (error.response) {
                // Log more detailed error information
                console.error('Error Status:', error.response.status);
                console.error('Error Data:', error.response.data);
                console.error('Error Headers:', error.response.headers);
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
};

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
          {server_name}
        </Typography>
      </Box>
      <List sx={{ py: 0 }}>
        {data.flatMap((obj) =>
          obj.channel_server.map((item) => (
            <ListItem
              disablePadding
              key={item.id}
              sx={{ display: "block", maxHeight: "40px" }}
              dense={true}
            >
              <Link
                to={`/server/${serverId}/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
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
            </ListItem>
          ))
        )}
      </List>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{ m: 2 }}
      >
        Add Channel
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddChannel}
            disabled={!channelName}
          >
            Add Channel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ServerChannels;
