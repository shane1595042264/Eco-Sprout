import React, { useState, useEffect } from 'react';
import Field from './components/Field'; 
import Market from './components/Market'; 
import ImpactMeter from './components/ImpactMeter'; 
import FieldGrid2 from './components/FieldGrid2';
import InventorySlot from './components/InventorySlot';
import CropSelection from './components/CropSelection';
import './App.css';
import Wheat from './crops/Wheat';
import Potato from './crops/Potato';
import Corn from './crops/Corn';
import { getWeather } from './components/Weather';
import './DoublePlayer.css';

const initialCrop = {
  type: null, // Type of crop, null if empty
  growthStage: 0,
  isReadyToHarvest: false,
  owner: null, // New attribute to track the owner of the crop
};

function DoublePlayer() {
    const initialInventoryPlayer1 = Array(27).fill({ cropType: null, quantity: 0 });
    initialInventoryPlayer1[0] = { cropType: 'Wheat', quantity: 3 };
    initialInventoryPlayer1[1] = { cropType: 'Potato', quantity: 3 };
    initialInventoryPlayer1[2] = { cropType: 'Corn', quantity: 3 };
  
    const initialInventoryPlayer2 = Array(27).fill({ cropType: null, quantity: 0 });
    initialInventoryPlayer2[0] = { cropType: 'Wheat', quantity: 3 };
    initialInventoryPlayer2[1] = { cropType: 'Potato', quantity: 3 };
    initialInventoryPlayer2[2] = { cropType: 'Corn', quantity: 3 };
  

  const [weather, setWeather] = useState('');
  const [turn, setTurn] = useState(1); // 1 for Player 1, 2 for Player 2
  const [player1Inventory, setPlayer1Inventory] = useState(initialInventoryPlayer1);
  const [player2Inventory, setPlayer2Inventory] = useState(initialInventoryPlayer2);
  const [player1Money, setPlayer1Money] = useState(50); // Initial money for Player 1
  const [player2Money, setPlayer2Money] = useState(50);
  const [impactLevel, setImpactLevel] = useState(0);
  const initialField = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => ({ ...initialCrop })));
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [field, setField] = useState(initialField);

  const handlePlant = (rowIndex, colIndex) => {
    const inventory = turn === 1 ? player1Inventory : player2Inventory;
    const setInventory = turn === 1 ? setPlayer1Inventory : setPlayer2Inventory;

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

    newField[rowIndex][colIndex] = { type: selectedCrop, ...cropToPlant, growthStage: 0, owner: turn };
    setField(newField);
    updateInventory(inventoryIndex, setInventory);
  };

  const updateInventory = (inventoryIndex, setInventory) => {
    const inventory = turn === 1 ? player1Inventory : player2Inventory;
    const newInventory = [...inventory];
    newInventory[inventoryIndex].quantity -= 1;
    setInventory(newInventory);
  };

  const handleNextTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
    updateCropsGrowth(); // Update crops growth on turn change
    updateWeather(); // Update weather on turn change
    checkWinCondition();
    handleCompetition();
  };
  const handleCompetition = () => {
    setField((prevField) => {
      const newField = prevField.map((row, rowIndex) =>
        row.map((crop, colIndex) => {
          if (crop.type) {
            const cropItem = getItem(crop.type);
            let newGrowthStage = crop.growthStage;
  
            // Calculate total attack from neighbors
            let totalAttack = 0;
            getNeighbors(rowIndex, colIndex).forEach(([nRow, nCol]) => {
              const neighborCrop = prevField[nRow][nCol];
              if (neighborCrop.type && neighborCrop.growthStage >= 0) {
                const neighborCropItem = getItem(neighborCrop.type);
                totalAttack += neighborCropItem.attack;
              }
            });
  
            // Check if total attack is greater than the crop's defense
            if (totalAttack > cropItem.defense) {
              newGrowthStage -= 1;
            }
  
            // Check if the crop is destroyed
            if (newGrowthStage < 0) {
              return { ...initialCrop };
            }
  
            return { ...crop, growthStage: newGrowthStage };
          }
          return crop;
        })
      );
      return newField;
    });
  };
  
  const updateCropsGrowth = (rainEffect = false) => {
    const newField = field.map(row => row.map(crop => {
      if (crop.type && crop.growthStage < 3) {
        let growthIncrement = crop.owner === turn ? 1 : 0;
        if (rainEffect) {
          growthIncrement += 1; // Increase growth stage by 1 if it's raining
        }
        return { ...crop, growthStage: crop.growthStage + growthIncrement };
      }
      if (crop.growthStage === 3) {
        return { ...crop, isReadyToHarvest: true };
      }
      return crop;
    }));
    setField(newField);
  };
    // Get neighbors of a given cell
    const getNeighbors = (row, col) => {
        const neighbors = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Right, Down, Left, Up
        directions.forEach(([dx, dy]) => {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < field.length && newCol >= 0 && newCol < field[0].length) {
            neighbors.push([newRow, newCol]);
          }
        });
        return neighbors;
      };
  const handleHarvest = (rowIndex, colIndex) => {
    const inventory = turn === 1 ? player1Inventory : player2Inventory;
    const setInventory = turn === 1 ? setPlayer1Inventory : setPlayer2Inventory;

    const newField = [...field];
    const crop = newField[rowIndex][colIndex];
    if (crop.owner !== turn) {
      alert("You don't own this crop.");
      return;
    }
    const newInventory = [...inventory];
    if (crop.isReadyToHarvest) {
      console.log(`Harvested ${crop.name}`);

      // Update inventory
       // Corrected the variable name
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

      // Reset the cell to the initial state
      newField[rowIndex][colIndex] = { ...initialCrop };
    } else {
      console.log("Crop is not ready to harvest");
    }

    setField(newField);
    setInventory(newInventory);
  };
  useEffect(() => {
    const winner = checkWinCondition();
    if (winner !== 0) {
      // Redirect to homepage if there's a winner
      window.location.href = '/'; // Replace '/' with your homepage URL
    }
  }, [field]);
  const handleSellCrop = (cropType) => {
    const inventory = turn === 1 ? player1Inventory : player2Inventory;
    const setInventory = turn === 1 ? setPlayer1Inventory : setPlayer2Inventory;
    const setMoney = turn === 1 ? setPlayer1Money : setPlayer2Money;

    const inventoryIndex = inventory.findIndex(slot => slot.cropType === cropType && slot.quantity > 0);
    if (inventoryIndex === -1) {
      alert("No crop of this type to sell.");
      return;
    }

    const cropToSell = inventory.find(slot => slot.cropType === cropType);
    const cropPrice = getItem(cropToSell.cropType)?.price;

    const newInventory = [...inventory];
    newInventory[inventoryIndex].quantity -= 1;
    setInventory(newInventory);
    setMoney(prevMoney => prevMoney + cropPrice);
  };

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
  };

  const getItem = (cropName) => {
    switch (cropName) {
      case 'Wheat':
        return Wheat;
      case 'Potato':
        return Potato;
      case 'Corn':
        return Corn;
      default:
        alert("Invalid crop type.");
        return null;
    }
  };
  const checkWinCondition = () => {
    // Flatten the field array to make it easier to process
    const flattenedField = field.flat();

    // Check if all tiles are owned by player 1
    const player1Wins = flattenedField.every(crop => crop.owner === 1);

    // Check if all tiles are owned by player 2
    const player2Wins = flattenedField.every(crop => crop.owner === 2);

    if (player1Wins) {
      alert("Player 1 wins!");
      return 1; // Return 1 indicating Player 1 wins
    } else if (player2Wins) {
      alert("Player 2 wins!");
      return 2; // Return 2 indicating Player 2 wins
    }
    return 0; // Return 0 indicating no winner yet
  };
  const handleBuy = (item) => {
    const money = turn === 1 ? player1Money : player2Money;
    const setMoney = turn === 1 ? setPlayer1Money : setPlayer2Money;
    const price = getItem(item)?.price;
    if (money < price) {
      alert("Not enough money to buy this item.");
      return;
    }


    const inventory = turn === 1 ? player1Inventory : player2Inventory;
    const setInventory = turn === 1 ? setPlayer1Inventory : setPlayer2Inventory;

    const newInventory = [...inventory];
    let added = false;

    for (let i = 0; i < newInventory.length; i++) {
      if (newInventory[i].cropType === item && newInventory[i].quantity < 64) {
        newInventory[i].quantity += 1;
        added = true;
        break;
      } else if (!newInventory[i].cropType) {
        newInventory[i] = { cropType: item, quantity: 1 };
        added = true;
        break;
      }
    }

    if (!added) {
      alert("Inventory is full!");
      return;
    }

    setInventory(newInventory);
    setMoney(prevMoney => prevMoney - price);
  };
  const updateWeather = () => {
    const currentWeather = getWeather();
    setWeather(currentWeather);
    if (currentWeather === 'Rainy') {
      updateCropsGrowth(true); // Apply rain effect if the weather is rainy
    }
  };
  return (
    <div className="container">
      <div className="title">
        <h1>EcoSprout: Mini Farm</h1>
      </div>
      <div className="game-layout">
        <div className="game-board">
          <div>
            <h2>Weather</h2>
            Current Weather: {weather}
          </div>
          <CropSelection onSelectCrop={handleSelectCrop} />
          <div className="selected-crop">
            Current Selected Crop: {selectedCrop}
          </div>
          <FieldGrid2 field={field} onPlant={handlePlant} onHarvest={handleHarvest} selectedCrop={selectedCrop} />
          <div className="turn-indicator">
            Current Turn: Player {turn}
          </div>
          <div className="turn-button">
            <button onClick={handleNextTurn}>Next Turn</button>
          </div>
        </div>
        <div className="game-info">
          <Market money={turn === 1 ? player1Money : player2Money} onBuy={handleBuy} />
          <div>
            <h2>Inventory</h2>
            <div className="inventories">
              {turn === 1 ? (
                // Render player 1's inventory
                player1Inventory.map((slot, index) => (
                  <InventorySlot key={index} cropType={slot.cropType} quantity={slot.quantity} onSell={handleSellCrop} />
                ))
              ) : (
                // Render player 2's inventory
                player2Inventory.map((slot, index) => (
                  <InventorySlot key={index} cropType={slot.cropType} quantity={slot.quantity} onSell={handleSellCrop} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoublePlayer;
