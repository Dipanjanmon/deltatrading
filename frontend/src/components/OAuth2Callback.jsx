import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OAuth2Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // We need to add this to AuthContext

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Assume we can extract username/id from token or just fetch profile
            // For now, simpler to just store token and redirect
            localStorage.setItem('token', token);
            // We might need to fetch user profile to complete login state in context
            // But standard 'login' takes username/password.
            // We should add a 'setToken' or 'loadUser' method.

            // Temporary hack: Just redirect to dashboard, Dashboard will fetch profile.
            navigate('/dashboard');
        } else {
            toast.error('Login failed');
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );
}
