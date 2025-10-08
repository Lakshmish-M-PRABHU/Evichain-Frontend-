import React, { useState, useEffect } from "react";
import Navbar from "../Pages/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  // Load role (you can adjust this depending on how you're storing user info)
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole"); // e.g., "Admin" or "Investigator"
    setRole(storedRole);
  }, []);

  // Load files from localStorage
  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("evidenceFiles")) || [];
    setFiles(storedFiles);
  }, []);

  // Persist files in localStorage
  useEffect(() => {
    localStorage.setItem("evidenceFiles", JSON.stringify(files));
  }, [files]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file || !title) return alert("Please provide a title and select a file!");

    const wallet = window.ethereum?.selectedAddress || "0xUploaderWallet";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("wallet", wallet);
    formData.append("case_id", title);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload failed:", data);
        return alert(data.error || "Upload failed!");
      }

      const newFile = {
        id: Date.now(),
        title,
        description,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        fileHash: data.fileHash,
        fileCID: data.fileCID,
        metaCID: data.metaCID,
        txHash: data.txHash,
      };

      setFiles([newFile, ...files]);
      setTitle("");
      setDescription("");
      fileInput.value = "";

      alert(`✅ Upload successful!\nCID: ${data.fileCID}\nTxHash: ${data.txHash || "N/A"}`);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen flex flex-col items-center justify-start py-16 px-6"
        style={{
          background: "linear-gradient(135deg, #C0F5F1 0%, #58E2D9 50%, #3FB0A8 100%)",
        }}
      >
        <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-md">🧾 Upload Evidence</h1>
        <p className="text-white/90 mb-10 text-center max-w-md">
          Upload and manage digital evidence securely in your blockchain locker.
        </p>

        {/* ✅ Access Control */}
        {role === "admin" || role === "investigator" ? (
          <Card
            className="w-full max-w-lg backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
            }}
          >
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-gray-900">
                Upload New Evidence
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter evidence title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/70 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-teal-400"
                />

                <Textarea
                  placeholder="Enter description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/70 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-teal-400"
                />

                <input
                  id="fileInput"
                  type="file"
                  className="block w-full text-gray-700 bg-white/70 border border-gray-300 rounded-lg p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400"
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" /> Upload Evidence
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white/20 p-6 rounded-xl text-center shadow-md text-white">
            🚫 You do not have permission to access this page.
            <br />
            <span className="text-sm opacity-80">
              Only Admin and Crime Investigator roles can upload evidence.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
