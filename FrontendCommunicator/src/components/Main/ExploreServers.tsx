import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";
import {Grid} from "@mui/material/Grid";
import {CardContent} from "@mui/material/CardContent";
import {Card} from "@mui/material/Card";
import {CardMedia} from "@mui/material/CardMedia";


interface Server {
    id: number;
    name: string;
    category: string;
    icon: string;
}

const ExploreServers = () => {
    return <></>
}
export default ExploreServers;