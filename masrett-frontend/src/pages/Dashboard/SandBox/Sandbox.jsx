import React, { useState, useEffect } from 'react';

const Sandbox = () => {
    const [predictedWord, setPredictedWord] = useState("No sign detected");

    // Fetch the prediction from the Flask API
    const fetchPrediction = async () => {
        try {
            const response = await fetch('http://localhost:5000/prediction');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("API Response:", data);
            setPredictedWord(data.predicted_word);
            console.log("Predicted Word:", data.predicted_word); // Log the prediction to the console
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    useEffect(() => {
        // Fetch the prediction immediately on mount
        fetchPrediction();

        // Set an interval to fetch prediction every second
        const intervalId = setInterval(fetchPrediction, 1000); 

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, []);    

    return (
        <div>
            <h1>Sign Language Detection</h1>
            <iframe
                src="http://localhost:8501"
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Streamlit App"
            />
            <h2>Predicted Word: {predictedWord}</h2>
        </div>
    );
};

export default Sandbox;
