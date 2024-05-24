import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";

export const DashboardLayout = () => {
  return (
    <>
      <ScrollToTop>
        <Outlet />
      </ScrollToTop>
    </>
  );
};
