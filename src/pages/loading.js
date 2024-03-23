import { useEffect, useState } from 'react';

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        }
        clearInterval(interval);
        return prevProgress;
      });
    }, 500); // Adjust the interval duration as needed

    return () => {
      clearInterval(interval);
    };
  }, []);

  const progressValue = progress === 100 ? (
    <>
      Complete
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="400px" width="30" height="30" viewBox="0 0 48 48">
        <path fill="#8bc34a" d="M24,2l4.506,5.029L35,5l1.465,6.535L43,13l-2,6.494L46,24l-5,4.506L43,35l-6.535,1.465L35,43l-6.494-2.029L24,46l-4.506-5.029L13,43l-1.465-6.535L5,35l2-6.494L2,24l5-4.506L5,13l6.535-1.465L13,5l6.494,2.029L24,2z"></path>
        <path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
      </svg>
    </>
  ) : (
    <>
      {progress}%
    </>
  );

  return (
    <div className="loading-bar-container">
      <div className="loading-bar">
        <div className="loading-bar-progress" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-value">{progressValue}</div>
    </div>
  );
};

export default LoadingBar;
