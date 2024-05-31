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
import { Categories } from "../pages/Categories";
import { Modes } from "../pages/Modes";
import { Parties } from "../pages/Parties";

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
        { path: "", element: <Navigate to="/dashboard/expenses" replace /> },
        { path: "charts", element: <Charts /> },
        { path: "expenses", element: <Expenses /> },
        { path: "parties", element: <Parties /> },
        { path: "modes", element: <Modes /> },
        { path: "categories", element: <Categories /> },
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
        {
          path: "dashboard/expenses",
          element: <Navigate to="/sign-in" replace />,
        },
        {
          path: "dashboard/charts",
          element: <Navigate to="/sign-in" replace />,
        },
        {
          path: "dashboard/parties",
          element: <Navigate to="/sign-in" replace />,
        },
        {
          path: "dashboard/categories",
          element: <Navigate to="/sign-in" replace />,
        },
        {
          path: "dashboard/modes",
          element: <Navigate to="/sign-in" replace />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const allRoutes = userInfo ? authenticatedRoutes : unauthenticatedRoutes;

  return useRoutes(allRoutes);
};
