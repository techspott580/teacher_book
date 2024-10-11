// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the Teacher schema
const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

// API endpoint for admin login (simple credential check)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Login successful' });
    }
    return res.status(401).json({ message: 'Invalid username or password' });
});

// API endpoint to add a teacher
app.post('/api/teachers', async (req, res) => {
    const { name, position, salary } = req.body;
    const newTeacher = new Teacher({ name, position, salary });
    try {
        await newTeacher.save();
        res.status(201).json(newTeacher);
    } catch (error) {
        console.error('Error saving teacher:', error);
        res.status(400).json({ error: error.message });
    }
});

// API endpoint to get all teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
