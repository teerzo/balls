import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox } from '@react-three/cannon'

import Ball from './ball'
import Container from './container'

function Plane(props) {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
    return (
        <mesh ref={ref}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'grey'} />
        </mesh>
    )
}

function Cube(props) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 15, 0], ...props }))

    useFrame((state, delta) => (ref.current.position.z = 0))

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.5, 24, 24]} />

            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}



const R3FCanvas = forwardRef((props, ref) => {

    const [balls, setBalls] = useState([]);

    useImperativeHandle(ref, () => ({

        spawnBall() {
            // alert("getAlert from Child");
            // console.log('spawnBall');
            let _balls = [...balls];

            _balls.push(<Cube />);

            setBalls(_balls);
        }

    }));


    return (
        <div className='canvas-wrapper'>
            <Canvas camera={{ position: [0, 5, 15] }}>
                <OrbitControls target={[0, 5, 0]} />
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

                <Physics>
                    {/* Physics related objects in here please */}
                    <Container />
                    {/* <Ball /> */}

                    {balls.map((item, key) => {
                        // return item;
                        return <Cube key={key} />
                    })}

                    <Plane />
                    <Cube />

                </Physics>
            </Canvas>
        </div>
    )
});

export default R3FCanvas;