import React, { useState } from "react";
import axios from "axios";
import "./ParttoRM.css";

// Form component to collect necessary inputs and make predictions
const ParttoRM = ({ setPredictedRM, setSelectedForm }) => {
  const [formData, setFormData] = useState({
    length: "",
    thickness: "",
    width: "",
    form: "",
  });

  const [localPredictedRM, setLocalPredictedRM] = useState({
    rmThickness: "",
    rmWidth: "",
    rmLength: "",
    volume: "",
  });

  // Update form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update the selected form state in App.js
    if (name === "form") {
      setSelectedForm(value);
    }
  };

  const predictRM = async () => {
    try {
      console.log("Form data being sent to the backend:", formData);

      // Send form data to the backend for predicting RM dimensions
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response received from backend:", response.data);

      const { rmThickness, rmWidth, rmLength } = response.data.predicted_dimensions;

      // Update the local state with the predicted RM dimensions
      setLocalPredictedRM({
        rmThickness: rmThickness.toFixed(2),
        rmWidth: rmWidth.toFixed(2),
        rmLength: rmLength.toFixed(2),
        volume: (rmThickness * rmWidth * rmLength).toFixed(2), // Volume calculation
      });

      // Update the shared state in App.js with the predicted dimensions
      setPredictedRM({
        rmThickness: rmThickness.toFixed(2),
        rmWidth: rmWidth.toFixed(2),
        rmLength: rmLength.toFixed(2),
      });
    } catch (error) {
      console.error("Error in prediction:", error);
    }
  };

  return (
    <div className="ParttoRM">
      <form>
        <div className="parttoRM-form-group">
          <label htmlFor="form">Form</label>
          <select
            id="form"
            name="form"
            value={formData.form}
            onChange={handleChange}
            className="parttoRM-select"
          >
            <option value="">Select form</option>
            <option value="Round">Round</option>
            <option value="Flat">Flat</option>
            <option value="Bar">Bar</option>
            <option value="EXT">Extrusion</option>
          </select>
        </div>

        <div className="parttoRM-form-group">
          <label htmlFor="length">Length (m)</label>
          <input
            type="number"
            step="0.01"
            id="length"
            name="length"
            value={formData.length}
            onChange={handleChange}
            placeholder="Enter length in meters"
            className="parttoRM-input"
          />
        </div>

        <div className="parttoRM-form-group">
          <label htmlFor="width">Width (m)</label>
          <input
            type="number"
            step="0.01"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleChange}
            placeholder="Enter width in meters"
            className="parttoRM-input"
          />
        </div>

        <div className="parttoRM-form-group">
          <label htmlFor="thickness">Thickness (m)</label>
          <input
            type="number"
            step="0.01"
            id="thickness"
            name="thickness"
            value={formData.thickness}
            onChange={handleChange}
            placeholder="Enter thickness in meters"
            className="parttoRM-input"
          />
        </div>

        <div className="parttoRM-button-group">
          <button type="button" onClick={predictRM} className="parttoRM-button">
            Predict RM Dimensions
          </button>
        </div>
      </form>

      {localPredictedRM.rmThickness && (
        <div className="prediction-result">
          <h3>Predicted Raw Material Dimensions:</h3>
          <p>RM Thickness: {localPredictedRM.rmThickness} m</p>
          <p>RM Width: {localPredictedRM.rmWidth} m</p>
          <p>RM Length: {localPredictedRM.rmLength} m</p>
          <p>Volume: {localPredictedRM.volume} m³</p>
        </div>
      )}
    </div>
  );
};

export default ParttoRM;

