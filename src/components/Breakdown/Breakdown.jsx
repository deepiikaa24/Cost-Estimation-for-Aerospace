import React from "react";
import "./Breakdown.css";

const Breakdown = () => {
  return (
    <div className="Breakdown">
      <h2>Breakdown Information</h2>
      <div className="tree">
        <div className="node level-1">
          <div className="box">Project A3782</div>
        </div>
        <div className="level-2">
          <div className="branch">
            <div className="line"></div>
            <div className="node">
              <div className="box aluminum">Aluminium</div>
              <div className="level-3">
                <div className="branch">
                  <div className="line"></div>
                  <div className="box aluminum-alloy">Aluminium Alloy 1</div>
                </div>
                <div className="branch">
                  <div className="line"></div>
                  <div className="box aluminum-alloy">Aluminium Alloy 2</div>
                </div>
              </div>
            </div>
          </div>
          <div className="branch">
            <div className="line"></div>
            <div className="node">
              <div className="box iron">Iron</div>
              <div className="level-3">
                <div className="branch">
                  <div className="line"></div>
                  <div className="box iron-alloy">Iron Alloy 1</div>
                </div>
                <div className="branch">
                  <div className="line"></div>
                  <div className="box iron-alloy">Iron Alloy 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breakdown;
