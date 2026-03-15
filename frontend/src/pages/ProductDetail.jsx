import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, ShoppingCart, Heart, Share2, MessageCircle, Check } from 'lucide-react';
import { WHATSAPP_NUMBER, API_BASE_URL } from '../config';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const isLoggedIn = !!localStorage.getItem('token');
    const { addToCart } = useCart();

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);
    const handleAddToCart = () => {
        addToCart(product, selectedSize, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const handleWhatsAppOrder = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const productUrl = window.location.href;
        const message = `Hello, I'd like to order:
*Product:* ${product.name}
*Size:* ${selectedSize}
*Quantity:* ${quantity}
*Link:* ${productUrl}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;
    }

    if (!product) {
        return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Product not found.</div>;
    }

    return (
        <div className="container pdp-container">
            <div className="pdp-grid">
                {/* Image Section */}
                <div className="pdp-image-section">
                    <div className="pdp-main-image">
                        <img src={product.image_url || 'https://via.placeholder.com/600'} alt={product.name} />
                    </div>
                </div>

                {/* Info Section */}
                <div className="pdp-info-section">
                    <div className="pdp-header">
                        <span className="pdp-category">{product.type}</span>
                        <h1>{product.name}</h1>
                    </div>

                    <div className="pdp-description">
                        <p>{product.description || "Premium quality cotton t-shirt with high-quality print. Soft, breathable, and durable for everyday wear."}</p>
                    </div>

                    <div className="pdp-options">
                        <div className="option-group">
                            <label>Select Size</label>
                            <div className="size-selector">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="option-group">
                            <label>Quantity</label>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="pdp-actions">
                        <button className="btn btn-whatsapp add-to-cart-btn" onClick={handleWhatsAppOrder}>
                            <MessageCircle size={20} />
                            Order on WhatsApp
                        </button>
                        <button
                            className={`btn ${addedToCart ? 'btn-success' : 'btn-primary'} add-to-cart-btn`}
                            onClick={handleAddToCart}
                        >
                            {addedToCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                            {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                        <button className="btn-icon heart-btn">
                            <Heart size={20} />
                        </button>
                        <button className="btn-icon share-btn">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="pdp-extra">
                        <div className="extra-item">
                            <strong>Premium Quality</strong> Assured
                        </div>
                        <div className="extra-item">
                            <strong>Safe Delivery</strong> Pan India
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
