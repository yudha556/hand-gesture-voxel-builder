"use client";

import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.2,
        minTrackingConfidence: 0.2,
      });

      landmarkerRef.current = handLandmarker;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const video = videoRef.current;
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
        requestAnimationFrame(detect);
      };
    }

    function detect() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const landmarker = landmarkerRef.current;

      // GUARD penting
      if (!video || !landmarker || video.readyState < 2) {
        requestAnimationFrame(detect);
        return;
      }

      // kalau ukuran video belum ada jangan proses
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const results = landmarker.detectForVideo(video, performance.now());

      console.log("results:", results);

      if (results.landmarks?.length) {
        const hand = results.landmarks[0];
        console.log("landmarks:", results.landmarks);

        hand.forEach((point) => {
          ctx.beginPath();
          ctx.arc(
            point.x * canvas.width,
            point.y * canvas.height,
            5,
            0,
            2 * Math.PI,
          );

          ctx.fillStyle = "red";
          ctx.fill();
        });
      }

      requestAnimationFrame(detect);
    }

    init();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />

      <canvas ref={canvasRef} />
    </div>
  );
}
