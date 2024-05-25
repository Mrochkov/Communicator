import React, {useEffect, useMemo, useState} from "react";
import {CssBaseline, ThemeProvider, useMediaQuery} from "@mui/material";
import {ModesContext} from "../context/DarkModeContext.tsx"
import MuiTheme from "../theme/theme.tsx";
import Cookies from "js-cookie";

interface ToggleDarkModeProps {
    children: React.ReactNode
}

const ToggleDarkMode: React.FC<ToggleDarkModeProps> = ({children}) => {

    const [mode, setMode] = useState<"light" | "dark">(
        () => Cookies.get("lightMode") as "light" | "dark"
    ) || (useMediaQuery("([prefers-scheme: dark])") ? "dark" : "light");

    const toggleDarkMode = React.useCallback(() => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    }, []);

    useEffect(() => {
        Cookies.set("lightMode", mode);
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