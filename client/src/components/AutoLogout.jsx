import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetMeMutation } from "../redux/userApiSlice";
import { logout } from "../redux/userSlice";

export const AutoLogout = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const [getMe] = useGetMeMutation();

  useEffect(() => {
    let ignore = false;
    const checkUserSession = async () => {
      if (userInfo) {
        try {
          await getMe().unwrap();
        } catch (error) {
          if (!ignore) {
            dispatch(logout());
            navigate("/sign-in");
            toast.error("Auto Logout Triggered!");
          }
        }
      }
    };

    if (userInfo) {
      checkUserSession();
    }
    return () => {
      ignore = true;
    };
  }, [pathname, userInfo, getMe, dispatch, navigate]);

  return null;
};
