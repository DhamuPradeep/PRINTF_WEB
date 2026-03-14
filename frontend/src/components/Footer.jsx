import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

const Footer = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-column brand-col">
                    <Link to="/" className="logo">
                        <span className="p">P</span>
                        <span className="r">R</span>
                        <span className="i">I</span>
                        <span className="n">N</span>
                        <span className="t">T</span>
                        <span className="f">F</span>
                        <span className="quotes">("")</span>
                    </Link>
                    <p className="footer-tagline">Premium Tamil Graphic T-shirts & Merchandise.</p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/printf_clothing_world?igsh=bm42MjFna3JveGN6" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Instagram size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Collections</h4>
                    <ul className="footer-links">
                        <li><Link to="/collection/1?name=Politics">Politics</Link></li>
                        <li><Link to="/collection/2?name=Cinema">Cinema</Link></li>
                        <li><Link to="/collection/3?name=Tamil">Tamil</Link></li>
                        <li><Link to="/collection/4?name=Memes">Memes</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Shop</h4>
                    <ul className="footer-links">
                        <li><Link to="/shop?type=Round neck">Round Neck</Link></li>
                        <li><Link to="/shop?type=Polo">Polo</Link></li>
                        <li><Link to="/shop?type=Sweat shirt">Sweatshirt</Link></li>
                        <li><Link to="/shop?type=Hoodie">Hoodie</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>About Us</h4>
                    <ul className="footer-links">
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div className="footer-column contact-col">
                    <h4>Contact</h4>
                    <ul className="contact-info">
                        <li><Mail size={16} /> support@printf.com</li>
                        <li><MapPin size={16} /> Coimbatore, Tamil Nadu</li>
                        <li>
                            <Link
                                to={isLoggedIn ? `https://wa.me/${WHATSAPP_NUMBER}` : "/login"}
                                target={isLoggedIn ? "_blank" : "_self"}
                                rel={isLoggedIn ? "noopener noreferrer" : ""}
                                className="whatsapp-link"
                            >
                                <MessageCircle size={16} /> WhatsApp Admin
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} PRINTF. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
