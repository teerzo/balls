import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Stats, OrbitControls, useGLTF } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'

import { create } from 'zustand'

import * as THREE from "three";

// import { useRef } from 'react'
// import { Canvas, useThree } from '@react-three/fiber'
// import { Environment, Lightformer, useGLTF } from '@react-three/drei'
// import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'

import Ball from './ball';

// import Balls from './balls';
// import Container from './container'
// import Cursor from './cursor'
import Camera from './camera'

const useBallStore = create((set) => ({
    ballCount: 0,
    balls: [],
    addBall: (size, position) => {
        console.log('addBall', size, position);
        set((state) => ({ balls: [...state.balls, { size, position, name: 'ball-' + state.ballCount+1 }], ballCount: state.ballCount + 1 }))
    },
    mergeBalls: (a, b) => {
        console.log('mergeBalls', a, b);

        set((state) => ({ balls: state.balls.filter(ball => ball.name !== a && ball.name !== b) }));
    }
}));



const Walls = (props) => {
    const { width, height } = useThree((state) => state.viewport);
    return (
        <>
            <CuboidCollider position={[0, -height / 2 - 1, 0]} args={[width / 2, 1, 1]} />
            <CuboidCollider position={[-width / 2 - 1, 0, 0]} args={[1, height * 10, 10]} />
            <CuboidCollider position={[width / 2 + 1, 0, 0]} args={[1, height * 10, 1]} />
        </>
    )
}


const R3FCanvas = forwardRef((props, ref) => {

    const shapes = ['heart', 'blink', 'blush', 'laugh'];
    const { nodes, materials } = useGLTF('/smileys-transformed.glb');
    const container = { width: 20, height: 30, depth: 3 };

    const balls = useBallStore((state) => state.balls);
    const addBall = useBallStore((state) => state.addBall);
    const mergeBalls = useBallStore((state) => state.mergeBalls);

    useEffect(() => {
        // addBall(1, [0, 5, 0]);
    }, [])


    // useImperativeHandle(ref, () => ({
    //     spawnBall() {
    //         addBall(1, [0, 20, 0]);
    //     }
    // }));



    function spawnBall(event) {
        event.preventDefault();

        const pos = getBallRand();

        addBall(1, [...pos]);
    }




    // function collisionCheck(body, target) {
    //     // console.log('collisionCheck-start', body, target);
    //     console.log('collisionCheck-start', body?.userData.id, target?.userData.id);

    //     if (body.userData.size === target.userData.size) {
    //         let _balls = [];



    //         for (let i = 0; i < balls.length; i++) {
    //             let bodyMatch = false;
    //             let targetMatch = false;

    //             if (balls[i].id === body.userData.id) {
    //                 bodyMatch = true;
    //             }
    //             else if (balls[i].id === target.userData.id) {
    //                 targetMatch = true;
    //             }

    //             // for( let j in ids ) {
    //             //     if( balls[i].id === ids[j] ) {
    //             //         match = true;
    //             //     }
    //             // }
    //             if (bodyMatch) {
    //                 let _ball = { ...balls[i] };
    //                 // _ball.size += 1;
    //                 // _balls.push(_ball);
    //                 // const newBall = createBall(balls[i].size+1, balls[i].position);
    //                 // _balls.push(newBall);
    //             }
    //             else if (!bodyMatch && !targetMatch) {
    //                 // _balls.push(balls[i]);
    //             }
    //             _balls.push(balls[i]);
    //         }
    //         if (body.userData.size + 1 < 4) {
    //             const pos = [0, container.height, 0];
    //             const newBall = createBall(body.userData.size + 1, pos);
    //             // const newBall = createBall(3);
    //             newBall.direction = container.height;
    //             _balls.push(newBall);
    //         }

    //         console.log('collisionCheck balls', _balls);

    //         setBalls(_balls);
    //     }
    // }

    // function createBall(size = 1, position) {
    //     // let date = Date.now();
    //     // console.log('createBall', size, date);
    //     // const onCollide = (e) => {
    //     //     if (e?.body?.name === 'ball' && e?.target?.name === 'ball') {
    //     //         // console.log('onCollide', e?.target?.name, e );
    //     //         collisionCheck(e.body, e.target);
    //     //     }
    //     // }
    //     // const radius = (size + 1) * 2.1 - 1;

    //     // const newBall = { id: date, direction: container.height, size: size, radius: radius, position: position, onCollide }

    //     let _ball = { size: size, position: position };

    //     let _balls = [...balls];
    //     _balls.push(_ball);
    //     setBalls(_balls); 
    // }



    function getBallRand() {

        const min = (-container.width / 2) + 1;
        const max = (container.width / 2) - 1;
        // console.log('getBallRand', min, max);

        let pos = [getRand(min, max), 10, 0];
        // let pos = [getRand(min, max), container.height, 0];
        return pos;
    }

    function getRand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function handleBallCollision(manifold, target, other) {
        const position = new THREE.Vector3();


        if (target && other) {
            if (target.rigidBodyObject && other.rigidBodyObject) {
                // console.log('handleBallCollision', target.rigidBodyObject, other.rigidBodyObject);

                if (target.rigidBodyObject.name.indexOf('ball-') === 0 && other.rigidBodyObject.name.indexOf('ball-') === 0) {
                    if (target.rigidBodyObject.size === other.rigidBodyObject.size) {
                        if (target.rigidBodyObject.userData.disabled === false && other.rigidBodyObject.userData.disabled === false) {

                            console.log('handleBallCollision', target.rigidBodyObject, other.rigidBodyObject);

                            target.rigidBodyObject.userData.disabled = true;
                            other.rigidBodyObject.userData.disabled = true;

                            position.copy( target.rigidBodyObject.position);

                            mergeBalls(target.rigidBodyObject.name, other.rigidBodyObject.name);
                            addBall(target.rigidBodyObject.size + 1, position);
                        }
                    }
                }
            }
        }
    }




    return (
        <div className='canvas-wrapper'>
            <div className="header">
                <button onClick={spawnBall}> SPAWN </button>
            </div>
            {/* <Canvas shadows orthographic camera={{ position: [0, 0, 10], zoom: 180 }}> */}
            <Canvas shadows camera={{ position: [0, 0, 10], zoom: 1 }}>
                <OrbitControls target={[0, 0, 0]} enabled={true} />

                <ambientLight intensity={Math.PI} />
                <spotLight decay={0} position={[5, 10, 2.5]} angle={0.2} castShadow />
                <Physics debug>
                    {balls.map((ball, index) => {
                        return <Ball key={index} name={ball.name} size={ball.size} position={ball.position} onCollision={handleBallCollision} />
                    })}

                    {/* {Array.from({ length: 50 }, (v, i) => (
                        <Ball key={i} which={shapes[i % shapes.length]} size={1} position={[Math.random(), 10 + Math.random() * 10, 0]} onCollision={handleBallCollision} />
                    ))} */}
                    <Walls />
                </Physics>
                <Environment>
                    <Lightformer form="rect" intensity={4} position={[15, 10, 10]} scale={20} onCreated={(self) => self.lookAt(0, 0, 0)} />
                    <Lightformer intensity={2} position={[-10, 0, -20]} scale={[10, 100, 1]} onCreated={(self) => self.lookAt(0, 0, 0)} />
                </Environment>
            </Canvas>

            {/* <Canvas
                shadows
                camera={{ position: [0, 0, 10], zoom: 1 }}
                gl={{
                    // alpha: false,
                    // todo: stop using legacy lights
                    useLegacyLights: true,
                }}> */}

            {/* <Camera container={container} position={[0, 0, 10]} zoom={1} /> */}
            {/* <OrbitControls target={[0, container.height / 2, 0]} enabled={false} /> */}

            {/* <pointLight position={[0, 20, 10]} castShadow /> */}
            {/* <ambientLight intensity={0.2} /> */}

            {/* <ambientLight intensity={Math.PI / 2} /> */}
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
            {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}

            {/* <hemisphereLight intensity={0.35} /> */}
            {/* <spotLight
                    position={[5, 5, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize-width={1028}
                    shadow-mapSize-height={1028}
                /> */}



            {/* <Debug scale={1.01} color={"red"}> */}
            {/* <Cursor container={container} /> */}
            {/* </Debug> */}
            {/* <Physics> */}
            {/* Physics related objects in here please */}
            {/* <Debug scale={1.01} color={"red"}> */}
            {/* <Container container={container} /> */}
            {/* </Debug> */}
            {/* <Debug scale={1.1} color={"green"}> */}
            {/* <Balls balls={balls} /> */}
            {/* </Debug> */}


            {/* {Array.from({ length: 10 }, (v, i) =>
                        <Ball key={i} which={shapes[i % shapes.length]} position={[Math.random(), 10 + Math.random() * 10, 0]} />
                    )}
                    <Walls /> */}


            {/* </Physics> */}
            {/* </Canvas> */}
        </div>
    )
});

export default R3FCanvas;