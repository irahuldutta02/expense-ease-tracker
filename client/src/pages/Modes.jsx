import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ConfirmationModelContext } from "../context/ContextProvider";
import {
  useCreateModeMutation,
  useDeleteModeMutation,
  useGetModesQuery,
  useUpdateModeMutation,
} from "../redux/modeApiSlice";

export const Modes = () => {
  const { data, isLoading, isError, refetch } = useGetModesQuery();
  const categories = data?.data || [];

  const [createMode, { isLoading: createModeLoading }] =
    useCreateModeMutation();

  const [updateMode, { isLoading: updateModeLoading }] =
    useUpdateModeMutation();

  const [deleteMode, { isLoading: deleteModeLoading }] =
    useDeleteModeMutation();

  const [inputMode, setInputMode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  const sortedModes = [...categories]?.sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  const handleAddMode = (e) => {
    e.preventDefault();
    if (!inputMode) {
      toast.error("Mode name is required!");
      return;
    }

    if (inputMode.trim().length === 0) {
      toast.error("Mode name is required!");
      return;
    }

    if (isEditing) {
      openConfirmationModel({
        question: "Are you sure you want to update this mode?",
        answer: ["Yes", "No"],
        onClose: (result) => {
          if (result) {
            updateMode({
              id: editMode._id,
              data: { name: inputMode },
            })
              .unwrap()
              .then(() => {
                toast.success("Mode updated successfully!");
                setInputMode("");
                setIsEditing(false);
                setEditMode(null);
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
      createMode({ name: inputMode })
        .unwrap()
        .then(() => {
          toast.success("Mode added successfully!");
          setInputMode("");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Something went wrong!");
        });
    }
  };

  const handleEditMode = (mode) => {
    setIsEditing(true);
    setEditMode(mode);
    setInputMode(mode?.Name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteMode = (mode) => {
    setInputMode("");
    setEditMode(null);
    setIsEditing(false);

    openConfirmationModel({
      question: "Are you sure you want to delete this mode?",
      answer: ["Yes", "No"],
      onClose: (result) => {
        if (result) {
          deleteMode(mode._id)
            .unwrap()
            .then(() => {
              toast.success("Mode deleted successfully!");
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
        <div className="flex justify-start items-center flex-col gap-4 w-full p-4">
          {/* page header */}
          <div className="flex justify-between w-full items-center border-b-2 py-4">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl font-bold">Modes</h1>
            </div>
          </div>
          {/* add or edit mode */}
          <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap flex-col">
            <div className="flex justify-center items-center gap-4 w-full max-w-sm">
              <input
                type="text"
                className="block outline-none w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={inputMode}
                onChange={(e) => setInputMode(e.target.value)}
              />
            </div>
            <div className="flex justify-center items-center gap-4 w-full max-w-sm">
              <button
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32 ${
                  createModeLoading || updateModeLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleAddMode}
                disabled={createModeLoading || updateModeLoading}
              >
                {!isEditing ? "Add" : "Update"}
              </button>
              {isEditing && (
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                  onClick={() => {
                    setIsEditing(false);
                    setEditMode(null);
                    setInputMode("");
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
                  No modes found!
                </h1>
              </div>
            </div>
          )}
          {!isLoading && !isError && categories.length > 0 && (
            <>
              {/* categories */}
              <div className="flex justify-center flex-col w-full items-center gap-2 flex-wrap">
                {sortedModes?.map((mode, index) => (
                  <div
                    key={mode._id}
                    className="flex justify-between w-full max-w-3xl items-center py-2 gap-4"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <div className="flex justify-center items-center gap-2">
                        <span>{index + 1}.</span>
                        <h1 className="text-sm font-bold">{mode?.Name}</h1>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                      <button
                        className="btn btn-primary font-bold text-green-400
                      hover:underline"
                        onClick={() => handleEditMode(mode)}
                        disabled={updateModeLoading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-primary font-bold text-red-400 hover:underline"
                        onClick={() => handleDeleteMode(mode)}
                        disabled={deleteModeLoading}
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
