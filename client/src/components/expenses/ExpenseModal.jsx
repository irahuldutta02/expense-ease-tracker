import { X, Save, RotateCcw, Image as ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "../CustomSelect";
import { FileUpload } from "../FileUpload";
import { FaRegTimesCircle } from "react-icons/fa";
import { cn } from "../../utils/cn";

export const ExpenseModal = ({
  isOpen,
  handleClose,
  expenseType,
  setExpenseType,
  dateTime,
  setDateTime,
  amount,
  setAmount,
  party,
  setParty,
  partySearching,
  setPartySearching,
  category,
  setCategory,
  categorySearching,
  setCategorySearching,
  mode,
  setMode,
  modeSearching,
  setModeSearching,
  remark,
  setRemark,
  attachments,
  setAttachments,
  handleSave,
  handleEdit,
  isEditing,
  isSaving,
  parties,
  categories,
  modes,
  handleResetForm
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-muted/30">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {isEditing ? "Edit" : "New"} {expenseType === "cash_in" ? "Income" : "Expense"}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest",
                  expenseType === "cash_in" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {expenseType === "cash_in" ? "Cash In" : "Cash Out"}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Fill in the details below</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <form className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Type</label>
                <div className="flex p-1 bg-muted rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => setExpenseType("cash_in")}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                      expenseType === "cash_in" ? "bg-card text-emerald-500 shadow-sm" : "text-muted-foreground hover:bg-card/50"
                    )}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpenseType("cash_out")}
                    className={cn(
                      "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                      expenseType === "cash_out" ? "bg-card text-rose-500 shadow-sm" : "text-muted-foreground hover:bg-card/50"
                    )}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Date Time */}
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold ml-1">Amount</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-4 bg-muted/50 border rounded-2xl text-2xl font-black focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Custom Selects */}
              <CustomSelect
                options={parties}
                selected={party}
                setSelected={setParty}
                searching={partySearching}
                setSearching={setPartySearching}
                labelFor="Party"
              />
              <CustomSelect
                options={categories}
                selected={category}
                setSelected={setCategory}
                searching={categorySearching}
                setSearching={setCategorySearching}
                labelFor="Category"
              />
              <div className="md:col-span-2">
                <CustomSelect
                  options={modes}
                  selected={mode}
                  setSelected={setMode}
                  searching={modeSearching}
                  setSearching={setModeSearching}
                  labelFor="Payment Mode"
                />
              </div>

              {/* Remark */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold ml-1">Remark / Note</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="What was this for?"
                  rows={3}
                  className="w-full p-4 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Attachments */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-bold ml-1 flex items-center gap-2">
                  <ImageIcon size={16} /> Attachments
                </label>
                <div className="space-y-4">
                  <FileUpload
                    type="multiple-image"
                    page="expense"
                    onSetFileUrl={(urlArray) => {
                      setAttachments([...attachments, ...urlArray]);
                    }}
                  />
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 p-4 bg-muted/30 border border-dashed rounded-2xl">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={attachment}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-xl shadow-sm transition-transform group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-muted/30">
            {!isEditing && (
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-all"
              >
                <RotateCcw size={18} /> Reset
              </button>
            )}
            <button
              type="button"
              disabled={isSaving}
              onClick={isEditing ? handleEdit : handleSave}
              className={cn(
                "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50",
                expenseType === "cash_in" 
                  ? "bg-emerald-500 text-white shadow-emerald-500/20" 
                  : "bg-rose-500 text-white shadow-rose-500/20"
              )}
            >
              <Save size={18} />
              {isSaving ? "Saving..." : isEditing ? "Update" : "Save Entry"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
