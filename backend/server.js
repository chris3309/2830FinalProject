const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://AppointmentApp:25at9O2aKBuIYDws@cluster0.dd4bnzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define MongoDB Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user'}
});

const User = mongoose.model('User', userSchema);

async function createAdmin(){
    try{
        const ifAdmin = await User.findOne({username: 'admin'});
        if(ifAdmin){
            console.log('Admin account already exists.');
        }
        else{
            const adminPassword = bcrypt.hashSync('adminPassword', 10);
            const admin = new User({
                username: 'admin',
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Created admin account');
        }
    }
    catch(error){
        console.error('Error creating admin account:', error);
    }
}

createAdmin();

// Handle login request
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }
        
        const token = jwt.sign(
            { userId: user.username, role:user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Handle registration request
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
