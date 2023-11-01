import React from 'react';
import { Controller, useForm, } from 'react-hook-form';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';


const Login = () => {

    const { handleSubmit, control, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        if (data) {
            toast.success("Login Successful.")
            reset();
            const redirectTimer = setTimeout(() => {
                window.location.href = '/'; // Replace with your destination URL
              }, 2000);
        }
    };

    return (
        <div className='h-screen'>
            <h1 className='text-3xl font-bold text-center py-8 uppercase'>login Now</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
    
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


                <div className='text-center mt-4 flex justify-center'>
                    <button type="submit">Login</button>
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

export default Login;