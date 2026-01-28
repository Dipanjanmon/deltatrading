import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Mail, Phone, FileText, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import API_BASE_URL from '../config';

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        profilePictureUrl: ''
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                profilePictureUrl: user.profilePictureUrl || ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setUploading(true);
        try {
            // Assuming we use axios interceptor or passing token manually.
            // Dashboard passes 'user', but we need token for upload if protected.
            // Let's assume axios is configured or we pass headers.
            await axios.post(`${API_BASE_URL}/api/users/${user?.username}/photo`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Profile photo updated!');
            onUpdate();
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/api/users/${user?.username}`, formData, config);
            toast.success('Profile updated successfully!');
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass-card w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-hidden transform">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User className="text-emerald-500" />
                        Edit Profile
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full glass-interactive flex items-center justify-center relative overflow-hidden group">
                                {formData.profilePictureUrl ? (
                                    <img src={formData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-slate-500" />
                                )}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={20} className="text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                                </label>
                            </div>
                            {uploading && <p className="text-xs text-emerald-500 mt-2">Uploading...</p>}
                            <input
                                type="text"
                                name="profilePictureUrl"
                                placeholder="Profile Image URL"
                                value={formData.profilePictureUrl}
                                onChange={handleChange}
                                className="mt-4 w-full glass-interactive rounded-lg p-3 text-sm text-white focus:border-emerald-500/50 outline-none placeholder:text-slate-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full glass-interactive rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none placeholder:text-slate-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full glass-interactive rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none placeholder:text-slate-600"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full glass-interactive rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none placeholder:text-slate-600"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-slate-500" size={16} />
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full glass-interactive rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none min-h-[100px] placeholder:text-slate-600"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

ProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    user: PropTypes.shape({
        fullName: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        bio: PropTypes.string,
        profilePictureUrl: PropTypes.string,
        username: PropTypes.string
    }),
    onUpdate: PropTypes.func.isRequired
};
