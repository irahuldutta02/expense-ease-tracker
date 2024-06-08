export const processExpensesData = (expenses, view) => {
  const dataMap = {};

  expenses.forEach((expense) => {
    let key;

    switch (view) {
      case "category":
        key = expense.Category ? expense.Category.Name : "Uncategorized";
        break;
      case "party":
        key = expense.Party ? expense.Party.Name : "No Party";
        break;
      case "mode":
        key = expense.Mode ? expense.Mode.Name : "No Mode";
        break;
      default:
        key = "Uncategorized";
    }

    if (!dataMap[key]) {
      dataMap[key] = { cashIn: 0, cashOut: 0 };
    }

    if (expense.Cash_In) {
      dataMap[key].cashIn += expense.Cash_In;
    }

    if (expense.Cash_Out) {
      dataMap[key].cashOut += expense.Cash_Out;
    }
  });

  const labels = Object.keys(dataMap);
  const cashInData = labels.map((label) => dataMap[label].cashIn);
  const cashOutData = labels.map((label) => dataMap[label].cashOut);

  return { labels, cashInData, cashOutData };
};
