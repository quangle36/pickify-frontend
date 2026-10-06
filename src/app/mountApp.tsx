import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ApiQueryProvider } from "./providers/ApiQueryProvider";
import { router } from "./router";

export function mountApp(root: HTMLElement) {
  createRoot(root).render(<React.StrictMode><ApiQueryProvider><RouterProvider router={router} /></ApiQueryProvider></React.StrictMode>);
}
