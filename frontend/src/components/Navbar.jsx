import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Home, Grid, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const { cartCount } = useCart();

    return (
        <>
            <nav className="navbar">
                <div className="container nav-content">
                    <Link to="/" className="logo">
                        <span className="p">P</span>
                        <span className="r">R</span>
                        <span className="i">I</span>
                        <span className="n">N</span>
                        <span className="t">T</span>
                        <span className="f">F</span>
                        <span className="quotes">("")</span>
                    </Link>

                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li className="dropdown">
                            <Link to="/shop">Shop</Link>
                            <ul className="dropdown-menu">
                                <li><Link to="/shop?type=Round neck">Round Neck</Link></li>
                                <li><Link to="/shop?type=Polo">Polo</Link></li>
                                <li><Link to="/shop?type=Sweat shirt">Sweatshirt</Link></li>
                                <li><Link to="/shop?type=Hoodie">Hoodie</Link></li>
                            </ul>
                        </li>
                        {isLoggedIn ? (
                            <>
                                {role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                                <li><Link to="/profile">Profile</Link></li>
                            </>
                        ) : (
                            <li><Link to="/login">Login/Register</Link></li>
                        )}
                    </ul>

                    <div className="nav-actions">
                        <div className="search-bar">
                            <Search size={18} />
                            <input type="text" placeholder="Search..." />
                        </div>
                        <div className="nav-icons">
                            <Link
                                to={isLoggedIn ? `https://wa.me/${WHATSAPP_NUMBER}` : "/login"}
                                target={isLoggedIn ? "_blank" : "_self"}
                                rel={isLoggedIn ? "noopener noreferrer" : ""}
                                className="nav-icon-item"
                                style={{ color: '#25D366' }}
                            >
                                <MessageCircle size={20} />
                            </Link>
                            <Link to={isLoggedIn ? "/profile" : "/login"} className="nav-icon-item">
                                <User size={20} />
                            </Link>
                            <Link to="/cart" className="nav-icon-item cart-icon">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="mobile-nav">
                <Link to="/"><Home size={24} /></Link>
                <Link to="/shop"><Grid size={24} /></Link>
                <Link
                    to={isLoggedIn ? `https://wa.me/${WHATSAPP_NUMBER}` : "/login"}
                    target={isLoggedIn ? "_blank" : "_self"}
                    rel={isLoggedIn ? "noopener noreferrer" : ""}
                    style={{ color: '#25D366' }}
                >
                    <MessageCircle size={24} />
                </Link>
                <Link to={isLoggedIn ? "/profile" : "/login"}><User size={24} /></Link>
                <Link to="/cart" className="cart-icon">
                    <ShoppingCart size={24} />
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
            </div>
        </>
    );
};

export default Navbar;
