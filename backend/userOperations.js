const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'mysql_username',
  password: 'mysql_password',
  database: 'database_name',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to user database: ', err);
    return;
  }
  console.log('Connected to user database');
});

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password); // Compare hashed password

      if (!passwordMatch) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      res.status(200).json({ message: 'Login successful' });
    }
  );
});

// Handle registration request
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password

  connection.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json({ message: 'Registration successful' });
    }
  );
});

module.exports = app; // Export the app object