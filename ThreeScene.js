import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 opacity

    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // GLTF Loader
    const loader = new GLTFLoader();
    loader.load(
      'ebonchill_magic_sword/scene.gltf', // Path to the model
      (gltf) => {
        console.log("Model loaded successfully");
        //scene.add(gltf.scene);
        gltf.scene.scale.set(0.4, 0.4, 0.4); // Scale the model to a visible size
        gltf.scene.position.set(-250, 0, 0); // Center the model
        // Add a BoxHelper to visualize the bounding box
        const boxHelper = new THREE.BoxHelper(gltf.scene, 0xffff00);
        scene.add(boxHelper);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('An error happened while loading the model:', error);
      }
    );

    camera.position.z = 100; // Position the camera further back
    camera.lookAt(scene.position); // Ensure the camera looks at the center of the scene

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}

export default ThreeScene;
