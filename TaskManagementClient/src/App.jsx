import { Outlet } from "react-router-dom"
import Navbar from "./Navbar/Navbar"


function App() {


  return (
    <div className="gap-8">
      <Navbar></Navbar>
      <div className="pt-20 bg-zinc-200">
      <Outlet></Outlet>
      </div>
    </div>
  )
}

export default App
