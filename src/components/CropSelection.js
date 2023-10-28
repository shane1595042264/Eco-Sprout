// CropSelection.js

import React from 'react';
import './CropSelection.css'
const CropSelection = ({ onSelectCrop }) => {
  const crops = ['Wheat', 'Potato', 'Corn'];

  return (
    <div className="crop-selection">
      <h3>Select a Crop</h3>
      <div className="crop-list">
        {crops.map((crop) => (
          <div key={crop} className="crop-item" onClick={() => onSelectCrop(crop)}>
            <img src={`./img/${crop}.png`} alt={crop} />
            <span>
              <div className = "crop-selector">
              {crop}
              </div>
              </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropSelection;
