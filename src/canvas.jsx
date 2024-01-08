import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox, useSphere, Debug } from '@react-three/cannon'

import Balls from './balls';
import Container from './container'

function Plane(props) {
    const [ref] = usePlane(() => ({ type: 'Static', ...props }), useRef(null))
    return (
        <group ref={ref} name="plane">
            <mesh name="plane-1">
                <planeGeometry args={[props.width, props.height]} />
                <meshBasicMaterial color={props.color} />
            </mesh>
            <mesh name="plane-2" receiveShadow>
                <planeGeometry args={[props.width + 1, props.height + 1]} />
                <shadowMaterial color="lightsalmon" />
            </mesh>
        </group>


    )
}

const R3FCanvas = forwardRef((props, ref) => {

    const container = { width: 3, height: 20 };

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
            const pos = [getRand(-container.width/2, container.width/2), container.height, 0];
            console.log('pos', pos);
            // alert("getAlert from Child");
            // console.log('spawnBall');
            let _balls = [...balls];
            _balls.push(createBall(size, pos));
            setBalls(_balls);
        }
    }));

    function getRand(min, max) {
        return Math.random() * (max - min) + min;
    }


    return (
        <div className='canvas-wrapper'>
            <Canvas
                // shadows 
                camera={{ position: [0, container.height/2, container.height] }}
                gl={{
                    // alpha: false,
                    // todo: stop using legacy lights
                    // useLegacyLights: true,
                }}>
                <OrbitControls target={[0, container.height/2, 0]} />
                <ambientLight intensity={Math.PI / 2} />
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


                <Physics>
                    {/* Physics related objects in here please */}
                    <Debug scale={1.01} color={"red"}>
                        <Container width={container.width} height={container.height} />
                    </Debug>
                    <Debug scale={1.1} color={"green"}>

                        <Balls balls={balls} />
                    </Debug>

                    {/* {balls.map((item, key) => {
                        // return item;
                        return <Ball key={key} size={item.size} radius={item.radius} position={item.position} direction={item.direction} userData={{ id: item.id, size: item.size }} onCollide={item.onCollide} />
                    })} */}
                    <Debug scale={1.1} color={"green"}>

                        <Plane color={'grey'} width={20} height={20} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />
                    </Debug>

                    {/* <Plane color={'red'} width={10} height={5} position={[-5, 5, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} /> */}
                    {/* <Plane color={'red'} width={10} height={5} position={[5, 5, 0]} rotation={[-Math.PI / 2, -Math.PI / 2, 0]} /> */}

                    {/* <Plane color={'green'} width={10} height={10} position={[0, 5, -3]} rotation={[0, 0, 0]} /> */}
                    {/* <Plane color={'blue'} width={10} height={10} position={[0, 5, 3]} rotation={[0, -Math.PI, 0]} /> */}

                </Physics>
            </Canvas>
        </div>
    )
});

export default R3FCanvas;