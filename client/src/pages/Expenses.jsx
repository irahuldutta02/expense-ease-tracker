import moment from "moment";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCopy,
  FaEquals,
  FaMinus,
  FaPlus,
  FaRegTimesCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiInsightsModel } from "../components/AiInsightsModel";
import ChartsModel from "../components/ChartsModel";
import CustomSelect from "../components/CustomSelect";
import { FileUpload } from "../components/FileUpload";
import { ImageModel } from "../components/ImageModel";
import { ConfirmationModelContext } from "../context/ContextProvider";
import { useGetCategoriesQuery } from "../redux/categoryApiSlice";
import {
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} from "../redux/expenseApiSlice";
import { useGetModesQuery } from "../redux/modeApiSlice";
import { useGetPartiesQuery } from "../redux/partyApiSlice";
import { convertTo12HourTime } from "../utils/convertTo12HourTime";
import { convertToReadableDateString } from "../utils/convertToReadableDateString";
import { roundToTwoDecimalPlaces } from "../utils/roundToTwoDecimalPlaces";
import { BulkActionModel } from "../components/BulkActionModel";

export const Expenses = () => {
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();
  const expenses = data?.data || [];
  const {
    data: modesData,
    isLoading: modesIsLoading,
    isError: modesIsError,
    refetch: modesRefetch,
  } = useGetModesQuery();
  let modes = modesData?.data || [];
  modes = [...modes].sort((a, b) => a.Name.localeCompare(b.Name));
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    refetch: categoriesRefetch,
  } = useGetCategoriesQuery();
  let categories = categoriesData?.data || [];
  categories = [...categories].sort((a, b) => a.Name.localeCompare(b.Name));
  const {
    data: partiesData,
    isLoading: partiesIsLoading,
    isError: partiesIsError,
    refetch: partiesRefetch,
  } = useGetPartiesQuery();
  let parties = partiesData?.data || [];
  parties = [...parties].sort((a, b) => a.Name.localeCompare(b.Name));

  const [createExpense, { isLoading: isCreatingExpense }] =
    useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdatingExpense }] =
    useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeletingExpense }] =
    useDeleteExpenseMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState("default");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showAiInsightsModel, setShowAiInsightsModel] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const [showFilters, setShowFilters] = useState(false);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [expenseType, setExpenseType] = useState(null);
  const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DDTHH:mm"));
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [partySearching, setPartySearching] = useState("");
  const [category, setCategory] = useState("");
  const [categorySearching, setCategorySearching] = useState("");
  const [mode, setMode] = useState("");
  const [modeSearching, setModeSearching] = useState("");
  const [remark, setRemark] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageModalUrls, setShowImageModalUrls] = useState(null);

  const [partyFilter, setPartyFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [modeFilter, setModeFilter] = useState([]);

  const [partyModalOpen, setPartyModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [modeModalOpen, setModeModalOpen] = useState(false);

  const [partySearchTerm, setPartySearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [modeSearchTerm, setModeSearchTerm] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [selectedBulkExpenses, setSelectedBulkExpenses] = useState([]);
  const closeBulkActionModal = () => {
    setShowBulkActionModal(false);
    setSelectedBulkExpenses([]);
    refetch();
  };

  const [showCharts, setShowCharts] = useState(false);
  const closeShowCharts = () => {
    setShowCharts(false);
  };

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  // filter by search term
  let filteredExpenses = expenses.filter((expense) => {
    if (searchTerm.trim() === "") {
      return expense;
    }

    if (expense?.Remark.toLowerCase().includes(searchTerm.toLowerCase())) {
      return expense;
    }
  });

  // date filter
  if (fromDate && toDate) {
    filteredExpenses = [...filteredExpenses]?.filter((expense) => {
      const itemDate = moment(expense.Date).format("YYYY-MM-DD");
      const from = moment(fromDate).format("YYYY-MM-DD");
      const to = moment(toDate).format("YYYY-MM-DD");

      return (
        moment(itemDate).isSameOrAfter(from) &&
        moment(itemDate).isSameOrBefore(to)
      );
    });
  }

  // filter by party
  filteredExpenses = filteredExpenses.filter((expense) => {
    if (partyFilter.length === 0) {
      return expense;
    }

    if (partyFilter.includes(expense?.Party?._id)) {
      return expense;
    }
  });

  // filter by category
  filteredExpenses = filteredExpenses.filter((expense) => {
    if (categoryFilter.length === 0) {
      return expense;
    }

    if (categoryFilter.includes(expense?.Category?._id)) {
      return expense;
    }
  });

  // filter by mode
  filteredExpenses = filteredExpenses.filter((expense) => {
    if (modeFilter.length === 0) {
      return expense;
    }

    if (modeFilter.includes(expense?.Mode?._id)) {
      return expense;
    }
  });

  const totalCashIn = filteredExpenses.reduce((acc, expense) => {
    return acc + expense?.Cash_In;
  }, 0);

  const totalCashOut = filteredExpenses.reduce((acc, expense) => {
    return acc + expense?.Cash_Out;
  }, 0);

  const handleEditing = (expense) => {
    setIsEditing(true);
    setEditId(expense?._id);
    setExpenseType(expense?.Cash_In ? "cash_in" : "cash_out");
    setDateTime(expense?.Date);
    setAmount(expense?.Cash_In || expense?.Cash_Out);
    setParty(expense?.Party?._id || "");
    setCategory(expense?.Category?._id || "");
    setMode(expense?.Mode?._id || "");
    setRemark(expense?.Remark);
    setAddExpenseModal(true);
    setAttachments(expense?.attachments || []);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditId(null);
  };

  const resetHandler = () => {
    setSearchTerm("");
    setRange("default");
    setFromDate("");
    setToDate("");
    setPartyFilter([]);
    setCategoryFilter([]);
    setModeFilter([]);
    refetch();
    modesRefetch();
    categoriesRefetch();
    partiesRefetch();
  };

  const handleModalClose = () => {
    handleCancelEditing();
    setAddExpenseModal(false);
    setExpenseType(null);
    refetch();
    modesRefetch();
    categoriesRefetch();
    partiesRefetch();
    handleResetForm();
  };

  const handleResetForm = () => {
    setDateTime(moment().format("YYYY-MM-DDTHH:mm"));
    setAmount("");
    setParty("");
    setPartySearching("");
    setCategory("");
    setCategorySearching("");
    setMode("");
    setModeSearching("");
    setRemark("");
    setAttachments([]);
  };

  const handleSaveExpense = async () => {
    const expense = {
      Date: dateTime,
      Cash_In: expenseType === "cash_in" ? amount : null,
      Cash_Out: expenseType === "cash_out" ? amount : null,
      Party: party === "" ? null : party,
      Category: category === "" ? null : category,
      Mode: mode === "" ? null : mode,
      Remark: remark,
      attachments,
    };
    try {
      const res = await createExpense(expense);
      if (res?.data?.status === 201) {
        toast.success("Expense created successfully");
        handleResetForm();
        refetch();
        modesRefetch();
        categoriesRefetch();
        partiesRefetch();
      }
    } catch (error) {
      console.error("Error creating expense", error);
      toast.error("Error creating expense");
    }
  };

  const editExpenseApiHandler = async () => {
    const expense = {
      Date: dateTime,
      Cash_In: expenseType === "cash_in" ? amount : null,
      Cash_Out: expenseType === "cash_out" ? amount : null,
      Party: party === "" ? null : party,
      Category: category === "" ? null : category,
      Mode: mode === "" ? null : mode,
      Remark: remark,
      attachments,
    };
    try {
      const res = await updateExpense({ id: editId, data: expense });
      if (res?.data?.status === 200) {
        toast.success("Expense updated successfully");
        handleModalClose();
      }
    } catch (error) {
      console.error("Error updating expense", error);
      toast.error("Error updating expense");
    }
  };

  const handleEditExpense = () => {
    openConfirmationModel({
      question: "Are you sure you want to Edit this expense?",
      answer: ["Yes", "No"],
      onClose: (result) => {
        if (result) {
          editExpenseApiHandler();
        } else {
          return;
        }
      },
    });
  };

  const deleteExpenseApiHandler = async (id) => {
    try {
      const res = await deleteExpense(id);
      if (res?.data?.status === 200) {
        toast.success("Expense deleted successfully");
        handleModalClose();
      }
    } catch (error) {
      console.error("Error deleting expense", error);
      toast.error("Error deleting expense");
    }
  };

  const handleDeleteExpense = (id) => {
    openConfirmationModel({
      question: "Are you sure you want to delete this expense?",
      answer: ["Yes", "No"],
      onClose: (result) => {
        if (result) {
          deleteExpenseApiHandler(id);
        } else {
          return;
        }
      },
    });
  };

  const handleDuplicate = (expense) => {
    setIsEditing(false);
    setEditId(null);
    setExpenseType(expense?.Cash_In ? "cash_in" : "cash_out");
    setDateTime(expense?.Date);
    setAmount(expense?.Cash_In || expense?.Cash_Out);
    setParty(expense?.Party?._id || "");
    setCategory(expense?.Category?._id || "");
    setMode(expense?.Mode?._id || "");
    setRemark(expense?.Remark);
    setAddExpenseModal(true);
    setAttachments(expense?.attachments || []);
  };

  const handleShowImageModal = (urlArray) => {
    setShowImageModal(true);
    setShowImageModalUrls(urlArray);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setShowImageModalUrls(null);
  };

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  // render the table
  const renderTable = () => {
    if (filteredExpenses?.slice(start, end).length === 0) {
      return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
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
        onClick={() => {
          handleEditing(expense);
        }}
      >
        <td
          className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold relative"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span
            className="flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              onClick={(e) => {
                e.stopPropagation();
              }}
              checked={selectedBulkExpenses.includes(expense?._id)}
              onChange={() => {
                if (selectedBulkExpenses.includes(expense?._id)) {
                  setSelectedBulkExpenses(
                    selectedBulkExpenses.filter((id) => id !== expense?._id)
                  );
                } else {
                  setSelectedBulkExpenses([
                    ...selectedBulkExpenses,
                    expense?._id,
                  ]);
                }
              }}
            />
          </span>
        </td>
        <td
          scope="row"
          className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold"
        >
          <p>{convertToReadableDateString(expense?.Date)}</p>
          <p className="font-normal text-sm mt-1">
            {convertTo12HourTime(expense?.Date)}
          </p>
        </td>
        <td className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold relative">
          <p>{expense?.Party?.Name}</p>
          <p className="font-normal text-sm mt-1 max-w-44 text-wrap">
            {expense?.Remark}
          </p>
          <p className="font-normal text-sm mt-1 absolute right-2 top-2">
            {expense?.attachments?.length > 0 && (
              <button
                className="text-blue-400 font-bold rounded hover:transform hover:scale-125 transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowImageModal(expense?.attachments);
                }}
              >
                <IoReceiptSharp size={20} />
              </button>
            )}
          </p>
        </td>
        <td className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold">
          <p>{expense?.Category?.Name}</p>
          <p className="font-normal text-sm mt-1">{expense?.Mode?.Name}</p>
        </td>
        <td className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold">
          <div className="w-24">
            ₹{" "}
            <span className="text-green-500 font-bold">{expense?.Cash_In}</span>
            <span className="text-red-500 font-bold">{expense?.Cash_Out}</span>
          </div>
        </td>
        <td className="p-4 border-r whitespace-nowrap border-gray-300 dark:border-gray-700 text-[16px] font-semibold">
          <div className="w-24">
            ₹ {roundToTwoDecimalPlaces(expense?.balance)}
          </div>
        </td>
        <td
          className="px-6 whitespace-nowrap py-4"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="flex justify-center items-center gap-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              className="text-blue-400 font-bold rounded hover:transform hover:scale-125 transition duration-300 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                handleEditing(expense);
              }}
            >
              <MdEditSquare size={20} />
            </button>
            <button
              className="text-blue-400 font-bold rounded hover:transform hover:scale-125 transition duration-300 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(expense);
              }}
            >
              <FaCopy size={18} />
            </button>
            <button
              className={`text-red-500 font-bold rounded hover:transform hover:scale-125 transition duration-300 ease-in-out ${
                isDeletingExpense && "opacity-50 cursor-not-allowed"
              }`}
              disabled={isDeletingExpense}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteExpense(expense?._id);
              }}
            >
              <MdDelete size={20} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const filteredParties = parties.filter((party) => {
    if (partySearchTerm.trim() === "") {
      return party;
    }

    if (party?.Name.toLowerCase().includes(partySearchTerm.toLowerCase())) {
      return party;
    }
  });

  const filteredCategories = categories.filter((category) => {
    if (categorySearchTerm.trim() === "") {
      return category;
    }

    if (
      category?.Name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    ) {
      return category;
    }
  });

  const filteredModes = modes.filter((mode) => {
    if (modeSearchTerm.trim() === "") {
      return mode;
    }

    if (mode?.Name.toLowerCase().includes(modeSearchTerm.toLowerCase())) {
      return mode;
    }
  });

  const handlePartyModelClear = () => {
    setPartyFilter([]);
  };

  const handlePartyModalDone = () => {
    handlePartyModalClose();
  };

  const handlePartyModalClose = () => {
    setPartySearchTerm("");
    setPartyModalOpen(false);
  };

  const handleCategoryModelClear = () => {
    setCategoryFilter([]);
  };

  const handleCategoryModalDone = () => {
    handleCategoryModalClose();
  };

  const handleCategoryModalClose = () => {
    setCategorySearchTerm("");
    setCategoryModalOpen(false);
  };

  const handleModeModelClear = () => {
    setModeFilter([]);
  };

  const handleModeModalDone = () => {
    handleModeModalClose();
  };

  const handleModeModalClose = () => {
    setModeSearchTerm("");
    setModeModalOpen(false);
  };

  // for date range filter
  useEffect(() => {
    if (range === "default") return;
    let fromDate = "";
    let toDate = "";

    if (range === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "yesterday") {
      fromDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      toDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    } else if (range === "this_month") {
      fromDate = moment().startOf("month").format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "last_month") {
      fromDate = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      toDate = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
    } else if (range === "this_year") {
      fromDate = moment().startOf("year").format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "last_year") {
      fromDate = moment()
        .subtract(1, "years")
        .startOf("year")
        .format("YYYY-MM-DD");
      toDate = moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }

    setFromDate(fromDate);
    setToDate(toDate);
  }, [range]);

  // reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    fromDate,
    toDate,
    range,
    partyFilter,
    categoryFilter,
    modeFilter,
  ]);

  // reset selected bulk expenses when page changes
  useEffect(() => {
    setSelectedBulkExpenses([]);
  }, [
    currentPage,
    partyFilter,
    categoryFilter,
    modeFilter,
    searchTerm,
    fromDate,
    toDate,
    range,
  ]);

  // for hiding the body overflow when modal is open
  useEffect(() => {
    if (addExpenseModal || showCharts) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [addExpenseModal, showCharts]);

  // to close all modals when click outside other than the modal
  useEffect(() => {
    const closeModals = (e) => {
      // close party modal if not clicking on the party modal
      if (
        partyModalOpen &&
        !document.getElementById("partyFilter").contains(e.target)
      ) {
        setPartyModalOpen(false);
      }

      // close category modal if not clicking on the category modal
      if (
        categoryModalOpen &&
        !document.getElementById("categoryFilter").contains(e.target)
      ) {
        setCategoryModalOpen(false);
      }

      // close mode modal if not clicking on the mode modal
      if (
        modeModalOpen &&
        !document.getElementById("modeFilter").contains(e.target)
      ) {
        setModeModalOpen(false);
      }
    };
    window.addEventListener("click", closeModals);
    return () => window.removeEventListener("click", closeModals);
  }, [categoryModalOpen, modeModalOpen, partyModalOpen]);

  useEffect(() => {
    if (
      addExpenseModal ||
      showCharts ||
      showAiInsightsModel ||
      showImageModal ||
      showBulkActionModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [
    addExpenseModal,
    showCharts,
    showAiInsightsModel,
    showImageModal,
    showBulkActionModal,
  ]);

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
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
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
              {showFilters && (
                <>
                  {/* category, mode, party filter */}
                  <div className="flex justify-between w-full items-center gap-4 flex-wrap">
                    {/* party filter */}
                    <div
                      id="partyFilter"
                      className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20 relative cursor-pointer"
                    >
                      <label
                        htmlFor="formDate"
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Filter By Party
                      </label>
                      <div
                        className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-full dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  pl-0 ${
                          partyFilter.length > 0
                            ? "border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => setPartyModalOpen(true)}
                      >
                        <div
                          className={`p-2.5 ${
                            partyFilter.length > 0
                              ? "text-blue-500 font-bold"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Parties:{" "}
                          {partyFilter.length > 0
                            ? `${partyFilter.length} Selected`
                            : "All"}
                        </div>
                      </div>

                      {/* party modal */}
                      {partyModalOpen && (
                        <div className="absolute w-full top-24 flex justify-center items-center flex-col gap-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white z-20">
                          {/* header */}
                          <div className="w-full pt-4 px-4">
                            <input
                              type="text"
                              id="small-input"
                              className="block w-full p-2 text-gray-900 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 border border-blue-500  focus:border-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white outline-none"
                              placeholder="Search Party"
                              value={partySearchTerm}
                              onChange={(e) =>
                                setPartySearchTerm(e.target.value)
                              }
                            />
                          </div>
                          <hr className="w-full" />
                          {/* body */}
                          <div className="w-full flex flex-col gap-2 px-4 max-h-60 overflow-y-auto">
                            {filteredParties.map((party) => (
                              <div
                                key={party?._id}
                                className="flex items-center w-full"
                              >
                                <input
                                  id={party?._id}
                                  type="checkbox"
                                  value={party?._id}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                  checked={partyFilter.includes(party?._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setPartyFilter([
                                        ...partyFilter,
                                        party?._id,
                                      ]);
                                    }
                                    if (!e.target.checked) {
                                      setPartyFilter(
                                        partyFilter.filter(
                                          (id) => id !== party?._id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={party?._id}
                                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  {party?.Name}
                                </label>
                              </div>
                            ))}

                            <div className="flex justify-center items-center w-full flex-col gap-4">
                              <Link
                                className="text-green-500 font-bold hover:underline"
                                to={"/dashboard/parties"}
                              >
                                Add Party
                              </Link>
                            </div>
                          </div>
                          <hr className="w-full" />
                          {/* footer */}
                          <div className="w-full px-4 pb-4 flex justify-end items-center gap-4">
                            <button
                              className="font-bold text-gray-400"
                              onClick={handlePartyModelClear}
                            >
                              Clear
                            </button>
                            <button
                              className="font-bold text-blue-500"
                              onClick={handlePartyModalDone}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* category filter */}
                    <div
                      id="categoryFilter"
                      className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20 relative cursor-pointer"
                    >
                      <label
                        htmlFor="formDate"
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Filter By Category
                      </label>
                      <div
                        className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-full dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  pl-0 ${
                          categoryFilter.length > 0
                            ? "border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => setCategoryModalOpen(true)}
                      >
                        <div
                          className={`p-2.5 ${
                            categoryFilter.length > 0
                              ? "text-blue-500 font-bold"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Categories:{" "}
                          {categoryFilter.length > 0
                            ? `${categoryFilter.length} Selected`
                            : "All"}
                        </div>
                      </div>

                      {/* category modal */}
                      {categoryModalOpen && (
                        <div className="absolute w-full top-24 flex justify-center items-center flex-col gap-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white z-20">
                          {/* header */}
                          <div className="w-full pt-4 px-4">
                            <input
                              type="text"
                              id="small-input"
                              className="block w-full p-2 text-gray-900 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 border border-blue-500  focus:border-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white outline-none"
                              placeholder="Search Party"
                              value={categorySearchTerm}
                              onChange={(e) =>
                                setCategorySearchTerm(e.target.value)
                              }
                            />
                          </div>
                          <hr className="w-full" />
                          {/* body */}
                          <div className="w-full flex flex-col gap-2 px-4 max-h-60 overflow-y-auto">
                            {filteredCategories.map((category) => (
                              <div
                                key={category?._id}
                                className="flex items-center w-full"
                              >
                                <input
                                  id={category._id}
                                  type="checkbox"
                                  value={category._id}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                  checked={categoryFilter.includes(
                                    category._id
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCategoryFilter([
                                        ...categoryFilter,
                                        category._id,
                                      ]);
                                    }
                                    if (!e.target.checked) {
                                      setCategoryFilter(
                                        categoryFilter.filter(
                                          (id) => id !== category._id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={category._id}
                                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  {category.Name}
                                </label>
                              </div>
                            ))}
                            <div className="flex justify-center items-center w-full flex-col gap-4">
                              <Link
                                className="text-green-500 font-bold hover:underline"
                                to={"/dashboard/categories"}
                              >
                                Add Category
                              </Link>
                            </div>
                          </div>
                          <hr className="w-full" />
                          {/* footer */}
                          <div className="w-full px-4 pb-4 flex justify-end items-center gap-4">
                            <button
                              className="font-bold text-gray-400"
                              onClick={handleCategoryModelClear}
                            >
                              Clear
                            </button>
                            <button
                              className="font-bold text-blue-500"
                              onClick={handleCategoryModalDone}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* mode filter */}
                    <div
                      id="modeFilter"
                      className="flex justify-end items-start flex-col gap-2 flex-1 min-w-48 min-h-20 relative cursor-pointer"
                    >
                      <label
                        htmlFor="formDate"
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Filter By Mode
                      </label>

                      <div
                        className={`bg-gray-50 border  text-gray-900 text-sm rounded-lg block w-full dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  pl-0 ${
                          modeFilter.length > 0
                            ? "border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onClick={() => setModeModalOpen(true)}
                      >
                        <div
                          className={`p-2.5 ${
                            modeFilter.length > 0
                              ? "text-blue-500 font-bold"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Modes:{" "}
                          {modeFilter.length > 0
                            ? `${modeFilter.length} Selected`
                            : "All"}
                        </div>
                      </div>

                      {/* mode modal */}
                      {modeModalOpen && (
                        <div className="absolute w-full top-24 flex justify-center items-center flex-col gap-4 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white z-20">
                          {/* header */}
                          <div className="w-full pt-4 px-4">
                            <input
                              type="text"
                              id="small-input"
                              className="block w-full p-2 text-gray-900 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 border border-blue-500  focus:border-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white outline-none"
                              placeholder="Search Party"
                              value={modeSearchTerm}
                              onChange={(e) =>
                                setModeSearchTerm(e.target.value)
                              }
                            />
                          </div>
                          <hr className="w-full" />
                          {/* body */}
                          <div className="w-full flex flex-col gap-2 px-4 max-h-60 overflow-y-auto">
                            {filteredModes.map((mode) => (
                              <div
                                key={mode?._id}
                                className="flex items-center w-full"
                              >
                                <input
                                  id={mode._id}
                                  type="checkbox"
                                  value={mode._id}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                  checked={modeFilter.includes(mode._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setModeFilter([...modeFilter, mode._id]);
                                    }
                                    if (!e.target.checked) {
                                      setModeFilter(
                                        modeFilter.filter(
                                          (id) => id !== mode._id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={mode._id}
                                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                  {mode.Name}
                                </label>
                              </div>
                            ))}
                            <div className="flex justify-center items-center w-full flex-col gap-4">
                              <Link
                                className="text-green-500 font-bold hover:underline"
                                to={"/dashboard/modes"}
                              >
                                Add Mode
                              </Link>
                            </div>
                          </div>
                          <hr className="w-full" />
                          {/* footer */}
                          <div className="w-full px-4 pb-4 flex justify-end items-center gap-4">
                            <button
                              className="font-bold text-gray-400"
                              onClick={handleModeModelClear}
                            >
                              Clear
                            </button>
                            <button
                              className="font-bold text-blue-500"
                              onClick={handleModeModalDone}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* date filter */}
                  <div className="flex justify-between w-full items-center gap-4 flex-wrap">
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                      >
                        <option value="default">Choose a Range</option>
                        <option value="this_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="this_year">This Year</option>
                        <option value="last_year">Last Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {/* search and action */}
              <div className="flex justify-between w-full items-center flex-wrap gap-4">
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
              <div className="flex justify-center w-full items-center gap-4 flex-wrap">
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
              {/* ai insights, charts and reset filter btn */}
              <div className="flex justify-end items-center w-full gap-4 flex-wrap">
                <button
                  className="hover:brightness-110 hover:animate-pulse font-bold py-2 px-4 w-24 rounded bg-gradient-to-r from-blue-500 to-pink-500 text-white whitespace-nowrap text-sm"
                  onClick={() => {
                    if (filteredExpenses.length === 0) {
                      toast.error("No Data to show Ai Insight");
                      return;
                    }
                    if (fromDate.trim() === "" || toDate.trim() === "") {
                      toast.error("Please select date range");
                      return;
                    }
                    setShowAiInsightsModel(true);
                  }}
                >
                  Ai Insight
                </button>
                <button
                  onClick={() => {
                    setShowCharts(true);
                  }}
                  className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex justify-center whitespace-nowrap items-center gap-2 w-24 text-sm ${
                    filteredExpenses.length === 0 &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={filteredExpenses.length === 0}
                >
                  Reports
                </button>
                <button
                  onClick={resetHandler}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center whitespace-nowrap items-center gap-2 w-24 text-sm"
                >
                  Reset Filters
                </button>
              </div>

              {/* table info and actions */}
              <div className="flex justify-between w-full items-end gap-4 flex-wrap">
                <div className="flex justify-start items-start gap-2 flex-wrap flex-col">
                  {/* pagination */}
                  <div className="flex justify-center gap-2 items-center text-sm">
                    {!isLoading &&
                      filteredExpenses?.length / rowsPerPage > 1 && (
                        <>
                          <button
                            onClick={() => {
                              currentPage > 1 &&
                                setCurrentPage(currentPage - 1);
                            }}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded-full ${
                              currentPage <= 1 &&
                              "opacity-50 cursor-not-allowed "
                            }`}
                            disabled={currentPage <= 1}
                          >
                            <FaAngleLeft size={15} />
                          </button>
                          <span className="dark:text-white">
                            Page {currentPage} of{" "}
                            {Math.ceil(filteredExpenses?.length / rowsPerPage)}
                          </span>
                          <button
                            onClick={() => {
                              currentPage <
                                Math.ceil(
                                  filteredExpenses?.length / rowsPerPage
                                ) && setCurrentPage(currentPage + 1);
                            }}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded-full ${
                              currentPage >=
                                Math.ceil(
                                  filteredExpenses?.length / rowsPerPage
                                ) && "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={
                              currentPage >=
                              Math.ceil(filteredExpenses?.length / rowsPerPage)
                            }
                          >
                            <FaAngleRight size={15} />
                          </button>
                        </>
                      )}
                  </div>
                  {/* count */}
                  <div className="flex justify-center items-center gap-4 flex-wrap text-sm">
                    <h1>
                      Showing{" "}
                      <span className="text-blue-500">
                        {filteredExpenses?.slice(start, end).length}
                      </span>{" "}
                      Expenses of{" "}
                      <span className="text-blue-500">
                        {filteredExpenses.length}
                      </span>{" "}
                    </h1>
                  </div>
                </div>

                {/* selected count */}
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  {selectedBulkExpenses.length > 0 && (
                    <h1>
                      <span className="text-blue-500">
                        {selectedBulkExpenses.length}
                      </span>{" "}
                      Expenses selected{" "}
                      <span
                        className="text-blue-500 font-bold cursor-pointer"
                        onClick={() => {
                          setShowBulkActionModal(true);
                        }}
                      >
                        Bulk Action
                      </span>{" "}
                    </h1>
                  )}
                </div>
              </div>

              {/* data table */}
              <div className="flex justify-center w-full items-center gap-2 flex-wrap flex-col">
                <div className="relative overflow-x-auto shadow-md w-full rounded-t-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          <span
                            className="flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <input
                              id="default-checkbox"
                              type="checkbox"
                              value=""
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                              checked={
                                selectedBulkExpenses.length ===
                                filteredExpenses?.slice(start, end).length
                              }
                              onChange={() => {
                                if (
                                  selectedBulkExpenses.length ===
                                  filteredExpenses?.slice(start, end).length
                                ) {
                                  setSelectedBulkExpenses([]);
                                } else {
                                  setSelectedBulkExpenses(
                                    filteredExpenses
                                      ?.slice(start, end)
                                      .map((expense) => expense?._id)
                                  );
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            />
                          </span>
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Party & Detail
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Category & Mode
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Balance
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isError && renderTable()}

                      {isError && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
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

              {/* add expense modal */}
              {addExpenseModal && (
                <>
                  <div className="fixed inset-0 bg-black bg-opacity-70 z-50"></div>
                  <div
                    id="close-model"
                    className="fixed inset-0 flex justify-center items-start sm:items-center sm:m-4 overflow-y-auto sm:overflow-hidden z-50"
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
                                  <>
                                    <span className="text-green-500 font-bold">
                                      Cash In
                                    </span>
                                    <span>{isEditing && " - Edit"}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-500 font-bold">
                                      Cash Out
                                    </span>
                                    <span>{isEditing && " - Edit"}</span>
                                  </>
                                )}
                              </h3>
                              <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="editUserModal"
                                onClick={handleModalClose}
                              >
                                <FaTimes size={20} />
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div className="p-6 space-y-6 sm:max-h-[70vh] overflow-y-auto">
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
                                <CustomSelect
                                  options={parties}
                                  selected={party}
                                  setSelected={setParty}
                                  searching={partySearching}
                                  setSearching={setPartySearching}
                                  labelFor="Party"
                                />

                                {/* category */}
                                <CustomSelect
                                  options={categories}
                                  selected={category}
                                  setSelected={setCategory}
                                  searching={categorySearching}
                                  setSearching={setCategorySearching}
                                  labelFor="Category"
                                />

                                {/* mode */}
                                <CustomSelect
                                  options={modes}
                                  selected={mode}
                                  setSelected={setMode}
                                  searching={modeSearching}
                                  setSearching={setModeSearching}
                                  labelFor="Mode"
                                />

                                {/* description */}
                                <div className="col-span-6">
                                  <label
                                    htmlFor="remark"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Remark
                                  </label>
                                  <textarea
                                    id="remark"
                                    name="remark"
                                    rows="3"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                  ></textarea>
                                </div>

                                {/* attachments */}
                                <div className="col-span-6">
                                  <label
                                    htmlFor="remark"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                  >
                                    Attachments
                                  </label>
                                  <div className="flex flex-col gap-2">
                                    <FileUpload
                                      type="multiple-image"
                                      page="expense"
                                      onSetFileUrl={(urlArray) => {
                                        setAttachments([
                                          ...attachments,
                                          ...urlArray,
                                        ]);
                                      }}
                                    />
                                    {attachments.length > 0 && (
                                      <div className="flex items-center justify-start gap-3 border border-gray-300 rounded-lg p-4 dark:border-gray-600">
                                        {attachments.map(
                                          (attachment, index) => (
                                            <div
                                              key={index}
                                              className="relative"
                                            >
                                              <img
                                                src={attachment}
                                                alt="Attachment"
                                                className="h-16 rounded-lg"
                                              />
                                              <button
                                                className="text-white font-bold absolute right-[-10px] top-[-10px] bg-blue-500 rounded-full p-1"
                                                onClick={() => {
                                                  setAttachments(
                                                    attachments.filter(
                                                      (_, i) => i !== index
                                                    )
                                                  );
                                                }}
                                              >
                                                <FaRegTimesCircle size={10} />
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <!-- Modal footer --> */}
                            <div className="flex justify-center gap-4 items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                              {!isEditing && (
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
                              )}
                              {!isEditing && (
                                <button
                                  type="submit"
                                  className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                                    isCreatingExpense &&
                                    "opacity-50 cursor-not-allowed"
                                  }`}
                                  disabled={isCreatingExpense}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSaveExpense();
                                  }}
                                >
                                  Save
                                </button>
                              )}

                              {isEditing && (
                                <button
                                  type="submit"
                                  className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                                    isUpdatingExpense &&
                                    "opacity-50 cursor-not-allowed"
                                  }`}
                                  disabled={isUpdatingExpense}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleEditExpense();
                                  }}
                                >
                                  Update
                                </button>
                              )}
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
                                  fill=""
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

              {/* charts model */}
              {showCharts && (
                <ChartsModel
                  expenses={filteredExpenses}
                  closeShowCharts={closeShowCharts}
                />
              )}

              {/* ai insights */}
              {showAiInsightsModel && (
                <AiInsightsModel
                  startDate={fromDate}
                  endDate={toDate}
                  onCloseModel={() => setShowAiInsightsModel(false)}
                />
              )}

              {/* image modal */}
              <ImageModel
                showImageModel={showImageModal}
                closeImageModel={handleCloseImageModal}
                images={showImageModalUrls}
              />

              {/* bulk action modal */}
              <BulkActionModel
                showBulkActionModal={showBulkActionModal}
                closeBulkActionModal={closeBulkActionModal}
                selectedExpenses={selectedBulkExpenses}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
