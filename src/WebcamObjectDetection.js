import React, { useState, useEffect, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import './WebcamObjectDetection.css'


const WebcamObjectDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [name, setName] = useState([]);

  useEffect(() => {
    const runObjectDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Load the COCO-SSD model
      const model = await cocoSsd.load();

      // Access the user's webcam
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((error) => {
          console.log('Error accessing the webcam: ', error);
        });

      // Perform object detection on each video frame
      const detectObjects = async () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const predictions = await model.detect(canvas);

        // Display the object detection results
        predictions.forEach((prediction) => {
          const { bbox, class: label, score } = prediction;
          setName(label);
          console.log(`It is a ${label}`)
          context.beginPath();
          context.rect(bbox[0], bbox[1], bbox[2], bbox[3]);
          context.lineWidth = 2;
          context.strokeStyle = 'red';
          context.fillStyle = 'red';
          context.stroke();
          context.fillText(`${label} (${Math.round(score * 100)}%)`, bbox[0], bbox[1] > 10 ? bbox[1] - 5 : 10);
        });

        requestAnimationFrame(detectObjects);
      };

      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        detectObjects();
      });
    };

    runObjectDetection();
  }, []);

  return (
    <div class = "row">
      <div class ='column'>
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} />
      </div>
      <div class ='column'>
        <p>
          It is <strong><mark>{name}</mark></strong>
        </p>
      </div>
    </div>
  );
};

export default WebcamObjectDetection;