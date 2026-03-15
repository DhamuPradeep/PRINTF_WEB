import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/api/register`, {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', padding: '100px 20px' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Register</h2>
                {error && <p style={{ color: 'red', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Username</label>
                        <input
                            name="username"
                            type="text"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Phone (Optional)</label>
                        <input
                            name="phone"
                            type="text"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Register</button>
                </form>
                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
