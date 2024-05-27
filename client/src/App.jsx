import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { MainRoutes } from "./Routes/MainRoutes";
import { ThemeContext } from "./context/ContextProvider";
import { useContext } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className={theme === "dark" ? "dark" : "light"}>
        <MainRoutes />
        <ToastContainer
          autoClose={2000}
          position="bottom-right"
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <ConfirmationModal />
      </div>
    </>
  );
}

export default App;
