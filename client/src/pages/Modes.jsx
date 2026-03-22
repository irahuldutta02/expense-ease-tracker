import { useContext } from "react";
import { ConfirmationModelContext } from "../context/ContextProvider";
import {
  useCreateModeMutation,
  useDeleteModeMutation,
  useGetModesQuery,
  useUpdateModeMutation,
} from "../redux/modeApiSlice";
import { SimpleManagementPage } from "../components/SimpleManagementPage";

export const Modes = () => {
  const { data, isLoading, isError, refetch } = useGetModesQuery();
  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  return (
    <SimpleManagementPage
      title="Payment Modes"
      data={data?.data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      createMutation={useCreateModeMutation}
      updateMutation={useUpdateModeMutation}
      deleteMutation={useDeleteModeMutation}
      placeholder="Payment mode (e.g. Cash, GPay, Bank...)"
      openConfirmationModel={openConfirmationModel}
    />
  );
};
