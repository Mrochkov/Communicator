import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import useCRUD from "../../hooks/useCRUD.ts";
import React, { useEffect } from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { MEDIA_URL } from "../../config.ts";
import { Link } from "react-router-dom";


type Props = {
    open: boolean;
};
const TrendingChannels: React.FC<Props> = ({open}) => {

    return<>
        <Box sx={{ height: 50, p: 2, display: "flex", alignItems: "center", flex: "1 1 100%"}}>
            <Typography sx={{display: open ? "block" : "none"}}>
                Trending
            </Typography>
        </Box>
    </>;
};
export default TrendingChannels;