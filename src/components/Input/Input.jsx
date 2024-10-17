import React, { useState, useEffect } from "react";  
import axios from "axios"; // Import axios for making API calls
import "./Input.css";

// Sample data structure based on the provided Excel sheet
const materialAlloyTemperDensity = {
  AL: {
    alloys: {
      2024: ["T0","T3", "T351","T3511","T4"],
      2124: ["T851"],
      6061: ["T4","T0","T6", "T651","T6511","T652"],
      7050: ["T7451","T7651"],
      7075: ["T6","T0","T76","T651","T7351","T73511"],
      7475: ["T7351"],
    },
    density: 2700, // Example density for Aluminum in kg/m³
  },
  SS: {
    alloys: {
      301: ["A", "B"],
      303: ["A", "B"],
      "303SE": ["A", "B"],
      304: ["A", "B"],
      "304L": ["A", "B"],
      316: ["A", "B"],
      "316L": ["A", "B"],
      321: ["A", "B"],
      "440C": ["A", "B"],
      "13-8 MO": ["A", "B"],
      "15-5 PH": ["A", "B"],
      "17-A PH": ["A", "B"],
      4130: ["A", "B"],
      4340: ["ANNEALED", "B"],
      
    },
    density: 7850, // Example density for Steel in kg/m³
  },
  TI: {
    alloys: {
      "Ti-6AL-4V": ["H1000", "H1150"],
    },
    density: 4507, // Example density for Titanium in kg/m³
  },
  // Add other materials, alloys, and densities here...
};

const Input = ({ predictedRM, selectedForm }) => {
  const [formData, setFormData] = useState({
    length: predictedRM?.rmLength || "",
    width: predictedRM?.rmWidth || "",
    thickness: predictedRM?.rmThickness || "",
    diameter: selectedForm === "RND" ? predictedRM?.rmWidth || "" : "",
    form: selectedForm || "",
    material: "",
    alloy: "",
    temper: "",
    density: "",
    volume: "",
    weight: "",
    quantity: "",
    predictedPrice: "",
    netPrice: "",
    netValue: "",
  });

  const [alloys, setAlloys] = useState([]);
  const [tempers, setTempers] = useState([]);
  const [formType, setFormType] = useState(selectedForm || "");

  // Update form data when predictedRM or selectedForm changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      length: predictedRM?.rmLength || "",
      width: predictedRM?.rmWidth || "",
      thickness: predictedRM?.rmThickness || "",
      diameter: selectedForm === "RND" ? predictedRM?.rmWidth || "" : "",
      form: selectedForm,
    }));
    setFormType(selectedForm);
  }, [predictedRM, selectedForm]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateWeightAndVolume = () => { 
    let volume;
    if (formType === "RND") {
        const radius = formData.diameter / 2;
        volume = Math.PI * Math.pow(radius, 2) * formData.length; // Volume = πr²h
    } else {
        volume = formData.length * formData.width * formData.thickness; // Volume = l * w * h
    }

    // Convert cubic inches to cubic meters (1 cubic inch = 0.000016387064 cubic meters)
    volume = volume * 0.000016387064;

    const weight = volume * formData.density; // Weight in kg = Volume * Density

    // Convert weight to grams (1 kg = 1000 g)
    const weightInGrams = weight;

    setFormData((prevData) => ({
        ...prevData,
        volume: volume.toFixed(6), // Six decimal places for volume in m³
        weight: weightInGrams.toFixed(2), // Two decimal places for weight in grams
    }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data submitted:", formData);

      // Send form data to the backend to get the predicted price using Random Forest model
      const response = await axios.post("http://127.0.0.1:5000/predict_price", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response received from backend:", response.data);

      const predictedPrice = response.data.predicted_price.toFixed(2);
      const netPrice = (predictedPrice * formData.weight).toFixed(2);
      const netValue = (netPrice * formData.quantity).toFixed(2);

      // Update the predicted price in the state
      setFormData((prevData) => ({
        ...prevData,
        predictedPrice,
        netPrice,
        netValue,
      }));
    } catch (error) {
      console.error("Error in predicting price:", error);
    }
  };

  return (
    <div className="Input">
      <form onSubmit={handleSubmit}>
        <div className="form-scroll">
          <div className="form-group">
            <label htmlFor="form">Form</label>
            <select
              id="form"
              name="form"
              value={formData.form}
              onChange={handleChange}
            >
              <option value="">Select form</option>
              <option value="RND">RND</option>
              <option value="FLAT">FLAT</option>
              <option value="BAR">BAR</option>
              <option value="EXT">EXT</option>
              <option value="PLATE">PLATE</option> {/* Added plate option */}
            </select>
          </div>
  
          {/* Render dimensions based on form type */}
          {formData.form === "RND" ? (
            <div className="form-group">
              <label htmlFor="diameter">Diameter (in)</label>
              <input
                type="number"
                step="0.01"
                id="diameter"
                name="diameter"
                value={formData.diameter}
                onChange={handleChange}
                placeholder="Enter diameter"
              />
              <label htmlFor="length">Length (in)</label>
              <input
                type="number"
                step="0.01"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="length">Length (in)</label>
              <input
                type="number"
                step="0.01"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="Enter length"
              />
              <label htmlFor="width">Width (in)</label>
              <input
                type="number"
                step="0.01"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Enter width"
              />
              <label htmlFor="thickness">Thickness (in)</label>
              <input
                type="number"
                step="0.01"
                id="thickness"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                placeholder="Enter thickness"
              />
            </div>
          )}
  
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
              disabled={!alloys.length} // Disable if no alloys are available
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
              disabled={!tempers.length} // Disable if no tempers are available
            >
              <option value="">Select Temper</option>
              {tempers.map((temper) => (
                <option key={temper} value={temper}>
                  {temper}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="spec">Spec</label>
            <input
              type="text"
              id="spec"
              name="spec"
              value={formData.spec}
              onChange={handleChange}
              placeholder="Enter spec"
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />
          </div>
  
          {/* Display calculated volume, weight, and predicted price */}
          <div className="form-group">
            <label htmlFor="volume">Volume (m³)</label>
            <input
              type="text"
              id="volume"
              name="volume"
              value={formData.volume}
              readOnly
              placeholder="Calculated volume"
            />
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              readOnly
              placeholder="Calculated weight"
            />
            <label htmlFor="predictedPrice">Predicted Price per kg</label>
            <input
              type="text"
              id="predictedPrice"
              name="predictedPrice"
              value={formData.predictedPrice}
              readOnly
              placeholder="Predicted price"
            />
            </div>

            <label htmlFor="netPrice">Net Price : </label>
            <div id="netPrice" name="netPrice">
              {formData.netPrice || ""}
            </div>

            <label htmlFor="netValue">Net Value : </label>
            <div id="netValue" name="netValue">
              {formData.netValue || ""}
            </div>

          <button type="button" onClick={calculateWeightAndVolume}>
            Calculate Weight and Volume
          </button>
          <button type="submit">Predict Price</button>
        </div>
      </form>
    </div>
  );
};

export default Input;
