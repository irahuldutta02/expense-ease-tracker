import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "../utils/cn";

const CustomSelect = ({
  options,
  selected,
  setSelected,
  searching,
  setSearching,
  labelFor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const selectedOption = options.find((option) => option._id === selected);
  const displayValue = selectedOption ? selectedOption.Name : searching;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearching("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setSearching]);

  const filteredOptions = options.filter((option) =>
    option.Name.toLowerCase().includes(searching.toLowerCase())
  );

  const handleSelect = (optionId) => {
    setSelected(optionId);
    setIsOpen(false);
    setSearching("");
  };

  const handleSearching = (search) => {
    setSelected("");
    setSearching(search);
    setIsOpen(true);
  };

  return (
    <div className="space-y-2 relative" ref={ref}>
      <label className="text-sm font-bold ml-1 text-foreground/80">
        {labelFor}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder={`Search ${labelFor}...`}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 bg-muted/50 border rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all",
            isOpen && "border-primary/50 ring-2 ring-primary/10"
          )}
          value={displayValue}
          onChange={(e) => handleSearching(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
          <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
        </div>

        {isOpen && (
          <div className="absolute z-[70] mt-2 w-full max-h-60 overflow-y-auto bg-card border shadow-2xl rounded-2xl p-1 animate-in fade-in zoom-in-95 slide-in-from-top-2 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground italic">
                No {labelFor.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option._id}
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors",
                    selected === option._id 
                      ? "bg-primary text-primary-foreground font-bold" 
                      : "hover:bg-muted text-left"
                  )}
                  onClick={() => handleSelect(option._id)}
                >
                  <span className="truncate">{option.Name}</span>
                  {selected === option._id && <Check size={16} className="shrink-0" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
