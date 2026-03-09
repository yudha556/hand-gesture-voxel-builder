"use client";

import { useEffect } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function useHandTracking(videoRef,onPinch){

  useEffect(()=>{

    let handLandmarker
    let lastPinch = false

    async function init(){

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      )

      handLandmarker = await HandLandmarker.createFromOptions(vision,{
        baseOptions:{
          modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        },
        runningMode:"VIDEO",
        numHands:1
      })

      const stream = await navigator.mediaDevices.getUserMedia({
        video:true
      })

      videoRef.current.srcObject = stream

      videoRef.current.onloadeddata = () => detect()
    }

    function detect(){

      const results = handLandmarker.detectForVideo(
        videoRef.current,
        performance.now()
      )

      if(results.landmarks.length){

        const hand = results.landmarks[0]

        const thumb = hand[4]
        const index = hand[8]

        const dx = thumb.x - index.x
        const dy = thumb.y - index.y

        const distance = Math.sqrt(dx*dx + dy*dy)

        const pinch = distance < 0.05

        if(pinch && !lastPinch){
          onPinch()
        }

        lastPinch = pinch
      }

      requestAnimationFrame(detect)
    }

    init()

  },[])

}