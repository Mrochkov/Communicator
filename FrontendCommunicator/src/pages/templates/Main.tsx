import {Box, Typography} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Main = () => {
    const theme = useTheme();

    return(
        <Box sx={{ flexGrow: 1,
            mt: `${theme.navbar.height}px`,
            height: `calc(100vh - ${theme.navbar.height}px )`,
            overflow: "hidden",
        }}>
            {[...Array(100)].map((_, i) => (
                <Typography key={i} paragraph>{i + 1}</Typography>
            ))}
        </Box>

    );
};
export default Main;