// Admin Dashboard

/*
TODO:
- Load all appointments from database into appointments (Half works, bad values)
- Finish logout button and redirect to login page (Seems to work fine)
- Finish cancel button
*/

import React, { useState, useEffect } from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Dashboard.css'
import './App.css'
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    const [appointmentData, setAppointmentData] = useState({
        dateTime: new Date(),
        fullName: '',
        reason: ''
    });
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch('http://localhost:3001/allAppointments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data);
                } else {
                    throw new Error('Failed to fetch appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, []);

    const handleInputChange = (e) => {
        setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setAppointmentData({ ...appointmentData, dateTime: date });
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        setAppointments([...appointments, appointmentData]); // Add new appointments to list
        setAppointmentData({ dateTime: new Date(), fullName: '', reason: '' }); // Reset form
    };

    const handleCancel = index => {
        setAppointments(appointments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // SEND TO SERVER
    };

    const handleLogout = () => {
        setAppointments([]); //clear apt
        localStorage.removeItem('userToken');
        navigate('/');
    };

    return (
        <div>
            <header>
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main>
                <section>
                    <h2>Schedule Appointment</h2>
                    <form onSubmit={handleSchedule}>
                        <label htmlFor="dateTime">Date and Time</label>
                        <DatePicker
                            selected={appointmentData.dateTime}
                            onChange={handleDateChange}
                            id='dateTime'
                            name="dateTime"
                            showTimeSelect
                            dateFormat="Pp" />

                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={appointmentData.fullName}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="reason">What is this appointment for?</label>
                        <textarea
                            type="text"
                            id="reason"
                            name="reason"
                            value={appointmentData.reason}
                            onChange={handleInputChange}
                        />

                        <button type="submit">Schedule</button>
                    </form>
                </section>

                <section>
                    <h2>All Appointments</h2>
                    {appointments.map((app, index) => (
                        <div key={index} className="appointment">
                            <p><strong>Date:</strong> {new Date(app.dateTime).toLocaleString('en-US', { timeZonename: 'short' })}</p>
                            <p><strong>Name:</strong> {app.fullName}</p>
                            <p><strong>Notes:</strong> {app.reason}</p>
                            <button style={{ backgroundColor: 'red' }} onClick={() => handleCancel(index)}>Cancel</button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;
