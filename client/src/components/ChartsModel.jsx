import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaTimes } from "react-icons/fa";
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
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50"
        onClick={closeShowCharts}
      ></div>
      <div
        id="close-model"
        className="fixed inset-0 flex justify-center items-start sm:items-center sm:m-4 overflow-auto z-50"
        onClick={(e) => {
          if (e.target.id === "close-model") {
            closeShowCharts();
          }
        }}
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
