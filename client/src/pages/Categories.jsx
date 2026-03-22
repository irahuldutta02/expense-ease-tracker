import { useContext } from "react";
import { ConfirmationModelContext } from "../context/ContextProvider";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../redux/categoryApiSlice";
import { SimpleManagementPage } from "../components/SimpleManagementPage";

export const Categories = () => {
  const { data, isLoading, isError, refetch } = useGetCategoriesQuery();
  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  return (
    <SimpleManagementPage
      title="Categories"
      data={data?.data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      createMutation={useCreateCategoryMutation}
      updateMutation={useUpdateCategoryMutation}
      deleteMutation={useDeleteCategoryMutation}
      placeholder="Category name (e.g. Food, Rent...)"
      openConfirmationModel={openConfirmationModel}
    />
  );
};
