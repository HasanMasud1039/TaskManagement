import React from 'react';
import ShowTask from '../ShowTask/ShowTask';

const Home = () => {
    return (
        <div>
            <div className="md:pt-12 bg-lime-200">
                <p className='text-red-500 font-bold text-3xl text-center pt-12'>Task Management System</p>
            </div>
            <ShowTask/>
        </div>
    );
};

export default Home;