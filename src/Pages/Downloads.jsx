import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const Downloads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all evidence
  useEffect(() => {
    const fetchEvidenceList = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/events/all");
        const data = await res.json();
        setFiles(data || []);
      } catch (err) {
        console.error("Failed to fetch evidence list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidenceList();
  }, []);

  // Download file
  const handleDownload = async (fileHash) => {
    try {
      setMessage(`Downloading ${fileHash}...`);
      const res = await fetch(`http://127.0.0.1:5000/download/${fileHash}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Download failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileHash}.bin`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage(`✅ ${fileHash} downloaded successfully`);
    } catch (err) {
      setMessage(`❌ Error downloading file: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-20 p-8">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          📥 Download Evidence Files
        </h1>
        <p className="text-gray-600 mt-2">
          View uploaded evidence and download verified files securely from the blockchain locker.
        </p>

        {loading ? (
          <p className="text-gray-500 mt-6">Loading evidence records...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-500 mt-6">No records found.</p>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border">File Hash</th>
                  <th className="px-4 py-2 border">Uploader</th>
                  <th className="px-4 py-2 border">Case ID</th>
                  <th className="px-4 py-2 border">Timestamp</th>
                  <th className="px-4 py-2 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={idx} className="text-sm hover:bg-gray-50">
                    <td className="px-4 py-2 border text-blue-700 font-mono">{file.file_hash}</td>
                    <td className="px-4 py-2 border">{file.uploader_wallet}</td>
                    <td className="px-4 py-2 border">{file.case_id}</td>
                    <td className="px-4 py-2 border">
                      {file.timestamp ? new Date(file.timestamp).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDownload(file.file_hash)}
                        className="px-4 py-2 bg-blue-600 hover:bg-orange-300 hover:text-black rounded-lg border border-black text-white"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-gray-700">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Downloads;

