import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { saveAs } from "file-saver";
import moment from "moment";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaTimes } from "react-icons/fa";
import * as XLSX from "xlsx";
import { processExpensesData } from "../utils/processData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartsModel = ({ expenses, closeShowCharts }) => {
  const [view, setView] = useState("category");

  const csvData = expenses.map((expense) => {
    return {
      Date: moment(expense?.Date).format("DD/MM/YYYY hh:mm:ss A"),
      Category: expense?.Category ? expense?.Category?.Name : "",
      Party: expense?.Party ? expense?.Party?.Name : "",
      Mode: expense?.Mode ? expense?.Mode?.Name : "",
      "Cash In": expense?.Cash_In ? expense?.Cash_In : 0,
      "Cash Out": expense?.Cash_Out ? expense?.Cash_Out : 0,
      Balance: expense?.balance,
    };
  });

  const uniqueCategories = {};
  const uniqueParties = {};
  const uniqueModes = {};

  expenses.forEach((expense) => {
    if (expense?.Category?._id) {
      uniqueCategories[expense?.Category?._id] = expense?.Category;
    }

    if (expense?.Party?._id) {
      uniqueParties[expense?.Party?._id] = expense?.Party;
    }

    if (expense?.Mode?._id) {
      uniqueModes[expense?.Mode?._id] = expense?.Mode;
    }
  });

  const categoryWiseCsvData = Object.values(uniqueCategories).map(
    (category) => {
      const categoryExpenses = expenses.filter(
        (expense) => expense?.Category?._id === category?._id
      );

      const cashIn = categoryExpenses.reduce(
        (acc, expense) => acc + (expense?.Cash_In || 0),
        0
      );

      const cashOut = categoryExpenses.reduce(
        (acc, expense) => acc + (expense?.Cash_Out || 0),
        0
      );

      return {
        Category: category?.Name,
        "Cash In": cashIn,
        "Cash Out": cashOut,
        Balance: cashIn - cashOut,
      };
    }
  );

  const partyWiseCsvData = Object.values(uniqueParties).map((party) => {
    const partyExpenses = expenses.filter(
      (expense) => expense?.Party?._id === party?._id
    );

    const cashIn = partyExpenses.reduce(
      (acc, expense) => acc + (expense?.Cash_In || 0),
      0
    );

    const cashOut = partyExpenses.reduce(
      (acc, expense) => acc + (expense?.Cash_Out || 0),
      0
    );

    return {
      Party: party?.Name,
      "Cash In": cashIn,
      "Cash Out": cashOut,
      Balance: cashIn - cashOut,
    };
  });

  const modeWiseCsvData = Object.values(uniqueModes).map((mode) => {
    const modeExpenses = expenses.filter(
      (expense) => expense?.Mode?._id === mode?._id
    );

    const cashIn = modeExpenses.reduce(
      (acc, expense) => acc + (expense?.Cash_In || 0),
      0
    );

    const cashOut = modeExpenses.reduce(
      (acc, expense) => acc + (expense?.Cash_Out || 0),
      0
    );

    return {
      Mode: mode?.Name,
      "Cash In": cashIn,
      "Cash Out": cashOut,
      Balance: cashIn - cashOut,
    };
  });

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    const worksheet1 = XLSX.utils.json_to_sheet(csvData);
    XLSX.utils.book_append_sheet(workbook, worksheet1, "All Expense");

    const worksheet2 = XLSX.utils.json_to_sheet(categoryWiseCsvData);
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Category Wise");

    const worksheet3 = XLSX.utils.json_to_sheet(partyWiseCsvData);
    XLSX.utils.book_append_sheet(workbook, worksheet3, "Party Wise");

    const worksheet4 = XLSX.utils.json_to_sheet(modeWiseCsvData);
    XLSX.utils.book_append_sheet(workbook, worksheet4, "Mode Wise");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `expenses.xlsx`);
  };

  const { labels, cashInData, cashOutData } = processExpensesData(
    expenses,
    view
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Cash In",
        data: cashInData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Cash Out",
        data: cashOutData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Total Cash In and Cash Out by ${
          view.charAt(0).toUpperCase() + view.slice(1)
        }`,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50"></div>
      <div
        id="close-model"
        className="fixed inset-0 flex justify-center items-start sm:m-4 sm:rounded-lg overflow-auto z-50"
      >
        <div className="w-full">
          <div className="bg-white sm:rounded-lg shadow dark:bg-gray-700 min-h-screen sm:min-h-[95vh]">
            {/* header */}
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 w-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Charts
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="editUserModal"
                onClick={closeShowCharts}
              >
                <FaTimes size={20} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* body */}
            <div className="p-6 space-y-6 w-full ">
              {/* vie switch btns */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <button
                  className={`font-bold py-2 px-4 rounded w-32 ${
                    view === "category"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("category")}
                >
                  Category
                </button>
                <button
                  className={`font-bold py-2 px-4 rounded w-32 ${
                    view === "party"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("party")}
                >
                  Party
                </button>
                <button
                  className={`font-bold py-2 px-4 rounded w-32 ${
                    view === "mode"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("mode")}
                >
                  Mode
                </button>
              </div>

              {/* excel export */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <button
                  onClick={downloadExcel}
                  className="inline-block relative px-4 py-2 bg-green-500 text-white font-sans text-base text-center border-none hover:bg-green-600"
                >
                  Download Excel
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="chart-container min-w-[1000px] h-[600px]">
                  <Bar data={data} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartsModel;
