import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-image">
                <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} />
            </div>
            <div className="product-info">
                <h4>{product.name}</h4>
            </div>
        </Link>
    );
};

export default ProductCard;
