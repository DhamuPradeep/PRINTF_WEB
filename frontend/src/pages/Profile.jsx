import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const res = await axios.get(`${API_BASE_URL}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/profile/change-password`, { newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Password updated successfully!');
            setNewPassword('');
        } catch (err) {
            alert('Failed to update password');
        }
    };

    if (loading) return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h2>My Profile</h2>
                    <button onClick={handleLogout} className="btn" style={{ background: '#ff4444', color: 'white' }}>Logout</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* User Details */}
                    <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Account Details</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h4 style={{ marginBottom: '15px' }}>Change Password</h4>
                            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="btn"
                                    style={{ border: '1px solid #ddd', textAlign: 'left' }}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Update Password</button>
                            </form>
                        </div>
                    </section>

                    {/* Order History */}
                    <section style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Order History</h3>
                        {user.orders && user.orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {user.orders.map(order => (
                                    <div key={order.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                                        <p style={{ fontWeight: '600' }}>{order.product_name}</p>
                                        <p style={{ fontSize: '14px', color: '#666' }}>Qnty: {order.quantity} | Total: ₹{order.price * order.quantity}</p>
                                        <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>{new Date(order.order_date).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#666' }}>You haven't placed any orders yet.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
