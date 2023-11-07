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

    const { data: taskData = [], refetch } = useQuery({ //used for refetch after CRUD operation.
        queryKey: ["email", userEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(
                `tasks/${userEmail}`
            );
            return res.data;
        },
    });

    const [allTask, setAllTask] = useState('');
    const [searchText, setSearchText] = useState("");
    //search in table
    const search = () => {
        fetch(
            `http://tlocalhost:5000/getSearchByTaskName/${searchText}`
        )
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                setAllTask(data);
            });
    };
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        search();
    };

    //used for automatic modal close after successful update
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    //onClick Delete Button
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
    //onClick Update button
    const handleUpdate = (id) => {
        console.log(id)
        console.log(updatedTask);
        if (updatedTask) {
            axiosSecure.patch("/tasks", { id, updatedTask })
                .then((res) => {
                    console.log(res.data);
                    setUpdatedTask('');
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

    }

    //react-hook-form item
    const onSubmit = (data) => {
        setUpdatedTask(data);
    };
    //react-table-component items
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
                        <input type="checkbox" id={row._id} className="modal-toggle" />
                        {
                            isOpen &&
                            <div className="modal">
                                <div className="modal-box  bg-zinc-100">
                                    <form className='space-y-4 max-w-[600px] mx-auto p-8 border border-gray-300 rounded-lg shadow-md bg-gray-200' onSubmit={handleSubmit(onSubmit)}>
                                        <div className=' space-y-1'>
                                            <div className='gap-8  space-y-1'>
                                                <label className='w-32 text-start font-bold mb-2' htmlFor="task">Title</label>
                                                <Controller
                                                    name="task"
                                                    control={control}
                                                    rules={{ required: 'Task Title is required' }}
                                                    render={({ field }) => (
                                                        <input {...field} placeholder={row.task} type="text" id="task" className='w-full p-2 mb-2 border border-gray-300 rounded-md' />
                                                    )}
                                                />
                                            </div>
                                            {errors.task && <p className='text-red-500 mt-[-10px] mb-2'>{errors.task.message}</p>}
                                        </div>
                                        <div className=' space-y-1'>
                                            <div className='gap-8  space-y-1'>
                                                <label className='w-20 text-start font-bold mb-2' htmlFor="date">Date</label>
                                                <Controller
                                                    name="date"
                                                    control={control}
                                                    rules={{ required: 'Date is required' }}
                                                    render={({ field }) => (
                                                        <input placeholder={row.date} {...field} type="date" id="date" className='w-full p-2 mb-2 border border-gray-300 rounded-md' />
                                                    )}
                                                />
                                            </div>
                                            {errors.date && <p className='text-red-500 mt-[-10px] mb-2'>{errors.date.message}</p>}
                                        </div>
                                        <div className=' space-y-1'>
                                            <div className='gap-8  space-y-1'>
                                                <label className='w-20 text-start font-bold mb-2' htmlFor="time">Time</label>
                                                <Controller
                                                    name="time"
                                                    control={control}
                                                    rules={{ required: 'Time is required' }}
                                                    render={({ field }) => (
                                                        <input {...field} placeholder={row.time} type="time" id="time" className='w-full p-2 mb-2 border border-gray-300 rounded-md' />
                                                    )}
                                                />
                                            </div>
                                            {errors.time && <p className='text-red-500 mt-[-10px] mb-2'>{errors.time.message}</p>}
                                        </div>
                                        <div className=' space-y-1'>
                                            <div className='gap-8  space-y-2'>
                                                <label className='w-32 h-24 text-start font-bold mb-2' htmlFor="description">Description (Optional)</label>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <input {...field} placeholder={row?.description} type="text" id="description" className='w-full p-2 mb-2 border border-gray-300 rounded-md' />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className='text-center flex justify-center'>
                                            <button type="submit" onClick={() => handleUpdate(row._id)} className='bg-blue-500 text-white p-2 px-4 rounded-md cursor-pointer'>Update Task</button>
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
                padding: '10px'
            },
        },
        headCells: {
            style: {

                padding: '14px',
                backgroundColor: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
            },
        },
        cells: {
            style: {
                padding: '5px',
                fontSize: '18px'
            },
        },
        columns: {
            style: {
            }
        }
    };
    createTheme('solarized', {
        table: {
            border: ''
        },
        text: {
            primary: 'rgb(21 94 177)',
            secondary: '#2aa198',
        },
        background: {
            default: 'rgb(229 231 235)',
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
            <div className=" w-[80%] mx-auto ">
                <h1 className='py-4 text-3xl text-center font-serif font-bold'>Task List</h1>
                <div className='bg-red-300 relative mb-24 '>
                    <form onChange={handleSearchSubmit} className=" absolute top-0 right-0 bg-zinc-200 border-0">
                        <input className="rounded-lg px-4 mx-4 h-12"
                            name="search"
                            label="Search"
                            value={searchText}
                            onChange={handleSearchChange}
                            placeholder="Search"
                        />
                        <button className="btn btn-primary mt-1">
                            Search
                        </button>
                    </form>
                </div>
                <div className='border border-gray-300 rounded-lg shadow-md p-2'>
                    <DataTable columns={columns} data={taskData} customStyles={customStyles} theme="solarized" pagination />
                </div>
            </div>

        </div>
    );
};

export default ShowTask;