import React from 'react';

function ImpactMeter({ impactLevel }) {
  const meterStyle = {
    width: `${impactLevel}%`,
    backgroundColor: impactLevel > 50 ? 'red' : 'green',
    height: '20px',
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div>
      <div className = "meter-title">
      <h3>Environmental Impact Meter</h3></div>
      <div style={{ border: '1px solid #ccc', width: '100%', height: '20px' }}>
        <div style={meterStyle}></div>
      </div>
    </div>
  );
}

export default ImpactMeter;
