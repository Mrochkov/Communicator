import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import SecondDraw from "./templates/SecondDraw.tsx";
import Main from "./templates/Main.tsx";
import TextingTemplate from "../components/Server/TextingTemplate.tsx";
import ServerChannels from "../components/Server/ServerChannels.tsx";
import ServerUsers from "../components/Server/ServerUsers.tsx";

const Server = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw>
                <ServerUsers open={false} />
            </Draw>
            <SecondDraw>
                <ServerChannels />
            </SecondDraw>
            <Main>
                <TextingTemplate />
            </Main>
        </Box>
    );

};

export default Server;