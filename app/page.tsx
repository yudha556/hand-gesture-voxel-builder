"use client";

import Scene from "./components/Scene";
import { useState } from "react";

export default function Home() {

  const [blocks,setBlocks] = useState([[0,0,0]])

  return (
    <main style={{width:"100vw",height:"100vh"}}>
      <Scene blocks={blocks}/>
    </main>
  )
}