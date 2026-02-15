import { axiosInstance } from './authService';

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/user/me');
  return response.data;
};

const userService = {
  getCurrentUser,
};

export default userService;
