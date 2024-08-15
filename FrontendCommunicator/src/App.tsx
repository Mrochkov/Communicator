import Homepage from "./pages/Homepage.tsx"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Explore from "./pages/Explore.tsx";
import ToggleDarkMode from "./components/ToggleDarkMode.tsx";
import Server from "./pages/Server.tsx";
import Login from "./pages/Login.tsx";
import {AuthServiceProvider} from "./context/AuthContext.tsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Homepage />} />
            <Route path="/server/:serverId/:channelId?" element={<Server />} />
            <Route path="/explore/:categoryName" element={<Explore />} />
            <Route path="/login" element={<Login />} />
        </Route>
    )
);

const App = () => {
    return (
        <AuthServiceProvider>
            <ToggleDarkMode>
                <RouterProvider router={router} />
            </ToggleDarkMode>
        </AuthServiceProvider>
        );
};




export default App;
