import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { MainNav } from "../components/MainNav";

export const RootLayout = () => {
  return (
    <>
      <ScrollToTop>
        <div className="bg-white dark:bg-gray-900 min-h-screen">
          <div className="flex flex-col justify-start items-center w-full">
            <MainNav />
            <Outlet />
          </div>
        </div>
      </ScrollToTop>
    </>
  );
};
