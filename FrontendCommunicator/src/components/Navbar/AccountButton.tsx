import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DarkModeSwitch from "./DarkMode/DarkModeSwitch.tsx";

const AccountButton = () => {
    const renderMenu = (
        <Menu open={true}>
            <MenuItem>
                <Brightness4Icon sx={{ marginRight: "6px", fontSize: "20px"}} />
                <DarkModeSwitch />
            </MenuItem>
        </Menu>
    );



    return(
        <Box sx={{display: {xs: "flex"} }}>
            <IconButton edge="end" color="inherit">
                <AccountCircle />
            </IconButton>
            {renderMenu}
        </Box>
    );
};
export default AccountButton;