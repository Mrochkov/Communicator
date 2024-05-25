import Homepage from "./pages/Homepage.tsx"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import {MuiTheme} from "./theme/theme.tsx";
import Explore from "./pages/Explore.tsx";
import ToggleDarkMode from "./components/ToggleDarkMode.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Homepage />} />
            <Route path="/explore/:categoryName" element={<Explore />} />
        </Route>
    )
);

const App = () => {
    return (
        <ToggleDarkMode>
            <RouterProvider router={router} />
        </ToggleDarkMode>
        );
};




export default App;
