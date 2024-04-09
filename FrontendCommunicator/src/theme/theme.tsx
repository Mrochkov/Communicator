import { createTheme } from "@mui/material";

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
    return theme;

};
export default MuiTheme;