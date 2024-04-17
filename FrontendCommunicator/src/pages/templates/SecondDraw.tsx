import {Box, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import axios from "axios";
const SecondDraw = () => {
    const theme = useTheme();

    axios.get('http://127.0.0.1:8000/api/server/select/?category=cat1').then(response => {
        console.log(response.data);
    }).catch(error => {
        console.log(error);
    });

    return (
        <Box sx={{minWidth: `${theme.secondDraw.width}px`,
            height: `calc(100vh - ${theme.navbar.height}px )`,
            mt: `${theme.navbar.height}px`,
            borderRight: `1px solid ${theme.palette.divider}`,
            display: { xs: "none", sm: "block"},
            overflow: "auto"
        }}>
            {[...Array(100)].map((_, i) => (
                <Typography key={i} paragraph>{i + 1}</Typography>
            ))}
        </Box>
    );
};
export default SecondDraw;