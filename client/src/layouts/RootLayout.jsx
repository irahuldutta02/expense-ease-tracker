import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";

export const RootLayout = () => {
  return (
    <>
      <ScrollToTop>
        <Outlet />
      </ScrollToTop>
    </>
  );
};
