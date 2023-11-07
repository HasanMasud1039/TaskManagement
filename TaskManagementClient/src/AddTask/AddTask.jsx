import React from 'react';
import { Controller, useForm, } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTask = () => {

    const userEmail = localStorage.getItem('userEmail');
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        const task = { userEmail, ...data }

        if (data) {
            toast.success("Task Added Successfully.")
            reset();
            const redirectTimer = setTimeout(() => {
                // window.location.href = '/';
                navigate('/showTask');
            }, 2000);

            //POST Data
            try {
                const response = await axios.post('http://localhost:5000/tasks', task);
                console.log('Data sent successfully:', response.data);
            } catch (error) {
                console.error('Error sending data:', error);
            }

        }
    };

    return (
        <div className='h-screen'>
            <h1 className=' text-3xl font-bold text-center py-8 uppercase'>add task</h1>
            <form className="max-w-[600px] mx-auto p-20 border border-gray-300 rounded-lg shadow-md bg-gray-200" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="name" className="block font-bold mb-2">Task Title</label>
                    <Controller
                        name="task"
                        control={control}
                        rules={{ required: 'Task Title is required' }}
                        render={({ field }) => (
                            <input {...field} type="text" id="task" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                        )}
                    />
                    {errors.task && <p className="text-red-500 mt-[-10px] mb-2">{errors.task.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block font-bold mb-2">Date</label>
                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: 'Date is required' }}
                        render={({ field }) => (
                            <input {...field} type="date" id="date" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                        )}
                    />
                    {errors.date && <p className="text-red-500 mt-[-10px] mb-2">{errors.date.message}</p>}
                </div>

                <div>
                    <label htmlFor="name" className="block font-bold mb-2">Time</label>
                    <Controller
                        name="time"
                        control={control}
                        rules={{ required: 'Time is required' }}
                        render={({ field }) => (
                            <input {...field} type="time" id="time" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                        )}
                    />
                    {errors.time && <p className="text-red-500 mt-[-10px] mb-2">{errors.time.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block font-bold mb-2">Description (Optional)</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <input {...field} type="text" id="description" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                        )}
                    />
                </div>

                <div className="text-center flex justify-center">
                    <button type="submit" className="bg-blue-500 text-white p-2 px-4 mt-8 rounded-md cursor-pointer">Add Task</button>
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

export default AddTask;