"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { TransactionRow } from "@/lib/api";

export type TxRow = TransactionRow;

const TYPE_LABELS: Record<number, string> = {
  2: "Campsite",
  3: "Tour",
  4: "Parking",
};

const PIE_COLORS = ["#4ade80", "#86efac", "#bbf7d0", "#a3e635"];

// Group active transactions by month → [{ month, revenue }]
// Uses START_TIME as the date field (TRANSACTION_DATE may not always be present).
function toMonthlyRevenue(rows: TxRow[]) {
  const map: Record<string, number> = {};
  rows
    .filter((r) => r.STATUS === 1 && (r.START_TIME || r.TRANSACTION_DATE))
    .forEach((r) => {
      const raw = r.START_TIME || r.TRANSACTION_DATE || "";
      const d = new Date(raw);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) map[key] = 0;
      map[key] += Number(r.TOTAL_PRICE) || 0;
    });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, revenue]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      return { month: label, revenue: parseFloat(revenue.toFixed(2)) };
    });
}

// Group active transactions by type → [{ name, value }]
function toTypeBreakdown(rows: TxRow[]) {
  const map: Record<string, number> = {};
  rows
    .filter((r) => r.STATUS === 1 && r.TRANSACTION_TYPE != null)
    .forEach((r) => {
      const label = TYPE_LABELS[r.TRANSACTION_TYPE!] ?? `Type ${r.TRANSACTION_TYPE}`;
      map[label] = (map[label] ?? 0) + 1;
    });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function AdminCharts({ rows }: { rows: TxRow[] }) {
  const monthly = toMonthlyRevenue(rows);
  const breakdown = toTypeBreakdown(rows);

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-10">
      {/* Revenue Bar Chart */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-foreground/45 mb-4">
          Revenue by month (active)
        </p>
        {monthly.length === 0 ? (
          <p className="text-sm text-foreground/40 py-8 text-center">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--foreground))", opacity: 0.5, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--foreground))", opacity: 0.5, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
                formatter={(v) =>
                  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(v))
                }
              />
              <Bar
                dataKey="revenue"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Booking Type Pie */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-foreground/45 mb-4">
          Bookings by type (active)
        </p>
        {breakdown.length === 0 ? (
          <p className="text-sm text-foreground/40 py-8 text-center">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
              >
                {breakdown.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span style={{ color: "hsl(var(--foreground))", opacity: 0.7, fontSize: 12 }}>
                    {v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
