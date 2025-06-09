// Designed and Developed with Luxury and Love by Yash Lalwani 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const EmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/email_logs");
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching email logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-indigo-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        <span className="text-lg font-medium">Loading email logs...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-7xl bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-indigo-100">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6 tracking-tight">
          📧 Email Logs
        </h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full table-auto text-sm text-gray-800">
            <thead className="bg-indigo-100 text-indigo-800 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Recipient</th>
                <th className="px-6 py-4 text-left">Subject</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log._id || index}
                  className="border-t border-gray-200 hover:bg-indigo-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{log.recipient}</td>
                  <td className="px-6 py-4">{log.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        log.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {log.status === "success" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailLogs;
