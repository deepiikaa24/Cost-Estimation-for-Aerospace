import React, { useState, useEffect } from "react";
import "./Input.css";

// Sample data structure based on the provided Excel sheet
const materialAlloyTemperDensity = {
  ALUMINUM: {
    alloys: {
      2024: ["T0", "T3", "T351"],
      2124: ["T851"],
      6061: ["T6", "T651"],
      7050: ["T7451"],
      7075: ["T0", "T6"],
      7475: ["T7351"],
    },
    density: 2.7, // Example density for Aluminum in kg/m³
  },
  STEEL: {
    alloys: {
      4130: ["A", "B"],
      4340: ["C", "D"],
    },
    density: 7.85, // Example density for Steel in kg/m³
  },
  TITANIUM: {
    alloys: {
      "Ti-6AL-4V": ["H1000", "H1150"],
    },
    density: 4.5, // Example density for Titanium in kg/m³
  },
  // Add other materials, alloys, and densities here...
};

const Input = () => {
  const [formData, setFormData] = useState({
    partSize: "",
    length: "",
    thickness: "",
    width: "",
    diameter: "",
    material: "",
    alloy: "",
    temper: "",
    form: "",
    density: "",
    volume: "",
    weight: "",
  });

  const [alloys, setAlloys] = useState([]);
  const [tempers, setTempers] = useState([]);
  const [formType, setFormType] = useState("");

  // Update alloys and density when material changes
  useEffect(() => {
    if (formData.material) {
      const selectedMaterial = materialAlloyTemperDensity[formData.material];
      setAlloys(Object.keys(selectedMaterial.alloys));
      setFormData((prevData) => ({
        ...prevData,
        density: selectedMaterial.density,
        alloy: "",
        temper: "",
        volume: "",
        weight: "",
      }));
      setTempers([]); // Reset tempers when material changes
    }
  }, [formData.material]);

  // Update tempers when alloy changes
  useEffect(() => {
    if (formData.material && formData.alloy) {
      const selectedTempers =
        materialAlloyTemperDensity[formData.material].alloys[formData.alloy];
      setTempers(selectedTempers);
      setFormData((prevData) => ({ ...prevData, temper: "" }));
    }
  }, [formData.alloy]);

  // Update the dimension input fields based on form type (round, flat, bar, etc.)
  useEffect(() => {
    setFormType(formData.form);
    setFormData((prevData) => ({
      ...prevData,
      length: "",
      width: "",
      thickness: "",
      diameter: "",
      volume: "",
      weight: "",
    }));
  }, [formData.form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateWeightAndVolume = () => {
    let volume;
    if (formType === "Round") {
      const radius = formData.diameter / 2;
      volume = Math.PI * Math.pow(radius, 2) * formData.length; // Volume = πr²h
    } else {
      volume =
        formData.length *
        formData.width *
        formData.thickness; // Volume = l * w * h
    }

    const weight = volume * formData.density; // Weight = Volume * Density
    setFormData((prevData) => ({
      ...prevData,
      volume: volume.toFixed(2), // Keep two decimal places
      weight: weight.toFixed(2),   // Keep two decimal places
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit form data to the backend or handle it as required
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="Input">
      <form onSubmit={handleSubmit}>
        <div className="form-scroll">
          {/* Form Dropdown */}
          <div className="form-group">
            <label htmlFor="form">Form</label>
            <select
              id="form"
              name="form"
              value={formData.form}
              onChange={handleChange}
            >
              <option value="">Select form</option>
              <option value="Round">Round</option>
              <option value="Flat">Flat</option>
              <option value="Bar">Bar</option>
              <option value="Extrusion">Extrusion</option>
            </select>
          </div>

          {/* Dimension Fields */}
          {formType === "Round" ? (
            <div className="form-group">
              <label htmlFor="diameter">Diameter (m)</label>
              <input
                type="number"
                step="0.01"
                id="diameter"
                name="diameter"
                value={formData.diameter}
                onChange={handleChange}
                placeholder="Enter diameter in meters"
              />
              <label htmlFor="length">Length (m)</label>
              <input
                type="number"
                step="0.01"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length in meters"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="length">Length (m)</label>
              <input
                type="number"
                step="0.01"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length in meters"
              />
              <label htmlFor="width">Width (m)</label>
              <input
                type="number"
                step="0.01"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Enter width in meters"
              />
              <label htmlFor="thickness">Thickness (m)</label>
              <input
                type="number"
                step="0.01"
                id="thickness"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                placeholder="Enter thickness in meters"
              />
            </div>
          )}

          {/* Material Dropdown */}
          <div className="form-group">
            <label htmlFor="material">Material</label>
            <select
              id="material"
              name="material"
              value={formData.material}
              onChange={handleChange}
            >
              <option value="">Select Material</option>
              {Object.keys(materialAlloyTemperDensity).map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          {/* Alloy Dropdown */}
          <div className="form-group">
            <label htmlFor="alloy">Alloy</label>
            <select
              id="alloy"
              name="alloy"
              value={formData.alloy}
              onChange={handleChange}
              disabled={!formData.material}
            >
              <option value="">Select Alloy</option>
              {alloys.map((alloy) => (
                <option key={alloy} value={alloy}>
                  {alloy}
                </option>
              ))}
            </select>
          </div>

          {/* Temper Dropdown */}
          <div className="form-group">
            <label htmlFor="temper">Temper</label>
            <select
              id="temper"
              name="temper"
              value={formData.temper}
              onChange={handleChange}
              disabled={!formData.alloy}
            >
              <option value="">Select Temper</option>
              {tempers.map((temper) => (
                <option key={temper} value={temper}>
                  {temper}
                </option>
              ))}
            </select>
          </div>

          {/* Density Field (Auto-populated) */}
          <div className="form-group">
            <label htmlFor="density">Density (kg/m³)</label>
            <input
              type="text"
              id="density"
              name="density"
              value={formData.density}
              readOnly
              placeholder="Density will auto-populate"
            />
          </div>

          {/* Volume Field (Auto-populated) */}
          <div className="form-group">
            <label htmlFor="volume">Volume (m³)</label>
            <input
              type="text"
              id="volume"
              name="volume"
              value={formData.volume}
              readOnly
              placeholder="Volume will auto-populate"
            />
          </div>

          {/* Weight Field (Auto-populated) */}
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              readOnly
              placeholder="Weight will auto-populate"
            />
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={calculateWeightAndVolume}>
            Calculate Weight and Volume
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Input;


