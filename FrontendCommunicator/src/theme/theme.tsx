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
        secondDraw: {
            width: number;
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
        secondDraw: {
            width: number;
        };
    }
}

export const MuiTheme = () => {
    let theme = createTheme({

        typography: {
            fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
            body1: {
            fontWeight: 500,
            letterSpacing: "-0.5px"
            },
        },
        navbar: {
            height: 50,
        },
        draw: {
            width: 240,
            closed: 70,
        },
        secondDraw: {
            width: 240,
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