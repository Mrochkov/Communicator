import React from "react";

interface DarkModeContextProps {
    toggleDarkMode: () => void;
}

export const ModesContext = React.createContext<DarkModeContextProps>({
    toggleDarkMode: () => {},
});

