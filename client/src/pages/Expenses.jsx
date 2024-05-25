import { useGetExpensesQuery } from "../redux/expenseApiSlice";

export const Expenses = () => {
  const { data, isLoading, isError, refetch } = useGetExpensesQuery();

  console.log({ data, isLoading, isError, refetch });

  return (
    <>
      <div className="flex justify-start items-center flex-col gap-4 w-full ">
        <div className="flex justify-start items-center flex-col gap-4 w-full p-4">
          <h1 className="text-3xl font-bold">Expenses Page</h1>
          <p className="text-justify">This is Expenses page.</p>
        </div>
      </div>
    </>
  );
};
