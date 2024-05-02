import React, { useState } from 'react';
import Dashboard from './Dashboard.js';
import Login from './loginSignup.js';
import AdminDashboard from './adminDashboard.js';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
