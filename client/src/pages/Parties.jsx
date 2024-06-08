import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { ConfirmationModelContext } from "../context/ContextProvider";
import {
  useCreatePartyMutation,
  useDeletePartyMutation,
  useGetPartiesQuery,
  useUpdatePartyMutation,
} from "../redux/partyApiSlice";

export const Parties = () => {
  const { data, isLoading, isError, refetch } = useGetPartiesQuery();
  const categories = data?.data || [];

  const [createParty, { isLoading: createPartyLoading }] =
    useCreatePartyMutation();

  const [updateParty, { isLoading: updatePartyLoading }] =
    useUpdatePartyMutation();

  const [deleteParty, { isLoading: deletePartyLoading }] =
    useDeletePartyMutation();

  const [inputParty, setInputParty] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editParty, setEditParty] = useState(null);

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  const sortedParties = [...categories]?.sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  const handleAddParty = (e) => {
    e.preventDefault();
    if (!inputParty) {
      toast.error("Party name is required!");
      return;
    }

    if (inputParty.trim().length === 0) {
      toast.error("Party name is required!");
      return;
    }

    if (isEditing) {
      openConfirmationModel({
        question: "Are you sure you want to update this party?",
        answer: ["Yes", "No"],
        onClose: (result) => {
          if (result) {
            updateParty({
              id: editParty._id,
              data: { name: inputParty },
            })
              .unwrap()
              .then(() => {
                toast.success("Party updated successfully!");
                setInputParty("");
                setIsEditing(false);
                setEditParty(null);
                refetch();
              })
              .catch((error) => {
                toast.error(error?.data?.message || "Something went wrong!");
              });
          } else {
            return;
          }
        },
      });
    } else {
      createParty({ name: inputParty })
        .unwrap()
        .then(() => {
          toast.success("Party added successfully!");
          setInputParty("");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Something went wrong!");
        });
    }
  };

  const handleEditParty = (party) => {
    setIsEditing(true);
    setEditParty(party);
    setInputParty(party?.Name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteParty = (party) => {
    setInputParty("");
    setEditParty(null);
    setIsEditing(false);

    openConfirmationModel({
      question: "Are you sure you want to delete this party?",
      answer: ["Yes", "No"],
      onClose: (result) => {
        if (result) {
          deleteParty(party._id)
            .unwrap()
            .then(() => {
              toast.success("Party deleted successfully!");
              refetch();
            })
            .catch((error) => {
              toast.error(error?.data?.message || "Something went wrong!");
            });
        } else {
          return;
        }
      },
    });
  };

  return (
    <>
      <div className="flex justify-start items-center flex-col gap-4 w-full">
        <div className="flex justify-start items-center flex-col gap-4 w-full">
          {/* page header */}
          <div className="flex justify-between w-full items-center border-b-2 py-4">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">Parties</h1>
            </div>
          </div>

          {/* add or edit party */}
          <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap flex-col">
            <div className="flex justify-center items-center gap-4 w-full max-w-sm">
              <input
                type="text"
                className="block outline-none w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={inputParty}
                onChange={(e) => setInputParty(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center gap-4 w-full max-w-sm">
              <button
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32 ${
                  createPartyLoading || updatePartyLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleAddParty}
                disabled={createPartyLoading || updatePartyLoading}
              >
                {!isEditing ? "Add" : "Update"}
              </button>
              {isEditing && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                  onClick={() => {
                    setIsEditing(false);
                    setEditParty(null);
                    setInputParty("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center w-full h-96">
              <div className="flex justify-center items-center gap-4">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
          )}
          {isError && (
            <div className="flex justify-center items-center w-full h-96">
              <div className="flex justify-center items-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-500">
                  Something went wrong!
                </h1>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                  onClick={() => refetch()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {!isLoading && !isError && categories.length === 0 && (
            <div className="flex justify-center items-center w-full">
              <div className="flex justify-center items-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-red-500">
                  No parties found!
                </h1>
              </div>
            </div>
          )}
          {!isLoading && !isError && categories.length > 0 && (
            <>
              {/* categories */}
              <div className="flex justify-center flex-col w-full items-center gap-2 flex-wrap">
                {sortedParties?.map((party, index) => (
                  <div
                    key={party._id}
                    className="flex justify-between w-full max-w-3xl items-center py-2 gap-4"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <div className="flex justify-center items-center gap-2">
                        <span>{index + 1}.</span>
                        <h1 className="text-sm font-bold">{party?.Name}</h1>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                      <button
                        className="btn btn-primary font-bold text-green-400
                      hover:underline"
                        onClick={() => handleEditParty(party)}
                        disabled={updatePartyLoading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-primary font-bold text-red-400 hover:underline"
                        onClick={() => handleDeleteParty(party)}
                        disabled={deletePartyLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
