import React from 'react';
import './FieldGrid2.css';

function FieldGrid2({ field, onPlant, onHarvest, selectedCrop }) {
    return (
        <div className="field-grid">
            {field.map((row, rowIndex) => (
                <div key={rowIndex} className="field-row">
                    {row.map((cell, colIndex) => {
                        // Determine the cell's class based on the owner
                        let cellClass = "field-cell";
                        if (cell.owner === 1) {
                            cellClass += " player1-cell"; // Add class for player 1
                        } else if (cell.owner === 2) {
                            cellClass += " player2-cell"; // Add class for player 2
                        }
                        
                        return (
                            <div
                                key={colIndex}
                                className={cellClass}
                                onClick={() => cell.type ? onHarvest(rowIndex, colIndex) : onPlant(rowIndex, colIndex, selectedCrop)}
                            >
                                {cell.type ?  <img src={`./img/${cell.type}${cell.growthStage}.png`} alt={selectedCrop} width="32" height="32"/> : 'Empty'}
                            </div>  
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default FieldGrid2;
