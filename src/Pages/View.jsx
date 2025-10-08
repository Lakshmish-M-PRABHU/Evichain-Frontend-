import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const TraceActivity = () => {
  const [fileHash, setFileHash] = useState("");
  const [logs, setLogs] = useState([]);
  const [chainEvents, setChainEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  // Load role (you can adjust this depending on how you're storing user info)
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole"); // e.g., "Admin" or "Investigator"
    setRole(storedRole);
  }, []);

  const handleFetchLogs = async (e) => {
    e.preventDefault();
    if (!fileHash) {
      setMessage("⚠️ Please enter a file hash.");
      return;
    }

    setLoading(true);
    setMessage("");
    setLogs([]);
    setChainEvents([]);

    try {
      const res = await fetch(`http://127.0.0.1:5000/events/${fileHash}`);
      const data = await res.json();

      if (res.ok) {
        setLogs(data.backendLogs || []);
        setChainEvents(data.chainEvents || []);
        if ((data.backendLogs || []).length === 0 && (data.chainEvents || []).length === 0) {
          setMessage("ℹ️ No activity found for this file hash.");
        }
      } else {
        setMessage(`⚠️ ${data.error || "Failed to fetch logs"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-20 p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">🕵️ Trace Evidence Activity</h1>
        <p className="text-gray-600 mb-6">
          Enter a file hash to view who uploaded or accessed it, along with timestamps.
        </p>

        {role === "admin" ? (<form onSubmit={handleFetchLogs} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter file hash"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fileHash}
            onChange={(e) => setFileHash(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg"
          >
            {loading ? "Fetching..." : "Trace"}
          </button>
        </form>) : (<div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-md mb-6">
          🚫 Access Denied — Only Admins can trace evidence activity.
        </div>)}

        {message && (
          <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-md border border-yellow-300">
            {message}
          </div>
        )}

        {chainEvents.length > 0 && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-2">Blockchain Events:</h2>
            <ul className="list-disc list-inside text-gray-600">
              {chainEvents.map((evt, i) => (
                <li key={i}>{JSON.stringify(evt)}</li>
              ))}
            </ul>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-2">Backend Logs:</h2>
            <ul className="list-disc list-inside text-gray-600">
              {logs.map((log, i) => (
                <li key={i}>
                  <span className="font-semibold">{log.action || "Action Unknown"}</span> —{" "}
                  Actor: <span className="font-medium">{log.actor || "Unknown"}</span> —{" "}
                  Time: {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraceActivity;
