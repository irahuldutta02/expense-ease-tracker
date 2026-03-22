import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { MainNav } from "../components/MainNav";
import { PageTransition } from "../components/PageTransition";

export const RootLayout = () => {
  return (
    <ScrollToTop>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
        <MainNav />
        <main className="flex flex-col items-center w-full pt-16">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </ScrollToTop>
  );
};
