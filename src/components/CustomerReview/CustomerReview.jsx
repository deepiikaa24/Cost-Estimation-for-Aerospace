import React, { useState } from "react";
import Chart from "react-apexcharts";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import "./CustomerReview.css";

// Main CustomerReview Component
const CustomerReview = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCustomerReview setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCustomerReview setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

// Compact CustomerReview
function CompactCustomerReview({ setExpanded }) {
  const data = {
    series: [
      {
        name: "RM Rate",
        data: [10, 50, 30, 90, 40, 120, 100],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      yaxis: {
        show: false,
      },
      toolbar: {
        show: false,
      },
    },
  };

  return (
    <motion.div
      className="CompactCustomerReview"
      onClick={setExpanded}
      layoutId="expandableCustomerReview"
    >
      <Chart options={data.options} series={data.series} type="area" />
      <span>RM Cost</span>
    </motion.div>
  );
}

// Expanded CustomerReview
function ExpandedCustomerReview({ setExpanded }) {
  const [material, setMaterial] = useState('All');
  const [alloy, setAlloy] = useState('All');

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
    // Update the graph data based on the selected material
  };

  const handleAlloyChange = (event) => {
    setAlloy(event.target.value);
    // Update the graph data based on the selected alloy
  };

  const data = {
    series: [
      {
        name: "RM Rate",
        data: 
          material === "All" && alloy === "All"
            ? [10, 50, 30, 90, 40, 120, 100]
            : material === "Material1" && alloy === "Alloy1"
            ? [15, 60, 35, 95, 45, 130, 110]
            : material === "Material1" && alloy === "Alloy2"
            ? [20, 70, 40, 100, 50, 140, 120]
            : material === "Material2" && alloy === "Alloy1"
            ? [25, 80, 45, 105, 55, 150, 130]
            : material === "Material2" && alloy === "Alloy2"
            ? [30, 90, 50, 110, 60, 160, 140]
            : [10, 50, 30, 90, 40, 120, 100], // Default data
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
    },
  };

  return (
    <motion.div
      className="ExpandedCustomerReview"
      layoutId="expandableCustomerReview"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <span>RM Cost</span>
      <div className="filters">
        <select value={material} onChange={handleMaterialChange}>
          <option value="All">All Materials</option>
          <option value="Material1">Aluminium</option>
          <option value="Material2">Stainless Steel</option>
        </select>
        <select value={alloy} onChange={handleAlloyChange}>
          <option value="All">All Alloys</option>
          <option value="Alloy1">Alloy 1</option>
          <option value="Alloy2">Alloy 2</option>
        </select>
      </div>
      <div className="chartContainer">
        <Chart options={data.options} series={data.series} type="area" />
      </div>
    </motion.div>
  );
}

export default CustomerReview;
