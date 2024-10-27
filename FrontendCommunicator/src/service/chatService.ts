import {useState} from "react";
import useWebSocket from "react-use-websocket";
import {useAuthService} from "./AuthService.ts";
import thisUseCRUD from "../hooks/thisUseCRUD.ts";
import {Server} from "../@types/server";
import {WEBSOCKET_URL} from "../config.ts";

interface Message {
    sender: string;
    content: string;
    timestamp: string;
}

const chatWebSocketHook = (channelId: string, serverId: string) => {
    const [newMessage, setNewMessage] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const { fetchData } = thisUseCRUD<Server>([], `/messages/?channel_id=${channelId}`);
    const {logout, refreshAccessToken} = useAuthService();

    const socketUrl = channelId ? `${WEBSOCKET_URL}/${serverId}/${channelId}` : null;


    const [reconnect,setReconnect] = useState(0);
    const maxReconnectAttempts = 4;
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
        onClose: (event: CloseEvent) => {
            if (event.code == 4001) {
                console.log("Authentication failed");
                refreshAccessToken().catch((error) => {
                    if(error.response && error.response.status === 401) {
                        logout();
                    }
                })
            }
            console.log("Connection closed");
            setReconnect((prevAttempt) => prevAttempt + 1);
        },
        onError: () => {
            console.log("Error");
        },
        onMessage: (msg) => {
            const data = JSON.parse(msg.data);
            setNewMessage((prev_msg) => [...prev_msg, data.new_message]);
            setMessage("");
        },
            shouldReconnect: (closeEvent) => {
            if(closeEvent.code === 4001 && reconnect >= maxReconnectAttempts) {
              setReconnect(0);
              return false;
            }
            return true;
            },
            reconnectInterval: 1000
        });

    return {
        newMessage,
        message,
        setMessage,
        sendJsonMessage
    }
}
export default chatWebSocketHook;
