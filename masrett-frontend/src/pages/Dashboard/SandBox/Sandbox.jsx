import React from 'react';

const Sandbox = () => {
    return (
        <div>
            <h1>Sign Language Detection</h1>
            <iframe
                src="http://localhost:8501"
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Streamlit App"
            />
        </div>
    );
};

export default Sandbox;