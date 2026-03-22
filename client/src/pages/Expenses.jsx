import moment from "moment";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiInsightsModel } from "../components/AiInsightsModel";
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
import { BulkActionModel } from "../components/BulkActionModel";

// New Components
import { ExpenseSummary } from "../components/expenses/ExpenseSummary";
import { ExpenseFilters } from "../components/expenses/ExpenseFilters";
import { ExpenseTable } from "../components/expenses/ExpenseTable";
import { ExpenseModal } from "../components/expenses/ExpenseModal";
import { motion } from "framer-motion";

export const Expenses = () => {
  // API Hooks
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();
  const expenses = data?.data || [];
  const { data: modesData, refetch: modesRefetch } = useGetModesQuery();
  const modes = [...(modesData?.data || [])].sort((a, b) => a.Name.localeCompare(b.Name));
  const { data: categoriesData, refetch: categoriesRefetch } = useGetCategoriesQuery();
  const categories = [...(categoriesData?.data || [])].sort((a, b) => a.Name.localeCompare(b.Name));
  const { data: partiesData, refetch: partiesRefetch } = useGetPartiesQuery();
  const parties = [...(partiesData?.data || [])].sort((a, b) => a.Name.localeCompare(b.Name));

  const [createExpense, { isLoading: isCreatingExpense }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdatingExpense }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeletingExpense }] = useDeleteExpenseMutation();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [range, setRange] = useState("default");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [partyFilter, setPartyFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [modeFilter, setModeFilter] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // UI States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [expenseType, setExpenseType] = useState("cash_out");
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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Modal States
  const [showAiInsightsModel, setShowAiInsightsModel] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageModalUrls, setShowImageModalUrls] = useState(null);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [selectedBulkExpenses, setSelectedBulkExpenses] = useState([]);

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  // Filtering Logic
  let filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = !searchTerm || expense?.Remark?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = partyFilter.length === 0 || partyFilter.includes(expense?.Party?._id);
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(expense?.Category?._id);
    const matchesMode = modeFilter.length === 0 || modeFilter.includes(expense?.Mode?._id);
    
    let matchesDate = true;
    if (fromDate && toDate) {
      const itemDate = moment(expense.Date).format("YYYY-MM-DD");
      matchesDate = moment(itemDate).isSameOrAfter(fromDate) && moment(itemDate).isSameOrBefore(toDate);
    }

    return matchesSearch && matchesParty && matchesCategory && matchesMode && matchesDate;
  });

  const totalCashIn = filteredExpenses.reduce((acc, e) => acc + (e.Cash_In || 0), 0);
  const totalCashOut = filteredExpenses.reduce((acc, e) => acc + (e.Cash_Out || 0), 0);

  // Handlers
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
    setIsEditing(false);
    setEditId(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRange("default");
    setFromDate("");
    setToDate("");
    setPartyFilter([]);
    setCategoryFilter([]);
    setModeFilter([]);
    refetch();
  };

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
    setAttachments(expense?.attachments || []);
    setAddExpenseModal(true);
  };

  const handleDuplicate = (expense) => {
    handleEditing(expense);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSaveExpense = async () => {
    const expense = {
      Date: dateTime,
      Cash_In: expenseType === "cash_in" ? amount : null,
      Cash_Out: expenseType === "cash_out" ? amount : null,
      Party: party || null,
      Category: category || null,
      Mode: mode || null,
      Remark: remark,
      attachments,
    };
    try {
      const res = await createExpense(expense);
      if (res?.data?.status === 201) {
        toast.success("Entry saved!");
        handleResetForm();
        setAddExpenseModal(false);
        refetch();
      }
    } catch (error) {
      toast.error("Error saving entry");
    }
  };

  const handleUpdateExpense = async () => {
    openConfirmationModel({
      question: "Update this entry?",
      answer: ["Yes", "No"],
      onClose: async (result) => {
        if (!result) return;
        const expense = {
          Date: dateTime,
          Cash_In: expenseType === "cash_in" ? amount : null,
          Cash_Out: expenseType === "cash_out" ? amount : null,
          Party: party || null,
          Category: category || null,
          Mode: mode || null,
          Remark: remark,
          attachments,
        };
        try {
          const res = await updateExpense({ id: editId, data: expense });
          if (res?.data?.status === 200) {
            toast.success("Entry updated!");
            setAddExpenseModal(false);
            handleResetForm();
            refetch();
          }
        } catch (error) {
          toast.error("Error updating entry");
        }
      },
    });
  };

  const handleDeleteExpense = (id) => {
    openConfirmationModel({
      question: "Delete this expense?",
      answer: ["Delete", "Cancel"],
      onClose: async (result) => {
        if (result === "Delete") {
          try {
            const res = await deleteExpense(id);
            if (res?.data?.status === 200) {
              toast.success("Entry deleted");
              refetch();
            }
          } catch (error) {
            toast.error("Error deleting entry");
          }
        }
      },
    });
  };

  // Date Range Sync
  useEffect(() => {
    if (range === "default") return;
    let start = "";
    let end = moment().format("YYYY-MM-DD");

    if (range === "today") start = end;
    else if (range === "yesterday") {
      start = moment().subtract(1, "days").format("YYYY-MM-DD");
      end = start;
    } else if (range === "this_month") start = moment().startOf("month").format("YYYY-MM-DD");
    else if (range === "last_month") {
      start = moment().subtract(1, "months").startOf("month").format("YYYY-MM-DD");
      end = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
    } else if (range === "this_year") start = moment().startOf("year").format("YYYY-MM-DD");
    else if (range === "last_year") {
      start = moment().subtract(1, "years").startOf("year").format("YYYY-MM-DD");
      end = moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }

    setFromDate(start);
    setToDate(end);
  }, [range]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate, partyFilter, categoryFilter, modeFilter]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-muted rounded-2xl" />
          <div className="h-10 w-32 bg-muted rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-[2rem]" />)}
        </div>
        <div className="h-12 w-full bg-muted rounded-2xl" />
        <div className="h-96 w-full bg-muted rounded-[2rem]" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 pb-20 p-2 sm:p-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your cash flow</p>
        </div>
      </div>

      <ExpenseSummary totalCashIn={totalCashIn} totalCashOut={totalCashOut} />

      <ExpenseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        range={range}
        setRange={setRange}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        partyFilter={partyFilter}
        setPartyFilter={setPartyFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        modeFilter={modeFilter}
        setModeFilter={setModeFilter}
        parties={parties}
        categories={categories}
        modes={modes}
        resetHandler={resetFilters}
        setShowAiInsightsModel={setShowAiInsightsModel}
        setShowCharts={setShowCharts}
        setAddExpenseModal={setAddExpenseModal}
        setExpenseType={setExpenseType}
        hasData={filteredExpenses.length > 0}
      />

      <ExpenseTable
        expenses={filteredExpenses}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        selectedBulkExpenses={selectedBulkExpenses}
        setSelectedBulkExpenses={setSelectedBulkExpenses}
        handleEditing={handleEditing}
        handleDuplicate={handleDuplicate}
        handleDeleteExpense={handleDeleteExpense}
        handleShowImageModal={(urls) => {
          setShowImageModalUrls(urls);
          setShowImageModal(true);
        }}
        setShowBulkActionModal={setShowBulkActionModal}
        isError={isError}
        isLoading={isLoading}
      />

      <ExpenseModal
        isOpen={addExpenseModal}
        handleClose={() => {
          setAddExpenseModal(false);
          handleResetForm();
        }}
        expenseType={expenseType}
        setExpenseType={setExpenseType}
        dateTime={dateTime}
        setDateTime={setDateTime}
        amount={amount}
        setAmount={setAmount}
        party={party}
        setParty={setParty}
        partySearching={partySearching}
        setPartySearching={setPartySearching}
        category={category}
        setCategory={setCategory}
        categorySearching={categorySearching}
        setCategorySearching={setCategorySearching}
        mode={mode}
        setMode={setMode}
        modeSearching={modeSearching}
        setModeSearching={setModeSearching}
        remark={remark}
        setRemark={setRemark}
        attachments={attachments}
        setAttachments={setAttachments}
        handleSave={handleSaveExpense}
        handleEdit={handleUpdateExpense}
        isEditing={isEditing}
        isSaving={isCreatingExpense || isUpdatingExpense}
        parties={parties}
        categories={categories}
        modes={modes}
        handleResetForm={handleResetForm}
      />

      {/* Modals */}
      {showCharts && <ChartsModel expenses={filteredExpenses} closeShowCharts={() => setShowCharts(false)} />}
      {showAiInsightsModel && (
        <AiInsightsModel
          startDate={fromDate}
          endDate={toDate}
          onCloseModel={() => setShowAiInsightsModel(false)}
        />
      )}
      <ImageModel
        showImageModel={showImageModal}
        closeImageModel={() => setShowImageModal(false)}
        images={showImageModalUrls}
      />
      <BulkActionModel
        showBulkActionModal={showBulkActionModal}
        closeBulkActionModal={() => {
          setShowBulkActionModal(false);
          setSelectedBulkExpenses([]);
          refetch();
        }}
        selectedExpenses={selectedBulkExpenses}
      />
    </motion.div>
  );
};
