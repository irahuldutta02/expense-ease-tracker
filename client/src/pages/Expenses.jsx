import { useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaEdit,
  FaEquals,
  FaMinus,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useGetCategoriesQuery } from "../redux/categoryApiSlice";
import { useGetExpensesQuery } from "../redux/expenseApiSlice";
import { useGetModesQuery } from "../redux/modeApiSlice";
import { useGetPartiesQuery } from "../redux/partyApiSlice";
import { convertTo12HourTime } from "../utils/convertTo12HourTime";
import { convertToReadableDateString } from "../utils/convertToReadableDateString";
import { roundToTwoDecimalPlaces } from "../utils/roundToTwoDecimalPlaces";

export const Expenses = () => {
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();
  const {
    data: modesData,
    isLoading: modesIsLoading,
    isError: modesIsError,
    refetch: modesRefetch,
  } = useGetModesQuery();
  const modes = modesData?.data || [];
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    refetch: categoriesRefetch,
  } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];
  const {
    data: partiesData,
    isLoading: partiesIsLoading,
    isError: partiesIsError,
    refetch: partiesRefetch,
  } = useGetPartiesQuery();
  const parties = partiesData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState("default");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [expenseType, setExpenseType] = useState(null);
  const [dateTime, setDateTime] = useState(
    new Date(Date.now()).toISOString().slice(0, 16)
  );
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("none");
  const [category, setCategory] = useState("none");
  const [mode, setMode] = useState("none");

  const expenses = data?.data || [];
  const formattedData = expenses.map((expense) => {
    return {
      ...expense,
      balance: 0.0,
    };
  });
  let filteredExpenses = formattedData.filter((expense) => {
    if (searchTerm.trim() === "") {
      return expense;
    }

    if (expense?.Remark.toLowerCase().includes(searchTerm.toLowerCase())) {
      return expense;
    }
  });

  filteredExpenses = filteredExpenses.filter((expense) => {
    if (fromDate === "" || toDate === "") {
      return expense;
    }

    // only compare the date not time
    const expenseDate = new Date(expense.Date).toISOString().split("T")[0];
    const from = new Date(fromDate).toISOString().split("T")[0];
    const to = new Date(toDate).toISOString().split("T")[0];

    return expenseDate >= from && expenseDate <= to;
  });

  const totalCashIn = filteredExpenses.reduce((acc, expense) => {
    return acc + expense?.Cash_In;
  }, 0);

  const totalCashOut = filteredExpenses.reduce((acc, expense) => {
    return acc + expense?.Cash_Out;
  }, 0);

  const renderTable = () => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (filteredExpenses?.slice(start, end).length === 0) {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td
            scope="row"
            className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
            colSpan={8}
          >
            <div className="flex justify-center items-center text-xl">
              No Expenses Found
            </div>
          </td>
        </tr>
      );
    }

    return filteredExpenses?.slice(start, end).map((expense) => (
      <tr
        key={expense?._id}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
      >
        <td
          scope="row"
          className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
        >
          {convertToReadableDateString(expense?.Date)} <br />
          {convertTo12HourTime(expense?.Date)}
        </td>
        <td className="px-6 py-4">{expense?.Remark}</td>
        <td className="px-6 py-4">{expense?.Party?.Name}</td>
        <td className="px-6 py-4">{expense?.Category?.Name}</td>
        <td className="px-6 py-4">{expense?.Mode?.Name}</td>
        <td className="px-6 py-4">
          <div className="w-24">
            ₹{" "}
            <span className="text-green-500 font-bold">{expense?.Cash_In}</span>
            <span className="text-red-500 font-bold">{expense?.Cash_Out}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="w-24">₹ {expense?.balance}</div>
        </td>
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
    ));
  };

  const resetHandler = () => {
    setSearchTerm("");
    setRange("default");
    setFromDate("");
    setToDate("");
    refetch();
    modesRefetch();
    categoriesRefetch();
    partiesRefetch();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      });
    }, 1);
  };

  const handleModalClose = () => {
    setAddExpenseModal(false);
    setExpenseType(null);
    handleResetForm();
  };

  const handleResetForm = () => {
    setDateTime(new Date(Date.now()).toISOString().slice(0, 16));
    setAmount("");
    setParty("none");
    setCategory("none");
    setMode("none");
  };

  useEffect(() => {
    if (range === "default") {
      setFromDate("");
      setToDate("");
      return;
    }
    let fromDate = "";
    let toDate = "";

    const date = new Date();

    if (range === "this_month") {
      // to date should be the current date && from date should be the first date of the current month
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      fromDate = firstDay.toISOString().split("T")[0];
      toDate = date.toISOString().split("T")[0];
    } else if (range === "last_month") {
      // to date should be the last date of the last month && from date should be the first date of the last month
      const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      fromDate = firstDay.toISOString().split("T")[0];
      toDate = lastDay.toISOString().split("T")[0];
    } else if (range === "this_year") {
      // to date should be the current date && from date should be the first date of the current year
      const firstDay = new Date(date.getFullYear(), 0, 1);
      fromDate = firstDay.toISOString().split("T")[0];
      toDate = date.toISOString().split("T")[0];
    } else if (range === "last_year") {
      // to date should be the last date of the last year && from date should be the first date of the last year
      const firstDay = new Date(date.getFullYear() - 1, 0, 1);
      const lastDay = new Date(date.getFullYear(), 0, 0);
      fromDate = firstDay.toISOString().split("T")[0];
      toDate = lastDay.toISOString().split("T")[0];
    }

    setFromDate(fromDate);
    setToDate(toDate);
  }, [range]);

  useEffect(() => {
    if (addExpenseModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addExpenseModal]);

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
                onClick={resetHandler}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset Filters
              </button>
            </div>
          </div>
          {isLoading && (
            <div className="flex justify-center items-center w-full h-96">
              <div className="flex justify-center items-center gap-4">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}
          {!isLoading && (
            <>
              {/* date filter */}
              <div className="flex justify-between w-full items-center py-4 gap-4 flex-wrap">
                {/* start date */}
                <div className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20">
                  <label
                    htmlFor="formDate"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Start Date
                  </label>
                  <input
                    id="formDate"
                    type="date"
                    name="formDate"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                  />
                </div>
                {/* end date */}
                <div className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20">
                  <label
                    htmlFor="toDate"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    name="toDate"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                  />
                </div>
                {/* range date */}
                <div className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20">
                  <label
                    htmlFor="rangeDate"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Select Range
                  </label>
                  <select
                    value={range}
                    onChange={(e) => {
                      setRange(e.target.value);
                    }}
                    id="rangeDate"
                    name="rangeDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                  >
                    <option value="default">Choose a Range</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="this_year">This Year</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>
              </div>
              {/* search and action */}
              <div className="flex justify-between w-full items-center py-4 flex-wrap gap-4">
                {/* search */}
                <div className="flex justify-start items-center flex-1">
                  <div className="relative w-full max-w-3xl min-w-60">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <FaSearch />
                    </div>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="search"
                      id="search"
                      className="block outline-none w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search"
                      required
                    />
                  </div>
                </div>
                {/* add btnS */}
                <div className="flex justify-center md:justify-end items-center gap-4 flex-1">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                    onClick={() => {
                      setAddExpenseModal(true);
                      setExpenseType("cash_in");
                    }}
                  >
                    <FaPlus /> Cash In
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                    onClick={() => {
                      setAddExpenseModal(true);
                      setExpenseType("cash_out");
                    }}
                  >
                    <FaMinus /> Cash Out
                  </button>
                </div>
              </div>
              {/* balances */}
              <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap">
                <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-200 dark:bg-slate-800 rounded-lg font-bold">
                  <div className="p-1 bg-green-500 rounded-full">
                    <FaPlus color="white" />
                  </div>
                  <div className="flex justify-center items-start flex-col">
                    <div className="text-sm">Cash In</div>
                    <div className="text-2xl font-semibold">
                      ₹ {roundToTwoDecimalPlaces(totalCashIn)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-200 dark:bg-slate-800 rounded-lg font-bold">
                  <div className="p-1 bg-red-500 rounded-full">
                    <FaMinus color="white" />
                  </div>
                  <div className="flex justify-center items-start flex-col">
                    <div className="text-sm">Cash Out</div>
                    <div className="text-2xl font-semibold">
                      ₹ {roundToTwoDecimalPlaces(totalCashOut)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start items-start gap-4 flex-1 min-w-60 p-4 bg-gray-200 dark:bg-slate-800 rounded-lg font-bold">
                  <div className="p-1 bg-blue-500 rounded-full">
                    <FaEquals color="white" />
                  </div>
                  <div className="flex justify-center items-start flex-col">
                    <div className="text-sm">Net Balance</div>
                    <div className="text-2xl font-semibold">
                      ₹ {roundToTwoDecimalPlaces(totalCashIn - totalCashOut)}
                    </div>
                  </div>
                </div>
              </div>

              {/* data table */}
              <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap">
                <div className="flex justify-start w-full items-center gap-4 flex-wrap">
                  <h1>
                    Showing{" "}
                    <span className="text-blue-500">
                      {filteredExpenses.length}
                    </span>{" "}
                    Expenses of{" "}
                    <span className="text-blue-500">{expenses.length}</span>{" "}
                  </h1>
                </div>
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
                      {!isError && renderTable()}

                      {isError && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td
                            scope="row"
                            className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                            colSpan={8}
                          >
                            <div className="flex justify-center text-red-500 items-center text-xl">
                              Error Fetching Data
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* pagination */}
              <div className="mt-4 flex justify-center gap-4 items-center">
                {!isLoading && filteredExpenses?.length / rowsPerPage > 0 && (
                  <>
                    <button
                      onClick={() => {
                        scrollToBottom();
                        currentPage > 1 && setCurrentPage(currentPage - 1);
                      }}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                        currentPage <= 1 && "opacity-50 cursor-not-allowed "
                      }`}
                      disabled={currentPage <= 1}
                    >
                      <FaAngleLeft size={25} />
                    </button>
                    <span className="dark:text-white">
                      Page {currentPage} of{" "}
                      {Math.ceil(filteredExpenses?.length / rowsPerPage)}
                    </span>
                    <button
                      onClick={() => {
                        scrollToBottom();
                        currentPage <
                          Math.ceil(filteredExpenses?.length / rowsPerPage) &&
                          setCurrentPage(currentPage + 1);
                      }}
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
                        currentPage >=
                          Math.ceil(filteredExpenses?.length / rowsPerPage) &&
                        "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={
                        currentPage >=
                        Math.ceil(filteredExpenses?.length / rowsPerPage)
                      }
                    >
                      <FaAngleRight size={25} />
                    </button>
                  </>
                )}
              </div>

              {/* add expense modal */}
              {addExpenseModal && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-50"
                    onClick={handleModalClose}
                  ></div>
                  <div
                    id="close-model"
                    className="fixed inset-0 flex justify-center items-start sm:items-center sm:m-4 overflow-auto z-50"
                    onClick={(e) => {
                      if (e.target.id === "close-model") {
                        handleModalClose();
                      }
                    }}
                  >
                    {/* <!-- Edit user modal --> */}
                    {!partiesIsLoading &&
                      !categoriesIsLoading &&
                      !modesIsLoading &&
                      !modesIsError &&
                      !categoriesIsError &&
                      !partiesIsError && (
                        <div className="w-full max-w-2xl">
                          {/* <!-- Modal content --> */}
                          <form className="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {expenseType === "cash_in" ? (
                                  <span className="text-green-500 font-bold">
                                    Cash In
                                  </span>
                                ) : (
                                  <span className="text-red-500 font-bold">
                                    Cash Out
                                  </span>
                                )}
                              </h3>
                              <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="editUserModal"
                                onClick={handleModalClose}
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
                                {/* expense type */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="expenseType"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Expense Type
                                  </label>
                                  <select
                                    id="expenseType"
                                    name="expenseType"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    required
                                    value={expenseType}
                                    onChange={(e) =>
                                      setExpenseType(e.target.value)
                                    }
                                  >
                                    <option value="cash_in">Cash In</option>
                                    <option value="cash_out">Cash Out</option>
                                  </select>
                                </div>
                                {/* date time */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="dateTime"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Date Time
                                  </label>
                                  <input
                                    type="datetime-local"
                                    name="dateTime"
                                    id="dateTime"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    required
                                    value={dateTime}
                                    onChange={(e) =>
                                      setDateTime(e.target.value)
                                    }
                                  />
                                </div>
                                {/* amount */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="amount"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Amount
                                  </label>
                                  <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    placeholder="₹ 0.00"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                  />
                                </div>
                                {/* party */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="party"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Party Name
                                  </label>
                                  <select
                                    id="party"
                                    name="party"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    required
                                    value={party}
                                    onChange={(e) => setParty(e.target.value)}
                                  >
                                    <option value="none">NONE</option>
                                    {parties.map((party) => (
                                      <option
                                        key={party?._id}
                                        value={party?._id}
                                      >
                                        {party?.Name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {/* category */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="category"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Category
                                  </label>
                                  <select
                                    id="category"
                                    name="category"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    required
                                    value={category}
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                  >
                                    <option value="none">NONE</option>
                                    {categories.map((category) => (
                                      <option
                                        key={category?._id}
                                        value={category?._id}
                                      >
                                        {category?.Name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                {/* mode */}
                                <div className="col-span-6 sm:col-span-3">
                                  <label
                                    htmlFor="mode"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Mode
                                  </label>
                                  <select
                                    id="mode"
                                    name="mode"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    required
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                  >
                                    <option value="none">NONE</option>
                                    {modes.map((mode) => (
                                      <option key={mode?._id} value={mode?._id}>
                                        {mode?.Name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex justify-center gap-4 items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                              <button
                                type="submit"
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleResetForm();
                                }}
                              >
                                Reset
                              </button>
                              <button
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    {modesIsError ||
                      categoriesIsError ||
                      (partiesIsError && (
                        <div className="w-full max-w-2xl">
                          <div className="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-start justify-between p-4 ">
                              <h3 className="text-xl font-semibold text-red-500">
                                Some Error Occurred
                              </h3>
                              <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="editUserModal"
                                onClick={handleModalClose}
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
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
