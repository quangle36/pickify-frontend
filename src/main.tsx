import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ApiQueryProvider } from "./lib/apiQueries";
import { router } from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiQueryProvider>
      <RouterProvider router={router} />
    </ApiQueryProvider>
  </React.StrictMode>,
);
