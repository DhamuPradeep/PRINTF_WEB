import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const navigate = useNavigate();

    // New/Edit Product State
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', price: '', collection_id: '', type: 'Round neck', image_url: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    useEffect(() => {
        if (!isLoggedIn || role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [isLoggedIn, role, navigate]);

    const fetchData = async () => {
        try {
            const [pRes, cRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/products`),
                axios.get(`${API_BASE_URL}/api/collections`)
            ]);
            setProducts(pRes.data);
            setCollections(cRes.data);
            if (cRes.data.length > 0 && !newProduct.collection_id) {
                setNewProduct(prev => ({ ...prev, collection_id: cRes.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => setNotification({ ...notification, visible: false }), 4000);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`${API_BASE_URL}/api/admin/products/${editProductId}`, newProduct, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showNotification('Product updated successfully!', 'success');
                setIsEditing(false);
                setEditProductId(null);
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/products`, newProduct, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showNotification('Product added successfully!', 'success');
            }
            setNewProduct({ name: '', description: '', price: '', collection_id: collections[0]?.id || '', type: 'Round neck', image_url: '' });
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            showNotification(isEditing ? `Failed to update product: ${errorMsg}` : `Failed to add product: ${errorMsg}`, 'error');
        }
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditProductId(product.id);
        setNewProduct({
            name: product.name,
            description: product.description || '',
            price: product.price,
            collection_id: product.collection_id,
            type: product.type,
            image_url: product.image_url || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditProductId(null);
        setNewProduct({ name: '', description: '', price: '', collection_id: collections[0]?.id || '', type: 'Round neck', image_url: '' });
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotification('Product deleted successfully!', 'success');
            fetchData();
        } catch (err) {
            showNotification('Failed to delete product', 'error');
        }
    };

    if (!isLoggedIn || role !== 'admin') return null;

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            {notification.visible && (
                <div className={`admin-notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={() => { localStorage.clear(); navigate('/login'); window.location.reload(); }} className="btn" style={{ background: '#ff4444', color: 'white' }}>Logout</button>
            </div>

            <section style={{ margin: '40px 0', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    {isEditing && (
                        <button onClick={handleCancelEdit} className="btn" style={{ background: '#6b7280', color: 'white', fontSize: '0.8rem' }}>Cancel Edit</button>
                    )}
                </div>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Product Name</label>
                        <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="btn" style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Price</label>
                        <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="btn" style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }} required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Collection</label>
                        <select value={newProduct.collection_id} onChange={e => setNewProduct({ ...newProduct, collection_id: e.target.value })} className="btn" style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}>
                            {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Product Type</label>
                        <select value={newProduct.type} onChange={e => setNewProduct({ ...newProduct, type: e.target.value })} className="btn" style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }}>
                            <option>Round neck</option>
                            <option>Polo</option>
                            <option>Sweat shirt</option>
                            <option>Hoodie</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Image URL</label>
                        <input type="text" placeholder="Image URL (Optional)" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} className="btn" style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%' }} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Description</label>
                        <textarea
                            placeholder="Product Description"
                            value={newProduct.description}
                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="btn"
                            style={{ border: '1px solid #ddd', textAlign: 'left', width: '100%', minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>
                        {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            </section>

            <section>
                <h3>All Products</h3>
                <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Price</th>
                            <th style={{ padding: '12px' }}>Type</th>
                            <th style={{ padding: '12px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{p.name}</td>
                                <td style={{ padding: '12px' }}>₹{p.price}</td>
                                <td style={{ padding: '12px' }}>{p.type}</td>
                                <td style={{ padding: '12px', display: 'flex', gap: '12px' }}>
                                    <button onClick={() => handleEditClick(p)} style={{ color: 'var(--accent)', fontWeight: '600' }}>Edit</button>
                                    <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#ef4444', fontWeight: '600' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Admin;
