import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const useAuth = async (userData ) => {
    const [currentUser, setCurrentUser] = useState([]);
    const navigate = useNavigate();
    
    // const [isUser, setIsUser] = useState(false);
    // const {email, password} = userData;
//     if (userData) {

//         try {
//             const response = await axios.post('http://localhost:5000/login', {email: userData.email, password: userData.password });
//             const token = response.data.token;
//             localStorage.setItem('access-token', token);
//             // axios.post('http://localhost:5000/jwt', {email: userData.email})
//             // .then(data =>{
                
//                 toast.success("Login Successful")
//             // })
//             setCurrentUser(userData.email);
//             console.log(userData);
         
//             <Navbar userData={userData}></Navbar>
            
            
//             navigate('/');

//           } catch (error) {
//             console.error(error.response.data);
//             toast.error(error.response.data)

//           }

//     }
// console.log(currentUser);
// currentUser == null ? userLogged = "Null"  : userLogged = currentUser; 
//     return [userLogged];
};

export default useAuth;