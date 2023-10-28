import React from 'react';

export function getWeather(){
    const rn = Math.random();
    return rn <= 0.2 ? 'Rainy' : 'Sunny';
    
}