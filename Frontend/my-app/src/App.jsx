import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup/Signup"
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Addreading from "./components/Addreading/Addreading";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Myreadings from "./components/Myreadings/Myreadings";
import Report from "./components/Reports/Report";

function App(){
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<Signup/>} />
    <Route path="/login" element={<Login/>}/>
    <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    <Route path="/add-reading" element={<ProtectedRoute><Addreading/></ProtectedRoute>}/>
    <Route path="/readings" element={<ProtectedRoute><Myreadings/></ProtectedRoute>}/>
    <Route path="/reports" element={<ProtectedRoute><Report/></ProtectedRoute>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App