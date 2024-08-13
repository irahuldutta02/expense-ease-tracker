import { useState, useEffect, useRef } from "react";

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

  const searchTerm =
    options.filter((option) => option._id === selected)[0]?.Name || "";

  useEffect(() => {
    // Function to handle click outside
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearching("");
      }
    };

    // Adding event listener when dropdown is open
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, setSearching]);

  const filteredOptions = options.filter((option) =>
    option.Name.toLowerCase().includes(searching.toLowerCase())
  );

  const handleSelect = (optionId) => {
    setSelected(optionId);
    setIsOpen(false);
  };

  const handleSearching = (search) => {
    setSelected("");
    setSearching(search);
  };

  return (
    <div className="col-span-6 sm:col-span-3 relative" ref={ref}>
      <label
        htmlFor="custom-select"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Select {labelFor}
      </label>
      <div className="relative">
        <input
          id="custom-select"
          name="custom-select"
          type="text"
          placeholder={`Select ${labelFor}`}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
          value={searchTerm.length === 0 ? searching : searchTerm}
          onChange={(e) => handleSearching(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-300 dark:border-gray-500 dropdown-custom-scrollbar">
            {filteredOptions.map((option) => (
              <div
                key={option._id}
                className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSelect(option._id)}
              >
                {option.Name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
