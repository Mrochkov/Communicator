import React, { useEffect, useMemo, useState, useCallback } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { ModesContext } from "../context/DarkModeContext.tsx";
import MuiTheme from "../theme/theme.tsx";
import Cookies from "js-cookie";

interface ToggleDarkModeProps {
  children: React.ReactNode;
}

const ToggleDarkMode: React.FC<ToggleDarkModeProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const getInitialMode = () => {
    const cookieMode = Cookies.get("lightMode") as "light" | "dark" | undefined;
    if (cookieMode) {
      return cookieMode;
    }
    return prefersDarkMode ? "dark" : "light";
  };

  const [mode, setMode] = useState<"light" | "dark">(getInitialMode);

  const toggleDarkMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    Cookies.set("lightMode", mode, { expires: 365 });
  }, [mode]);

  const lightMode = useMemo(() => ({ toggleDarkMode }), [toggleDarkMode]);

  const theme = useMemo(() => MuiTheme(mode), [mode]);

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
