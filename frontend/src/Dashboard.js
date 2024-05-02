import React, { useState } from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Dashboard.css'
import './App.css'

function Dashboard(){
    const [appointmentData, setAppointmentData] = useState({
        dateTime: new Date(),
        fullName:'',
        reason:''
    });
    const [appointments, setAppointments] = useState([]);

    const handleInputChange = (e) => {
        setAppointmentData({...appointmentData, [e.target.name]:e.target.value});
    }

    const handleDateChange = (date) => {
        setAppointmentData({ ...appointmentData, dateTime: date });
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        // Add the new appointment to the list
        setAppointments([...appointments, appointmentData]);
        // Reset the form
        setAppointmentData({ dateTime: '', fullName: '', reason: '' });
    };

    const handleCancel = index => {
        // Remove the appointment from the list
        setAppointments(appointments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // SEND TO SERVER
    }

    const handleLogout = () => {
        // Simulate logout by clearing the appointments (or you could clear session/local storage)
        setAppointments([]);
        // Optionally redirect to login page or show login screen
        alert("You have been logged out."); // Placeholder for redirection
    };

    return (
        <div>
            <header>
                <h1>Scheduling System</h1>
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
                    <h2>My Appointments</h2>
                    {appointments.map((app,index) => (
                        <div key={index} className="appointment">
                            <p><strong>Date:</strong> {app.dateTime.toLocaleString('en-US', { timeZonename: 'short'})}</p>
                            <p><strong>Notes:</strong> {app.reason}</p>
                            <button style={{backgroundColor: 'red'}} onClick={()=>handleCancel(index)}>Cancel</button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;