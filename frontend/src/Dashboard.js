// User Dashboard

/*
TODO:
- Load current user's appointments from database into appointments
- Finish logout button and redirect to login page
- Send new appointments to server to put them into database
*/

import React, { useState } from "react";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './Dashboard.css'
import './App.css'
import { useNavigate } from "react-router-dom";

function Dashboard(){
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const [appointmentData, setAppointmentData] = useState({
        dateTime: new Date(),
        fullName:'',
        reason:''
    });
    const [appointments, setAppointments] = useState([]);//Load appointments into here
    const [convertData, setConvertData] = useState({
        dateTime: '',
        fullName:'',
        reason:''
    });
    const handleInputChange = (e) => {
        setAppointmentData({...appointmentData, [e.target.name]:e.target.value});
    }

    const handleDateChange = (date) => {
        setAppointmentData({ ...appointmentData, dateTime: date });
    };

    const handleSchedule = (e) => {
        e.preventDefault();
        const dateTimeString = new Date(appointmentData.dateTime).toLocaleString('en-US', { timeZonename: 'short'});
        setAppointments([...appointments, appointmentData]); // Add new appointments to list
        setAppointmentData({ dateTime: '', fullName: '', reason: '' }); // Reset form

        const formatedDate = {...appointmentData, dateTime: dateTimeString};
        fetch('http://localhost:3001/scheduleAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            body: JSON.stringify(formatedDate)
        }).then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                throw new Error('Failed to schedule appointment.');
            }
        }).then(data => console.log(data.message))
        .catch(error => console.error('Error submitting appointment:',error));
    };

    const handleCancel = index => {
        setAppointments(appointments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // SEND TO SERVER
    }

    const handleLogout = () => {
        setAppointments([]); //clear apt
        localStorage.removeItem('userToken');
        navigate('/');
    };

    return (
        <div>
            <header>
                <h1>Dashboard</h1>
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