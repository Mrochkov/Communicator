import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";
import {useTheme} from "@mui/material/styles";

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
}

const Explore = () => {
    const theme = useTheme();
    const {dataCRUD, error, isLoading, fetchData} = thisUseCRUD<Category>([], "/server/category/");


    useEffect(() => {
        fetchData();
        }, []);

    return <>
    <Box sx={{height: "50px", display: "flex", alignItems: "center", px:2, borderBottom: `1px solid ${theme.palette.divider}`, position: "sticky", top: 0, backgroundColor: theme.palette.background.default,}}>
    Explore
    </Box>

    </>;
};
export default Explore;