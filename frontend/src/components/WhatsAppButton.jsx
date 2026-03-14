import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

const WhatsAppButton = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <Link
            to={isLoggedIn ? `https://wa.me/${WHATSAPP_NUMBER}` : "/login"}
            target={isLoggedIn ? "_blank" : "_self"}
            rel={isLoggedIn ? "noopener noreferrer" : ""}
            className="floating-whatsapp"
            title={isLoggedIn ? "Chat with us on WhatsApp" : "Login to chat on WhatsApp"}
        >
            <MessageCircle size={32} />
        </Link>
    );
};

export default WhatsAppButton;
