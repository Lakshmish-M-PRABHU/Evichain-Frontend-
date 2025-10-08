import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get role from localStorage (set it after login)
  const role = localStorage.getItem("role"); // "admin", "investigator", "analyst"

  // 🔹 Navigation links with allowed roles
  const navLinks = [
    { name: "Upload", path: "/upload"},
    { name: "Verify", path: "/verify" },
    { name: "View", path: "/view" },
    { name: "Downloads", path: "/downloads" },
    { name: "Transfer", path: "/transfer" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("role"); // clear role on logout
    navigate("/");
  };

  // 🔹 Auto logout after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 200000); // 15000ms = 15 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, []); // run once on mount

  return (
    <nav className="w-full bg-[#59AEF4] text-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Brand */}
      <div
        className="text-2xl font-serif cursor-pointer text-white tracking-wide"
        onClick={() => navigate("/upload")}
      >
        EviChain
      </div>

      {/* Nav Links */}
      <div className="flex space-x-3">
        {navLinks.map((link) => (
          <Button
            key={link.name}
            onClick={() => navigate(link.path)}
            className={`border rounded-md font-medium transition-all duration-300 ${
              location.pathname === link.path
                ? "bg-[#001F54] text-white border-[#001F54]"
                : "bg-white text-black border-[#001F54] hover:bg-orange-300 hover:text-black hover:border-black"
            }`}
          >
            {link.name}
          </Button>
        ))}
      </div>

      {/* Logout */}
      <div>
        <Button
          onClick={handleLogout}
          className="bg-red-600 text-white hover:bg-red-700 font-medium px-4 rounded-md"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
