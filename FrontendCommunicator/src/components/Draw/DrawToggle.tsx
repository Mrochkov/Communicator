import {Box, IconButton} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import React from "react";

type Props = {
    open: boolean;
    handleDrawOpen: () => void;
    handleDrawClose: () => void;
};

const DrawToggle: React.FC<Props> = ({open, handleDrawClose, handleDrawOpen}) => {
    return (
        <Box sx={{height: "50px", display: "flex", alignItems: "center", justifyContent: "center", }}>
            <IconButton onClick={open ? handleDrawClose : handleDrawOpen}>
                {open ? <ChevronLeft/> : <ChevronRight/>}
            </IconButton>
        </Box>
    )
}
export default DrawToggle;