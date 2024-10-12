// src/App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash';
import Breakdown from './components/Breakdown/Breakdown';
import History from './components/History/History';
import Orders from './components/Orders/Orders';
import Input from './components/Input/Input';
import RightSide from './components/RigtSide/RightSide';
import Sidebar from './components/Sidebar'; // Ensure correct import path
import ParttoRM from './components/ParttoRM/ParttoRM';

function App() {
  // Shared state to store predicted RM dimensions and form
  const [predictedRM, setPredictedRM] = useState({
    rmThickness: "",
    rmWidth: "",
    rmLength: "",
  });

  const [selectedForm, setSelectedForm] = useState("");

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

            {/* Pass setPredictedRM and setSelectedForm as props to ParttoRM */}
            <Route
              path="/ParttoRM"
              element={
                <ParttoRM
                  setPredictedRM={setPredictedRM}
                  setSelectedForm={setSelectedForm}
                />
              }
            />

            {/* Pass predictedRM and selectedForm as props to Input */}
            <Route
              path="/Input"
              element={
                <Input
                  predictedRM={predictedRM}
                  selectedForm={selectedForm}
                />
              }
            />
          </Routes>
          <RightSide />
        </Router>
      </div>
    </div>
  );
}

export default App;


