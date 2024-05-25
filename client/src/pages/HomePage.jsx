import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <>
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center lg:flex">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white ">
                Welcome to <span className="text-blue-500">ExpenseEase</span>
              </h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Track your{" "}
                <span className="font-medium text-blue-500">Expense</span> with{" "}
                <span className="font-medium text-blue-500">Ease</span>{" "}
              </p>

              <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
                <Link
                  to={"/sign-in"}
                  className="w-full px-5 py-2 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto  hover:bg-blue-500 focus:outline-none flex justify-center items-center focus:bg-blue-500"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            <img
              className="w-full h-full max-w-md"
              src="/assets/Money-income-amico.svg"
              alt="email illustration vector art"
            />
          </div>
        </div>
      </div>
    </>
  );
};
