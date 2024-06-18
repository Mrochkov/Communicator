import useWebSocket from "react-use-websocket";
import {useState} from "react";
import {useParams} from "react-router-dom";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import { Server } from "../../@types/server";
import {Box, List, ListItem, ListItemText, Typography} from "@mui/material";
import TextingChannelsTemplate from "./TextingChannelsTemplate.tsx";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

interface ServerChannelProps {
    data: Server[];

}

const textingTemplate = (props: ServerChannelProps) => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { serverId, channelId } = useParams();
    const {data } = props;
    const server_name = data?.[0]?.name ?? "Server";
    const { fetchData } = thisUseCRUD<Server>([], `/messages/?channel_id=${channelId}`);

    const socketUrl = channelId ? `ws://127.0.0.1:8000/${serverId}/${channelId}` : null;


    const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: async () => {
        try{
            const data = await fetchData();
            setNewMessage([])
            setNewMessage(Array.isArray(data) ? data : [])
        } catch (error){
            console.log(error);
        }
    },
    onClose: () => {
        console.log("Closed");
    },
    onError: () => {
        console.log("Error");
    },
    onMessage: (msg) => {
        const data = JSON.parse(msg.data);
        setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
    },
});

    return (
        <>
            <TextingChannelsTemplate data={data} />
            {channelId == undefined ? (<Box sx={{overflow: "hidden", p: {xs: 0}, height: `calc(80vh)`, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Box sx={{textAlign: "center"}}>
                    <Typography variant="h4" fontWeight={700} letterSpacing={"-0.5px"} sx={{px: 5, maxWidth: "600"}}>
                        Welcome to {server_name}
                    </Typography>
                    <Typography>{data?.[0]?.description ?? "This is our home"}</Typography>
                    <Typography sx={{py: "50px"}}>Choose a channel to start talking!</Typography>

                </Box>
            </Box>
            )
            :
            (
                    <Box sx={{overflow: "hidden", p:0, height: `calc(100vh - 100px)` }}>
                        <List sx={{width: "100%", bgcolor: "background.paper" }}>
                            {newMessage.map((msg: Message, index: number) => {
                                return(
                                    <ListItem key={index} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt="user image" />
                                        </ListItemAvatar>
                                        <ListItemText primaryTypographyProps={{fontSize: "12px", variant: "body2"}}
                                                      primary={<Typography component="span" variant="body1" color="text.primary" sx={{display: "inline", fontWeight: 600}} >{msg.sender_id}</Typography>}
                                        secondary={
                                            <Box>
                                                <Typography variant="body1" style={{overflow: "visible", whiteSpace: "normal", textOverflow: "clip"}} sx={{display: "inline", lineHeight: 1.2, fontWeight: 400, letterSpacing: "-0.2px"}} component="span" color="text.primary">
                                                    {msg.content}
                                                </Typography>
                                            </Box>
                                        }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>)}


            {/*<div>
                {newMessage.map((msg: Message, index: number) => {
                    return(
                        <div key={index}>
                            <p>
                                {msg.sender}
                            </p>
                            <p>
                                {msg.content}
                            </p>
                        </div>
                    );
                })}
                <form>
                    <label>
                    Enter Message:
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />

                    </label>
                </form>
                <button onClick={() => {sendJsonMessage({type: "message", message});
                }}
                >
                    Send message
                </button>
            </div>
            */}
        </>

    );

};
export default textingTemplate;