const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'printf_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/printf';

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    phone: String,
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const collectionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image_url: String
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image_url: String,
    collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    type: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    order_date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Collection = mongoose.model('Collection', collectionSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Seeding Initial Data
const seedDB = async () => {
    try {
        const collectionsCount = await Collection.countDocuments();
        if (collectionsCount === 0) {
            const collectionNames = [
                'Politics', 'Cinema', 'Tamil', 'Memes', 'Devotional',
                'Motivational', 'Sports', 'Webseries', 'Professional',
                'Cartoons', 'Area specific', 'Anime'
            ];
            await Collection.insertMany(collectionNames.map(name => ({ name })));
            console.log('Collections seeded.');
        }

        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
            await User.create({
                username: process.env.ADMIN_USERNAME || 'admin',
                email: 'admin@printf.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user seeded.');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
};
seedDB();

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
app.get('/api/collections', async (req, res) => {
    try {
        const collections = await Collection.find();
        res.json(collections.map(c => ({ id: c._id, name: c.name, image_url: c.image_url })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    const { collection_id, type } = req.query;
    const filter = {};

    if (collection_id) filter.collection_id = collection_id;
    if (type) filter.type = type;

    try {
        const products = await Product.find(filter);
        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            collection_id: p.collection_id,
            type: p.type
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.image_url,
            collection_id: product.collection_id,
            type: product.type
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Auth Routes
app.post('/api/register', async (req, res) => {
    const { username, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username, email, phone, password: hashedPassword, role: 'user'
        });
        res.json({ id: newUser._id });
    } catch (err) {
        res.status(400).json({ error: 'Username or Email already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET);
        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const orders = await Order.find({ user_id: req.user.id }).populate('product_id');

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            orders: orders.map(o => ({
                id: o._id,
                product_id: o.product_id ? o.product_id._id : null,
                product_name: o.product_id ? o.product_id.name : 'Unknown Product',
                price: o.product_id ? o.product_id.price : 0,
                quantity: o.quantity,
                order_date: o.order_date
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/profile/change-password', authenticateToken, async (req, res) => {
    const { newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Products API
app.post('/api/admin/products', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { name, description, price, image_url, collection_id, type } = req.body;
    try {
        const newProduct = await Product.create({
            name, description, price, image_url, collection_id, type
        });
        res.json({ id: newProduct._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { name, description, price, image_url, collection_id, type } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, image_url, collection_id, type },
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json({ id: updatedProduct._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Legacy Admin Login (kept for backward compatibility)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, role: 'admin' });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
