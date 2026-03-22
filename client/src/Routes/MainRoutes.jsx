import { Navigate, useRoutes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { useSelector } from "react-redux";
import { Expenses } from "../pages/Expenses";
import { Categories } from "../pages/Categories";
import { Modes } from "../pages/Modes";
import { Parties } from "../pages/Parties";
import { ResetPass } from "../pages/ResetPass";
import { Profile } from "../pages/Profile";

export const MainRoutes = () => {
  const { userInfo } = useSelector((state) => state.user);

  const authenticatedRoutes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "sign-in", element: <Navigate to="/dashboard" replace /> },
        { path: "sign-up", element: <Navigate to="/dashboard" replace /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Navigate to="expenses" replace /> },
        { path: "expenses", element: <Expenses /> },
        { path: "parties", element: <Parties /> },
        { path: "modes", element: <Modes /> },
        { path: "categories", element: <Categories /> },
        { path: "profile", element: <Profile /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  const unauthenticatedRoutes = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "sign-in", element: <SignIn /> },
        { path: "sign-up", element: <SignUp /> },
        { path: "reset-password/:resetToken", element: <ResetPass /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/dashboard",
      element: <Navigate to="/sign-in" replace />,
    },
  ];

  return useRoutes(userInfo ? authenticatedRoutes : unauthenticatedRoutes);
};
