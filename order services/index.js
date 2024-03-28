const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// Order schema
const orderSchema = new mongoose.Schema({
    products: [{ 
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    user: { type: String, required: true },
    total_price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { products, user, total_price } = req.body;
    try {
        const order = new Order({ products, user, total_price });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const order = await Order.findById(id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    const id = req.params.id;
    const { products, user, total_price } = req.body;
    try {
        let order = await Order.findById(id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        order.products = products;
        order.user = user;
        order.total_price = total_price;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const order = await Order.findById(id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        await Order.findByIdAndDelete(id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
