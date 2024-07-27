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
    const checkUserSession = async () => {
      if (userInfo) {
        try {
          await getMe().unwrap();
          console.log("User session is active.");
        } catch (error) {
          dispatch(logout());
          navigate("/sign-in");
          toast.error("Auto Logout Triggered!");
        }
      }
    };

    if (userInfo) {
      checkUserSession();
    }
  }, [pathname, userInfo, getMe, dispatch, navigate]);

  return null;
};
