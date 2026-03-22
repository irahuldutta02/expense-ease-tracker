import { useContext } from "react";
import { ConfirmationModelContext } from "../context/ContextProvider";
import {
  useCreatePartyMutation,
  useDeletePartyMutation,
  useGetPartiesQuery,
  useUpdatePartyMutation,
} from "../redux/partyApiSlice";
import { SimpleManagementPage } from "../components/SimpleManagementPage";

export const Parties = () => {
  const { data, isLoading, isError, refetch } = useGetPartiesQuery();
  const { openConfirmationModel } = useContext(ConfirmationModelContext);

  return (
    <SimpleManagementPage
      title="Parties"
      data={data?.data}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      createMutation={useCreatePartyMutation}
      updateMutation={useUpdatePartyMutation}
      deleteMutation={useDeletePartyMutation}
      placeholder="Party name (e.g. Amazon, Landlord...)"
      openConfirmationModel={openConfirmationModel}
    />
  );
};
