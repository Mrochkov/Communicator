import React, {useEffect, useMemo, useState} from "react";
import {createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";


interface ToggleDarkModeProps {
    children: React.ReactNode
}

const ToggleDarkMode: React.FC<ToggleDarkModeProps> = ({children}) => {

    const [mode, setMode] = useState<"light" | "dark">(
        () => (localStorage.getItem("lightMode") as "light" | "dark"
    ) || (useMediaQuery("([prefers-scheme: dark") ? "dark" : "light");

    const toggleDarkMode = React.useCallback(() => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    }, []);

    useEffect(() => {
        localStorage.setItem("lightMode", mode);
    }, [mode]);

    const lightMode = useMemo(() => ({toggleDarkMode}), [toggleDarkMode]);

    const theme = React.useMemo(() => createMuiTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider values={lightMode}>

            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
export default ToggleDarkMode;