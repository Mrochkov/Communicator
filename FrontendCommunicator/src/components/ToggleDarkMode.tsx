import React, {useEffect, useMemo, useState} from "react";
import {CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import {ModesContext} from "../context/DarkModeContext.tsx"
import MuiTheme from "../theme/theme.tsx";

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

    const theme = React.useMemo(() => MuiTheme(mode), [mode]);

    return (
        <ModesContext.Provider value={lightMode}>

            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ModesContext.Provider>
    );
};
export default ToggleDarkMode;