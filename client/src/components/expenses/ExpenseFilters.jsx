import { Search, SlidersHorizontal, Plus, Minus, RotateCcw, Brain, BarChart3, ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import toast from "react-hot-toast";

export const ExpenseFilters = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  range,
  setRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  partyFilter,
  setPartyFilter,
  categoryFilter,
  setCategoryFilter,
  modeFilter,
  setModeFilter,
  parties,
  categories,
  modes,
  resetHandler,
  setShowAiInsightsModel,
  setShowCharts,
  setAddExpenseModal,
  setExpenseType,
  hasData
}) => {
  const toggleFilter = (id, currentFilter, setFilter) => {
    if (currentFilter.includes(id)) {
      setFilter(currentFilter.filter(item => item !== id));
    } else {
      setFilter([...currentFilter, id]);
    }
  };

  const isDateRangeValid = () => {
    if (range !== "default") return true;
    return fromDate && toDate;
  };

  const MultiSelectSection = ({ label, items, selectedItems, onToggle }) => (
    <div className="flex flex-col h-[240px]">
      <div className="flex justify-between items-center mb-2.5 px-1">
        <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/90">{label}</label>
        {selectedItems.length > 0 && (
          <button 
            onClick={() => onToggle([])} 
            className="text-[10px] font-bold text-primary/60 hover:text-destructive transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto p-2.5 bg-muted/20 border border-border/40 rounded-3xl custom-scrollbar hover:border-border/80 transition-all">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground/60 italic text-center px-4">No {label.toLowerCase()} found</p>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItems.includes(item._id);
            return (
              <button
                key={item._id}
                onClick={() => onToggle(item._id, selectedItems)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2 rounded-2xl text-[11px] font-bold transition-all group shrink-0",
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-md scale-[0.98]" 
                    : "hover:bg-background text-muted-foreground hover:text-foreground hover:shadow-sm"
                )}
              >
                <span className="truncate pr-2">{item.Name}</span>
                {isSelected ? (
                  <Check size={12} strokeWidth={3} className="shrink-0" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-primary/10 group-hover:border-primary/30 shrink-0 transition-colors" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search and Main Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-card border rounded-[1.25rem] text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm"
            placeholder="Search by remark..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
          <button
            onClick={() => {
              setAddExpenseModal(true);
              setExpenseType("cash_in");
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 text-white rounded-[1.25rem] text-sm font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Income
          </button>
          <button
            onClick={() => {
              setAddExpenseModal(true);
              setExpenseType("cash_out");
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-rose-500 text-white rounded-[1.25rem] text-sm font-black shadow-lg shadow-rose-500/20 hover:scale-105 transition-all active:scale-95"
          >
            <Minus size={18} strokeWidth={3} /> Expense
          </button>
          
          <div className="w-px h-10 bg-border/60 mx-2 hidden sm:block" />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-6 py-3.5 rounded-[1.25rem] text-sm font-black border transition-all hover:bg-muted shadow-sm active:scale-95",
              showFilters && "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
            )}
          >
            <SlidersHorizontal size={18} />
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-card border border-border/40 shadow-2xl rounded-[3rem] animate-in fade-in slide-in-from-top-4 duration-500">
          <MultiSelectSection 
            label="Party" 
            items={parties} 
            selectedItems={partyFilter} 
            onToggle={(id) => typeof id === 'string' ? toggleFilter(id, partyFilter, setPartyFilter) : setPartyFilter([])} 
          />
          
          <MultiSelectSection 
            label="Category" 
            items={categories} 
            selectedItems={categoryFilter} 
            onToggle={(id) => typeof id === 'string' ? toggleFilter(id, categoryFilter, setCategoryFilter) : setCategoryFilter([])} 
          />
          
          <MultiSelectSection 
            label="Mode" 
            items={modes} 
            selectedItems={modeFilter} 
            onToggle={(id) => typeof id === 'string' ? toggleFilter(id, modeFilter, setModeFilter) : setModeFilter([])} 
          />

          <div className="flex flex-col h-[240px]">
            <label className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground/90 mb-2.5 px-1">Date Range</label>
            <div className="flex-1 flex flex-col gap-4 p-5 bg-muted/20 border border-border/40 rounded-3xl hover:border-border/80 transition-all">
              <div className="relative group">
                <select
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-background border border-border/60 rounded-[1.25rem] text-xs font-black focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer appearance-none shadow-sm hover:border-primary/30"
                >
                  <option value="default">📅 Custom Range</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">This Year</option>
                  <option value="last_year">Last Year</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" size={14} />
              </div>
              
              <div className={cn(
                "flex flex-col gap-3 transition-all duration-500",
                range === "default" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none grayscale"
              )}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-muted-foreground/60 ml-2 uppercase tracking-tighter">From</span>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full p-3 bg-background border border-border/60 rounded-2xl text-[10px] font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:[color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-muted-foreground/60 ml-2 uppercase tracking-tighter">To</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full p-3 bg-background border border-border/60 rounded-2xl text-[10px] font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-center text-muted-foreground/50 font-medium">Select a start and end date to filter records</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics & Tools Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/80 backdrop-blur-md p-3.5 rounded-[2rem] border shadow-lg">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => {
              if (!isDateRangeValid()) {
                toast.error("Please select a valid date range first!");
                return;
              }
              setShowAiInsightsModel(true);
            }}
            disabled={!hasData}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
          >
            <Brain size={18} strokeWidth={2.5} /> AI Insight
          </button>

          <button
            onClick={() => setShowCharts(true)}
            disabled={!hasData}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-sm font-bold shadow-lg shadow-sky-600/20 hover:scale-105 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
          >
            <BarChart3 size={18} strokeWidth={2.5} /> Charts
          </button>
        </div>

        <button
          onClick={resetHandler}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-[1.25rem] bg-muted text-muted-foreground text-sm font-bold hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-[0.98] group"
        >
          <RotateCcw size={18} className="group-hover:-rotate-45 transition-transform" /> Reset Filters
        </button>
      </div>
    </div>
  );
};
