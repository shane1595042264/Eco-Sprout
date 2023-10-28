import React, { useState } from 'react';

function Field({ onHarvest }) {
  const [isPlanted, setIsPlanted] = useState(false);

  const handlePlanting = () => {
    setIsPlanted(true);
  };

  const handleHarvest = () => {
    setIsPlanted(false);
    onHarvest(); // This function will be passed from the parent component
  };

  return (
    <div>
      {isPlanted ? (
        <button onClick={handleHarvest}>Harvest</button>
      ) : (
        <button onClick={handlePlanting}>Plant</button>
      )}
    </div>
  );
}

export default Field;
