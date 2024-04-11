import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ContextProvider } from "./Context/ContextProvider";
import "./index.css";
import Router from "./router";
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
            <RouterProvider router={Router} />
        </ContextProvider>
    </React.StrictMode>
);
