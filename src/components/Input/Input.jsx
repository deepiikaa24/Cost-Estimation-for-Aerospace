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
    density: 2.7, // Example density for Aluminum in kg/m³
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
    density: 7.8, // Example density for Steel in kg/m³
  },
  TI: {
    alloys: {
      "Ti-6AL-4V": ["H1000", "H1150"],
    },
    density: 4.5, // Example density for Titanium in kg/m³
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

    // Check if the form is Round (RND), Tube, or another shape (like Rectangular)
    if (formData.form === "RND") {
        const radius = formData.diameter / 2;
        volume = Math.PI * Math.pow(radius, 2) * formData.length; // Volume = πr²h for cylindrical parts
    } else if (formData.form === "TUBE") {
        const outerRadius = formData.outerDiameter / 2;
        const innerRadius = formData.innerDiameter / 2;
        volume = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * formData.length; // Volume = π(outerRadius² - innerRadius²) * length for tubes
    } else {
        volume = formData.length * formData.width * formData.thickness; // Volume = l * w * h for rectangular parts
    }

    // Convert cubic inches to cubic centimeters (1 cubic inch = 16.387064 cubic centimeters)
    volume = volume * 16.387064;

    // Weight in grams = Volume in cm³ * Density in g/cm³
    const weight = (volume * formData.density)/ 1000;

    setFormData((prevData) => ({
        ...prevData,
        volume: volume.toFixed(6), // Six decimal places for volume in cm³
        weight: weight.toFixed(2), // Two decimal places for weight in grams
    }));
};




const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Form data submitted:", formData);

    // Step 1: Predict price using Random Forest model
    const response = await axios.post("http://127.0.0.1:5000/predict_price", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response received from backend:", response.data);

    // Step 2: Update formData with the predicted values
    const predictedPrice = response.data.predicted_price.toFixed(2);
    const netPrice = (predictedPrice * formData.weight).toFixed(2);
    const netValue = (netPrice * formData.quantity).toFixed(2);

    const updatedFormData = {
      ...formData,
      predictedPrice,
      netPrice,
      netValue,
    };

    setFormData(updatedFormData);

    // Step 3: Append updated formData to Google Sheet
    await axios.post("http://localhost:3000/update-sheet", updatedFormData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Form data appended to Google Sheet");

  } catch (error) {
    console.error("Error in predicting price or updating Google Sheet:", error);
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
              <option value="PLATE">PLATE</option>
              <option value="TUBE">TUBE</option> 
              <option value="SHEET">SHEET</option>
              <option value="FORG">FORG</option>
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
) : formData.form === "TUBE" ? (
  <div className="form-group">
    <label htmlFor="outerDiameter">Outer Diameter (in)</label>
    <input
      type="number"
      step="0.01"
      id="outerDiameter"
      name="outerDiameter"
      value={formData.outerDiameter}
      onChange={handleChange}
      placeholder="Enter outer diameter"
    />
    <label htmlFor="innerDiameter">Inner Diameter (in)</label>
    <input
      type="number"
      step="0.01"
      id="innerDiameter"
      name="innerDiameter"
      value={formData.innerDiameter}
      onChange={handleChange}
      placeholder="Enter inner diameter"
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
  <select
    id="spec"
    name="spec"
    value={formData.spec}
    onChange={handleChange}
  >
    <option value="">Select a Spec</option>
    <option value="BMS7-371">BMS7-371</option>
    <option value="AMS5659 TYPE I">AMS5659 TYPE I</option>
    <option value="AMS5659 TYPE II">AMS5659 TYPE II</option>
    <option value="ABS5052">ABS5052</option>
    <option value="ABS5073A">ABS5073A</option>
    <option value="ABS5324">ABS5324</option>
    <option value="ABS5455">ABS5455</option>
    <option value="AMS5659">AMS5659</option>
    <option value="AMS-WW-T-700/3">AMS-WW-T-700/3</option>
    <option value="AMS4027">AMS4027</option>
    <option value="AMS4050">AMS4050</option>
    <option value="AMS4078">AMS4078</option>
    <option value="AMS4082">AMS4082</option>
    <option value="AMS4117">AMS4117</option>
    <option value="AMS4124">AMS4124</option>
    <option value="AMS4342">AMS4342</option>
    <option value="AMS4534">AMS4534</option>
    <option value="AMS4596">AMS4596</option>
    <option value="AMS4625">AMS4625</option>
    <option value="AMS4640">AMS4640</option>
    <option value="AMS4880">AMS4880</option>
    <option value="AMS4911">AMS4911</option>
    <option value="AMS4928">AMS4928</option>
    <option value="AMS5599">AMS5599</option>
    <option value="AMS5622">AMS5622</option>
    <option value="AMS5629">AMS5629</option>
    <option value="AMS5630">AMS5630</option>
    <option value="AMS5639">AMS5639</option>
    <option value="AMS5640">AMS5640</option>
    <option value="AMS5643">AMS5643</option>
    <option value="AMS5647">AMS5647</option>
    <option value="AMS5848C">AMS5848C</option>
    <option value="AMS6345">AMS6345</option>
    <option value="AMS6346">AMS6346</option>
    <option value="AMS6348">AMS6348</option>
    <option value="AMS6360">AMS6360</option>
    <option value="AMS6414">AMS6414</option>
    <option value="AMS 4124">AMS 4124</option>
    <option value="AMS-QQ-A-200/11">AMS-QQ-A-200/11</option>
    <option value="AMS-QQ-A-250/12">AMS-QQ-A-250/12</option>
    <option value="AMS-QQ-A-250/4">AMS-QQ-A-250/4</option>
    <option value="ASNA3406">ASNA3406</option>
    <option value="ASTM A240">ASTM A240</option>
    <option value="ASTM A276">ASTM A276</option>
    <option value="ASTM A479">ASTM A479</option>
    <option value="ASTM A582">ASTM A582</option>
    <option value="ASTM B209">ASTM B209</option>
    <option value="ASTM B211">ASTM B211</option>
    <option value="ASTM B221">ASTM B221</option>
    <option value="ASTM D6778">ASTM D6778</option>
    <option value="BAC1501-100153">BAC1501-100153</option>
    <option value="BMS 7-122">BMS 7-122</option>
    <option value="BMS 7-214">BMS 7-214</option>
    <option value="BMS 7-240">BMS 7-240</option>
    <option value="BMS 7-323">BMS 7-323</option>
    <option value="BMS 7-323 Type 1">BMS 7-323 Type 1</option>
    <option value="BMS 7-323 Type III">BMS 7-323 Type III</option>
    <option value="EN573-3">EN573-3</option>
    <option value="MIL-T-9047">MIL-T-9047</option>
    <option value="AMS-QQ-A-200/3">AMS-QQ-A-200/3</option>
    <option value="AMS-QQ-A-200/8">AMS-QQ-A-200/8</option>
    <option value="AMS-QQ-A-225/6">AMS-QQ-A-225/6</option>
    <option value="AMS-QQ-A-225/8">AMS-QQ-A-225/8</option>
    <option value="AMS-QQ-A-225/9">AMS-QQ-A-225/9</option>
    <option value="AMS-QQ-A-250/11A">AMS-QQ-A-250/11A</option>
    <option value="AMS-QQ-A-250/30">AMS-QQ-A-250/30</option>
    <option value="AMS-QQ-A-250/5">AMS-QQ-A-250/5</option>
    <option value="QQ-S-763">QQ-S-763</option>
  </select>
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
            <label htmlFor="volume">Volume (cm³)</label>
            <input
              type="text"
              id="volume"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              placeholder="Calculated volume"
            />
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
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
