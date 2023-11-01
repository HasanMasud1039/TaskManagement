import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className=' bg-base-100  fixed w-full'>
            <div className="navbar bg-red-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-xl ">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/addTask'>Add task</Link></li>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/registration'>Registration</Link></li>
                        </ul>
                    </div>
                    <p className="btn btn-ghost font-bold text-xl uppercase">Task Management</p>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-xl font-black ">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/addTask'>Add task</Link></li>
                        <li><Link to='/login'>Login</Link></li>
                        <li><Link to='/registration'>Registration</Link></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <a className="btn">Button</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;