import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Registration from './Registration_Login/Registration.jsx';
import Login from './Registration_Login/Login.jsx';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Home/Home.jsx';
import AddTask from './AddTask/AddTask.jsx';
import ShowTask from './ShowTask/ShowTask.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children:
      [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/addTask',
          element: <AddTask />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Registration />
        },
        {
          path: '/showTask',
          element: <ShowTask />,
        }
      ]
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
