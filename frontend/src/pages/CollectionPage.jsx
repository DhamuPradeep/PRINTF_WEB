import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Filter } from 'lucide-react';

const CollectionPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const collectionName = queryParams.get('name');
    const type = queryParams.get('type');

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('latest');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let url = `${API_BASE_URL}/api/products`;
        const params = [];
        if (id) params.push(`collection_id=${id}`);
        if (type) params.push(`type=${type}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        axios.get(url)
            .then(res => {
                let data = res.data;
                // Simple client side sorting for demo
                if (sortBy === 'price-low') data.sort((a, b) => a.price - b.price);
                else if (sortBy === 'price-high') data.sort((a, b) => b.price - a.price);

                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, type, sortBy]);

    return (
        <div className="container collection-container">
            <div className="collection-header">
                <div>
                    <h1>{collectionName || type || 'All Products'}</h1>
                    <p className="text-muted">Showing {products.length} products</p>
                </div>

                <div className="collection-controls">
                    <div className="sort-dropdown">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="latest">Latest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading products...</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <Filter size={48} />
                    <h3>No products found</h3>
                    <p>Try checking another category or collection.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionPage;
