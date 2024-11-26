import React, { Fragment, useState, useEffect } from "react";
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
import Chatbot from "../ChatBot/Chatbot.tsx";
import { MEDIA_URL } from "../../config.ts";
import JoinButton from "../Membership/JoinButton.tsx";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  sender_username?: string;
  sender_avatar?: string;
  reply_to?: Message;
}

interface ServerChannelProps {
  data: { name: string; description: string }[];
}

interface SendMessageData {
  type: string;
  message: string;
  reply_to?: string;
  [key: string]: any;
}

const TextingTemplate = (props: ServerChannelProps) => {
  const { serverId, channelId } = useParams();
  const { data } = props;
  const server_name = data?.[0]?.name ?? "Server";
  const theme = useTheme();
  const { newMessage, message, setMessage, sendJsonMessage } = chatWebSocketHook(channelId || "", serverId || "");
  const { isUserMember } = useMembershipContext();
  const [translatedMessages, setTranslatedMessages] = useState<Map<number, string>>(new Map());
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const jwtAxios = jwtAxiosInterceptor();
  const [useChatbot, setUseChatbot] = useState(false);

  const toggleChatbot = () => setUseChatbot((prev) => !prev);

  useEffect(() => {
    const savedReplyTo = localStorage.getItem("replyTo");
    if (savedReplyTo) {
      setReplyTo(JSON.parse(savedReplyTo));
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isUserMember) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (!isUserMember || !message.trim()) return;
    const messageData: SendMessageData = {
      type: "message",
      message,
    };
    if (replyTo) {
      messageData.reply_to = replyTo.id;
    }
    sendJsonMessage(messageData);
    setMessage("");
    setReplyTo(null);
    localStorage.removeItem("replyTo");
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
        "http://127.0.0.1:8000/translate/",
        { text: msgContent, to: "pl" },
        { withCredentials: true }
      );

      const translatedText = response.data[0]?.translations?.[0]?.text;

      if (translatedText) {
        setTranslatedMessages((prevMessages) => {
          const newMessages = new Map(prevMessages);
          newMessages.set(index, translatedText);
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Translation error:", error.response?.data || error.message);
    }
  };

  const handleReply = (msg: Message) => {
    setReplyTo(msg);
    localStorage.setItem("replyTo", JSON.stringify(msg));
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    localStorage.removeItem("replyTo");
  };

  return (
    <>
      <Button onClick={toggleChatbot}>
        {useChatbot ? "Back to Channels" : "Chat with Bot"}
      </Button>
      {useChatbot ? (
        <Chatbot />
      ) : (
        <TextingChannelsTemplate data={data} />
      )}
      {channelId === undefined ? (
        <Box
          sx={{
            overflow: "hidden",
            p: { xs: 0 },
            height: `calc(80vh)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" fontWeight={700} letterSpacing={"-0.5px"} sx={{ px: 5, maxWidth: "600" }}>
              Welcome to {server_name}
            </Typography>
            <Typography>{data?.[0]?.description ?? "This is our home"}</Typography>
            <Typography variant="h5" sx={{ py: "50px" }}>
              Become a member to start interacting with this server!
            </Typography>
            <JoinButton />
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
                        <Avatar
                          alt={msg.sender_username}
                          src={msg.sender_avatar ? `${MEDIA_URL}${msg.sender_avatar}` : `${MEDIA_URL}default-avatar.jpg`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{ fontSize: "12px", variant: "body2" }}
                        primary={
                          <>
                            <Typography component="span" variant="body1" color="text.primary" sx={{ display: "inline", fontWeight: 600 }}>
                              {msg.sender || "Unknown Sender"}
                            </Typography>
                            <Typography component="span" variant="caption" color="text.secondary">
                              {" at "}
                              {timeStampFormat(msg.timestamp)}
                            </Typography>
                          </>
                        }
                        secondary={
                          <Fragment>
                            {msg.reply_to && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ paddingLeft: 2, borderLeft: "2px solid", marginBottom: 1 }}
                              >
                                Replying to: {msg.reply_to.content}
                              </Typography>
                            )}
                            <Typography
                              variant="body1"
                              style={{
                                overflow: "visible",
                                whiteSpace: "normal",
                                textOverflow: "clip",
                              }}
                              sx={{ display: "inline", lineHeight: 1.2, fontWeight: 400, letterSpacing: "-0.2px" }}
                              component="span"
                              color="text.primary"
                            >
                              {translatedMessages.get(index) || msg.content}
                            </Typography>
                            <Button size="small" onClick={() => handleReply(msg)}>
                              Reply
                            </Button>
                            <Button size="small" onClick={() => handleTranslate(msg.content, index)}>
                              Translate
                            </Button>
                          </Fragment>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Scrolling>
          </Box>

          {replyTo && (
            <Box sx={{ padding: 1, backgroundColor: theme.palette.action.hover }}>
              <Typography variant="body2">
                Replying to:{" "}
                <Typography variant="body1" component="span" fontWeight={600}>
                  {replyTo.content}
                </Typography>
              </Typography>
              <Button size="small" onClick={handleCancelReply}>
                Cancel
              </Button>
            </Box>
          )}

          <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              style={{
                bottom: 0,
                right: 0,
                padding: "1rem",
                backgroundColor: theme.palette.background.default,
                zIndex: 1,
              }}
            >
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
