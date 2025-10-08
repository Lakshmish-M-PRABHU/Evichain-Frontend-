import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Upload from "./Pages/Upload"
import Transfer from "./Pages/Transfer"
import Verify from "./Pages/Verify"
import View from "./Pages/View"
import Downloads from "./Pages/Downloads"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/downloads" element={<Downloads/>} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  )
}

export default App
