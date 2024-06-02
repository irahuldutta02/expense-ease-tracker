import toast from "react-hot-toast";
import { BiSolidCategory, BiSolidCategoryAlt } from "react-icons/bi";
import { FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/userApiSlice";
import { logout } from "../redux/userSlice";

export const DashboardSidebar = ({ sidebarOpen, onSidebarClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogOut = async () => {
    try {
      const res = await logoutApi().unwrap();
      toast.success(res.message);
      dispatch(logout());
      navigate("/sign-in");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          error?.error ||
          "An error occurred"
      );
    }
  };

  return (
    <>
      {sidebarOpen && (
        <aside
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform  bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <NavLink
                  to={"/dashboard/expenses"}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-200 dark:bg-gray-900" : ""
                    }`
                  }
                  onClick={onSidebarClose}
                >
                  <FaMoneyBill size={20} />
                  <span className="ms-3">Expenses</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/dashboard/categories"}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-200 dark:bg-gray-900" : ""
                    }`
                  }
                  onClick={onSidebarClose}
                >
                  <BiSolidCategoryAlt size={20} />
                  <span className="ms-3">Categories</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/dashboard/modes"}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-200 dark:bg-gray-900" : ""
                    }`
                  }
                  onClick={onSidebarClose}
                >
                  <BiSolidCategory size={20} />
                  <span className="ms-3">Modes</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/dashboard/parties"}
                  className={({ isActive }) =>
                    `flex items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                      isActive ? "bg-gray-200 dark:bg-gray-900" : ""
                    }`
                  }
                  onClick={onSidebarClose}
                >
                  <FaUserGroup size={20} />
                  <span className="ms-3">Parties</span>
                </NavLink>
              </li>
              <li>
                <button
                  className={`flex w-full items-center p-2 text-sm text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    handleLogOut();
                    onSidebarClose();
                  }}
                  disabled={isLoading}
                >
                  <FaSignOutAlt size={20} />
                  <span className="ms-3">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      )}
    </>
  );
};
