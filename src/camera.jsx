import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
// import { Physics, usePlane, useBox, useSphere, Debug } from '@react-three/cannon'
import * as THREE from "three";


export default function Camera({ container, ...props }) {

    const { width, height, depth} = {...container};


    useThree((state) => {
        state.camera?.lookAt(new THREE.Vector3(0, height/2, depth/2))
        state.camera.up = new THREE.Vector3(0, 1, 0);
        state.camera.updateProjectionMatrix()
    });

    return (
        <OrbitControls target={[0, container.height / 2, 0]} enabled={false} />
    )
}