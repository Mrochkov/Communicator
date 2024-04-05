import Homepage from "./components/Homepage"
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Homepage />} />
        </Route>
    )
);

const App = () => {
    return <RouterProvider router={router} />;

};

export default App;
