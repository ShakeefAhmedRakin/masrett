import { useState } from "react";

const Sandbox = () => {
  const [webcamAccess, setWebcamAccess] = useState(false);

  const requestWebcamAccess = () => {
    setWebcamAccess(true);
  };

  return (
    <div>
      <div className="flex justify-center mb-4 mt-2">
        <h1 className="font-bold text-secondary text-3xl bg-base-200 w-fit py-2 px-5 rounded-xl">
          Sandbox
        </h1>
      </div>

      <div className="border-2 border-secondary p-1">
        {!webcamAccess ? (
          <div className="flex justify-center h-[80vh] items-center">
            <button
              onClick={requestWebcamAccess}
              className="bg-primary text-white font-bold py-2 px-4 rounded-xl"
            >
              Allow Webcam Access
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <iframe
              src="http://localhost:8501"
              style={{
                width: "100%",
                height: "80vh",
                border: "none",
                overflow: "hidden",
              }}
              title="Streamlit App"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sandbox;
