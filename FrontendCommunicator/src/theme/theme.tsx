import { createTheme, responsiveFontSizes } from "@mui/material";

declare module "@mui/material/styles" {
    interface Theme {
        navbar: {
            height: number;
        };
    }
    interface ThemeOptions {
        navbar: {
            height: number;
        };
    }
}

export const MuiTheme = () => {
    let theme = createTheme({

        typography: {
            fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
        },
        navbar: {
            height:50,
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