import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { FaUser, FaUsers } from 'react-icons/fa';

const Navbar = () => {
    const [isLoggedInUser, setIsLoggedInUser] = useState()
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [axiosSecure] = useAxiosSecure();
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        if (userEmail) {
            axiosSecure.get(`http://localhost:5000/users/${userEmail}`)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Error retrieving data:', error);
                });
        }
        else {
            navigate('/');
        }
    }, []);


    const getIsLoggedInUser = () => {
        const token = localStorage.getItem('access-token');
        return token ? true : false
    }

    const handleLogout = () => {
        localStorage.removeItem('access-token');
        localStorage.removeItem('userEmail');
        setIsLoggedInUser(false);
        navigate('/');
    }

    return (
        <div className=' bg-zinc-100  fixed w-full'>
            <div className="navbar  w-[80%] mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-xl ">
                            <li><Link to='/'>Home</Link></li>

                            <li><Link to='/register'>Registration</Link></li>
                            {
                                getIsLoggedInUser() ? (<>
                                    <li><Link to='/addTask'>Add task</Link></li>
                                    <li onClick={handleLogout}><Link to='/'>Logout</Link></li>
                                </>
                                )
                                    :
                                    (<li><Link to='/login'>Login</Link></li>)
                            }
                        </ul>
                    </div>
                    <img className='h-20 w-64' src="/taskM.png" alt="" />
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-xl font-black ">
                        <li><Link to='/'>Home</Link></li>

                        <li><Link to='/register'>Registration</Link></li>
                        {
                            getIsLoggedInUser() ? (<>
                                <li><Link to='/addTask'>Add task</Link></li>
                                <li onClick={handleLogout}><Link to='/'>Logout</Link></li>
                            </>
                            )
                                :
                                (<li><Link to='/login'>Login</Link></li>)
                        }
                    </ul>
                </div>
                {
                    getIsLoggedInUser() ? (
                        <div className="navbar-end md:pr-8">
                            <h2 className='px-4 text-lg font-semibold'>{user?.name}</h2>
                            <img className='w-16 h-16 rounded-full' src={user?.photoURL} alt="USER" />
                        </div>)
                        :
                        (<div className="navbar-end">
                            <a className="rounded-full text-[44px] text-center border-0 w-16 h-16 "><Link to='/login'><FaUser></FaUser></Link></a>
                        </div>)
                }

            </div>
        </div>
    );
};

export default Navbar;