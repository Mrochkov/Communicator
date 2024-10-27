import Homepage from "./pages/Homepage.tsx"
import { Route, Routes, BrowserRouter} from "react-router-dom";
import Explore from "./pages/Explore.tsx";
import ToggleDarkMode from "./components/ToggleDarkMode.tsx";
import Server from "./pages/Server.tsx";
import Login from "./pages/Login.tsx";
import {AuthServiceProvider} from "./context/AuthContext.tsx";
import TestLogin from "./pages/TestLogin.tsx";
import ProtectedRoute from "./service/ProtectedRoute.tsx";


const App = () => {
    return (
        <BrowserRouter>
            <AuthServiceProvider>
                <ToggleDarkMode>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/server/:serverId/:channelId?" element={
                                <Server />
                        }
                        />
                        <Route path="/explore/:categoryName" element={<Explore />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/testlogin" element={
                            <ProtectedRoute>
                                <TestLogin />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </ToggleDarkMode>
            </AuthServiceProvider>
        </BrowserRouter>
        );
};




export default App;
