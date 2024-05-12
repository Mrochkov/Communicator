import {Box} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import React from "react";

type SecondDrawProps = {
    children: React.ReactNode;
};

const SecondDraw = ({children}: SecondDrawProps) => {
    const theme = useTheme();

    return (
        <Box sx={{minWidth: `${theme.secondDraw.width}px`,
            height: `calc(100vh - ${theme.navbar.height}px )`,
            mt: `${theme.navbar.height}px`,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: { xs: "none", sm: "block"},
            overflow: "auto"
        }}>
            {children}
        </Box>
    );
};
export default SecondDraw;