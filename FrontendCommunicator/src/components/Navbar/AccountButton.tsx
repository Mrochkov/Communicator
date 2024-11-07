import { Box, IconButton, Menu, MenuItem, Typography, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import DarkModeSwitch from "./DarkMode/DarkModeSwitch.tsx";
import { useState } from "react";
import { useAuthServiceContext } from "../../context/AuthContext.tsx";
import { Link } from "react-router-dom";

const AccountButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { username, logout } = useAuthServiceContext();

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={isMenuOpen}
            keepMounted
            onClose={handleMenuClose}
        >
            <MenuItem>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
                    <AccountCircle />
                </IconButton>


                <Typography
                    variant="h6"
                    component={Link}
                    to="/profile"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        marginLeft: 2,
                        marginRight: 10,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontSize: '1.2rem',
                    }}
                >
                    {username || "My Profile"}
                </Typography>
            </Box>

            <DarkModeSwitch />

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="inherit" onClick={logout}>
                    Logout
                </Button>
            </Box>

            {renderMenu}
        </Box>
    );
};

export default AccountButton;
