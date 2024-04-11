import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import GuestLayout from "./components/GuestLayout";
import DefaultLayout from "./components/DefaultLayout";
import TodoList from "./views/TodoList";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/todos",
                element: <TodoList />,
            },
        ],
    },

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
]);

export default router;
