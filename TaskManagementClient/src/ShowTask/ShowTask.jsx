import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';

const ShowTask = () => {
    const userEmail = localStorage.getItem('userEmail');
    const [taskData, setTaskData] = useState([]);
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();

    const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Time',
            selector: row => row.time,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: false,
        },
        {
            name: 'Action',
            selector: row => row.action,
            // sortable: true,
        },
    ];

    useEffect(() => {
        if(userEmail){
            axiosSecure.get(`http://localhost:5000/tasks/${userEmail}`)
            .then((response) => {
                setTaskData(response.data);
            })
            .catch((error) => {
                console.error('Error retrieving data:', error);
            });
        }
        else{
            navigate('/');
        }
    }, []);
    console.log(taskData);

    return (
        <div>
            <div className="overflow-x-auto">
                {/* <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {
                        taskData.map((task, index) => <tr
                            key={task._id}
                        >
                            <td className="font-bold">
                                {index + 1}
                            </td>

                            <td>{task.task}</td>
                            <td>{task.date}</td>
                            <td>{task.time}</td>
                            <td>{task?.description}</td>
                            <td >
                                <button className="btn btn-ghost bg-yellow-600 text-white">
                                    Edit</button>

                            </td>
                            <td>
                                <button className="btn btn-ghost bg-red-600  text-white">Delete</button>
                            </td>
                        </tr>)
                    }
                </table> */}
                {
                    taskData.map((task, index) => {
                        <>
                        <p>{task.name}</p>
                        <DataTable title="Task List" columns={columns} data={task} pagination />
                        </>
                    })
                }
            </div>

        </div>
    );
};

export default ShowTask;