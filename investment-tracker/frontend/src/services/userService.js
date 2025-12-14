import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

const userService = {
    getCurrentUser
};

export default userService;
