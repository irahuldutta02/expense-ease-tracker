import { useContext, useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ContextProvider";
import { DashboardSidebar } from "./DashboardSidebar";
import { useSelector } from "react-redux";
import { cn } from "../utils/cn";

export const DashboardNav = () => {
  const currentUser = useSelector((state) => state?.user?.userInfo);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarClose = () => {
    if (window.innerWidth < 640) setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="inline-flex items-center p-2 text-muted-foreground rounded-md sm:hidden hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Toggle sidebar</span>
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link
                to="/"
                className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
              >
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:rotate-12"
                  src="/assets/logo/expense-ease-without-bg-svg/1.svg"
                  alt="logo"
                />
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  ExpenseEase
                </span>
              </Link>
            </div>
            
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

              <Link
                to="/dashboard/profile"
                className="group relative flex items-center gap-2 p-1 rounded-full border bg-muted/50 transition-all hover:bg-muted"
              >
                <img
                  className="w-8 h-8 rounded-full object-cover transition-transform group-hover:scale-105"
                  src={currentUser?.avatar}
                  alt={currentUser?.name || "User"}
                />
                <div className="hidden md:block pr-2">
                  <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                </div>
              </Link>
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
