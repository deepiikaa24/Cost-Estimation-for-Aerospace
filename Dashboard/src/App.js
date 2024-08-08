// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash';
import Breakdown from './components/Breakdown/Breakdown';
import History from './components/History/History';
import Orders from './components/Orders/Orders';
import Report from './components/Report/Report';
import RightSide from './components/RigtSide/RightSide';
import Sidebar from './components/Sidebar'; // Ensure correct import path

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/history" element={<History />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/report" element={<Report />} />
          </Routes>
          <RightSide />
        </Router>
      </div>
    </div>
  );
}

export default App;
