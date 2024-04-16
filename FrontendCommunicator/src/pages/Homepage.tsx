import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";
import SecondDraw from "./templates/SecondDraw.tsx";
import Main from "./templates/Main.tsx";

const Homepage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw></Draw>
            <SecondDraw/>
            <Main/>
        </Box>
    );

};

export default Homepage;