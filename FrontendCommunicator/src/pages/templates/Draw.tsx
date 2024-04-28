import {Box, useMediaQuery, styled} from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import DrawToggle from "../../components/Draw/DrawToggle.tsx";
import MuiDrawer from "@mui/material/Drawer";

type Props = {
    children: ReactNode;
};

type ChildProps = {
    open: boolean;
};

type ChildElement = React.ReactElement<ChildProps>;

const Draw: React.FC<Props> = ({children}) => {
    const theme = useTheme();
    const below600 = useMediaQuery("(max-width: 599px)")
    const [open, setOpen] = useState(!below600);


    const openedMixin = () => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
    });

    const closedMixin = () => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
        width: theme.draw.closed,
    });

    const Drawer = styled(MuiDrawer, {})(({ theme, open }) => ({
        width: theme.draw.width,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            ...openedMixin(),
            "& .MuiDrawer-paper": openedMixin(),
        }),
        ...(!open && {
            ...closedMixin(),
            "& .MuiDrawer-paper": closedMixin(),
        }),
    }));

    useEffect(() => {
        setOpen(!below600);
    }, [below600]);

    const handleDrawOpen = () => {
        setOpen(true);
    };

    const handleDrawClose = () => {
        setOpen(false);
    };

    return(

    <Drawer open={open} variant={below600 ? "temporary" : "permanent"}
    PaperProps={{
        sx:{mt: `${theme.navbar.height}px`, height: `calc(100vh - ${theme.navbar.height}px )`,
        width: theme.draw.width,
        },
    }}
    >
        <Box>
            <Box sx={{position: "absolute", top: 0, right: 0, p: 0, width: open ? "auto" : "100%"}}>
                <DrawToggle
                    open={open}
                    handleDrawClose={handleDrawClose}
                    handleDrawOpen={handleDrawOpen} />

            </Box>
            {React.Children.map(children, (child) => {
                    return React.isValidElement(child)
                    ? React.cloneElement(child as ChildElement, {open}) : child;
                })}
        </Box>
    </Drawer>
    );
};
export default Draw;