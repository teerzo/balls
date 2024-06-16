import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'


export default function Ball(props) {

    const api = useRef();

    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <RigidBody 
        colliders={false}
        ref={api}
        enabledTranslations={[true,true,false]}
        >
        <BallCollider args={[0.48]} />
        <mesh
            ref={meshRef}
            castShadow
            {...props}
            // scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
        </RigidBody>
    )
}


// function Ball({direction = 20, position, ...props}) {
    //     console.log('direction', direction);
    //     console.log('position', position);
    //     console.log('props', props);
    
    //     // const position = [ Math.floor(Math.random() * 5) , props?.position[1], 0];
    
    //     const [ref, api] = useSphere(
    //         () => ({
    //             args: [1],
    //             mass: 1,
    //             position: position,
    //             ...props
    //         }),
    //         useRef(null),
    //     )
    
    //     useEffect(() => {
    //         const x = Math.random();
    //         const y = -direction //Math.random();
    //         const z = Math.random();
    //         api.applyImpulse([x, y, z], [x, y, z])
    //         // api.position.set(0,0,0)
    
    //         console.log('BALL', props.size);
    //     }, [])
    
    
    //     return (
    //         <mesh castShadow receiveShadow ref={ref}>
    //             <sphereGeometry args={[1, 32, 32]} />
    //             <meshStandardMaterial color="red" />
    //         </mesh>
    //     )
    // }
// }