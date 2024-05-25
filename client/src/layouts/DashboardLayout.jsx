import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { DashboardNav } from "../components/DashboardNav";

export const DashboardLayout = () => {
  return (
    <>
      <ScrollToTop>
        <DashboardNav />
        <div className="p-4 sm:ml-64 dark:bg-gray-900 dark:text-white min-h-screen">
          <div className="mt-14 mb-14">
            <Outlet />
          </div>
        </div>
      </ScrollToTop>
    </>
  );
};
