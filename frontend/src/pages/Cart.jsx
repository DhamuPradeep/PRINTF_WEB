import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MessageCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { WHATSAPP_NUMBER } from '../config';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const isLoggedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();

    const handleWhatsAppOrder = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (cart.length === 0) return;

        let message = `*Hello, I'd like to place an order from PRINTF:*%0A%0A`;

        cart.forEach((item, index) => {
            message += `*${index + 1}. ${item.name}*%0A`;
            message += `Type: ${item.type}%0A`;
            message += `Size: ${item.size}%0A`;
            message += `Quantity: ${item.quantity}%0A%0A`;
        });

        message += `_Please confirm my order._`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    if (cart.length === 0) {
        return (
            <div className="container empty-cart">
                <div className="empty-cart-content">
                    <ShoppingBag size={64} />
                    <h1>Your Cart is Empty</h1>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <div className="cart-header">
                <h1>Shopping Cart ({cartCount})</h1>
                <Link to="/shop" className="continue-shopping">
                    <ArrowLeft size={18} /> Continue Shopping
                </Link>
            </div>

            <div className="cart-grid">
                <div className="cart-items-section">
                    {cart.map(item => (
                        <div key={`${item.id}-${item.size}`} className="cart-item">
                            <div className="cart-item-image">
                                <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <div className="item-main-info">
                                    <h3>{item.name}</h3>
                                    <p className="item-meta">{item.type} | Size: {item.size}</p>
                                </div>
                                <div className="item-actions">
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>
                                            <Minus size={16} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button className="remove-item" onClick={() => removeFromCart(item.id, item.size)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h3>Order Summary</h3>
                        <p className="summary-tagline">Complete your order on WhatsApp to get final pricing and delivery details.</p>

                        <button className="btn btn-whatsapp checkout-btn" onClick={handleWhatsAppOrder}>
                            <MessageCircle size={20} />
                            Order all on WhatsApp
                        </button>

                        {!isLoggedIn && (
                            <p className="login-warning">
                                * You'll need to login to proceed to WhatsApp.
                            </p>
                        )}

                        <div className="summary-extra">
                            <p>Fast delivery within 3-5 business days.</p>
                            <p>Safe and secure payments via UPI/Cash on Delivery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
