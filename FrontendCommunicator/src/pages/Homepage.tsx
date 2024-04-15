import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";
import Draw from "./templates/Draw.tsx";

const Homepage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            <Draw>

            </Draw>
        </Box>
    );

};

export default Homepage;