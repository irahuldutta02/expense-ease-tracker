import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { MainRoutes } from "./Routes/MainRoutes";
import { AutoLogout } from "./components/AutoLogout";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ScrollToTopBtn } from "./components/ScrollToTopBtn";
import { ThemeContext } from "./context/ContextProvider";
import { AnimatePresence } from "framer-motion";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "dark" : "light"}>
      <AutoLogout />
      <AnimatePresence mode="wait">
        <MainRoutes />
      </AnimatePresence>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: "dark:bg-zinc-900 dark:text-white dark:border dark:border-zinc-800 rounded-2xl shadow-2xl",
          duration: 3000,
        }}
      />
      <ConfirmationModal />
      <ScrollToTopBtn />
    </div>
  );
}

export default App;
