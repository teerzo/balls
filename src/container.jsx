import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { useBox } from '@react-three/cannon'


function Box({ position, scale = [1, 1, 1], transparent = false, ...props }) {
    // This reference will give us direct access to the mesh

    const [ref, api] = useBox(
        () => ({
            args: scale,
            mass: 999,
            position: position ? position : [0, 0, 0],
            // type: 'Box'
            ...props,
        }),
        useRef(null),
    )

    // const [ref, api] = useBox(() => ({ args: [2, 1, 1], mass: 1, ...props }),
    // Set up state for the hovered and active state
    // const [hovered, setHover] = useState(false)
    // const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh name={props.name}
            ref={ref}
            castShadow
            {...props}
        >
            <boxGeometry args={scale ? scale : [1, 1, 1]} />
            <meshStandardMaterial color={'orange'} transparent opacity={transparent ? 0.0 : 0.5} />
        </mesh>
    )
}

export default function Container({ container, ...props }) {
    const ref = useRef()

    const { width, height, depth} = {...container};


    return (
        <group ref={ref} name="container">
            {/* <Box name={'box-1'} /> */}
            {/* <Box position={[-5, 1, 0]} scale={[1,1,1]} /> */}
            {/* <Box position={[-5, 5, 0]} scale={[1,1,1]} /> */}
            <Box position={[-width/2, height/2, 0]} scale={[0.2, height, depth]} type="Static" />
            <Box position={[width/2, height/2, 0]} scale={[0.2, height, depth]} type="Static" />

            <Box position={[0, height/2, -depth/2]} scale={[width, height, 0.2]} type="Static" />
            <Box position={[0, height/2, depth/2]} scale={[width, height, 0.2]} transparent={true} type="Static" />

        </group>
    )
    // return (
    //     <>
    //         <Box position={[-5, 0, 0]} />
    //         <Box position={[-5, 5, 0]} />
    //         <Box position={[-5, 10, 0]} />

    //         <Box position={[0, 0, 0]} />

    //         <Box position={[5, 0, 0]} />
    //         <Box position={[5, 5, 0]} />
    //         <Box position={[5, 10, 0]} />
    //     </>
    // )
}