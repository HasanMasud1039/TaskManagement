import React from 'react';
import { Controller, useForm, } from 'react-hook-form';
import './AddTask.css'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddTask = () => {

    const userEmail = localStorage.getItem('userEmail');
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const onSubmit = async(data) => {
        console.log(data);
        const task = {userEmail, ...data}
        console.log(task);
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
            <h1 className='text-3xl font-bold text-center py-8 uppercase'>add task</h1>
            <form className='mt-0' onSubmit={handleSubmit(onSubmit)}>


                <div>
                    <label htmlFor="name">Task Title</label>
                    <Controller
                        name="task"
                        control={control}
                        rules={{ required: 'Task Title is required' }}
                        render={({ field }) => (
                            <input {...field} type="text" id="task" />
                        )}

                    />
                    {errors.task && <p>{errors.task.message}</p>}
                </div>

                <div>
                    <label htmlFor="name">Date</label>
                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: 'Date is required' }}
                        render={({ field }) => (
                            <input {...field} type="date" id="date" />
                        )}

                    />
                    {errors.date && <p>{errors.date.message}</p>}
                </div>
                <div>
                    <label htmlFor="name">Time</label>
                    <Controller
                        name="time"
                        control={control}
                        rules={{ required: 'Time is required' }}
                        render={({ field }) => (
                            <input {...field} type="time" id="time" />
                        )}

                    />
                    {errors.time && <p>{errors.time.message}</p>}
                </div>
                <div>
                    <label htmlFor="description">Description (Optional)</label>
                    <Controller
                        name="description"
                        control={control}
                        // rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                            <input {...field} type="text" id="description" />
                        )}

                    />
                    {/* {errors.name && <p>{errors.name.message}</p>} */}
                </div>
                <div className='text-center flex justify-center'>
                    <button type="submit">Add Task</button>
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