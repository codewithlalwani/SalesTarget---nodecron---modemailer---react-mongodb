import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EmailDashboard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/email_logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const totalSent = logs.length;
  const successCount = logs.filter((log) => log.status === "success").length;
  const failedCount = logs.filter((log) => log.status === "failed").length;
  const timestamps = logs.map((log) => new Date(log.timestamp).toLocaleTimeString());

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] px-8 py-6 text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700 tracking-tight">
        ✉️ Email Analytics Dashboard
      </h1>

      {/* Info Cards */}
      <div className="flex justify-center gap-6 mb-8">
        {[
          { label: "Total", value: totalSent, color: "from-indigo-600 to-indigo-400" },
          { label: "Delivered", value: successCount, color: "from-green-600 to-green-400" },
          { label: "Failed", value: failedCount, color: "from-rose-600 to-rose-400" },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`w-36 h-28 rounded-xl shadow-md p-4 bg-gradient-to-br ${card.color} text-white flex flex-col justify-center items-center`}
          >
            <div className="text-sm mb-1 font-medium">{card.label}</div>
            <div className="text-3xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Side-by-Side */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 w-full lg:w-1/2 h-[360px] flex flex-col">
          <h3 className="text-center text-lg font-semibold text-indigo-800 mb-2">📦 Delivery Breakdown</h3>
          <div className="flex-grow">
            <Pie
              data={{
                labels: ["Success", "Failed"],
                datasets: [
                  {
                    data: [successCount, failedCount],
                    backgroundColor: ["#4f46e5", "#f43f5e"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#4b5563", usePointStyle: true, boxWidth: 10 },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 w-full lg:w-1/2 h-[360px] flex flex-col">
          <h3 className="text-center text-lg font-semibold text-indigo-800 mb-2">📈 Sent Over Time</h3>
          <div className="flex-grow">
            <Bar
              data={{
                labels: timestamps,
                datasets: [
                  {
                    label: "Emails Sent",
                    data: Array(timestamps.length).fill(1),
                    backgroundColor: "#6366f1",
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: {
                      color: "#6b7280",
                      maxRotation: 60,
                      minRotation: 45,
                      autoSkip: true,
                      maxTicksLimit: 8,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: "#6b7280" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;
