import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon'

// function Ball(props) {
//     // This reference will give us direct access to the mesh
//     const meshRef = useRef()
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//     // Subscribe this component to the render-loop, rotate the mesh every frame
//     // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
//     // Return view, these are regular three.js elements expressed in JSX
//     return (
//         <mesh
//             {...props}
//             ref={meshRef}
//             // scale={active ? 1.5 : 1}
//             onClick={(event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}>
//             <sphereGeometry args={[1, 24, 24]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//     )
// }

function ScalableBall(props) {
    const [ref, api] = useSphere(
        () => ({
            args: [1],
            mass: 1,
            // position: [0, 5, 0],
            ...props
        }),
        useRef(null),
    )
    const [sleeping, setSleeping] = useState(false)

    // Very quick demo to test forced sleep states. Catch ball mid-air to stop it.
    const toggle = () => {
        if (sleeping) {
            setSleeping(false)
            api.wakeUp()
        } else {
            setSleeping(true)
            api.sleep()
        }
    }

    return (
        <mesh castShadow receiveShadow ref={ref} onClick={toggle}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
    )
}

function Ball({direction = 20, position, ...props}) {

    console.log('direction', direction);
    console.log('position', position);
    console.log('props', props);

    // const position = [ Math.floor(Math.random() * 5) , props?.position[1], 0];

    const [ref, api] = useSphere(
        () => ({
            args: [1],
            mass: 1,
            position: position,
            ...props
        }),
        useRef(null),
    )

    useEffect(() => {
        const x = Math.random();
        const y = -direction //Math.random();
        const z = Math.random();
        api.applyImpulse([x, y, z], [x, y, z])
        // api.position.set(0,0,0)

        console.log('BALL', props.size);
    }, [])


    return (
        <mesh castShadow receiveShadow ref={ref}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="red" transparent opacity={0.5} />
        </mesh>
    )
}

function LBall(props) {
    console.log('ball', props.id, props.size);
    const balls = [
        { color: '#FF0000' },
        { color: '#00FF00' },
        { color: '#0000FF' },
        { color: '#FFFFFF' },
    ]
    const number = 1;
    // const radius = props.size + 1;

    const [ref, api] = useSphere(() => ({
        args: [props.radius],
        // isTrigger: true, 
        mass: 1,
        position: props.position,
        ...props
    }),
        useRef(null),
    )
    useFrame((state, delta) => { })

    useEffect(() => {
        const x = Math.random();
        const y = props.direction //Math.random();
        const z = Math.random();
        // api.applyImpulse([x, y, z], [x, y, z])
        // api.position.set(0,0,0)

        console.log('BALL', props.size);
    }, [])

    useEffect(() => {
        // if (props.size !== size) {
        //     if (props.size < balls.length) {
        //         setSize(props.size);
        //         setRadius(props.size + 1);
        //     }
        // }
    }, [props])
    // return (
    //     <instancedMesh ref={ref} name="ball" userData={props.userData}>
    //         <sphereGeometry args={[props.size + 1, 24, 24]} />
    //         <meshStandardMaterial color={balls[props.size].color} />
    //     </instancedMesh>
    // )
    return (
        <instancedMesh name="ball" userData={props.userData} receiveShadow castShadow ref={ref} args={[undefined, undefined, number]}>
            <sphereGeometry args={[props.size + 1, 24]}>
                {/* <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} /> */}
            </sphereGeometry>
            <meshLambertMaterial color={balls[props.size].color} />
        </instancedMesh>
    )
}

export default function Balls({ balls, ...props }) {

    useEffect(() => {
        console.log('balls', balls);
    }, [balls])

    return (
        <group>
            <ScalableBall />
            {balls && balls.length > 1 ?
                balls.map((item, key) => {
                    return <Ball key={key} {...item} />
                })
                : null
            }
            {/* <ScalableBall key={key} /> */}

        </group>
    )
}
