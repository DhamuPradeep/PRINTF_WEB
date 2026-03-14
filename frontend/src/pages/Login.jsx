import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('username', res.data.username);

            if (res.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
            window.location.reload(); // Refresh to update Navbar
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', padding: '100px 20px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Login</h2>
                {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Login</button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
