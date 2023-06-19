import React, { useEffect, useRef } from 'react';

const WebcamStream = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const startVideoStream = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((error) => {
          console.log('Error accessing the webcam: ', error);
        });
    };

    if (navigator.mediaDevices.getUserMedia) {
      startVideoStream();
    } else {
      console.log('getUserMedia is not supported in this browser.');
    }

    return () => {
      if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });

        video.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay={true} />
    </div>
  );
};

export default WebcamStream;
