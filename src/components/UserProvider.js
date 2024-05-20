import axios2 from '../config/axiosConfig';

export const getUserData = async () => {
    const token = localStorage.getItem('tokenUser');
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios2.get('/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};