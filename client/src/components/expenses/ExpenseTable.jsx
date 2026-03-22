import { 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Copy, 
  Receipt,
  CheckCircle2,
  Circle
} from "lucide-react";
import { convertToReadableDateString } from "../../utils/convertToReadableDateString";
import { convertTo12HourTime } from "../../utils/convertTo12HourTime";
import { roundToTwoDecimalPlaces } from "../../utils/roundToTwoDecimalPlaces";
import { cn } from "../../utils/cn";

export const ExpenseTable = ({
  expenses,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  selectedBulkExpenses,
  setSelectedBulkExpenses,
  handleEditing,
  handleDuplicate,
  handleDeleteExpense,
  handleShowImageModal,
  setShowBulkActionModal,
  isError,
  isLoading
}) => {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedExpenses = expenses.slice(start, end);

  const toggleAll = () => {
    if (selectedBulkExpenses.length === paginatedExpenses.length) {
      setSelectedBulkExpenses([]);
    } else {
      setSelectedBulkExpenses(paginatedExpenses.map(e => e._id));
    }
  };

  const toggleOne = (id) => {
    if (selectedBulkExpenses.includes(id)) {
      setSelectedBulkExpenses(selectedBulkExpenses.filter(i => i !== id));
    } else {
      setSelectedBulkExpenses([...selectedBulkExpenses, id]);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-dashed rounded-[2rem]">
        <p className="text-destructive font-bold text-lg">Error Fetching Data</p>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Header / Selection Actions */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground font-bold">{paginatedExpenses.length}</span> of <span className="text-foreground font-bold">{expenses.length}</span>
          </p>
          {selectedBulkExpenses.length > 0 && (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in-95">
              <span className="h-4 w-px bg-border" />
              <p className="text-sm font-bold text-primary">
                {selectedBulkExpenses.length} selected
              </p>
              <button
                onClick={() => setShowBulkActionModal(true)}
                className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
              >
                Bulk Action
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold">
            {currentPage} / {Math.ceil(expenses.length / rowsPerPage) || 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(expenses.length / rowsPerPage), prev + 1))}
            disabled={currentPage >= Math.ceil(expenses.length / rowsPerPage)}
            className="p-2 rounded-xl hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Actual Table */}
      <div className="relative overflow-x-auto border bg-card rounded-[2rem] shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase tracking-wider font-bold bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-4 w-10">
                <button onClick={toggleAll} className="text-primary transition-transform active:scale-90">
                  {selectedBulkExpenses.length === paginatedExpenses.length && paginatedExpenses.length > 0 
                    ? <CheckCircle2 size={20} /> 
                    : <Circle size={20} />
                  }
                </button>
              </th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Balance</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Receipt size={40} className="text-muted-foreground/30" />
                    <p className="text-lg font-medium text-muted-foreground">No expenses found</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedExpenses.map((expense) => (
                <tr 
                  key={expense._id} 
                  className={cn(
                    "group transition-colors hover:bg-muted/30 cursor-pointer",
                    selectedBulkExpenses.includes(expense._id) && "bg-primary/5"
                  )}
                  onClick={() => handleEditing(expense)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleOne(expense._id)} className="text-primary/40 group-hover:text-primary transition-colors">
                      {selectedBulkExpenses.includes(expense._id) 
                        ? <CheckCircle2 size={20} className="text-primary" /> 
                        : <Circle size={20} />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-bold text-foreground">{convertToReadableDateString(expense.Date)}</p>
                    <p className="text-xs text-muted-foreground">{convertTo12HourTime(expense.Date)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-foreground">{expense.Party?.Name || "Self"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{expense.Remark || "No remark"}</p>
                      </div>
                      {expense.attachments?.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowImageModal(expense.attachments);
                          }}
                          className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <Receipt size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase text-muted-foreground mb-1">
                      {expense.Category?.Name || "Uncategorized"}
                    </span>
                    <p className="text-xs text-muted-foreground font-medium">{expense.Mode?.Name || "Unknown Mode"}</p>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {expense.Cash_In ? (
                      <span className="text-emerald-500 font-black text-base">
                        + ₹{expense.Cash_In}
                      </span>
                    ) : (
                      <span className="text-rose-500 font-black text-base">
                        - ₹{expense.Cash_Out}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <p className="font-bold text-foreground">₹{roundToTwoDecimalPlaces(expense.balance)}</p>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditing(expense)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(expense)}
                        className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
