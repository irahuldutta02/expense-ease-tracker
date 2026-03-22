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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
        >
          <img
            className="w-8 h-8 transition-transform group-hover:rotate-12"
            src="/assets/logo/expense-ease-without-bg-svg/1.svg"
            alt="logo"
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ExpenseEase
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-all duration-300 hover:rotate-12",
              theme === "dark" 
                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
                : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
            )}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {userInfo ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
