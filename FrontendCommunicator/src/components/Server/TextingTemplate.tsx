import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, List, ListItem, ListItemText, TextField, Typography, Button } from "@mui/material";
import TextingChannelsTemplate from "./TextingChannelsTemplate.tsx";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useTheme } from "@mui/material/styles";
import Scrolling from "../Main/Scrolling.tsx";
import chatWebSocketHook from "../../service/chatService.ts";
import { useMembershipContext } from "../../context/MembershipContext.tsx";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  translatedContent?: string; // Add translatedContent as optional field
}

interface ServerChannelProps {
  data: { name: string; description: string }[];
}

interface SendMessageData {
  type: string;
  message: string;
  [key: string]: any;
}

const TextingTemplate = (props: ServerChannelProps) => {
  const { serverId, channelId } = useParams();
  const { data } = props;
  const server_name = data?.[0]?.name ?? "Server";
  const theme = useTheme();
  const { newMessage, message, setMessage, sendJsonMessage } = chatWebSocketHook(channelId || "", serverId || "");
  const { isUserMember } = useMembershipContext();
  const [translatedMessages, setTranslatedMessages] = useState<Map<number, string>>(new Map()); // Map to store translations
  const jwtAxios = jwtAxiosInterceptor();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isUserMember) {
      e.preventDefault();
      sendJsonMessage({
        type: "message",
        message,
      } as SendMessageData);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUserMember) {
      sendJsonMessage({
        type: "message",
        message,
      } as SendMessageData);
    }
  };

  function timeStampFormat(timestamp: string): string {
    const date = new Date(Date.parse(timestamp));
    const dateFormatted = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hourCycle: "h24" });
    return `${dateFormatted} at ${timeFormatted}`;
  }

  const handleTranslate = async (msgContent: string, index: number) => {
  try {
    const response = await jwtAxios.post(
      'http://127.0.0.1:8000/translate/', // Django API
      {
        text: msgContent,
        to: 'pl'
      },
      { withCredentials: true }
    );

    console.log("API Response:", response.data);

    const translatedText = response.data[0]?.translations?.[0]?.text;

    if (translatedText) {
      setTranslatedMessages(prevMessages => {
        const newMessages = new Map(prevMessages);
        newMessages.set(index, translatedText);
        console.log('Updated Translated Messages:', newMessages);
        return newMessages;
      });
    } else {
      console.error("Translation text is missing in the response");
    }
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
  }
};

  return (
    <>
      <TextingChannelsTemplate data={data} />
      {channelId === undefined ? (
        <Box sx={{ overflow: "hidden", p: { xs: 0 }, height: `calc(80vh)`, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} letterSpacing={"-0.5px"} sx={{ px: 5, maxWidth: "600" }}>
              Welcome to {server_name}
            </Typography>
            <Typography>{data?.[0]?.description ?? "This is our home"}</Typography>
            <Typography sx={{ py: "50px" }}>Choose a channel to start talking!</Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{ overflow: "hidden", p: 0, height: `calc(100vh - 100px)` }}>
            <Scrolling>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {newMessage.map((msg: Message, index: number) => {
                  return (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="user image" />
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: "12px", variant: "body2" }}
                        primary={
                          <>
                            <Typography component="span" variant="body1" color="text.primary" sx={{ display: "inline", fontWeight: 600 }}>
                              {msg.sender}{msg.sender_id}
                            </Typography>
                            <Typography component="span" variant="caption" color="text.secondary">
                              {" at "}{timeStampFormat(msg.timestamp)}
                            </Typography>
                          </>
                        }
                        secondary={
                          <Fragment>
                            <Typography
                              variant="body1"
                              style={{ overflow: "visible", whiteSpace: "normal", textOverflow: "clip" }}
                              sx={{ display: "inline", lineHeight: 1.2, fontWeight: 400, letterSpacing: "-0.2px" }}
                              component="span"
                              color="text.primary"
                            >
                              {msg.content}
                            </Typography>

                            {translatedMessages.has(index) ? (
                              <Typography variant="body1" color="text.secondary" sx={{ marginLeft: "10px" }} component="span">
                                {translatedMessages.get(index)}
                              </Typography>
                            ) : (
                              <Button onClick={() => handleTranslate(msg.content, index)}>Translate</Button>
                            )}
                          </Fragment>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Scrolling>
          </Box>

          <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
            <form onSubmit={handleSubmit} style={{ bottom: 0, right: 0, padding: "1rem", backgroundColor: theme.palette.background.default, zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  multiline
                  value={message}
                  minRows={1}
                  maxRows={4}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ flexGrow: 1, marginRight: 1 }}
                  disabled={!isUserMember}
                />
                <Button type="submit" variant="contained" sx={{ height: "100%" }} disabled={!isUserMember || !message.trim()}>
                  Send
                </Button>
              </Box>
            </form>
          </Box>
        </>
      )}
    </>
  );
};

export default TextingTemplate;
