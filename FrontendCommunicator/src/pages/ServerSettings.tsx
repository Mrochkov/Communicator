import React, { useEffect, useState } from "react";
import { Box, Button, Divider, List, Typography, ListItem, ListItemAvatar, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import jwtAxiosInterceptor from "../axios/jwtinterceptor";
import {MEDIA_URL} from "../config.ts";

const ServerSettings: React.FC = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const [serverDetails, setServerDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
                  <ListItem key={channel.id}>
                    <Typography variant="body1">{channel.name}</Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No channels found.</Typography>
            )}
          </Box>
        </>
      ) : (
        <Typography>Server details not found.</Typography>
      )}
    </Box>
  );
};

export default ServerSettings;
