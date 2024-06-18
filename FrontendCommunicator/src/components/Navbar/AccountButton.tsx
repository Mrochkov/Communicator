import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import DarkModeSwitch from "./DarkMode/DarkModeSwitch.tsx";
import { useState } from "react";

const AccountButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const renderMenu = (
        <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={isMenuOpen} keepMounted onClose={handleMenuClose}>
            <MenuItem>
                <DarkModeSwitch />
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircle />
            </IconButton>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' }, marginLeft: 1 }}>
                My Profile
            </Typography>
            {renderMenu}
        </Box>
    );
};

export default AccountButton;
