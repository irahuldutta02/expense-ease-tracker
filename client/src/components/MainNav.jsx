import { FaMoon, FaSignInAlt, FaSun } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ContextProvider";
import { useContext } from "react";

export const MainNav = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <nav>
        <div className="container flex items-center justify-between px-4 py-8 mx-auto max-w-6xl">
          <Link
            to={"/"}
            className="flex justify-center items-center gap-4 dark:text-white"
          >
            <img
              className="w-auto h-10 sm:h-8"
              src="/ExpenseEaseLogo.svg"
              alt=""
            />
            <p className="text-3xl font-bold">ExpenseEase</p>
          </Link>

          <div className=" flex justify-center items-center gap-4">
            <div
              className="my-1 text-sm font-medium text-gray-500 rtl:-scale-x-100 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0 cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <FaSun color="yellow" size={30} />
              ) : (
                <FaMoon size={25} />
              )}
            </div>

            <Link
              className="my-1 text-sm font-medium text-gray-500 rtl:-scale-x-100 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0"
              to={"/sign-in"}
            >
              <FaSignInAlt size={30} />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};
