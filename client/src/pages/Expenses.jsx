import { FaEdit, FaEquals, FaMinus, FaPlus, FaSearch } from "react-icons/fa";
import { useGetExpensesQuery } from "../redux/expenseApiSlice";
import { MdDelete } from "react-icons/md";

export const Expenses = () => {
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();

  console.log({ data, isLoading, isError, refetch });
  const expenses = data?.data || [];
  const formattedData = expenses.map((expense, index) => {
    return {
      ...expense,
      // will be calculated from the last index to the first index
      stringDate: new Date(expense.Date).toLocaleDateString(),
      stringTime: new Date(expense.Date).toLocaleTimeString(),
    };
  });
  const filteredExpenses = [...formattedData];

  console.log({ filteredExpenses });

  return (
    <>
      <div className="flex justify-start items-center flex-col gap-4 w-full">
        <div className="flex justify-start items-center flex-col gap-4 w-full">
          {/* page header */}
          <div className="flex justify-between w-full items-center border-b-2 py-4">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">Expenses</h1>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => refetch()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Refresh
              </button>
            </div>
          </div>
          {/* data filter */}
          {/* <div className="flex justify-between w-full items-center py-4">
            <div className="flex justify-center items-center">
              <h1 className="text-xl font-bold">Data Filters</h1>
            </div>
          </div> */}
          {/* search and action */}
          <div className="flex justify-between w-full items-center py-4 flex-wrap gap-4">
            <div className="flex justify-start items-center flex-1">
              <div className="relative w-full max-w-3xl min-w-60">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <FaSearch />
                </div>
                <input
                  type="search"
                  id="search"
                  className="block outline-none w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
              </div>
            </div>
            <div className="flex justify-center md:justify-end items-center gap-4 flex-1">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32">
                <FaPlus /> Cash In
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32">
                <FaMinus /> Cash Out
              </button>
            </div>
          </div>
          {/* balances */}
          <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap">
            <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-300 dark:bg-slate-800 rounded-lg font-bold">
              <div className="p-1 bg-green-500 rounded-full">
                <FaPlus color="white" />
              </div>
              <div className="flex justify-center items-start flex-col">
                <div className="text-sm">Cash In</div>
                <div className="text-2xl font-semibold">₹ 0.00</div>
              </div>
            </div>
            <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-300 dark:bg-slate-800 rounded-lg font-bold">
              <div className="p-1 bg-red-500 rounded-full">
                <FaMinus color="white" />
              </div>
              <div className="flex justify-center items-start flex-col">
                <div className="text-sm">Cash Out</div>
                <div className="text-2xl font-semibold">₹ 0.00</div>
              </div>
            </div>
            <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-300 dark:bg-slate-800 rounded-lg font-bold">
              <div className="p-1 bg-blue-500 rounded-full">
                <FaEquals color="white" />
              </div>
              <div className="flex justify-center items-start flex-col">
                <div className="text-sm">Net Balance</div>
                <div className="text-2xl font-semibold">₹ 0.00</div>
              </div>
            </div>
          </div>
          {/* data table */}

          <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap">
            <div className="relative overflow-x-auto shadow-md rounded-lg w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Detail
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Party
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Mode
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Balance
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <div className="flex justify-center items-center p-4">
                          <div
                            className="loader border-t-2 rounded-full border-gray-500 bg-gray-300 
                          animate-spin aspect-square w-8 flex justify-center items-center text-yellow-700"
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    filteredExpenses.length !== 0 &&
                    filteredExpenses.map((expense) => {
                      return (
                        <tr
                          key={expense?._id}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td
                            scope="row"
                            className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {expense?.Date} <br />
                            {expense?.Time}
                          </td>
                          <td className="px-6 py-4">{expense?.Remark}</td>
                          <td className="px-6 py-4">{expense?.Party?.Name}</td>
                          <td className="px-6 py-4">
                            {expense?.Category?.Name}
                          </td>
                          <td className="px-6 py-4">{expense?.Mode?.Name}</td>
                          <td className="px-6 py-4">
                            <span className="text-green-500">
                              {expense?.Cash_In}
                            </span>
                            <span className="text-red-500">
                              {expense?.Cash_Out}
                            </span>
                          </td>
                          <td className="px-6 py-4">₹ {expense?.balance}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-4">
                              <button className=" text-blue-400 font-bold  rounded">
                                <FaEdit size={20} />
                              </button>
                              <button className=" text-red-500 font-bold  rounded">
                                <MdDelete size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {/* <!-- Edit user modal --> */}
              <div
                id="editUserModal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
              >
                <div className="relative w-full max-w-2xl max-h-full">
                  {/* <!-- Modal content --> */}
                  <form className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit user
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="editUserModal"
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="first-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Bonnie"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Green"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@company.com"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="phone-number"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Phone Number
                          </label>
                          <input
                            type="number"
                            name="phone-number"
                            id="phone-number"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="e.g. +(12)3456 789"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="department"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Department
                          </label>
                          <input
                            type="text"
                            name="department"
                            id="department"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Development"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Company
                          </label>
                          <input
                            type="number"
                            name="company"
                            id="company"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="123456"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="current-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="new-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Save all
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
