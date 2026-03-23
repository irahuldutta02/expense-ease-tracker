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
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity duration-200 sm:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onSidebarClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 border-r bg-background pt-20 shadow-xl transition-transform duration-200 ease-out will-change-transform sm:translate-x-0 sm:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto px-4 pb-4">
          <ul className="space-y-1.5 font-medium">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onSidebarClose}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-150",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  <item.icon size={20} className="transition-transform duration-150 group-hover:scale-105" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            
            <li className="mt-4 border-t border-border/50 pt-4">
              <button
                onClick={() => {
                  handleLogOut();
                  onSidebarClose();
                }}
                className="group flex w-full items-center gap-3 rounded-lg p-3 text-sm text-destructive transition-colors duration-150 hover:bg-destructive/10"
              >
                <LogOut size={20} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
