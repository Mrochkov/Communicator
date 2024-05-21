import Homepage from "./pages/Homepage.tsx"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import {MuiTheme} from "./theme/theme.tsx";
import Explore from "./pages/Explore.tsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Homepage />} />
            <Route path="/explore/:categoryName" element={<Explore />} />
        </Route>
    )
);

const App = () => {
    const theme = MuiTheme();
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
        );
};




export default App;
