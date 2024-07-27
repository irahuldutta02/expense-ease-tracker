import { Toaster } from "react-hot-toast";
import "./App.css";
import { MainRoutes } from "./Routes/MainRoutes";
import { ThemeContext } from "./context/ContextProvider";
import { useContext } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";
import ScrollToTop from "react-scroll-to-top";
import { ScrollToTopStyle } from "./StyledObjects/StyledObject";
import { AutoLogout } from "./components/AutoLogout";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className={theme === "dark" ? "dark" : "light"}>
        <AutoLogout />
        <MainRoutes />
        <Toaster position="top-center" reverseOrder={false} />
        <ConfirmationModal />
        <ScrollToTop
          smooth
          viewBox="0 0 24 24"
          svgPath="M12 4l-8 8h6v8h4v-8h6z"
          style={ScrollToTopStyle()}
        />
      </div>
    </>
  );
}

export default App;
