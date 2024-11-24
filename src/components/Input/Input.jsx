import React, { useState, useEffect } from "react";   
import axios from "axios"; // Import axios for making API calls
import { Line } from "react-chartjs-2";  // Import Line chart from react-chartjs-2
import { Chart as ChartJS } from "chart.js/auto";
import "./Input.css";
import { color } from "chart.js/helpers";

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
    partPrice: "",
    netPrice: "",
    netValue: "",
  });
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isRecalculated, setisRecalculated] = useState(false); // Flag to control display of calculated values
  const [alloys, setAlloys] = useState([]);
  const [tempers, setTempers] = useState([]);
  const [importType, setImportType] = useState('Domestic');
  const [freightCharge, setFreightCharge] = useState(0);
  const [rejectionCharge, setRejectionCharge] = useState(0);

  const rejectionRates = {
    AL: 0.02,  // Aluminium
    SS: 0.025, // Steel & PH
    Ti: 0.03   // Titanium
  };
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{
      label: 'Price vs Quantity',
      data: [],
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      fill: false,
    }],
  });
  const [RecalculatedValues, setRecalculatedValues] = useState({
    partPrice: 0,
    netPrice: 0,
    netValue: 0,
  });
  const handleRecalculate = () => {
    const { quantity, weight } = formData;

    // Perform calculations
    const partPrice = (selectedPrice * formData.weight).toFixed(2);
    const netPrice = ((selectedPrice * formData.weight) + parseFloat(freightCharge) + parseFloat(rejectionCharge)).toFixed(2);
    const netValue = (netPrice * formData.quantity).toFixed(2);

    setRecalculatedValues({
      partPrice,
      netPrice,
      netValue,
    });
    setisRecalculated(true); // Set flag to true
  };
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      length: predictedRM?.rmLength || "",
      width: predictedRM?.rmWidth || "",
      thickness: predictedRM?.rmThickness || "",
      diameter: selectedForm === "RND" ? predictedRM?.rmWidth || "" : "",
      form: selectedForm,
    }));
  }, [predictedRM, selectedForm]);
 
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
      setTempers([]);
    }
  }, [formData.material]);

  useEffect(() => {
    if (formData.material && formData.alloy) {
      const selectedTempers =
        materialAlloyTemperDensity[formData.material].alloys[formData.alloy];
      setTempers(selectedTempers);
      setFormData((prevData) => ({ ...prevData, temper: "" }));
    }
  }, [formData.alloy]);

  const calculateFreightPercentage = (weight) => {
    if (weight >= 10000) return { Domestic: 0.02, Import: 0.05 };
    if (weight >= 1000) return { Domestic: (2 + Math.floor((10000 - weight) / 1000)) / 100, Import: (5 + Math.floor((10000 - weight) / 1000)) / 100 };
    if (weight >= 100) return { Domestic: (11 + Math.floor((1000 - weight) / 100)) / 100, Import: (14 + Math.floor((1000 - weight) / 100)) / 100 };
    if (weight >= 10) return { Domestic: (20 + Math.floor((100 - weight) / 10)) / 100, Import: (23 + Math.floor((100 - weight) / 10)) / 100 };
    return { Domestic: (29 + (10 - weight)) / 100, Import: (32 + (10 - weight)) / 100 };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "material") {
      const materialKey = value;
      const rejectionRate = rejectionRates[materialKey] || 0;
      setRejectionCharge((formData.predictedPrice * rejectionRate).toFixed(2));
    }

    if (name === "weight") {
      const weight = Number(value);
      const freightPercentage = calculateFreightPercentage(weight);
      setFreightCharge((formData.predictedPrice * freightPercentage[importType]).toFixed(2));
    }
  };
  const handleImportTypeChange = (e) => {
    setImportType(e.target.value);
    const freightPercentage = calculateFreightPercentage(formData.weight);
    setFreightCharge((formData.predictedPrice * freightPercentage[e.target.value]).toFixed(2));
  };

  const calculateWeightAndVolume = () => { 
    let volume;
    if (formData.form === "RND") {
      const radius = formData.diameter / 2;
      volume = Math.PI * Math.pow(radius, 2) * formData.length;
    } else if (formData.form === "TUBE") {
      const outerRadius = formData.outerDiameter / 2;
      const innerRadius = formData.innerDiameter / 2;
      volume = Math.PI * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) * formData.length;
    } else {
      volume = formData.length * formData.width * formData.thickness;
    }

    volume = volume * 16.387064;
    const weight = (volume * formData.density) / 1000;

    setFormData((prevData) => ({
      ...prevData,
      volume: volume.toFixed(6),
      weight: weight.toFixed(2),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict_price", formData, {
        headers: { "Content-Type": "application/json" },
      });
      const { prices_by_quantity } = response.data;
      const { quantity_range } = response.data;
      setGraphData({
        labels: quantity_range,
        datasets: [
          {
            label: 'Price vs Quantity',
            font: {
              size: 16, // Adjust font size as needed
              color: "red"
            },
            data: prices_by_quantity,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: true,
          },
        ],
      });
      const predictedPrice = parseFloat(response.data.predicted_price);
      const freightPercentage = calculateFreightPercentage(formData.weight)[importType];
      const rejectionRate = rejectionRates[formData.material] || 0;
      const freightCharge = (predictedPrice * freightPercentage).toFixed(2);
      const rejectionCharge = (predictedPrice * rejectionRate).toFixed(2);
      const partPrice = (predictedPrice * formData.weight).toFixed(2);
      const netPrice = ((predictedPrice * formData.weight) + parseFloat(freightCharge) + parseFloat(rejectionCharge)).toFixed(2);
      const netValue = (netPrice * formData.quantity).toFixed(2);

      setFormData((prevData) => ({
        ...prevData,
        predictedPrice: predictedPrice.toFixed(2),
        partPrice,
        netPrice,
        netValue,
      }));
      setFreightCharge(freightCharge);
      setRejectionCharge(rejectionCharge);

      // Update graph data for price vs quantity
      const newGraphData = { ...graphData };
      newGraphData.labels = quantity_range; // Use the quantity range as labels
      newGraphData.datasets[0].data = prices_by_quantity; // Use the predicted prices as data
      setGraphData(newGraphData);

      await axios.post("http://localhost:3000/update-sheet", { ...formData, predictedPrice, netPrice, netValue,freightCharge,rejectionCharge }, {
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Error in predicting price or updating Google Sheet:", error);
    }
  };

  return (
    <div className="Input" style={{ display: "flex" }}>
      <div style={{ width: "50%", padding: "10px" }}>
        <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-scroll">
        <div className="form-group">
            <label htmlFor="importType">Import Type</label>
            <select
              id="importType"
              value={importType}
              onChange={handleImportTypeChange}
            >
              <option value="Domestic">Domestic</option>
              <option value="Import">Import</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="form">Form</label>
            <select id="form" name="form" value={formData.form} onChange={handleChange}>
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
              disabled={!alloys.length}
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
              disabled={!tempers.length}
            >
              <option value="">Select Temper</option>
              {tempers.map((temper) => (
                <option key={temper} value={temper}>
                  {temper}
                </option>
              ))}
            </select>
          </div>

          {/* Spec Dropdown */}
          <div className="form-group">
            <label htmlFor="spec">Spec</label>
            <select
              id="spec"
              name="spec"
              value={formData.spec}
              onChange={handleChange}
            >
              <option value="">Select a Spec</option>
              <option value="ABS 5052">ABS 5052</option>
              <option value="ABS 5324">ABS 5324</option>
              <option value="ABS 5455">ABS 5455</option>
              <option value="AMS 4027">AMS 4027</option>
              <option value="AMS 4050">AMS 4050</option>
              <option value="AMS 4078">AMS 4078</option>
              <option value="AMS 4117">AMS 4117</option>
              <option value="AMS 4124">AMS 4124</option>
              <option value="AMS 4342">AMS 4342</option>
              <option value="AMS 4534">AMS 4534</option>
              <option value="AMS 4596">AMS 4596</option>
              <option value="AMS 4625">AMS 4625</option>
              <option value="AMS 4640">AMS 4640</option>
              <option value="AMS 4880">AMS 4880</option>
              <option value="AMS 4911">AMS 4911</option>
              <option value="AMS 4928">AMS 4928</option>
              <option value="AMS 5622">AMS 5622</option>
              <option value="AMS 5629">AMS 5629</option>
              <option value="AMS 5630">AMS 5630</option>
              <option value="AMS 5639">AMS 5639</option>
              <option value="AMS 5640">AMS 5640</option>
              <option value="AMS 5643">AMS 5643</option>
              <option value="AMS 5647">AMS 5647</option>
              <option value="AMS 5659">AMS 5659</option>
              <option value="AMS 5848">AMS 5848</option>
              <option value="AMS 6345">AMS 6345</option>
              <option value="AMS 6346">AMS 6346</option>
              <option value="AMS 6348">AMS 6348</option>
              <option value="AMS 6414">AMS 6414</option>
              <option value="ASNA 3406">ASNA 3406</option>
              <option value="ASTM A276">ASTM A276</option>
              <option value="ASTM A479">ASTM A479</option>
              <option value="ASTM A582">ASTM A582</option>
              <option value="ASTM B209">ASTM B209</option>
              <option value="ASTM B211">ASTM B211</option>
              <option value="ASTM B221">ASTM B221</option>
              <option value="ASTM D6778">ASTM D6778</option>
              <option value="BMS 7-122">BMS 7-122</option>
              <option value="BMS 7-214">BMS 7-214</option>
              <option value="BMS 7-240">BMS 7-240</option>
              <option value="BMS 7-26">BMS 7-26</option>
              <option value="BMS 7-323">BMS 7-323</option>
              <option value="BMS 7-323 TY1">BMS 7-323 TY1</option>
              <option value="BMS 7-323 TYIII">BMS 7-323 TYIII</option>
              <option value="BMS7-371">BMS7-371</option>
              <option value="MIL-T-9047">MIL-T-9047</option>
              <option value="AMS-QQ-A-200/3">AMS-QQ-A-200/3</option>
              <option value="AMS-QQ-A-200/8">AMS-QQ-A-200/8</option>
              <option value="AMS-QQ-A-200/11">AMS-QQ-A-200/11</option>
              <option value="AMS-QQ-A-225/6">AMS-QQ-A-225/6</option>
              <option value="AMS-QQ-A-225/8">AMS-QQ-A-225/8</option>
              <option value="AMS-QQ-A-225/9">AMS-QQ-A-225/9</option>
              <option value="AMS-QQ-A-250/4">AMS-QQ-A-250/4</option>
              <option value="AMS-QQ-A-250/5">AMS-QQ-A-250/5</option>
              <option value="AMS-QQ-A-250/11">AMS-QQ-A-250/11</option>
              <option value="AMS-QQ-A-250/12">AMS-QQ-A-250/12</option>
              <option value="AMS-QQ-A-250/30">AMS-QQ-A-250/30</option>
              <option value="AMS-QQ-S-763">AMS-QQ-S-763</option>
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
              value={`$${formData.predictedPrice}`}
              readOnly
              placeholder="Predicted price"
            />
          </div>

          {/* Freight and Rejection Charges */}
          <div className="form-group">
            <label>Freight Charge:</label>
            <input type="text" readOnly value={`$${freightCharge}`} />

            <label>Rejection Charge:</label>
            <input type="text" readOnly value={`$${rejectionCharge}`} />
          </div>

          {/* Net Price and Net Value */}
          <div className="form-group">
            <label><b>Part Price:</b></label>
            <div id="partPrice">${formData.partPrice}</div>

            <label><b>Net Price:</b></label>
            <div id="netPrice">${formData.netPrice}</div>

            <label><b>Net Value:</b></label>
            <div id="netValue">${formData.netValue}</div>
          </div>

          <button type="button" onClick={calculateWeightAndVolume}>
            Calculate Weight and Volume
          </button>
          <button type="submit">Predict Price</button>
        </div>
      </form>
      </div>
      {/* Graph */}
      <div className="graph-container">
      <Line
          data={graphData}
          options={{
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Quantity',
                  font: {
                    size: 16,},
                    color: "black",
                },
                ticks: {
                  color: "black", // X-axis label color
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Price',
                  font: {
                    size: 16,},
                    color: "black",
                  },
                ticks: {
                  color: "black", // X-axis label color
                },
                },
            },
            plugins: {
              title: {
                display: true,
                text: 'Price vs Quantity',
                color: "black",
                font: {
                  size: 20,
                },
              },
            },
            onClick: (event, chartElement) => {
              if (chartElement && chartElement.length > 0) {
                const clickedIndex = chartElement[0].index; // Index of clicked data point
                const datasetIndex = chartElement[0].datasetIndex; // Dataset index
                const newPrice =
                  graphData.datasets[datasetIndex].data[clickedIndex]; // Retrieve data value
        
                const roundedPrice = parseFloat(newPrice).toFixed(2); // Round to 2 decimals
        
                setSelectedPrice(roundedPrice); // Update selected price
                setisRecalculated(false); // Reset the flag when a new price is selected
              } else {
                console.warn('No data point clicked.');
              }
            },
          }}
        />
        <p>Selected Price: ${selectedPrice}</p> {/* Display the selected price */}
          {/* Conditionally Display Calculated Results */}
      {isRecalculated && (
        <div>
          <p>Recalculated Part Price: ${RecalculatedValues.partPrice}</p>
          <p>Recalculated Net Price: ${RecalculatedValues.netPrice}</p>
          <p>Recalculated Net Value: ${RecalculatedValues.netValue}</p>
        </div>
      )}
       <button className="recalculate-button" onClick={handleRecalculate}>Recalculate Price</button>
      </div>

    </div>
  );
};
export default Input;


