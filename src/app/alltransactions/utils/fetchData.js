// utils/fetchData.js
import supabaseClient from "../../../utils/supabaseClient";
const supabase = supabaseClient;

export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from("daily_transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Error fetching transactions:", error);
  } else {
    return data;
  }
};

export const calculateTotals = (data) => {
  return data.reduce(
    (acc, transaction) => ({
      quantity: acc.quantity + transaction.quantity,
      total: acc.total + transaction.total,
      cash: acc.cash + transaction.cash,
      old: acc.old + transaction.old,
      remaining: acc.remaining + transaction.remaining,
    }),
    { quantity: 0, total: 0, cash: 0, old: 0, remaining: 0 }
  );
};
