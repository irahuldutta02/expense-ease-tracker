import { Navigate, useRoutes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Charts } from "../pages/Charts";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { useSelector } from "react-redux";
import { Expenses } from "../pages/Expenses";

export const MainRoutes = () => {
  const { userInfo } = useSelector((state) => state.user);

  const authenticatedRoutes = [
    {
      path: "/",
      children: [
        { path: "", element: <Navigate to="/dashboard" replace /> },
        { path: "/sign-in", element: <Navigate to="/dashboard" replace /> },
        { path: "/sign-up", element: <Navigate to="/dashboard" replace /> },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "", element: <Navigate to="/dashboard/charts" replace /> },
        { path: "charts", element: <Charts /> },
        { path: "expenses", element: <Expenses /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  const unauthenticatedRoutes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "sign-in", element: <SignIn /> },
        { path: "sign-up", element: <SignUp /> },
        { path: "dashboard", element: <Navigate to="/sign-in" replace /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const allRoutes = userInfo ? authenticatedRoutes : unauthenticatedRoutes;

  return useRoutes(allRoutes);
};
