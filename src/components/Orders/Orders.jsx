import React from "react";
import "./Orders.css";

// Importing images
import Rf1 from "../../imgs/Rf1.jpeg";
import Rf2 from "../../imgs/Rf2.jpeg";
import Rf3 from "../../imgs/Rf3.jpeg";
import Rf4 from "../../imgs/Rf4.jpeg";
import Xgb1 from "../../imgs/Xgb1.jpeg";
import Xgb2 from "../../imgs/Xgb2.jpeg";
import Xgb3 from "../../imgs/Xgb3.jpeg";
import Xgb4 from "../../imgs/Xgb4.jpeg";

const Orders = () => {
  return (
    <div className="Orders">
      <h2>Explainable AI Visualizations</h2>

      {/* Random Forest Section */}
      <h3>Random Forest Model</h3>
      <div className="scroll-container">
        <img src={Rf1} alt="Random Forest Graph 1" className="graph-image" />
        <img src={Rf2} alt="Random Forest Graph 2" className="graph-image" />
        <img src={Rf3} alt="Random Forest Graph 3" className="graph-image" />
        <img src={Rf4} alt="Random Forest Graph 4" className="graph-image-small" />
      </div>

      {/* XGBoost Section */}
      <h3>XGBoost Model</h3>
      <div className="scroll-container">
        <img src={Xgb1} alt="XGBoost Graph 1" className="graph-image" />
        <img src={Xgb2} alt="XGBoost Graph 2" className="graph-image" />
        <img src={Xgb3} alt="XGBoost Graph 3" className="graph-image" />
        <img src={Xgb4} alt="XGBoost Graph 4" className="graph-image-small" />
      </div>
    </div>
  );
};

export default Orders;
