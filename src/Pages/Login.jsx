import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { KeyRound } from "lucide-react"
import { Toaster, toast } from "sonner"

const Login = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState("")
  const [name, setName] = useState("")
  const [key, setKey] = useState("")

  const users = [
    { role: "investigator", name: "Priyanka", key: "1234" },
    { role: "analyst", name: "Anita", key: "5678" },
    { role: "admin", name: "Admin", key: "9999" },
  ]

  const handleLogin = () => {
    const validUser = users.find(
      (u) =>
        u.role === role &&
        u.name.toLowerCase() === name.toLowerCase() &&
        u.key === key
    )

    if (validUser) {
      localStorage.setItem("userRole", validUser.role);

      toast.success(`Welcome ${validUser.name}! Redirecting...`)
      if(role === "analyst"){
        navigate('/downloads');
        return;
      }
      setTimeout(() => navigate("/upload"), 1000)
    } else {
      toast.error("Invalid credentials! Please try again.")
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background:"offwhite",
      }}
    >
      <Toaster position="top-center" />

      <Card
  className="w-[380px] h-[450px] p-5 flex flex-col justify-start rounded-[2%] shadow-[0_0_20px_3px_rgba(59,130,246,0.6)] border bg-white-50 text-black"

>
       <CardHeader className="text-center space-y-2">
  {/* Title */}
  <CardTitle className="text-3xl font-bold tracking-wide text-[#007BFF] font-sans">
    EviChain Login
  </CardTitle>

  <div className="flex justify-center">
  <img
    src="/logo.png" // 👉 replace with your logo path or URL
    alt="EviChain Logo"
    className="w-16 h-16 rounded-full border-4 border-black-400 shadow-lg shadow-black-300/70"
  />
</div>

</CardHeader>




        <CardContent className="space-y-4">
          {/* Role Selector */}
          <div className="flex flex-col items-center">
    <Label htmlFor="role" className="text-black text-sm font-medium mb-1">
      
    </Label>
    <Select onValueChange={setRole}>
      <SelectTrigger
        id="role"
        className="w-60 bg-white text-black border border-gray-500 shadow-sm"
      >
        <SelectValue placeholder="Choose your role" />
      </SelectTrigger>
      <SelectContent className="bg-white text-black border border-gray-500">
        <SelectItem value="investigator">Crime Investigator</SelectItem>
        <SelectItem value="analyst">Analyst</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  </div>


          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
className="bg-white-900 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            />
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <Label htmlFor="key" className="text-black">
              Access Key
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-black" />
              <Input
                id="key"
                type="password"
                placeholder="Enter your key"
                className="pl-9 bg-white text-white placeholder-gray-400 border border-gray-500"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full h-10 font-semibold border-1"
            style={{
              backgroundColor: "#7052dfff", // 🎨 black border
              color: "white", // 🎨 text color
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
