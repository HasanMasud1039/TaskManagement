import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import { FaPenAlt, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ShowTask = () => {
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const userEmail = localStorage.getItem('userEmail');
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const [updatedTask, setUpdatedTask] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const { data: taskData = [], refetch } = useQuery({
        queryKey: ["email", userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `tasks/${userEmail}`
            );
            return res.data;
        },
    });

console.log(updatedTask);

const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/tasks/${id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                            )
                            toast.success('Deleted');
                            navigate('/')
                        }

                    })
            }
        })


    }

    const handleUpdate = (id) => {
        console.log(id)
        axiosSecure.patch("/tasks", { id, updatedTask })
        .then((res) => {
            refetch();
            closeModal();
            Swal.fire({
                title: 'Update  Successful.',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            });
            reset();
            navigate('/');
        })
        .catch((error) => {
            console.error('Error updating data:', error);
            toast.error('Updating Data Failed')
        });

    }

    //form

    const onSubmit = (data) => {
        console.log(data);
        setUpdatedTask(data);

    };


    const columns = [
        {
            name: 'Title',
            selector: row => row.task,
            sortable: true,
            width: '10%'

        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            width: '10%'

        },
        {
            name: 'Time',
            selector: row => row.time,
            sortable: true,
            width: '10%'

        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: false,
            width: '60%',


        },
        {
            cell: (row) => (
                <div className='space-x-8 flex'>
                    <div>
                        <label htmlFor={row._id} onClick={openModal} className="btn btn-xl btn-warning text-xl" ><FaPenAlt /></label>

                        {/* Put this part before </body> tag */}
                        <input type="checkbox" id={row._id} className="modal-toggle" />

                        {
                            isOpen &&
                            <div className="modal ">
                            <div className="modal-box">

                                <p>ID: {row._id}</p>
                                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>

                                    <div >
                                        <div className='flex gap-8'>
                                            <label className='w-32 text-start' htmlFor="task">Title</label>

                                            <Controller
                                                name="task"
                                                control={control}
                                                rules={{ required: 'Task Title is required' }}
                                                // placeholder={row.task}
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
                                                // placeholder={row.date}
                                                rules={{ required: 'Date is required' }}
                                                render={({ field }) => (
                                                    <input placeholder={row.date} {...field}  type="date" id="date" />
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
                                                // placeholder={row.time}
                                                render={({ field }) => (
                                                    <input {...field} placeholder={row.time} type="time" id="time" />
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
                                                // placeholder={row?.description}
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

                                <div className="modal-action">
                                    <label onClick={closeModal} htmlFor={row._id} className="btn btn-error">Close!</label>
                                </div>

                            </div>

                        </div>
                        }
                    </div>
                    <button className='btn btn-xl btn-error text-xl' onClick={() => handleDelete(row._id)}>
                        <FaTrashAlt />
                    </button>
                </div>
            ),
            name: 'Action',
            width: '10%'

        },
    ];
    const customStyles = {
        table: {
            style: {
                overflow: true,
            },
        },
        rows: {
            style: {
                minHeight: '80px',
                fontSize: '16px',
            },
        },
        headCells: {
            style: {

                paddingX: '14px', // override the cell padding for head cells
                // paddingRight: '8px',
                backgroundColor: 'white',
                fontSize: '20px'
            },
        },
        cells: {
            style: {
                paddingX: '12px', // override the cell padding for data cells
            },
        },
        columns: {
            style: {

            }
        }
    };
    createTheme('solarized', {
        text: {
            primary: '#268bd2',
            secondary: '#2aa198',
        },
        background: {
            //   default: '',
            default: '#002b36',
        },
        context: {
            background: '#cb4b16',
            text: '#FFFFFF',
        },
        divider: {
            default: '#073642',
        },
        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
    }, 'dark')


    return (
        <div>
            <div className=" w-[90%] mx-auto text-center">
                <h1 className='py-6 text-3xl font-serif font-bold'>Task List</h1>
                <DataTable columns={columns} data={taskData} customStyles={customStyles} theme="solarized" pagination />
            </div>

        </div>
    );
};

export default ShowTask;