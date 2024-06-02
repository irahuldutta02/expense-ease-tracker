import { Toaster } from "react-hot-toast";
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
        <Toaster position="top-center" reverseOrder={false} />
        <ConfirmationModal />
      </div>
    </>
  );
}

export default App;
