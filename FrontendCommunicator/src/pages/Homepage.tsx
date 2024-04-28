import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import SecondDraw from "./templates/SecondDraw.tsx";
import Main from "./templates/Main.tsx";
import TrendingChannels from "../components/Draw/TrendingChannels.tsx";

const Homepage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw>
                <TrendingChannels/>
            </Draw>
            <SecondDraw/>
            <Main/>
        </Box>
    );

};

export default Homepage;