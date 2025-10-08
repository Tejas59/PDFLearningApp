"use client";
import { useFetchQuizStats } from "@/api/quiz.api";
import { userAuthStore } from "@/store/userAuthStore";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Stat {
  mcq: { correct: number; total: number };
  saq: { correct: number; total: number };
  laq: { correct: number; total: number };
}

interface Props {
  stats: Stat;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // MCQ, SAQ, LAQ colors

const QuizPieChart = () => {
  const { user } = userAuthStore();
  const {
    data: stats,
    isLoading,
    error,
  } = useFetchQuizStats(user?.id as string);
  if (isLoading) return <div>Loading chart...</div>;
  if (error || !stats) return <div>No data available</div>;
  const data = [
    {
      name: "MCQ",
      value: stats.mcq.total ? (stats.mcq.correct / stats.mcq.total) * 100 : 0,
      correct: stats.mcq.correct,
      total: stats.mcq.total,
    },
    {
      name: "SAQ",
      value: stats.saq.total ? (stats.saq.correct / stats.saq.total) * 100 : 0,
      correct: stats.saq.correct,
      total: stats.saq.total,
    },
    {
      name: "LAQ",
      value: stats.laq.total ? (stats.laq.correct / stats.laq.total) * 100 : 0,
      correct: stats.laq.correct,
      total: stats.laq.total,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={(entry: any) =>
              `${entry.correct}/${entry.total} (${entry.value.toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(_, name, props) =>
              `${props.payload.correct}/${
                props.payload.total
              } (${props.payload.value.toFixed(2)}%)`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuizPieChart;
