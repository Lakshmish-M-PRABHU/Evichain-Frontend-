import React, { useEffect, useState } from "react";
import Navbar from "../Pages/Navbar";

const Transfer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [newCustodian, setNewCustodian] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  // Load role (you can adjust this depending on how you're storing user info)
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole"); // e.g., "Admin" or "Investigator"
    setRole(storedRole);
  }, []);

  // 🔹 Fetch evidence list from backend
  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/events/all");
        const data = await res.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch evidence:", error);
      }
    };
    fetchEvidence();
  }, []);

  // 🔹 Handle transfer
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedFile || !newCustodian) {
      setMessage("⚠️ Please select a file and enter the new custodian wallet.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileHash: selectedFile,
          newCustodian: newCustodian,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Evidence transferred to ${data.newCustodian}`);
      } else {
        setMessage(`⚠️ ${data.error || "Transfer failed"}`);
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
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          🔄 Transfer Evidence
        </h1>
        <p className="text-gray-600 mt-2">
          Transfer evidence securely to authorized personnel.
        </p>

        {role === "admin" || role === "investigator" ? (<form
          onSubmit={handleTransfer}
          className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
        >
          <label className="block text-gray-700 font-semibold mb-2">
            Select Evidence File
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <option value="">-- Choose File --</option>
            {files.map((file, idx) => (
              <option key={idx} value={file.file_hash}>
                {file.original_filename || file.file_hash} (Case:{" "}
                {file.case_id || "N/A"})
              </option>
            ))}
          </select>

          <label className="block text-gray-700 font-semibold mb-2">
            New Custodian Wallet Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCustodian}
            onChange={(e) => setNewCustodian(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? "Transferring..." : "Transfer Evidence"}
          </button>

          {message && (
            <p
              className={`mt-4 ${message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
                } font-medium`}
            >
              {message}
            </p>
          )}
        </form>) : (<div className="mt-10 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-center shadow-md">
          🚫 <span className="font-semibold">Access Denied</span>
          <p className="mt-2 text-sm text-gray-700">
            You are not authorized to access this page.
            <br />
            Only <b>Admin</b> or <b>Investigator</b> users can transfer evidence.
          </p>
        </div>)}
      </div>
    </div>
  );
};

export default Transfer;
