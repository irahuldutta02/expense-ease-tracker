import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ContextProvider";
import { Sun, Moon, LayoutDashboard } from "lucide-react";
import { cn } from "../utils/cn";
import { useSelector } from "react-redux";

export const MainNav = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { userInfo } = useSelector((state) => state.user);

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-3 px-3 sm:px-4">
        <Link
          to="/"
          className="group flex min-w-0 flex-1 items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <img
            className="h-8 w-8 shrink-0 transition-transform group-hover:rotate-12"
            src="/assets/logo/expense-ease-without-bg-svg/1.svg"
            alt="logo"
          />
          <span className="truncate text-base font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent sm:text-xl">
            ExpenseEase
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className={cn(
              "rounded-full p-2 transition-all duration-300 hover:rotate-12",
              theme === "dark" 
                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
                : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
            )}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {userInfo ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-4"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/sign-in"
                className="px-1 text-sm font-medium transition-colors hover:text-primary sm:px-0"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:px-4"
              >
                <span className="sm:hidden">Start</span>
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
