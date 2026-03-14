import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL } from '../config';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/products`)
            .then(res => setFeaturedProducts(res.data.slice(0, 8)))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="home-page">
            <HeroCarousel />

            <CategoryGrid />

            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Products</h2>
                        <p>Our handpicked selection for you</p>
                    </div>
                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
