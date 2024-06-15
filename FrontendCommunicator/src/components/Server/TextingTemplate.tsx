import useWebSocket from "react-use-websocket";
import {useState} from "react";


const socketUrl = "ws://127.0.0.1:8000/ws/test";



const textingTemplate = () => {
    const [newMessage, setNewMessage] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
        console.log("Connected");
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
    <div>
        {newMessage.map((msg, index) => {
            return(
                <div key={index}>
                    <p>
                        {msg}
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

    );

};
export default textingTemplate;