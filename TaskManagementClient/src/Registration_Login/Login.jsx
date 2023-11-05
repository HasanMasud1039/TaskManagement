import React, { useState } from 'react';
import { Controller, useForm, } from 'react-hook-form';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../Hooks/useAuth';


const Login = () => {

    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const [user, setUser]= useState();
    const [currentUser, setCurrentUser] = useState([]);

    
    const onSubmit = async (userData) => {
        console.log(userData);
        setUser(userData);
 
            try {
                const response = await axios.post('http://localhost:5000/login', {email: userData.email, password: userData.password });
                const token = await response.data.token;
                localStorage.setItem('access-token', token);
                localStorage.setItem('userEmail', userData.email);
                    
                    toast.success("Login Successful")
                // })
                setCurrentUser(userData.email);
                console.log(userData);
     
                
                
                navigate('/showTask');
    
              } catch (error) {
                console.error(error.response.data);
                toast.error(error.response.data)
    
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
                
                <h3 className='text-lg'>New Here? <span className='text-primary font-semibold'><Link to='/register'>Register</Link></span> </h3>

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