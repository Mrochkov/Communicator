import React, { Fragment, useState, useEffect, useRef } from "react";
import { Box, List, ListItem, ListItemText, TextField, Typography, Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import jwtAxiosInterceptor from "../../axios/jwtinterceptor.ts";

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const senderId = "You";
  const jwtAxios = jwtAxiosInterceptor();
  const scrollRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "You", content: input, timestamp: new Date().toISOString() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await jwtAxios.post(
        "http://127.0.0.1:8000/chatbot/response/",
        {
          sender: senderId,
          message: input,
        },
        { withCredentials: true }
      );

      const botResponses = response.data;
      botResponses.forEach((botReply: any) => {
        const botMessage: Message = {
          sender: "Bot",
          content: botReply.text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      });
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", content: "Sorry, I'm having trouble right now.", timestamp: new Date().toISOString() },
      ]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box>
      <Box
        ref={scrollRef}
        sx={{
          height: 600,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          mb: 2, // Margin below the chat area
        }}
      >
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {messages.map((msg, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={msg.sender === "User" ? "User Avatar" : "Bot Avatar"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>
                      {msg.sender}
                    </Typography>
                    <Typography component="span" variant="caption" sx={{ marginLeft: "10px" }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <Typography variant="body1" color="text.primary">
                    {msg.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", p: 1, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          placeholder="Type a message to the bot..."
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={sendMessage} variant="contained" sx={{ marginLeft: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
