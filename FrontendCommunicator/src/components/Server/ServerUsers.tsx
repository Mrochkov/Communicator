import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

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
  owner: { id: number };
}

interface ServerChannelsProps {
  data: Server[];
}

type Props = {
  open: boolean;
};

const ServerUsers: React.FC<Props & ServerChannelsProps> = ({ open, data }) => {
  const navigate = useNavigate();
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setLoggedInUserId(Number(userId));
    }
  }, []);

  const isOwner = (serverOwnerId: number) => loggedInUserId === serverOwnerId;

  const handleSettingsRedirect = (serverId: number) => {
    navigate(`/server/${serverId}/settings`);
  };

  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: "flex",
          alignItems: "center",
          flex: "1 1 100%",
        }}
      >
        <Typography sx={{ display: open ? "block" : "none" }}>
          Current server
        </Typography>
      </Box>

      <List>
        {data.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{ display: "block" }}
            dense
          >
            <Link
              to={`/server/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar alt="Server Icon" src={`${MEDIA_URL}${item.icon}`} />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
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
                      {item.category}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Divider />

      {data.map((server) => (
        <Box key={server.id} sx={{ p: 2 }}>
          <Typography variant="h6">Connected Members</Typography>
          <List>
            {server.member.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar
                    alt={user.username}
                    src={
                      user.avatar_url
                        ? `${MEDIA_URL}${user.avatar_url}`
                        : `${MEDIA_URL}default-avatar.jpg`
                    }
                  />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
          <Divider />

          {/* Show the button only for the owner */}
          {isOwner(server.owner.id) && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "gray", color: "white" }}
                onClick={() => handleSettingsRedirect(server.id)}
              >
                Server Settings
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </>
  );
};

export default ServerUsers;
