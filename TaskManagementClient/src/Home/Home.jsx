import React from 'react';
import ShowTask from '../ShowTask/ShowTask';

const Home = () => {
    const userEmail = localStorage.getItem('userEmail');
    const getIsLoggedInUser = () => {
        return userEmail ? true : false;
    }

    return (
        <div>
            <div className="md:mb-6 space-y-8">
                <div className={getIsLoggedInUser() ? 'hidden' : ' p-16'}>
                    <p className='text-red-500 font-bold text-2xl text-center pt-12'>Welcome!</p>
                    <h1 className='text-red-500 font-bold text-3xl text-center pt-12'>Task Management System</h1>
                </div>
                <div className={getIsLoggedInUser() ? '' : 'hidden'}>
                    <ShowTask />
                </div>
            </div>
        </div>
    );
};

export default Home;