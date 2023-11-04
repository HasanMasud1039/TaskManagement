import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("access-token");
    }

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authentication = `Bearer ${token}`;
      }
      return config;
    });

    axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logOut();
          navigate("/");
        }
        return Promise.reject(error);
      }
    );
}, [logOut, navigate, axiosSecure]);

return [axiosSecure];
};

export default useAxiosSecure;