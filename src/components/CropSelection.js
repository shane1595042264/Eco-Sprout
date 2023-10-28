// CropSelection.js

import React from 'react';

const CropSelection = ({ onSelectCrop }) => {
  const crops = ['Wheat', 'Potato', 'Corn'];

  return (
    <div className="crop-selection">
      <h3>Select a Crop</h3>
      <div className="crop-list">
        {crops.map((crop) => (
          <div key={crop} className="crop-item" onClick={() => onSelectCrop(crop)}>
            <img src={`./img/${crop}.png`} alt={crop} />
            <span>{crop}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropSelection;
