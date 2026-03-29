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
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { X, BarChart3, Download } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const updateViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };

    document.body.style.overflow = "hidden";
    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

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
        labels: {
          color: "hsl(var(--foreground))",
          boxWidth: isMobile ? 12 : 20,
          font: {
            weight: "700",
            size: isMobile ? 11 : 13,
          },
        },
      },
      title: {
        display: true,
        text: `Total Cash In and Cash Out by ${
          view.charAt(0).toUpperCase() + view.slice(1)
        }`,
        color: "hsl(var(--foreground))",
        font: {
          size: isMobile ? 13 : 16,
          weight: "700",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: isMobile,
          maxRotation: 0,
          minRotation: 0,
          color: "hsl(var(--muted-foreground))",
          font: {
            weight: "600",
            size: isMobile ? 10 : 12,
          },
        },
        grid: {
          color: "hsla(var(--border) / 0.45)",
        },
      },
      y: {
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            weight: "600",
            size: isMobile ? 10 : 12,
          },
        },
        grid: {
          color: "hsla(var(--border) / 0.45)",
        },
      },
    },
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"></div>
      <div
        id="close-model"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-[calc(100dvh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[1.5rem] border border-border/60 bg-card shadow-2xl sm:h-[calc(100dvh-2rem)] sm:rounded-[2rem]">
            {/* header */}
            <div className="flex w-full shrink-0 items-start justify-between gap-4 border-b border-border/60 bg-muted/20 px-4 py-4 sm:px-8 sm:py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm sm:h-12 sm:w-12">
                  <BarChart3 size={isMobile ? 20 : 22} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground sm:text-2xl">
                    Charts
                  </h3>
                  <p className="mt-1 max-w-md text-sm font-medium leading-6 text-muted-foreground">
                    Explore cash flow patterns by category, party, and payment mode.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                data-modal-hide="editUserModal"
                onClick={closeShowCharts}
              >
                <X size={18} strokeWidth={2.5} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* body */}
            <div className="flex min-h-0 flex-1 flex-col gap-4 bg-gradient-to-b from-transparent to-muted/10 p-4 sm:gap-6 sm:p-8">
              {/* vie switch btns */}
              <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                <button
                  className={`min-w-[120px] rounded-2xl px-4 py-2.5 text-sm font-black transition-all sm:min-w-[132px] ${
                    view === "category"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setView("category")}
                >
                  Category
                </button>
                <button
                  className={`min-w-[120px] rounded-2xl px-4 py-2.5 text-sm font-black transition-all ${
                    view === "party"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setView("party")}
                >
                  Party
                </button>
                <button
                  className={`min-w-[120px] rounded-2xl px-4 py-2.5 text-sm font-black transition-all ${
                    view === "mode"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setView("mode")}
                >
                  Mode
                </button>
              </div>

              {/* excel export */}
              <div className="flex shrink-0 items-center justify-center gap-4">
                <button
                  onClick={downloadExcel}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-muted"
                >
                  <Download size={16} strokeWidth={2.4} />
                  Download Excel
                </button>
              </div>

              <div className="min-h-0 flex-1 rounded-[1.75rem] border border-border/60 bg-background/80 p-3 shadow-sm sm:rounded-[2rem] sm:p-6">
                <div className="chart-container h-full min-h-[280px] w-full sm:min-h-[360px]">
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
