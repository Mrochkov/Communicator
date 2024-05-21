import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Container} from "@mui/material";
import thisUseCRUD from "../../hooks/thisUseCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import {Link, useParams} from "react-router-dom";
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
    const { categoryName } = useParams();
    const url = categoryName ? `/server/select/?category=${categoryName}` : "/server/select";
    const { dataCRUD, fetchData } = thisUseCRUD<Server>([], url)

    useEffect(() => {
        fetchData();
    }, [categoryName]);

    return <>
        <Container maxWidth="lg">
            <Box sx={{ pt: 6 }}>
                <Typography variant="h3" noWrap component="h1"
                            sx={{display: {sm: "block", fontWeight: 700, fontSize: "48px", letterSpacing: "-2px"}, textAlign: {xs: "cemter", sm: "left" },
                            }}
                >
                    {categoryName ? categoryName : "Trending Channels"}
                </Typography>
            </Box>
        </Container>
    </>
}
export default ExploreServers;