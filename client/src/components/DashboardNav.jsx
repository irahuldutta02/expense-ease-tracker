import { useContext, useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { GoMoon, GoSun } from "react-icons/go";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ContextProvider";
import { DashboardSidebar } from "./DashboardSidebar";
import { useSelector } from "react-redux";

export const DashboardNav = () => {
  const currentUser = useSelector((state) => state?.user?.userInfo);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarClose = () => {
    window.innerWidth < 640 && setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start gap-2">
              <button
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <Link
                to={"/"}
                className="flex justify-center items-center gap-4 dark:text-white"
              >
                <img
                  className="w-auto h-10 sm:h-8"
                  src="/assets/logo/expense-ease-without-bg-svg/1.svg"
                  alt="logo"
                />
                <p className="text-2xl font-bold">ExpenseEase</p>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className=" flex justify-center items-center gap-4  dark:text-white">
                  <span
                    onClick={toggleTheme}
                    className={`cursor-pointer p-2 rounded-full shadow-lg font-bold ${
                      theme === "dark" ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  >
                    {theme === "dark" ? (
                      <GoSun color="white" size={22} />
                    ) : (
                      <GoMoon color="white" size={22} />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center ms-3">
                <div className=" flex justify-center items-center gap-4  dark:text-white">
                  <Link
                    to={"/dashboard/profile"}
                    className={`cursor-pointer rounded-full shadow-lg font-bold w-10 p-[1px]`}
                  >
                    <img
                      className="rounded-full"
                      src={currentUser?.avatar}
                      alt="rahul"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        onSidebarClose={sidebarClose}
      />
    </>
  );
};
