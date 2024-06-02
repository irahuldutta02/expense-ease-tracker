import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../redux/userApiSlice";
import { setCredentials } from "../redux/userSlice";

export const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const [forgotPassword, { isLoading: isLoadingPassword }] =
    useForgotPasswordMutation();

  const validate = () => {
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Invalid email or password");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailRegex)) {
      toast.error("Invalid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res.data }));
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          error?.error ||
          "An error occurred"
      );
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message);
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
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex items-center justify-center px-6 mx-auto">
          <form className="w-full max-w-md">
            <div className="flex items-center justify-center mt-6">
              <Link
                to={"/sign-in"}
                className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize  dark:text-gray-300 border-b-2 border-blue-500 dark:border-blue-400"
              >
                sign in
              </Link>

              <Link
                to={"/sign-up"}
                className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 dark:border-gray-400 dark:text-white"
              >
                sign up
              </Link>
            </div>

            <div className="relative flex items-center mt-6">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>

              <input
                type="email"
                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative flex items-center mt-4">
              <span className="absolute">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>

              <input
                type="password"
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <button
                className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
                  isLoading && "opacity-70 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Sign In
              </button>

              <div className="mt-6 text-center ">
                <button
                  className={`text-sm text-blue-500 dark:text-blue-400 ${
                    isLoadingPassword ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={handleForgotPassword}
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? "Sending Email..." : "Forgot Password?"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
