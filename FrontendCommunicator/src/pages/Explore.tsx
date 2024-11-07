import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import SecondDraw from "./templates/SecondDraw.tsx";
import Main from "./templates/Main.tsx";
import TrendingChannels from "../components/Draw/TrendingChannels.tsx";
import Explore from "../components/SecondDraw/Explore.tsx";
import ExploreServers from "../components/Main/ExploreServers.tsx";


const Homepage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw>
                <TrendingChannels open={false} />
            </Draw>
            <SecondDraw>
                <Explore />
            </SecondDraw>
            <Main>
                <ExploreServers />
            </Main>

        </Box>
    );

};

export default Homepage;