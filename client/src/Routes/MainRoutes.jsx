import { Navigate, useRoutes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { useSelector } from "react-redux";

export const MainRoutes = () => {
  const { userInfo } = useSelector((state) => state.user);

  const authenticatedRoutes = [
    {
      path: "/",
      children: [
        { path: "", element: <Navigate to="/dashboard" replace /> },
        { path: "/sign-in", element: <Navigate to="/dashboard" replace /> },
        { path: "/sign-up", element: <Navigate to="/dashboard" replace /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const unauthenticatedRoutes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/sign-in", element: <SignIn /> },
        { path: "/sign-up", element: <SignUp /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const allRoutes = userInfo ? authenticatedRoutes : unauthenticatedRoutes;

  return useRoutes(allRoutes);
};
