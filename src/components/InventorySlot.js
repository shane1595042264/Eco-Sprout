import React from 'react';

const InventorySlot = ({ cropType, quantity }) => {
  const imageStyle = {
    maxWidth: '50px', // Maximum width of the image
    maxHeight: '50px', // Maximum height of the image
    display: 'block', // To ensure it takes the full width available
    margin: 'auto' // To center the image within the slot
  };

  return (
    <div className="inventory-slot" style={{ position: 'relative', border: '1px solid #ccc', width: '60px', height: '60px', display: 'inline-block', margin: '5px' }}>
      {cropType && (
        <div>
          <img src={`./img/${cropType}.png`} alt={cropType} style={imageStyle} />
          <span style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '2px 5px', borderRadius: '5px' }}>{quantity}</span>
        </div>
      )}
    </div>
  );
};

export default InventorySlot;
