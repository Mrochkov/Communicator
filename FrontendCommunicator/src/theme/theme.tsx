import { createTheme, responsiveFontSizes } from "@mui/material";

declare module "@mui/material/styles" {
    interface Theme {
        navbar: {
            height: number;
        };
        draw: {
            width: number;
            closed: number;
        };
    }
    interface ThemeOptions {
        navbar: {
            height: number;
        };
        draw: {
            width: number;
            closed: number;
        };
    }
}

export const MuiTheme = () => {
    let theme = createTheme({

        typography: {
            fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        },
        navbar: {
            height: 50,
        },
        draw: {
            width: 240,
            closed: 70,
        },
        components:{
            MuiAppBar: {
                defaultProps:{
                    color: "default",
                    elevation: 0,
                },
            },
        },
    });
    theme = responsiveFontSizes(theme);
    return theme;

};
export default MuiTheme;