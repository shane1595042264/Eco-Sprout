import React, { useState, useEffect } from 'react';
import Field from './components/Field'; 
import Market from './components/Market'; 
import ImpactMeter from './components/ImpactMeter'; 
import FieldGrid from './components/FieldGrid';
import './App.css';


const initialCrop = {
  type: null, // Type of crop, null if empty
  growthStage: 0,
  isReadyToHarvest: false,
};

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  
  const [crops, setCrops] = useState(0);
  const [inventory, setInventory] = useState({});
  const [money, setMoney] = useState(0);
  const [impactLevel, setImpactLevel] = useState(0);
  const initialField = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ ...initialCrop })));

  const [field, setField] = useState(initialField);
  const handlePlant = (rowIndex, colIndex) => {
    const newField = [...field];
    newField[rowIndex][colIndex] = { type: 'Wheat', growthStage: 1 };
    setField(newField);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the time every second
      setCurrentTime((prevTime) => (prevTime + 1) % 86400); // There are 86400 seconds in a day
    }, 1000); // Update every second
    console.log("current Time:", currentTime)
    setCurrentTime(currentTime)
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [currentTime]);

  useEffect(() => {
    // Every 10 seconds, update the growth stage of crops
    if (currentTime % 10 === 0) {
      const newField = field.map((row) =>
        row.map((crop) => {
          if (crop.type && crop.growthStage < 3) {
            return { ...crop, growthStage: crop.growthStage + 1 };
          }
          if (crop.growthStage === 3) {
            return { ...crop, isReadyToHarvest: true };
          }
          return crop;
        })
      );
      setField(newField);
    }
  }, [currentTime]); 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };
  
  const handleHarvest = (rowIndex, colIndex) => {
    const newField = [...field];
    const crop = newField[rowIndex][colIndex];
  
    if (crop.isReadyToHarvest) {
      // Logic to harvest the crop and update the player's resources
      console.log(`Harvested ${crop.type}`);
      setCrops(crops + 1);
          // Update inventory
    setInventory((prevInventory) => {
      const newInventory = { ...prevInventory };
      if (newInventory[crop.type]) {
        newInventory[crop.type] += 1;
      } else {
        newInventory[crop.type] = 1;
      }
      return newInventory;
    });
      // Reset the cell to the initial state
      newField[rowIndex][colIndex] = { ...initialCrop };
    } else {
      console.log("Crop is not ready to harvest");
    }
  
    setField(newField);
  };
  

  const handleSell = () => {
    if (crops > 0) {
      setCrops(crops - 1);
      setMoney(money + 10); // Earn money for each crop sold
      setImpactLevel(impactLevel - 5); // Selling crops reduces the impact level
    }
  };
  

  return (
    <div>
      <h1>EcoSprout: Mini Farm</h1>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        Time: {formatTime(currentTime)}
      </div>
      <FieldGrid field={field} onPlant={handlePlant} onHarvest={handleHarvest} />
      <Market money={money} />
      <ImpactMeter impactLevel={impactLevel} />
      <button onClick={handleSell}>Sell Crops</button>
      <div>
      <h2>Inventory</h2>
      <ul>
        {Object.entries(inventory).map(([cropType, quantity]) => (
          <li key={cropType}>{cropType}: {quantity}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
