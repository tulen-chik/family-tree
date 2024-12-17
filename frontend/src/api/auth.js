import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/me`, {
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateGenealogy = async (token, genealogy) => {
    try {
        const response = await axios.put(
            `${API_URL}/genealogy`,
            { genealogy },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getGenealogy = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/genealogy`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
