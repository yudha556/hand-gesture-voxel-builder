"use client";

import { Canvas } from "@react-three/fiber";
import Block from "./Block";

export default function Scene({blocks}) {

  return (
    <Canvas camera={{ position:[5,5,5] }}>
      
      <ambientLight intensity={1} />

      {blocks.map((b,i)=>(
        <Block key={i} position={b}/>
      ))}

    </Canvas>
  )

}