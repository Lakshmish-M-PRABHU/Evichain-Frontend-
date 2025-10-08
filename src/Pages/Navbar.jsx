import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("userRole");

  const allNavLinks = [
    { name: "Upload", path: "/upload" },
    { name: "Verify", path: "/verify" },
    { name: "View", path: "/view" },
    { name: "Downloads", path: "/downloads" },
    { name: "Transfer", path: "/transfer" },
  ];

  // 🔹 Filter links based on role
  const filteredNavLinks = allNavLinks.filter((link) => {
    if (role === "admin") {
      return true; // admin sees all
    }
    if (role === "analyst") {
      return link.name === "Downloads";
    }
    if (role === "investigator") {
      // Investigator can access everything except "View"
      return link.name !== "View";
    }
    return false; // no access by default
  });

  // 🔸 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // ⏱ Auto logout after 200 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 200000);
    return () => clearTimeout(timer);
  }, []);

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
        {filteredNavLinks.map((link) => (
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
