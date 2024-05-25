import { useContext } from "react";
import { GoMoon, GoSun } from "react-icons/go";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ContextProvider";

export const MainNav = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <nav>
        <div className="container flex items-center justify-between p-4 py-8 mx-auto max-w-6xl">
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

          <div className=" flex justify-center items-center gap-4  dark:text-white">
            <span
              onClick={toggleTheme}
              className={`cursor-pointer p-2 rounded-full shadow-lg font-bold
              ${theme === "dark" ? "bg-yellow-500" : "bg-blue-500"}`}
            >
              {theme === "dark" ? (
                <GoSun color="white" size={22} />
              ) : (
                <GoMoon color="white" size={22} />
              )}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};
