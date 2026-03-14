import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import CollectionPage from './pages/CollectionPage';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
    return (
        <CartProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/collection/:id" element={<CollectionPage />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/shop" element={<CollectionPage />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </main>
                    <Footer />
                    <WhatsAppButton />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
