import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isPinVerified, setIsPinVerified] = useState(false);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const storedUser = localStorage.getItem('username');
            if (storedUser) {
                setUser({ username: storedUser });
            } else {
                // Fallback: Decode token to get username
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const username = payload.sub; // 'sub' usually holds the username in JWT
                    setUser({ username });
                    localStorage.setItem('username', username); // Persist for future
                } catch (e) {
                    console.error("Failed to decode token", e);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
            const { token, username: returnedUsername } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', returnedUsername);
            setToken(token);
            setUser({ username: returnedUsername });
            setIsPinVerified(false); // Reset PIN on new login
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (username, password, pin) => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password, pin, balance: 10000 });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    }

    const verifyPin = () => {
        setIsPinVerified(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
        setIsPinVerified(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isPinVerified, login, logout, register, verifyPin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
