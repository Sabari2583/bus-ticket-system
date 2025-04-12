const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // Your MySQL username
    password: "sabari",       // Your MySQL password
    database: "bus_booking" // Your database name
});

db.connect(err => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
        return;
    }
    console.log("✅ MySQL Connected...");

    // Ensure users table exists
    const createTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTable, err => {
        if (err) console.error("❌ Error creating table:", err);
        else console.log("✅ Users table ready");
    });
});

// Register User
app.post('/register', (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(query, [fullName, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Email already registered" });
            }
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json({ message: "Registration successful" });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        if (results.length > 0) {
            res.json({ message: "Login successful", user: results[0] });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
