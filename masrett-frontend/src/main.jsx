import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sandbox from "./pages/Dashboard/SandBox/Sandbox";
import AuthProvider from "./providers/AuthProvider";
import Root from "./pages/Home/Root";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { Toaster } from "sonner";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardRoot from "./pages/Dashboard/DashboardRoot";
import AddTutorial from "./pages/Dashboard/Admin/AddTutorial";
import Tutorials from "./pages/Dashboard/Tutorials/Tutorials";
import AddExercise from "./pages/Dashboard/Admin/AddExercise";
import Mcq from "./pages/Dashboard/Exercise/Mcq";
import DashboardHome from "./pages/Dashboard/DashboardHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/sandbox",
    element: <Sandbox></Sandbox>,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardRoot></DashboardRoot>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardHome></DashboardHome>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/tutorials",
        element: (
          <PrivateRoute>
            <Tutorials></Tutorials>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/mcq",
        element: (
          <PrivateRoute>
            <Mcq></Mcq>
          </PrivateRoute>
        ),
      },
      // ADMIN ROUTES
      {
        path: "/dashboard/add-tutorial",
        element: (
          <PrivateRoute>
            <AddTutorial></AddTutorial>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/add-exercise",
        element: (
          <PrivateRoute>
            <AddExercise></AddExercise>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="bottom-right" richColors />
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
