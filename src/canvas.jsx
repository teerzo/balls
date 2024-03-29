import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox, useSphere, Debug } from '@react-three/cannon'

import Balls from './balls';
import Container from './container'
import Cursor from './cursor'
import Camera from './camera'

// function Plane(props) {
//     const [ref] = usePlane(() => ({ type: 'Static', ...props }), useRef(null))
//     return (
//         <group ref={ref} name="plane">
//             {/* <mesh name="plane-1">
//                 <planeGeometry args={[props.width, props.height]} />
//                 <meshBasicMaterial color={props.color} transparent opacity={0} />
//             </mesh> */}
//             <mesh name="plane-2" receiveShadow>
//                 <planeGeometry args={[props.width + 1, props.height + 1]} />
//                 <meshStandardMaterial color={'#9b7653'} />
//             </mesh>
//         </group>
//     )
// }

const Plane = (props) => {
    const [ref] = usePlane(() => ({ ...props }), useRef(null))
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={'#9b7653'} />
        </mesh>
    )
}

const R3FCanvas = forwardRef((props, ref) => {

    const container = { width: 20, height: 30, depth: 3 };

    const [balls, setBalls] = useState([]);

    useEffect(() => {
        console.log('useEffect balls', balls);
    }, [balls])

    
   

    function collisionCheck(body, target) {
        // console.log('collisionCheck-start', body, target);
        console.log('collisionCheck-start', body?.userData.id, target?.userData.id);

        if (body.userData.size === target.userData.size) {
            let _balls = [];



            for (let i = 0; i < balls.length; i++) {
                let bodyMatch = false;
                let targetMatch = false;

                if (balls[i].id === body.userData.id) {
                    bodyMatch = true;
                }
                else if (balls[i].id === target.userData.id) {
                    targetMatch = true;
                }

                // for( let j in ids ) {
                //     if( balls[i].id === ids[j] ) {
                //         match = true;
                //     }
                // }
                if (bodyMatch) {
                    let _ball = { ...balls[i] };
                    // _ball.size += 1;
                    // _balls.push(_ball);
                    // const newBall = createBall(balls[i].size+1, balls[i].position);
                    // _balls.push(newBall);
                }
                else if (!bodyMatch && !targetMatch) {
                    // _balls.push(balls[i]);
                }
                _balls.push(balls[i]);
            }
            if (body.userData.size + 1 < 4) {
                const pos = [0, container.height, 0];
                const newBall = createBall(body.userData.size + 1, pos);
                // const newBall = createBall(3);
                newBall.direction = container.height;
                _balls.push(newBall);
            }

            console.log('collisionCheck balls', _balls);

            setBalls(_balls);
        }
    }

    function createBall(size = 0, position) {
        let date = Date.now();
        console.log('createBall', size, date);
        const onCollide = (e) => {
            if (e?.body?.name === 'ball' && e?.target?.name === 'ball') {
                // console.log('onCollide', e?.target?.name, e );
                collisionCheck(e.body, e.target);
            }
        }
        const radius = (size + 1) * 2.1 - 1;

        const newBall = { id: date, direction: container.height, size: size, radius: radius, position: position, onCollide }

        return newBall;
    }

    useImperativeHandle(ref, () => ({



        spawnBall() {
            const size = 0;
            const pos = getBallRand();
            console.log('pos', pos);
            // alert("getAlert from Child");
            // console.log('spawnBall');
            let _balls = [...balls];
            _balls.push(createBall(size, pos));
            setBalls(_balls);
        }
    }));

    function getBallRand() {

        const min = (-container.width / 2) + 1;
        const max = (container.width / 2) - 1;
        console.log('getBallRand', min, max);

        let pos = [getRand(min, max), container.height, 0];
        return pos;
    }

    function getRand(min, max) {
        return Math.random() * (max - min) + min;
    }


    return (
        <div className='canvas-wrapper'>
            <Canvas
                shadows
                camera={{ position: [0, container.height / 2, container.height] }}
                gl={{
                    // alpha: false,
                    // todo: stop using legacy lights
                    useLegacyLights: true,
                }}>

                <Camera container={container} />
                {/* <OrbitControls target={[0, container.height / 2, 0]} enabled={false} /> */}

                <pointLight position={[0, 20, 10]} castShadow />
                <ambientLight intensity={0.2} />

                {/* <ambientLight intensity={Math.PI / 2} /> */}
                {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
                {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}

                {/* <hemisphereLight intensity={0.35} /> */}
                <spotLight
                    position={[5, 5, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize-width={1028}
                    shadow-mapSize-height={1028}
                />



                {/* <Debug scale={1.01} color={"red"}> */}
                <Cursor container={container} />
                {/* </Debug> */}
                <Physics>
                    {/* Physics related objects in here please */}
                    {/* <Debug scale={1.01} color={"red"}> */}
                    <Container container={container} />
                    {/* </Debug> */}
                    <Debug scale={1.1} color={"green"}>
                        <Balls balls={balls} />
                    </Debug>
                    {/* <Debug scale={1.1} color={"green"}> */}
                    <Plane color={'grey'} width={20} height={20} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                    {/* </Debug> */}




                </Physics>
            </Canvas>
        </div>
    )
});

export default R3FCanvas;