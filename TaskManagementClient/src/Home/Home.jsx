import React, { useEffect } from 'react';
import ShowTask from '../ShowTask/ShowTask';

const Home = () => {
    const userEmail = localStorage.getItem('userEmail');
    // useEffect(() => {
    //     if (userEmail) {
    //         axiosSecure.get(`http://localhost:5000/users/${userEmail}`)
    //             .then((response) => {
    //                 setUser(response.data);
    //             })
    //             .catch((error) => {
    //                 console.error('Error retrieving data:', error);
    //             });
    //     }
    //     else {
    //         navigate('/');
    //     }
    // }, []);

    return (
        <div>
            <div className="md:mb-6 space-y-8">
                {userEmail? 
                    <ShowTask/> : <div>
                    <p className='text-red-500 font-bold text-2xl text-center pt-12'>Welcome!</p>
                    <h1 className='text-red-500 font-bold text-3xl text-center pt-12'>Task Management System</h1>
                    </div>
                }
            </div>
        </div>
    );
};

export default Home;