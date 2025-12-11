import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

type Props = {
  counts: Record<string, number>;
  type?: "pie" | "bar";
  title?: string;
};

export default function DomainChart({ counts, type = "pie", title }: Props) {
  const labels = Object.keys(counts);
  const data = {
    labels,
    datasets: [
      {
        label: title || "Domains",
        data: labels.map((l) => counts[l]),
        backgroundColor: [
          "#4e79a7",
          "#f28e2b",
          "#e15759",
          "#76b7b2",
          "#59a14f",
          "#edc949",
          "#af7aa1",
        ],
      },
    ],
  };

  if (type === "bar") {
    return <Bar options={{ responsive: true, plugins: { legend: { display: false }, title: { display: !!title, text: title } } }} data={data} />;
  }
  return <Pie options={{ responsive: true, plugins: { title: { display: !!title, text: title } } }} data={data} />;
}