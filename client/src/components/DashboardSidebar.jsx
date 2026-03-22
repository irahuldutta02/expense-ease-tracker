import toast from "react-hot-toast";
import { 
  CreditCard, 
  LayoutGrid, 
  Layers, 
  Users, 
  LogOut,
  BarChart3
} from "lucide-react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

export const DashboardSidebar = ({ sidebarOpen, onSidebarClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/sign-in");
    toast.success("Logged out successfully!");
  };

  const navItems = [
    { to: "/dashboard/expenses", label: "Expenses", icon: CreditCard },
    { to: "/dashboard/categories", label: "Categories", icon: Layers },
    { to: "/dashboard/modes", label: "Payment Modes", icon: LayoutGrid },
    { to: "/dashboard/parties", label: "Parties", icon: Users },
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          exit={{ x: -256 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 border-r bg-background/80 backdrop-blur-md transition-all duration-300"
          aria-label="Sidebar"
        >
          <div className="h-full px-4 pb-4 overflow-y-auto custom-scrollbar">
            <ul className="space-y-1.5 font-medium">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onSidebarClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-200 group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )
                    }
                  >
                    <item.icon size={20} className="transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
              
              <li className="pt-4 mt-4 border-t border-border/50">
                <button
                  onClick={() => {
                    handleLogOut();
                    onSidebarClose();
                  }}
                  className="flex w-full items-center gap-3 p-3 text-sm text-destructive rounded-lg transition-all duration-200 hover:bg-destructive/10 hover:shadow-sm group"
                >
                  <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
