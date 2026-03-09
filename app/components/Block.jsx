"use client";

export default function Block({position}){

  return(

    <mesh position={position}>
      <boxGeometry args={[1,1,1]}/>
      <meshStandardMaterial color="orange"/>
    </mesh>

  )

}