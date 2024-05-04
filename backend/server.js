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

const appointmentSchema = new mongoose.Schema({
    dateTime: String,
    fullName: String,
    reason: String,
    user: String,
})

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointments', appointmentSchema);


const authToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader&&authHeader.split(' ')[1];
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    }
    else{
        return res.sendStatus(401);
    }
}

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

app.post('/scheduleAppointment', authToken, async (req,res)=>{
    
    try{
        const {dateTime, fullName, reason} = req.body;
        const newappointment = new Appointment({
            dateTime,
            fullName,
            reason,
            user: req.user.userId
        });
        await newappointment.save();
        res.status(201).json({
            message: req.user.userId+': Appoinment created successfully.',
        });
    }
    catch(error){
        res.status(500).json({message:'Failed to create appoinment:', error: error.message});
    }
});

//Load appointments back into dashboard upon log in
app.get('/userAppointments', authToken, async (req, res) => {
    try {
        // Find user's appointments in database
        const appointments = await Appointment.find({ user: req.user.userId });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Retrieve all appointments for admin
app.get('/allAppointments', authToken, async (req, res) => {
    try {
        // Fetch all appointments from the database
        const appointments = await Appointment.find();

        // Return the appointments as JSON response
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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


//Cancel appointment
app.delete('/delete/:id', authToken, async (req,res)=> {
    try{
        const {id} = req.params;
        const result = await Appointment.findByIdAndDelete(id);
        if(result){
            res.status(200).json({message:'Appointment deleted successfully.'});
        }
        else{
            res.status(404).json({message:'Appointment not found'});
        }
    }
    catch(error){
        console.error('Error deleting appointment:', error);
        res.status(500).json({error:'Internal server error.'});
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
