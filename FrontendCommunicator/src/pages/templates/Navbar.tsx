import {AppBar, Box, Drawer, IconButton, Link, Toolbar, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';
import {useEffect, useState} from "react";
import Explore from "../Explore.tsx";
import AccountButton from "../../components/Navbar/AccountButton.tsx";
import TrendingChannels from "../../components/Draw/TrendingChannels.tsx";

const Navbar = () => {
    const [sideMenu, setSideMenu] = useState(false)
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

    useEffect(() => {
        if(isSmallScreen && sideMenu){
            setSideMenu(false);
        }
    }, [isSmallScreen]);
    const toggleDrawer =
        (open: boolean) => (event: React.MouseEvent | React.KeyboardEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                (event as React.KeyboardEvent).key === "Shift")
            )   {
                return;
            }
            setSideMenu(open);
    };

    const list = () => (
        <Box sx={{paddingTop: `${theme.navbar.height}px`, minWidth: 200 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <Explore />
        </Box>
    );
    
    return (
    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 2, backGroundColor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar variant="dense"
                 sx={{
                     height: theme.navbar.height,
                     minHeight: theme.navbar.height
                }}
        >

            <Box sx={{display: {xs: "block", sm: "none"}}}>
                <IconButton color="inherit" aria-label="open drawer" edge="start" sx={{mr:2}} onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            </Box>

            <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
                <Box sx={{mt: 5}}>
                <TrendingChannels />
                </Box>
            </Drawer>

            <Link href="/" underline="none" color="inherit">
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        display: {fontWeight: 700,
                            letterSpacing: "-0.5px"}
                    }}
                >
                    Home
                </Typography>
            </Link>
            <Box sx={{ flexGrow: 1 }}></Box>
            <AccountButton />
        </Toolbar>
    </AppBar>


    );


}
export default Navbar