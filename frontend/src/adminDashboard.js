// Admin Dashboard



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
                    console.log(data)
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

    const handleSchedule = async (e) => {
        e.preventDefault();
        const dateTimeString = new Date(appointmentData.dateTime).toLocaleString('en-US', { timeZoneName: 'short'});
        setAppointments([...appointments, appointmentData]); // Add new appointments to list
        setAppointmentData({ dateTime: '', fullName: '', reason: '' }); // Reset form
        const formatedDate = {...appointmentData, dateTime: dateTimeString};
        try {
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:3001/scheduleAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formatedDate)
            });
            if (!response.ok) {
                throw new Error('Failed to schedule appointment.');
            }
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error submitting appointment:', error);
        }
    };

    const handleCancel = async (id) => {
        console.log('Attempting to cancel appt with id:', id);
        try{
            const token = localStorage.getItem('userToken');
            const response = await fetch('http://localhost:3001/delete/'+id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer '+token
                }
            });
            if(!response.ok){
                throw new Error('Failure to cancel appointment.');
            }
            const data = await response.json();
            console.log(data.message);
            setAppointments(currentAppointments => currentAppointments.filter(app => app._id !== id));
        }
        catch(error){
            console.error('Error cancelling appointment:', error);
        }
        
        //setAppointments(appointments.filter((_, i) => i !== index));
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
                        <div key={app._id} className="appointment">
                            <p><strong>Date:</strong> {new Date(app.dateTime).toLocaleString('en-US', { timeZonename: 'short' })}</p>
                            <p><strong>Name:</strong> {app.fullName}</p>
                            <p><strong>Notes:</strong> {app.reason}</p>
                            <button style={{ backgroundColor: 'red' }} onClick={() => handleCancel(app._id)}>Cancel</button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;
