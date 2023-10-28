import React, { useState, useEffect } from 'react';
import Field from './components/Field'; 
import Market from './components/Market'; 
import ImpactMeter from './components/ImpactMeter'; 
import FieldGrid from './components/FieldGrid';
import InventorySlot from './components/InventorySlot';
import CropSelection from './components/CropSelection';
import './App.css';
import Wheat from './crops/Wheat';
import Potato from './crops/Potato';
import Corn from './crops/Corn';


const initialCrop = {
  type: null, // Type of crop, null if empty
  growthStage: 0,
  isReadyToHarvest: false,
};
const initialInventory = Array(27).fill({ cropType: null, quantity: 0 });
initialInventory[0] = { cropType: 'Wheat', quantity: 3 };
initialInventory[1] = { cropType: 'Potato', quantity: 3 };
initialInventory[2] = { cropType: 'Corn', quantity: 3 };

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  
  const [crops, setCrops] = useState(0);
  const [inventory, setInventory] = useState(initialInventory);

  const [money, setMoney] = useState(0);
  const [impactLevel, setImpactLevel] = useState(0);
  const initialField = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ ...initialCrop })));
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [field, setField] = useState(initialField);
  const handlePlant = (rowIndex, colIndex) => {
    if (!selectedCrop) {
      alert("Please select a crop to plant.");
      return;
    }
    if (selectedCrop.type) {
      alert("This field is already occupied. Please select another field.");
      return;
    }
    const inventoryIndex = inventory.findIndex(slot => slot.cropType === selectedCrop && slot.quantity > 0);
  
    if (inventoryIndex === -1) {
      alert("No crop left of this type. Please select another crop.");
      return;
    }
  
    const newField = [...field];
    let cropToPlant;
    switch (selectedCrop) {
      case 'Wheat':
        cropToPlant = Wheat;
        break;
      case 'Potato':
        cropToPlant = Potato;
        break;
      case 'Corn':
        cropToPlant = Corn;
        break;
      default:
        alert("Invalid crop type.");
        return;
    }
  
    newField[rowIndex][colIndex] = { ...cropToPlant, growthStage: 0 };
    setField(newField);
  
    // Decrease crop count in inventory
    setInventory(prevInventory => {
      const newInventory = [...prevInventory];
      newInventory[inventoryIndex].quantity -= 1;
      return newInventory;
    });
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
      console.log(`Harvested ${crop.name}`);
      
      // Update inventory
      setInventory((prevInventory) => {
        const newInventory = [...prevInventory];
        let added = false;
  
        for (let i = 0; i < newInventory.length; i++) {
          if (newInventory[i].cropType === crop.name && newInventory[i].quantity < 64) {
            newInventory[i].quantity += crop.harvestYield;
            added = true;
            break;
          } else if (!newInventory[i].cropType) {
            newInventory[i] = { cropType: crop.name, quantity: crop.harvestYield };
            added = true;
            break;
          }
        }
  
        if (!added) {
          alert("Inventory is full!");
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
  const handleSelectCrop = (crop) => {
  setSelectedCrop(crop);
};


  return (
    <div>
      <h1>EcoSprout: Mini Farm</h1>
      <CropSelection onSelectCrop={handleSelectCrop} />
      <div>
        Current Selected Crop: {selectedCrop}
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        Time: {formatTime(currentTime)}
      </div>
      <FieldGrid field={field} onPlant={handlePlant} onHarvest={handleHarvest} selectedCrop={selectedCrop} />
      <Market money={money} />
      <ImpactMeter impactLevel={impactLevel} />
      <button onClick={handleSell}>Sell Crops</button>
      <div>
      <h2>Inventory</h2>
      <div className="inventory-slots">
        {inventory.map((slot, index) => (
          <InventorySlot key={index} cropType={slot.cropType} quantity={slot.quantity} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default App;
