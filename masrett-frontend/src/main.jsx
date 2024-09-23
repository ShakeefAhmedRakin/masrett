import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home/Home";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sandbox from "./pages/Dashboard/SandBox/Sandbox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/sandbox",
    element: <Sandbox></Sandbox>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
