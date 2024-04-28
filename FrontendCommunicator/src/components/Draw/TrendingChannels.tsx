import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import useCRUD from "../../hooks/useCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";


interface Server {
    id: number;
    name: string;
    category: string;
    icon: string;
}

type Props = {
    open: boolean;
};
const TrendingChannels: React.FC<Props> = ({open}) => {
    const {dataCRUD, error, isLoading, fetchData} = useCRUD<Server>([], "/server/select/");

    useEffect(() => {
        fetchData();
        }, []);

    useEffect(() => {
        console.log(dataCRUD);
    }, [dataCRUD]);

    return<>
        <Box sx={{ height: 50, p: 2, display: "flex", alignItems: "center", flex: "1 1 100%"}}>
            <Typography sx={{display: open ? "block" : "none"}}>
                Trending
            </Typography>
        </Box>
    </>;
};
export default TrendingChannels;