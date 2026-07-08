"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { monthlyData, procedureData } from "@/lib/mock-data";

const colors = ["#315a8f", "#526a52", "#b05d3b", "#8b7a5b", "#5c6670"];

export function ActivityAreaChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData}>
          <defs>
            <linearGradient id="surgeries" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#315a8f" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#315a8f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e7e2d8" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#6b6f76" fontSize={12} />
          <YAxis stroke="#6b6f76" fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey="surgeries" stroke="#315a8f" strokeWidth={3} fill="url(#surgeries)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BillingBarChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid stroke="#e7e2d8" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#6b6f76" fontSize={12} />
          <YAxis stroke="#6b6f76" fontSize={12} />
          <Tooltip />
          <Bar dataKey="billing" fill="#526a52" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProcedurePieChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={procedureData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={4}>
            {procedureData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LearningBarChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid stroke="#e7e2d8" strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#6b6f76" fontSize={12} />
          <YAxis stroke="#6b6f76" fontSize={12} />
          <Tooltip />
          <Bar dataKey="learning" fill="#b05d3b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
