import React, { useState } from 'react';
import { Controller, useForm, } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


const Registration = () => {

    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [user, setUser] = useState();

    const onSubmit = (userData) => {
        if (userData) {

            // send data to DB
            fetch(`http://localhost:5000/users`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.insertedId) {
                        toast.success("Registration Successful.")
                        reset();
                        const redirectTimer = setTimeout(() => {
                            // window.location.href = '/'; 
                            navigate('/login');
                            setUser(userData)
                        }, 2000);
                    }
                    else {
                        toast.error("User already exists in Database!")
                    }
                })
        }

    };

    return (
        <div className='h-screen'>
            <h1 className='text-3xl font-bold text-center py-8 uppercase'>register Now</h1>

            <form className='max-w-[600px] mx-auto p-20 border border-gray-300 rounded-lg shadow-md bg-gray-200' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name" className="block font-bold mb-2">Name</label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => (
                            <input {...field} type="text" id="name" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                        )}
                    />
                    {errors.name && <p className="text-red-500 mt-[-10px] mb-2">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block font-bold mb-2">Email</label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field }) => <input {...field} type="email" id="email" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />}
                    />
                    {errors.email && <p className="text-red-500 mt-[-10px] mb-2">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block font-bold mb-2">Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                        }}
                        render={({ field }) => <input {...field} type="password" id="password" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />}
                    />
                    {errors.password && <p className="text-red-500 mt-[-10px] mb-2">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="photoURL" className="block font-bold mb-2">Photo URL (Optional)</label>
                    <Controller
                        name="photoURL"
                        control={control}
                        render={({ field }) => <input {...field} type="text" id="photoURL" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />}
                    />
                    {errors?.photoURL && <p className="text-red-500 mt-[-10px] mb-2">{errors?.photoURL.message}</p>}
                </div>

                <h3 className="text-lg">Already have an account? <span className="text-primary font-semibold"><Link to="/login">Login</Link></span></h3>

                <div className="text-center mt-4 flex justify-center">
                    <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded-md cursor-pointer">Register</button>
                </div>
            </form>

            <Toaster
                position="top-right"
                reverseOrder
                containerStyle={{ padding: '10px', fontSize: '18px' }}
                containerClassName="custom-toast-container"
                toastClassName="custom-toast"
                toastOptions={{ duration: 2000, style: { background: '' } }}
            />
        </div>
    );
};

export default Registration;