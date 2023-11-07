import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar/Navbar"


function App() {

  const location = useLocation();
  const noNavbar = location.pathname.includes('login') || location.pathname.includes('register')

  return (
    <div className="gap-8">
      {noNavbar || <Navbar></Navbar>}
      <div className="h-screen pt-24 bg-zinc-200">
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default App
