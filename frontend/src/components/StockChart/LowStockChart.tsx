import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type Props = {
  lowCount: number;
  okCount: number;
};

const COLORS = ["#f97316", "#22c55e"];

export default function LowStockChart({ lowCount, okCount }: Props) {
  const data = [
    { name: "Low stock (<5)", value: lowCount },
    { name: "Healthy", value: okCount },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Stock health
          </p>
          <h3 className="text-lg font-semibold text-slate-900">Low vs healthy</h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Pie view
        </span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

