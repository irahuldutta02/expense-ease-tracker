import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { MainRoutes } from "./Routes/MainRoutes";

function App() {
  return (
    <>
      <MainRoutes />
      <ToastContainer
        autoClose={2000}
        position="bottom-right"
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
