import React, { useState, useEffect, useSyncExternalStore } from 'react';
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
import { getWeather} from './components/Weather';


const initialCrop = {
  type: null, // Type of crop, null if empty
  growthStage: 0,
  isReadyToHarvest: false,
};


function SinglePlayer() {
  const initialInventory = Array(27).fill({ cropType: null, quantity: 0 });
initialInventory[0] = { cropType: 'Wheat', quantity: 3 };
initialInventory[1] = { cropType: 'Potato', quantity: 3 };
initialInventory[2] = { cropType: 'Corn', quantity: 3 };
  const [currentTime, setCurrentTime] = useState(0);
  const [weather, setWeather] = useState('')
  const [crops, setCrops] = useState(0);
  const [inventory, setInventory] = useState(initialInventory);

  const [money, setMoney] = useState(0);
  const [impactLevel, setImpactLevel] = useState(0);
  const initialField = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ ...initialCrop })));
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [field, setField] = useState(initialField);
  const handlePlant = (rowIndex, colIndex) => {
    console.log("Planting", selectedCrop, "at", rowIndex, colIndex);
    if (!selectedCrop) {
      alert("Please select a crop to plant.");
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
  
    newField[rowIndex][colIndex] = { type: selectedCrop, ...cropToPlant, growthStage: 0 };
    setField(newField);
  
    updateInventory(inventoryIndex);
  };
  const updateInventory = (inventoryIndex) => {
    const newInventory = [...inventory];
    newInventory[inventoryIndex].quantity -= 1;
    console.log("Decreasing Inventory");
    setInventory(newInventory);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update the time every second
      setCurrentTime((prevTime) => (prevTime + 1) % 86400); // There are 86400 seconds in a day
    }, 1000); // Update every second
    console.log("current Time:", currentTime)
    setCurrentTime(currentTime)
    if(currentTime % 30 === 0){
      updateWeather();
    }
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    // Update the growth stage of crops based on their growth time
    const newField = field.map((row) =>
      row.map((crop) => {
        if (crop.type && crop.growthStage < 3) {
          const cropItem = getItem(crop.type);
          if (!cropItem) {
            return crop; // If crop type is invalid, return the crop as is
          }
  
          // Check if the current time is a multiple of the crop's growth time
          if (currentTime % cropItem.growthTime === 0) {
            return { ...crop, growthStage: crop.growthStage + 1 };
          }
        }
  
        if (crop.growthStage === 3) {
          return { ...crop, isReadyToHarvest: true };
        }
        return crop;
      })
    );
    setField(newField);
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
  
  

  const handleSellCrop = (cropType) => {
    const inventoryIndex = inventory.findIndex(slot => slot.cropType === cropType && slot.quantity > 0);
    if (inventoryIndex === -1) {
      alert("No crop of this type to sell.");
      return;
    }

    const cropToSell = inventory.find(slot => slot.cropType === cropType);
    console.log("Crop : ", cropToSell.cropType)
    console.log("Crop details : ", getItem(cropToSell.cropType))
    const cropPrice = getItem(cropToSell.cropType)?.price; // Assuming you have the price attribute in each crop object
    console.log("Selling", cropToSell, "for", cropPrice)
    updateInventory(inventoryIndex);
    setMoney(prevMoney => prevMoney + cropPrice);
    console.log("Now my money: ", money)
  };
const handleSelectCrop = (crop) => {
  setSelectedCrop(crop);
};
const getItem = (cropName) => {

  let plant;
  switch (cropName) {
    case 'Wheat':
      plant = Wheat;
      return plant;

    case 'Potato':
      plant = Potato;
      return plant;

    case 'Corn':
      plant = Corn;
      return plant;

    default:
      alert("Invalid crop type.");
      return;
  }
};

// Function to update the weather
const updateWeather = () => {
  const currentWeather = getWeather();

  setWeather(currentWeather);
};

//Use useEffect to update the weather every 30 seconds
// Inside the App component

const handleBuy = (cropName) => {
  const cropItem = getItem(cropName);
  if (!cropItem) {
    alert("Invalid crop type.");
    return;
  }

  // Check if the player has enough money
  if (money < cropItem.price) {
    alert("Not enough money to buy this crop.");
    return;
  }

  // Update inventory
  let added = false;
  const newInventory = [...inventory];
  for (let i = 0; i < newInventory.length; i++) {
    if (newInventory[i].cropType === cropName && newInventory[i].quantity < 64) {
      newInventory[i].quantity += 1;
      added = true;
      break;
    } else if (!newInventory[i].cropType) {
      newInventory[i] = { cropType: cropName, quantity: 1 };
      added = true;
      break;
    }
  }

  if (!added) {
    alert("Inventory is full!");
    return;
  }

  // Deduct the cost from the player's money
  setMoney(money - cropItem.price);

  // Update the inventory
  setInventory(newInventory);
};
  return (
    <div>
      <div className = "container">
      <div className = "title">
      <h1>EcoSprout: Mini Farm</h1>
      </div>
      <div>
        <h2>Weather</h2>
        Current Weather: {weather}
      </div>
      <CropSelection onSelectCrop={handleSelectCrop} />
      
      <div className="selected-crop">
        Current Selected Crop: {selectedCrop}
      </div>
      <div className="time">
        Time: {formatTime(currentTime)}
      </div>
   
      <FieldGrid field={field} onPlant={handlePlant} onHarvest={handleHarvest} selectedCrop={selectedCrop} />
      <Market money={money} onBuy={handleBuy} />
      <ImpactMeter impactLevel={impactLevel} />
      <div>
      <h2>Inventory</h2>
      <div className="inventory-slots">
        {inventory.map((slot, index) => (
          <InventorySlot key={index} cropType={slot.cropType} quantity={slot.quantity}  onSell={handleSellCrop} />
        ))}
      </div>
      
     
      </div>
    </div>
    </div>
  );
}

export default SinglePlayer;
