import { createRoot } from 'react-dom/client'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { useBox } from '@react-three/cannon'

function Box({ width, height, depth, ...props }) {
    // This reference will give us direct access to the mesh
    const { viewport } = useThree()

    const ref = useRef();
    // const position = [0, height, depth ];
    const position = [0, 0,0 ];
    // const position = [0, 10, 10 ];
    
    console.log('Box', width, height, depth);

    // const [ref, api] = useBox(() => ({ args: [2, 1, 1], mass: 1, ...props }),
    // Set up state for the hovered and active state
    // const [hovered, setHover] = useState(false)
    // const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
   

    useFrame(({ mouse }) => {
      const x = (mouse.x * viewport.width) / 2
    //   const y = (mouse.y * viewport.height) / 2
      const y = ((mouse.y * viewport.height+30) / 2);
      ref.current.position.set(x, y, 0)
    //   ref.current.rotation.set(-y, x, 0)
    })
    
    useEffect(() => {
        console.log('box', ref.current.position);
        // ref.current.position.set(position);
    },[])
   
    return (
        <mesh name={props.name}
            ref={ref}
            {...props}
            // position={position}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'green'} />
        </mesh>
    )
}

export default function Cursor({ container, ...props }) {
    const ref = useRef()
    const { width, height, depth} = {...container};

    console.log('Cursor', width, height, depth);

    return (
        <group ref={ref} name="cursor">
            <Box {...container} />

            {/* <Box position={[-width/2, height/2, 0]} scale={[0.2, height, depth]} type="Static" /> */}
            {/* <Box position={[width/2, height/2, 0]} scale={[0.2, height, depth]} type="Static" /> */}

            {/* <Box position={[0, height/2, -depth/2]} scale={[width, height, 0.2]} transparent={true} type="Static" /> */}
            {/* <Box position={[0, height/2, depth/2]} scale={[width, height, 0.2]} transparent={true} type="Static" /> */}
        </group>
    )
}