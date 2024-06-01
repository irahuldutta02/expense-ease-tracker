import { useContext, useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../redux/categoryApiSlice";
import { toast } from "react-toastify";
import { ConfirmationModelContext } from "../context/ContextProvider";

export const Categories = () => {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();
  const categories = data?.data || [];

  const [createCategory, { isLoading: createCategoryLoading }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: deleteCategoryLoading }] =
    useDeleteCategoryMutation();

  const [inputCategory, setInputCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  const sortedCategories = [...categories]?.sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!inputCategory) {
      toast.error("Category name is required!");
      return;
    }

    if (inputCategory.trim().length === 0) {
      toast.error("Category name is required!");
      return;
    }

    if (isEditing) {
      openConfirmationModel({
        question: "Are you sure you want to update this category?",
        answer: ["Yes", "No"],
        onClose: (result) => {
          if (result) {
            updateCategory({
              id: editCategory._id,
              data: { name: inputCategory },
            })
              .unwrap()
              .then(() => {
                toast.success("Category updated successfully!");
                setInputCategory("");
                setIsEditing(false);
                setEditCategory(null);
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
      createCategory({ name: inputCategory })
        .unwrap()
        .then(() => {
          toast.success("Category added successfully!");
          setInputCategory("");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.data?.message || "Something went wrong!");
        });
    }
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditCategory(category);
    setInputCategory(category?.Name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteCategory = (category) => {
    setInputCategory("");
    setEditCategory(null);
    setIsEditing(false);

    openConfirmationModel({
      question: "Are you sure you want to delete this category?",
      answer: ["Yes", "No"],
      onClose: (result) => {
        if (result) {
          deleteCategory(category._id)
            .unwrap()
            .then(() => {
              toast.success("Category deleted successfully!");
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
              <h1 className="text-2xl font-bold">Categories</h1>
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
            <div className="flex justify-center items-center w-full h-96">
              <div className="flex justify-center items-center flex-col gap-4">
                <h1 className="text-2xl font-bold text-green-500">
                  No categories found!
                </h1>
              </div>
            </div>
          )}
          {!isLoading && !isError && categories.length > 0 && (
            <>
              {/* add or edit category */}
              <div className="flex justify-center w-full items-center py-4 gap-4 flex-wrap flex-col">
                <div className="flex justify-center items-center gap-4 w-full max-w-sm">
                  <input
                    type="text"
                    className="block outline-none w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={inputCategory}
                    onChange={(e) => setInputCategory(e.target.value)}
                  />
                </div>
                <div className="flex justify-center items-center gap-4 w-full max-w-sm">
                  <button
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32 ${
                      createCategoryLoading || updateCategoryLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAddCategory}
                    disabled={createCategoryLoading || updateCategoryLoading}
                  >
                    {!isEditing ? "Add" : "Update"}
                  </button>
                  {isEditing && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center gap-2 w-32"
                      onClick={() => {
                        setIsEditing(false);
                        setEditCategory(null);
                        setInputCategory("");
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              {/* categories */}
              <div className="flex justify-center flex-col w-full items-center gap-2 flex-wrap">
                {sortedCategories?.map((category, index) => (
                  <div
                    key={category._id}
                    className="flex justify-between w-full max-w-3xl items-center py-2 gap-4"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <div className="flex justify-center items-center gap-2">
                        <span>{index + 1}.</span>
                        <h1 className="text-sm font-bold">{category?.Name}</h1>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                      <button
                        className="btn btn-primary font-bold text-green-400
                      hover:underline"
                        onClick={() => handleEditCategory(category)}
                        disabled={updateCategoryLoading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-primary font-bold text-red-400 hover:underline"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={deleteCategoryLoading}
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
