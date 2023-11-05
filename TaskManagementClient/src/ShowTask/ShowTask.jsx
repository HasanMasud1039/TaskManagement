import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import DataTable, { createTheme } from 'react-data-table-component';
import { FaPenAlt, FaShieldAlt, FaTrashAlt } from 'react-icons/fa';

const ShowTask = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [taskData, setTaskData] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();

    const handleDelete = ()=>{
        
    }
    const handleUpdate = ()=>{

    }

    const columns = [
        {
            name: 'Title',
            selector: row => row.task,
            sortable: true,
            width: '12%'
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            width: '12%'
        },
        {
            name: 'Time',
            selector: row => row.time,
            sortable: true,
            width: '12%'
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: false,
            width: '48%'
        
        },
        {
            // name: 'Action',
            // selector: row => row.action,
            // // sortable: true,
            cell: (row) => (
                <div className='space-x-8 '>
                    <button className='btn btn-xl btn-warning text-xl' onClick={handleUpdate() }>
                        <FaPenAlt/>
                    </button>
                    <button className='btn btn-xl btn-error text-xl' onClick={handleDelete() }>
                        <FaTrashAlt/>
                    </button>
                </div>
            ),
            name: 'Action',
        },
    ];
    const customStyles = {
        table: {
            style: {
                width: '80%',
                
                
                // margin: 'auto'

            },
        },
        rows: {
            style: {
                minHeight: '72px',
                fontSize: '16px'
            },
        },
        headCells: {
            style: {
                width:'80%',
                paddingX: '14px', // override the cell padding for head cells
                // paddingRight: '8px',
                backgroundColor: 'white',
                fontSize: '20px',
                textAlign: 'center'
            },
        },
        cells: {
            style: {
                width:'80%',
                paddingX: '12px', // override the cell padding for data cells
                // paddingRight: '8px',
            },
        },
        columns: {
            style: {
                backgroundColor: 'red',
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

    useEffect(() => {
        if (userEmail) {
            axiosSecure.get(`http://localhost:5000/tasks/${userEmail}`)
                .then((response) => {
                    setTaskData(response.data);
                })
                .catch((error) => {
                    console.error('Error retrieving data:', error);
                });
        }
        else {
            navigate('/');
        }
    }, []);
    console.log(taskData);

    return (
        <div>
            <div className="content-fit w-[90%] mx-auto text-center">
                <DataTable title="Task List" columns={columns} data={taskData} customStyles={customStyles} theme="solarized" pagination />
                {
                    taskData.map((task, index) => {
                        <>
                            <p>{task.name}</p>
                        </>
                    })
                }
            </div>

        </div>
    );
};

export default ShowTask;