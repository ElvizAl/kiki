"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1800000,
  },
  {
    name: "Feb",
    total: 2200000,
  },
  {
    name: "Mar",
    total: 2700000,
  },
  {
    name: "Apr",
    total: 2400000,
  },
  {
    name: "Mei",
    total: 2900000,
  },
  {
    name: "Jun",
    total: 3100000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}jt`}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Tooltip
          formatter={(value: number) => [`Rp ${value.toLocaleString("id-ID")}`, "Total"]}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
          cursor={{ fill: "hsl(var(--muted))" }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}