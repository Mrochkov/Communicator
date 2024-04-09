import {AppBar, Link, Toolbar, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles"

const Navbar = () => {
    const theme = useTheme();
    return (
    <AppBar sx={{ backGroundColor: theme.palette.background.default, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar variant="dense"
                 sx={{
                     height: theme.navbar.height,
                     minHeight: theme.navbar.height
                }}
        >

            <Link href="/" underline="none" color="inherit">
                <Typography variant="h6" noWrap component="div" sx={{ display: {fontWeight: 700, letterSpacing: "-0.5px"} }}>

                </Typography>
            </Link>
        </Toolbar>
    </AppBar>


    );


}
export default Navbar