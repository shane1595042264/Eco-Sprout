import React from 'react';
import Wheat from '../crops/Wheat';
import Potato from '../crops/Potato';
import Corn from '../crops/Corn';

// Import images (assuming they are stored in the public directory)


function Market({ money, onBuy }) {
  const crops = [
    { ...Wheat, image: "./img/Wheat.png" },
    { ...Potato, image: "./img/Potato.png" },
    { ...Corn, image: "./img/Corn.png" },
  ];

  return (
    <div>
      <h3>Market</h3>
      <p>Total Money Earned: ${money}</p>
      <div className="market-grid">
        {crops.map((crop, index) => (
          <div key={index} className="market-item" onClick={() => onBuy(crop.name)}>
            <img src={crop.image} alt={crop.name} />
            <p>{crop.name}</p>
            <p>Price: ${crop.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
