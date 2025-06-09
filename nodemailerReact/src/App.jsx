// Designed and Developed with Luxury and Love by Yash Lalwani 

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ContactForm from './components/ContactForm'
import EmailLogs from './components/EmailLogs'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmailDashboard from './components/EmailDashboard'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactForm />} />
        <Route path="/emails" element={<EmailLogs/>} />
        <Route path="/emaildashboard" element={<EmailDashboard/>} />
       
      </Routes>
    </Router>
  );
 
}

export default App
