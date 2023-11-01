import React from 'react';
import { Controller, useForm, } from 'react-hook-form';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Registration = () => {

    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        console.log(data);
        if (data) {
            toast.success("Registration Successful.")
            reset();
            const redirectTimer = setTimeout(() => {
                window.location.href = '/'; // Replace with your destination URL
            }, 2000);
        }
    };

    return (
        <div className='h-screen'>
            <h1 className='text-3xl font-bold text-center py-8 uppercase'>register Now</h1>
            <form className='mt-0' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name">Name</label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => (
                            <input {...field} type="text" id="name" />
                        )}

                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
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
                        render={({ field }) => <input {...field} type="email" id="email" />}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                        }}
                        render={({ field }) => <input {...field} type="password" id="password" />}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="photoURL">Photo URL</label>
                    <Controller
                        name="photoURL"
                        control={control}
                        rules={{ required: 'Photo URL is required' }}
                        render={({ field }) => <input {...field} type="text" id="photoURL" />}
                    />
                    {errors.photoURL && <p>{errors.photoURL.message}</p>}
                </div>

                <div className='text-center flex justify-center'>
                    <button type="submit">Register</button>
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