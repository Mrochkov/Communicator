import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import SecondDraw from "./templates/SecondDraw.tsx";
import Main from "./templates/Main.tsx";
import TextingTemplate from "../components/Server/TextingTemplate.tsx";
import ServerChannels from "../components/Server/ServerChannels.tsx";
import ServerUsers from "../components/Server/ServerUsers.tsx";
import {useNavigate, useParams} from "react-router-dom";
import thisUseCRUD from "../hooks/thisUseCRUD.ts";
import { Server } from "../@types/server"
import {useEffect} from "react";

const Server = () => {
    const navigate = useNavigate();
    const { serverId, channelId } = useParams();
    const { dataCRUD, error, isLoading, fetchData } = thisUseCRUD<Server>(
        [],
        `/server/select/?by_server_id=${serverId}`
    );

    if (error !== null && error.message === "400"){
        navigate("/");
        return null;
    }


    useEffect(() => {
        fetchData()
    }, [] );


    const isCorrectChannel = (): Boolean => {
        if (!channelId) {
            return true;
        }
        return dataCRUD.some((server) =>
            server.channel_server.some(
                (channel) => channel.id === parseInt(channelId)
            )
        );
    };

    useEffect(() =>{
        if (!isCorrectChannel()) {
            navigate(`/server/${serverId}`);
        }
    }, [isCorrectChannel, channelId]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw>
                <ServerUsers open={false} data={dataCRUD} />
            </Draw>
            <SecondDraw>
                <ServerChannels data={dataCRUD} />
            </SecondDraw>
            <Main>
                <TextingTemplate data={dataCRUD} />
            </Main>
        </Box>
    );

};

export default Server;