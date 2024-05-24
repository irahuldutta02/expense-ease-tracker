import { useRoutes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";

export const MainRoutes = () => {
  const auth = false;

  const authenticatedRoutes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "", element: <HomePage /> },
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
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const allRoutes = auth ? authenticatedRoutes : unauthenticatedRoutes;

  return useRoutes(allRoutes);
};
