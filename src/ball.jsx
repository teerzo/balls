import { createRoot } from 'react-dom/client'
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'


// export default function Ball(props) {

//     const api = useRef();

//     // This reference will give us direct access to the mesh
//     const meshRef = useRef()
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//     // Subscribe this component to the render-loop, rotate the mesh every frame
//     // useFrame((state, delta) => (meshRef.current.rotation.x += delta))
//     // Return view, these are regular three.js elements expressed in JSX

//     const colours = ['orange','red', 'green', 'blue', 'hotpink'];

//     return (
//         <RigidBody 
//         colliders={false}
//         ref={api}
//         enabledTranslations={[true,true,false]}
//         >
//         <BallCollider args={[0.48]} />
//         <mesh
//             ref={meshRef}
//             castShadow
//             {...props}
//             // scale={active ? 1.5 : 1}
//             onClick={(event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}>
//             <sphereGeometry args={[1, 24, 24]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
//         </mesh>
//         </RigidBody>
//     )
// }

export default function Ball({ ...props }) {
    const api = useRef()
    // const { nodes, materials } = useGLTF('/smileys-transformed.glb');

    //             <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />

    // const size = 1;
    const colours = ['orange', 'red', 'green', 'blue', 'hotpink'];

    // const [size, setSize] = useState(Math.random() * colours.length);
    const defaultSize = 0.5;
    const sizeFactor = 0.1;
    const [size, setSize] = useState(defaultSize);

    const [position, setPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if( props.position) {
            setPosition(props.position);
        }
    },[]);

    useEffect(() => {
        if (props.size > 1 && props.size <= colours.length) {

            setSize(defaultSize + (props.size * sizeFactor));
        }
    }, [props.size])

    return (
        <RigidBody
            name={props.name}
            size={size}
            userData={{ size: size, disabled: false }}
            colliders={false}
            ref={api}
            type='dynamic'
            // uncomment next line to lock rotations to Z
            // enabledRotations={[false, false, true]}
            enabledTranslations={[true, true, false]}
            linearDamping={1}
            angularDamping={1}
            restitution={1}
            onCollisionEnter={({ manifold, target, other }) => {
                // setSize(size + 1);

                // setSize(size > 1 ? size - 1 : 1);
                if (props.onCollision) {
                    props.onCollision(manifold, target, other);
                }
            }}
            {...props}>
            <BallCollider args={[size - 0.02]} />
            <mesh

                castShadow
                receiveShadow
                onClick={() => {
                    // setSize(size > 1 ? size - 1 : 1);

                    // setSize(size + 1);
                    // api.current.applyImpulse({ x: 0, y: 4, z: 0 }, true)
                    // api.current.applyTorqueImpulse({ x: Math.random() / 2, y: Math.random() / 2, z: Math.random() / 2 }, true)
                }}
                // geometry={nodes[which].geometry}
                // material={materials.PaletteMaterial001}
                material-roughness={0.2}
                material-toneMapped={false}
            >
                <sphereGeometry args={[size, 24, 24]} />
                <meshStandardMaterial color={colours[props.size - 1]} />
            </mesh>
        </RigidBody>
    )
}