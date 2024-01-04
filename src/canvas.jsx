import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox } from '@react-three/cannon'

import Ball from './ball'
import Container from './container'

// function Plane({ color, width, height, position, rotation, ...props}) {
//     const [ref] = usePlane(() => ({ position: position, rotation: rotation, ...props }))
//     return (
//         <mesh ref={ref}>
//             <planeGeometry args={[width, height]} />
//             <meshStandardMaterial color={color ? color : 'orange'} />
//         </mesh>
//     )
// }


function Plane(props) {
    const [ref] = usePlane(() => ({ type: 'Static', ...props }), useRef(null))
    return (
      <group ref={ref}>
        <mesh>
          <planeGeometry args={[props.width, props.height]} />
          <meshBasicMaterial color={props.color}/>
        </mesh>
        <mesh receiveShadow>
          <planeGeometry args={[props.width, props.height]} />
          <shadowMaterial color="lightsalmon" />
        </mesh>
      </group>
    )
  }
  

function Cube(props) {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 8, 0], ...props }))

    // useFrame((state, delta) => (ref.current.position.z = 0))

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

                    <Plane color={'grey'} width={20} height={20} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />

                    <Plane color={'red'} width={10} height={5} position={[-5, 5, 0]} rotation={[-Math.PI/2,Math.PI/2,0]} />
                    <Plane color={'red'} width={10} height={5} position={[5, 5, 0]} rotation={[-Math.PI/2,-Math.PI/2,0]} />

                    <Plane color={'green'} width={10} height={10} position={[0, 5, -2]} rotation={[0,0,0]} />
                    <Plane color={'blue'} width={10} height={10} position={[0, 5, 2]} rotation={[0,-Math.PI,0]} />

                    {/* <Plane color={'red'} width={1} height={1} position={[-10, -10, 0]} rotation={[0, 0, 0]} /> */}
                    {/* <Plane width={20} height={20} position={[10, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} /> */}
                    {/* <Plane rotation={[Math.PI / 2, 0, 0]} /> */}
                    <Cube />

                </Physics>
            </Canvas>
        </div>
    )
});

export default R3FCanvas;