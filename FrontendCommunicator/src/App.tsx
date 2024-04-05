import Homepage from "./components/Homepage"
import {createBrowserRouter, createRoutesFromElements, Route, RouteProvider} from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Homepage />} />
        </Route>
    )
);

const App: React.FC = () => {
    return <RouteProvider router={router} />;

};

export default App;
