import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { MainRoutes } from "./Routes/MainRoutes";
import { AutoLogout } from "./components/AutoLogout";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ScrollToTopBtn } from "./components/ScrollToTopBtn";
import { ThemeContext } from "./context/ContextProvider";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className={theme === "dark" ? "dark" : "light"}>
        <AutoLogout />
        <MainRoutes />
        <Toaster position="top-center" />
        <ConfirmationModal />
        <ScrollToTopBtn />
      </div>
    </>
  );
}

export default App;
