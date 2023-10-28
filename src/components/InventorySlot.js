// InventorySlot.js

import React from 'react';

const InventorySlot = ({ cropType, quantity }) => {
  return (
    <div className="inventory-slot">
      {cropType && (
        <div>
          <img src={`${WheatStage1}.png`} alt={cropType} /> {/* Assuming you have images for each crop type */}
          <span>{quantity}</span>
        </div>
      )}
    </div>
  );
};

export default InventorySlot;
