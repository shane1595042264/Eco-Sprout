import React, { useState } from 'react';
import './Tutorial.css';

function Tutorial() {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 9) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="tutorial-container">
            <h1>EcoSprout: Mini Farm Tutorial</h1>
            {step === 1 && (
                <div className="tutorial-step">
                    <h2>Welcome to EcoSprout: Mini Farm!</h2>
                    <p>This tutorial will guide you through the basics of playing the game in both Singleplayer and Doubleplayer modes.</p>
                </div>
            )}
            {step === 2 && (
                <div className="tutorial-step">
                    <h2>1. Game Modes</h2>
                    <p>In Singleplayer mode, you play against the environment, focusing on maximizing your farm's output. In Doubleplayer mode, you compete against another player, adding an element of strategy and competition. The goal of the doubleplayer mode is to completely squeeze the surival space of the other player by planting crops all over the place. </p>
                </div>
            )}
            {step === 3 && (
                <div className="tutorial-step">
                    <h2>2. Starting the Game</h2>
                    <p>Each player starts with a set of crops in their inventory and some initial money of 50$. While in singleplayer mode, you start with 0. </p>
                </div>
            )}
            {step === 4 && (
                <div className="tutorial-step">
                    <h2>3. Planting Crops</h2>
                    <p>Select a crop from the bar above the field and click on an empty field tile to plant it. Each crop takes a few turns to grow before it can be harvested.</p>
                </div>
            )}
            {step === 5 && (
                <div className="tutorial-step">
                    <h2>4. Harvesting Crops</h2>
                    <p>Once a crop is fully grown, you can click on it to harvest. Harvested crops will be added to your inventory.</p>
                </div>
            )}
            {step === 6 && (
                <div className="tutorial-step">
                    <h2>5. Selling Crops</h2>
                    <p>Visit the inventory to sell your crops. You can sell crops by clicking on each crop in the inventory. Selling crops will earn you money that you can use to buy more seeds or items from the market.</p>
                </div>
            )}
            {step === 7 && (
                <div className="tutorial-step">
                    <h2>6. Weather Effects</h2>
                    <p>Keep an eye on the weather! Some weather conditions can affect the growth of your crops.</p>
                </div>
            )}
            {step === 8 && (
                <div className="tutorial-step">
                    <h2>7. Doubleplayer Specifics</h2>
                    <p>In Doubleplayer mode, be cautious of neighboring crops. Some crops can attack and reduce the growth stage of your crops. Strategize to protect your crops and maximize yield. The game ends when one player manages to own all the tiles on the field.</p>
                </div>
            )}
            {step === 9 && (
                <div className="tutorial-step">
                    <h2>8. Ending the Game</h2>
                    <p>The game ends when one player owns all the tiles in Doubleplayer mode. Play strategically to win! You don't win in singleplayer, it is more like a test field</p>
                </div>
            )}

            <div className="tutorial-navigation">
                <button onClick={prevStep} disabled={step === 1}>Previous</button>
                <button onClick={nextStep} disabled={step === 9}>Next</button>
            </div>
        </div>
    );
}

export default Tutorial;
