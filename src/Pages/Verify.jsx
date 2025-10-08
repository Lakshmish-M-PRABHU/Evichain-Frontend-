import React, { useEffect, useState } from "react";
import Navbar from "../Pages/Navbar";

const Verify = () => {
  const [file, setFile] = useState(null);
  const [wallet, setWallet] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, []);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // Handle verification
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please select a file to verify.");
      return;
    }

    if (wallet && !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      setMessage("⚠️ Invalid wallet address format.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    if (wallet) formData.append("wallet", wallet);

    try {
      const res = await fetch("http://127.0.0.1:5000/verify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `🗂 File Hash: ${data.fileHash}\n✅ Result: ${data.result}${data.txHash ? `\n🔗 Tx Hash: ${data.txHash}` : ""
          }`
        );
      } else {
        setMessage(`⚠️ ${data.error || "Verification failed"}`);
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
          📝 Verify Evidence
        </h1>
        <p className="text-gray-600 mt-2">
          Upload evidence to check its authenticity.
        </p>

        {role === "admin" || role === "investigator" ?
          (<form
            onSubmit={handleVerify}
            className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <label className="block text-gray-700 font-semibold mb-2">
              Select Evidence File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mb-4"
            />

            <label className="block text-gray-700 font-semibold mb-2">
              Wallet Address (optional)
            </label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-lg transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {loading ? "Verifying..." : "Verify Evidence"}
            </button>

            {message && (
              <pre
                className={`mt-4 font-medium whitespace-pre-wrap ${message.includes("✅") ? "text-green-600" : "text-red-600"
                  }`}
              >
                {message}
              </pre>
            )}
          </form>) : (
            <div className="mt-10 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-center shadow-md">
              🚫 <span className="font-semibold">Access Denied</span>
              <p className="mt-2 text-sm text-gray-700">
                You are not authorized to access this page.
                <br />
                Only <b>Admin</b> users can verify evidence.
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Verify;

