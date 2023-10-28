import React from 'react';

function FieldGrid({ field, onPlant, onHarvest, selectedCrop }) {
    return (
      <div className="field-grid">
        {field.map((row, rowIndex) => (
          <div key={rowIndex} className="field-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="field-cell"
                onClick={() => cell.type ? onHarvest(rowIndex, colIndex) : onPlant(rowIndex, colIndex, selectedCrop)}
              >
                {cell.type ?  <img src={`./img/${cell.type}${cell.growthStage}.png`} alt={selectedCrop} width = "32" height = "32"/> : 'Empty'}
              </div>  
              
            ))}
          </div>
        ))}
      </div>
    );
  }
  

export default FieldGrid;
