import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../components/ScrollToTop";
import { DashboardNav } from "../components/DashboardNav";
import { PageTransition } from "../components/PageTransition";

export const DashboardLayout = () => {
  return (
    <ScrollToTop>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
        <DashboardNav />
        <main className="p-4 sm:ml-64 dark:bg-background min-h-screen pt-20">
          <div className="max-w-6xl m-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </ScrollToTop>
  );
};
