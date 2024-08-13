import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { useGetCategoriesQuery } from "../redux/categoryApiSlice";
import { useBulkUpdateExpenseMutation } from "../redux/expenseApiSlice";
import { useGetModesQuery } from "../redux/modeApiSlice";
import { useGetPartiesQuery } from "../redux/partyApiSlice";
import CustomSelect from "./CustomSelect";
import { ConfirmationModelContext } from "../context/ContextProvider";

export const BulkActionModel = ({
  showBulkActionModal,
  closeBulkActionModal,
  selectedExpenses,
}) => {
  const {
    data: modesData,
    isLoading: modesIsLoading,
    isError: modesIsError,
  } = useGetModesQuery();
  let modes = modesData?.data || [];
  modes = [...modes].sort((a, b) => a.Name.localeCompare(b.Name));
  const {
    data: categoriesData,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
  } = useGetCategoriesQuery();
  let categories = categoriesData?.data || [];
  categories = [...categories].sort((a, b) => a.Name.localeCompare(b.Name));
  const {
    data: partiesData,
    isLoading: partiesIsLoading,
    isError: partiesIsError,
  } = useGetPartiesQuery();
  let parties = partiesData?.data || [];
  parties = [...parties].sort((a, b) => a.Name.localeCompare(b.Name));

  const [bulkUpdateExpense] = useBulkUpdateExpenseMutation();

  const [party, setParty] = useState("");
  const [partySearching, setPartySearching] = useState("");
  const [category, setCategory] = useState("");
  const [categorySearching, setCategorySearching] = useState("");
  const [mode, setMode] = useState("");
  const [modeSearching, setModeSearching] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  const validateInput = () => {
    console.log(party.trim(), category.trim(), mode.trim());

    if (
      (party.trim() == "" || party === null) &&
      (category.trim() == "" || category === null) &&
      (mode.trim() == "" || mode === null)
    ) {
      toast.error("Please fill at least one of the fields!");
      return false;
    }
    return true;
  };

  const handleBulkAction = async () => {
    openConfirmationModel({
      question: "Are you sure you want to Update these expenses?",
      answer: ["Yes", "No"],
      onClose: async (result) => {
        if (result) {
          try {
            setIsSaving(true);

            if (!validateInput()) {
              return;
            }

            const payload = {
              ids: selectedExpenses,
            };

            if (party.trim() !== "" && party !== null) {
              payload.Party = party;
            }

            if (category.trim() !== "" && category !== null) {
              payload.Category = category;
            }

            if (mode.trim() !== "" && mode !== null) {
              payload.Mode = mode;
            }

            const res = await bulkUpdateExpense(payload).unwrap();

            if (res.status === 200) {
              toast.success("Bulk action saved successfully!");
              handleCloseBulkActionModal();
            }
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
          } finally {
            setIsSaving(false);
          }
        } else {
          return;
        }
      },
    });
  };

  const handleCloseBulkActionModal = () => {
    setParty("");
    setCategory("");
    setMode("");
    setPartySearching("");
    setCategorySearching("");
    setModeSearching("");
    setIsSaving(false);
    closeBulkActionModal();
  };

  return (
    <>
      {showBulkActionModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50"></div>
          <div
            id="close-model"
            className="fixed inset-0 flex justify-center items-start sm:items-center sm:m-4 overflow-y-auto sm:overflow-hidden z-50"
          >
            <div className="w-full max-w-2xl">
              {/* model content */}
              <div className="relative bg-white sm:rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Attachments
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="editUserModal"
                    onClick={handleCloseBulkActionModal}
                  >
                    <FaTimes size={20} />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-4 sm:max-h-[70vh] overflow-y-auto min-h-72">
                  <div className="flex justify-center items-center gap-4 flex-col">
                    {selectedExpenses.length > 0 && (
                      <p>
                        <span className="font-bold text-blue-500">
                          {selectedExpenses.length}
                        </span>{" "}
                        Expenses selected
                      </p>
                    )}
                    {!partiesIsLoading &&
                      !categoriesIsLoading &&
                      !modesIsLoading &&
                      !modesIsError &&
                      !categoriesIsError &&
                      !partiesIsError && (
                        <form className="flex gap-4 justify-center items-center">
                          {/* party */}
                          <CustomSelect
                            options={[
                              {
                                Name: "None",
                                _id: "none",
                              },
                              ...parties,
                            ]}
                            selected={party}
                            setSelected={setParty}
                            searching={partySearching}
                            setSearching={setPartySearching}
                            labelFor="Party"
                          />

                          {/* category */}
                          <CustomSelect
                            options={[
                              {
                                Name: "None",
                                _id: "none",
                              },
                              ...categories,
                            ]}
                            selected={category}
                            setSelected={setCategory}
                            searching={categorySearching}
                            setSearching={setCategorySearching}
                            labelFor="Category"
                          />

                          {/* mode */}
                          <CustomSelect
                            options={[
                              {
                                Name: "None",
                                _id: "none",
                              },
                              ...modes,
                            ]}
                            selected={mode}
                            setSelected={setMode}
                            searching={modeSearching}
                            setSearching={setModeSearching}
                            labelFor="Mode"
                          />
                        </form>
                      )}

                    <div className="flex justify-end items-center gap-4 flex-col">
                      <button
                        type="submit"
                        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                          isSaving && "opacity-50 cursor-not-allowed"
                        }`}
                        disabled={isSaving}
                        onClick={(e) => {
                          e.preventDefault();
                          handleBulkAction();
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                {/* <!-- Modal footer --> */}
                <div className="flex justify-center gap-4 items-center p-8 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
