import {
    AppBar,
    Toolbar,
    Box,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    Drawer,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {MEDIA_URL} from "../../config.ts";
import {Server} from "../../@types/server";
import {useParams} from "react-router-dom";
import ServerChannels from "./ServerChannels.tsx";
import {useEffect, useState} from "react";
import {MoreVert} from "@mui/icons-material";
import JoinButton from "../Membership/JoinButton.tsx";

interface ServerChannelProps {
    data: Server[];
}
const TextingChannelsTemplate = (props: ServerChannelProps) => {
    const [sideMenu, setSideMenu] = useState(false)
    const { data } = props;
    const theme = useTheme();
    const { serverId, channelId } = useParams();
    const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

    useEffect(() => {
        if(isSmallScreen && sideMenu){
            setSideMenu(false);
        }
    }, [isSmallScreen]);

    const channelName =
        data
            ?.find((server) => server.id == Number(serverId))
            ?.channel_server?.find((channel) => channel.id === Number(channelId))
            ?.name || "home";

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
        <Box sx={{paddingTop: `${theme.navbar.height}px`, minWidth: 200 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}
        >
            <ServerChannels data={data} />
        </Box>
    );

    return (<>
        <AppBar sx={{backgroundColor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}`}} color="default" position="sticky" elevation={0}>
            <Toolbar variant="dense" sx={{minHeight: theme.navbar.height, height: theme.navbar.height, display:"flex", alignItems:"center"}}>
                <Box sx={{display: { xs: "block", sm: "none"} }}>
                    <ListItemAvatar sx={{ minWidth: "40px" }}>
                        <Avatar alt="Server Icon" src={`${MEDIA_URL}${data?.[0]?.icon}`} sx={{ width: 30, height:30 }}/>
                    </ListItemAvatar>
                </Box>
                <Typography noWrap component="div">
                    {channelName}
                </Typography>
                <Box sx={{ flexGrow: 1 }}></Box>
                <JoinButton />
                <Box sx={{display: {xs: "block", sm: "none"} }}>
                    <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
                        <MoreVert />
                    </IconButton>
                </Box>
                <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>
            </Toolbar>
        </AppBar>
    </>
    )
}
export default TextingChannelsTemplate;