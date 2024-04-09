import {Box, CssBaseline} from "@mui/material";
import Navbar from "./templates/Navbar.tsx";

const Homepage = () => {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline/>
            <Navbar/>
            Welcome
        </Box>
    );

};

export default Homepage;