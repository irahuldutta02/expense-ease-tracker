import { Plus, Minus, Equal } from "lucide-react";
import { roundToTwoDecimalPlaces } from "../../utils/roundToTwoDecimalPlaces";
import { motion } from "framer-motion";

export const ExpenseSummary = ({ totalCashIn, totalCashOut }) => {
  const netBalance = totalCashIn - totalCashOut;

  const stats = [
    {
      label: "Total Income",
      value: totalCashIn,
      icon: Plus,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Expenses",
      value: totalCashOut,
      icon: Minus,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Net Balance",
      value: netBalance,
      icon: Equal,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-card border shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold mt-1">
                ₹ {roundToTwoDecimalPlaces(stat.value)}
              </h3>
            </div>
          </div>
          <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.color.replace('text', 'bg')}/20`} />
        </motion.div>
      ))}
    </div>
  );
};
