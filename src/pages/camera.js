import React from 'react';
import Webcam from 'react-webcam';

const WebcamComponent = ({ isActive, videoConstraints }) => {
  return (
    <div className="webcam-container">
      {isActive && (
        <Webcam
          className="webcam"
          videoConstraints={videoConstraints}
          screenshotFormat="image/jpeg"
          mirrored={true}
        >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot()
              console.log(imageSrc);
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
      )}
    </div>
  );
};

export default WebcamComponent;
