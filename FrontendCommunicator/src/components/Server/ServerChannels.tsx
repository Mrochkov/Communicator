import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";
import {useTheme} from "@mui/material/styles";

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
}

const ServerChannels = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const {dataCRUD, error, isLoading, fetchData} = thisUseCRUD<Category>([], "/server/category/");


    useEffect(() => {
        fetchData();
        }, []);

    return <>
    <Box sx={{height: "50px", display: "flex", alignItems: "center", px:2, borderBottom: `1px solid ${theme.palette.divider}`, position: "sticky", top: 0, backgroundColor: theme.palette.background.default,}}>
    Explore
    </Box>
    <List sx={{ py: 0 }}>
        {dataCRUD.map((item) => (
            <ListItem disablePadding key={item.id} sx={{display: "block"}} dense={true}>
                <Link to={`/explore/${item.name}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItemButton sx={{minHeight: 48}}>
                        <ListItemIcon sx={{minWidth: 0, justifyContent: "center"}}>
                            <ListItemAvatar sx={{minWidth: "0px"}}>
                                <img alt="server Icon" src={`${MEDIA_URL}${item.icon}`} style={{width: "25px", height: "25px", display: "block", margin: "auto", filter: isDarkMode ? "invert(100%)" : "none"}}/>
                            </ListItemAvatar>
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body1" textAlign="start" paddingLeft={1}>{item.name}</Typography>} />
                    </ListItemButton>
                </Link>
            </ListItem>
        ))}
    </List>
    </>;
};
export default ServerChannels;