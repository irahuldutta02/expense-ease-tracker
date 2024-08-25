import {
  ArrowRight,
  BarChart3,
  Brain,
  CreditCard,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen dark:text-white w-full">
      <main className="w-full flex justify-start items-center flex-col">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your Finances with ExpenseEase
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track expenses, gain insights, and make smarter financial
                  decisions with AI-powered analytics.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  to="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex justify-center items-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <CreditCard className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Expense Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Easily log and categorize your expenses in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <BarChart3 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Visual Reports</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get clear, visual representations of your spending habits.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Brain className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">AI Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Receive personalized financial advice powered by Google&apos;s
                  Gemini API.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  AI-Powered Insights
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Leverage the power of Google&apos;s Gemini API to gain deep
                  insights into your spending patterns and receive personalized
                  recommendations for improving your financial health.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <PieChart className="h-64 w-64 text-primary" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground flex justify-center items-center bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Managing Your Finances Today
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Join thousands of users who have taken control of their
                  expenses with ExpenseEase.
                </p>
              </div>
              <Link
                to="/sign-up"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 ExpenseEase. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
