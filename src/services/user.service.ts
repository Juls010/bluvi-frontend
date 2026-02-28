/*
import axios from 'axios';
import { User } from '../types/user'; // Importa la interfaz que creamos

const API_URL = 'http://localhost:3000/api/users';

export const getMyProfile = async (): Promise<User> => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, lanzamos error antes de llamar a la API
    if (!token) throw new Error("No token found");

    const response = await axios.get<{ user: User }>(`${API_URL}/profile`, {
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });

    return response.data.user;
};
*/