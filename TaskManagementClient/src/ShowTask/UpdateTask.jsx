import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const UpdateTask = (row) => {
    console.log(row);
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const userEmail = localStorage.getItem('userEmail');
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const [updatedTask, setUpdatedTask] = useState();

    
    const { data: taskData = [], refetch } = useQuery({
        queryKey: ["email", userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `tasks/${userEmail}`
            );
            return res.data;
        },
    });
    const handleUpdate = (row) => {
        console.log(row);
        axiosSecure.patch("/tasks", { id: row._id, updatedTask }).then((res) => {
            refetch();
            reset();
            navigate('/');
            Swal.fire({
                title: 'Update  Successful.',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
        });

    }

    const onSubmit = (data) => {
        console.log(data);
        setUpdatedTask(data);

    };

    return (
        <div>


            <p>ID: {row._id}</p>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

                <div >
                    <div className='flex gap-8'>
                        <label className='w-32 text-start' htmlFor="task">Title</label>

                        <Controller
                            name="task"
                            control={control}
                            rules={{ required: 'Task Title is required' }}
                            defaultValue={row.task}
                            render={({ field }) => (
                                <input {...field} placeholder={row.task} type="text" id="task" />
                            )}

                        />
                    </div>
                    {errors.task && <p>{errors.task.message}</p>}
                </div>

                <div >
                    <div className='flex gap-8'>
                        <label className='w-20 text-start' htmlFor="date">Date</label>
                        <Controller
                            name="date"
                            control={control}
                            // defaultValue={row.date}
                            rules={{ required: 'Date is required' }}
                            render={({ field }) => (
                                <input {...field} placeholder={row.date} type="date" id="date" />
                            )}

                        />
                    </div>
                    {errors.date && <p>{errors.date.message}</p>}
                </div>
                <div >
                    <div className='flex gap-8'>
                        <label className='w-20 text-start' htmlFor="time">Time</label>
                        <Controller
                            name="time"
                            control={control}
                            rules={{ required: 'Time is required' }}
                            // defaultValue={row.time}
                            render={({ field }) => (
                                <input {...field} placeholder={row?.time} type="time" id="time" />
                            )}

                        />
                    </div>
                    {errors.time && <p>{errors.time.message}</p>}
                </div>
                <div >
                    <div className='flex gap-8'>
                        <label className='w-32 h-24 text-start' htmlFor="description">Description (Optional)</label>
                        <Controller
                            name="description"
                            control={control}
                            // defaultValue={row?.description}
                            render={({ field }) => (
                                <input {...field} placeholder={row?.description} type="text" id="description" />
                            )}
                        />
                    </div>
                </div>
                <div className='text-center flex justify-center'>
                    <button type="submit" onClick={() => handleUpdate(row._id)}>Update Task</button>
                </div>
            </form>


        </div>
    );
};

export default UpdateTask;