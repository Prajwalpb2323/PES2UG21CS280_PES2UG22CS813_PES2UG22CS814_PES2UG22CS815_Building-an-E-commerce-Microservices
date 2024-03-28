const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// MongoDB Schema
const schema = mongoose.Schema;
const UserSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const UserModel = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Hello from your project!" });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw Error('Email not registered');
        } else if (user.password !== password) {
            throw Error('Incorrect password');
        } else {
            res.status(200).json(user.email);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await UserModel.create({ email, password });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server
        app.listen(5001, () => {
            console.log("Server is running on port 5001");
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
