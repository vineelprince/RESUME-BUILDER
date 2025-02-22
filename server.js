const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // Change this to a secure key
const USERS_FILE = 'users.json';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname)); // Serves static files (HTML, CSS, JS)

// 📌 Function to load users from JSON file
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

// 📌 Function to save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 📌 Serve the Login Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index1.html'));
});

// 📌 Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();

    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1 || !bcrypt.compareSync(password, users[userIndex].password)) {
        return res.status(401).json({ validUser: false, message: 'Invalid email or password' });
    }

    // Update last login timestamp
    users[userIndex].lastLogin = new Date().toLocaleString();
    saveUsers(users);

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ validUser: true, message: 'Login successful!', email });
});

// 📌 Admin Route - View Logged-in Users
app.get('/admin/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// 📌 Check Auth Route
app.get('/check-auth', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ validUser: false });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ validUser: true, email: decoded.email });
    } catch (err) {
        res.json({ validUser: false });
    }
});

// 📌 Registration Route
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ email, password: hashedPassword, lastLogin: null });
    saveUsers(users);

    res.json({ message: 'Registration successful!' });
});

// 📌 Logout Route
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// 📌 Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
