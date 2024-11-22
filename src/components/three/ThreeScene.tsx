"use client"

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as Tone from 'tone';

const createPlanet = (radius: number, meshParams: THREE.MeshBasicMaterialParameters) => {
  const group = new THREE.Group();

  const geometry = new THREE.SphereGeometry(radius);
  const material = new THREE.MeshBasicMaterial(meshParams)
  const sphere = new THREE.Mesh(geometry, material);

  group.add(sphere);

  // const light = new THREE.PointLight(0xffffff, 5, 100);
  // light.position.set(3, 3, 3);
  // group.add(light);

  return group;
}

const createPlanetPath = (rad: number) => {
  const radius = rad;
  const segments = 32;

  const points = []
  for (let i = 0; i <= segments; i++) {
    const angle = (i/segments) * Math.PI * 2; //angle in radians
    points.push(new THREE.Vector3(
      radius * Math.cos(angle),
      radius * Math.sin(angle),
      0
    ))
  }

  const path = new THREE.CatmullRomCurve3(points, true);

  return path
}

const createPathObject = (path: THREE.CatmullRomCurve3, params: THREE.LineBasicMaterialParameters) => {
  const pathGeometry = new THREE.BufferGeometry().setFromPoints(
    path.getPoints(50)
  );

  const pathMaterial = new THREE.LineBasicMaterial(params);
  const pathObject = new THREE.Line(pathGeometry, pathMaterial);

  return pathObject;
}

const planetAudioMap = new Map<string, Tone.Player>();
const planetOutlineMap = new Map<string, THREE.Mesh>();

const ThreeScene: React.FC = () => {

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.set(20, 10, 15);
      camera.lookAt(0, 0, 0);

      const mercury = createPlanet(0.5, {color: 0xe5e5e5});
      mercury.traverse((child) => {
        child.name = "mercury"
      })
      const mercuryPath = createPlanetPath(1.5);
      const mercuryPathObject = createPathObject(mercuryPath, {color: 0xff00ff});

      scene.add(mercury);
      scene.add(mercuryPathObject);

      const venus = createPlanet(0.6, {color: 0xbd7f40});
      venus.traverse((child) => {
        child.name = "venus"
      })
      const venusPath = createPlanetPath(3);
      const venusPathObject = createPathObject(venusPath, {color: 0x0000ff})

      scene.add(venus);
      scene.add(venusPathObject);

      const earth = createPlanet(0.7, {color: 0xbdd28d});
      earth.traverse((child) => {
        child.name = "earth"
      })
      const earthPath = createPlanetPath(5);
      const earthPathObject = createPathObject(earthPath, {color: 0x2e6bb2})

      scene.add(earth);
      scene.add(earthPathObject);

      const mars = createPlanet(0.8, {color: 0xec6e2f});
      mars.traverse((child) => {
        child.name = "mars"
      })
      const marsPath = createPlanetPath(6.5);
      const marsPathObject = createPathObject(marsPath, {color: 0x7d4826});

      scene.add(mars);
      scene.add(marsPathObject)

      const jupiter = createPlanet(0.9, {color: 0xe9d1aa});
      jupiter.traverse((child) => {
        child.name = "jupiter"
      })
      const jupiterPath = createPlanetPath(8.5);
      const jupiterPathObject = createPathObject(jupiterPath, {color: 0x975e23});

      scene.add(jupiter)
      scene.add(jupiterPathObject)

      const saturn = createPlanet(1, {color: 0xc7bbab})
      saturn.traverse((child) => {
        child.name = "saturn"
      })
      const saturnPath = createPlanetPath(11.5)
      const saturnPathObject = createPathObject(saturnPath, {color: 0x766453})

      scene.add(saturn)
      scene.add(saturnPathObject)

      const uranus = createPlanet(1.1, {color: 0x74b9c0})
      uranus.traverse((child) => {
        child.name = "uranus"
      })
      const uranusPath = createPlanetPath(14.5)
      const uranusPathObject = createPathObject(uranusPath, {color: 0xafc8cf})

      scene.add(uranus)
      scene.add(uranusPathObject)

      const neptune = createPlanet(1.2, {color: 0x346bc1})
      neptune.traverse((child) => {
        child.name = "neptune"
      })
      const neptunePath = createPlanetPath(18)
      const neptunePathObject = createPathObject(neptunePath, {color: 0x86c9f9})

      scene.add(neptune)
      scene.add(neptunePathObject)

      let initialMousePosition = { x: 0, y: 0 };
      let isDragging = false;

      const handleMouseDown = (event: MouseEvent) => {
        // Store the initial mouse position
        initialMousePosition = { x: event.clientX, y: event.clientY };
        isDragging = true;
      };

      const handleMouseUp = (event: MouseEvent) => {
        // Stop dragging
        isDragging = false;

        const deltaX = Math.abs(event.clientX - initialMousePosition.x);
        const deltaY = Math.abs(event.clientY - initialMousePosition.y);
        const movementThreshold = 5; // Adjust as needed
        
        if (deltaX <= movementThreshold && deltaY <= movementThreshold) {
          // Handle click if movement is small
          handlePlanetClick(initialMousePosition); // Pass mousedown position
        }
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) return; // Only rotate the camera while dragging

        // Calculate the change in mouse position (delta)
        const deltaMove = {
          x: event.clientX - initialMousePosition.x,
          y: event.clientY - initialMousePosition.y,
        };

        rotateCamera(deltaMove);  

        // Update initial mouse position for the next movement
        initialMousePosition = { x: event.clientX, y: event.clientY };
      };

      const rotateCamera = (deltaMove: { x: number; y: number }) => {
        const rotationSpeed = 0.005;
        const angleX = deltaMove.x * rotationSpeed;
        const angleY = deltaMove.y * rotationSpeed;

        const radius = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);

        spherical.theta -= angleX; // Horizontal rotation
        spherical.phi -= angleY; // Vertical rotation
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi)); // Clamp vertical movement

        const newCameraPosition = new THREE.Vector3().setFromSpherical(spherical);
        camera.position.copy(newCameraPosition);
        camera.lookAt(0, 0, 0);
      };

      const addPlanetOutline = (mesh: THREE.Mesh, planetName: string) => {
        if (planetOutlineMap.has(planetName)) return;

        const outlineMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          side: THREE.BackSide,
        });

        const outlineGeometry = mesh.geometry.clone();
        const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
        outlineMesh.scale.multiplyScalar(1.05);
        outlineMesh.name = `${planetName}-outline`;

        mesh.parent?.add(outlineMesh);
        planetOutlineMap.set(planetName, outlineMesh);
      }

      const removePlanetOutline = (planetName: string) => {
        const outlineMesh = planetOutlineMap.get(planetName);
        if (outlineMesh) {
          outlineMesh.parent?.remove(outlineMesh);
          planetOutlineMap.delete(planetName);
        }
      }

const handlePlanetClick = (mousePosition: { x: number; y: number }) => {
  const mouse = new THREE.Vector2(
    (mousePosition.x / window.innerWidth) * 2 - 1,
    -(mousePosition.y / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  const meshes = intersects.filter((intersection) => intersection.object.type === 'Mesh');

  if (meshes.length > 0) {
    const clickedMesh = meshes[0].object as THREE.Mesh;
    const planetName = clickedMesh.name;

    if (!planetName) return;

    if (planetAudioMap.has(planetName)) {
      const player = planetAudioMap.get(planetName);

      if (player?.state === 'started') {
        player.stop();
        console.log(`${planetName} audio stopped.`);
        removePlanetOutline(planetName);
      } else {
        player?.start()
        console.log(`${planetName} audio started.`);
        addPlanetOutline(clickedMesh, planetName);
      }
    } else {

      const player = new Tone.Player(`/audio/${planetName}.mp3`, () => {
        player.loop = true;
        player.volume.value = -10;
        player.start();
        console.log(`${planetName} audio started.`);
        addPlanetOutline(clickedMesh, planetName);
      }).toDestination();

      planetAudioMap.set(planetName, player);
    }
  }
};

      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      const renderScene = () => {
        renderer.render(scene, camera);

        const time = Date.now();

        const mercSpeed = 5000;
        const venSpeed = 6000;
        const earthSpeed = 7000;
        const marsSpeed = 8000;
        const jupSpeed = 9000;
        const satSpeed = 10500;
        const uraSpeed = 11000;
        const nepSpeed = 12500;

        const mercT = 1 - (time / mercSpeed) % 1;
        const venT = 1 - (time / venSpeed) % 1;
        const earthT = 1 - (time / earthSpeed) % 1;
        const marsT = 1 - (time / marsSpeed) % 1;
        const jupT = 1 - (time / jupSpeed) % 1;
        const satT = 1 - (time / satSpeed) % 1;
        const uraT = 1 - (time / uraSpeed) % 1;
        const nepT = 1 - (time / nepSpeed) % 1;

        const mercuryPosition = mercuryPath.getPointAt(mercT);
        mercury.position.copy(mercuryPosition);

        const venusPosition = venusPath.getPointAt(venT);
        venus.position.copy(venusPosition);

        const earthPosition = earthPath.getPointAt(earthT);
        earth.position.copy(earthPosition);

        const marsPosition = marsPath.getPointAt(marsT);
        mars.position.copy(marsPosition);

        const jupiterPosition = jupiterPath.getPointAt(jupT);
        jupiter.position.copy(jupiterPosition);

        const saturnPosition = saturnPath.getPointAt(satT);
        saturn.position.copy(saturnPosition);

        const uranusPosition = uranusPath.getPointAt(uraT);
        uranus.position.copy(uranusPosition);

        const neptunePosition = neptunePath.getPointAt(nepT);
        neptune.position.copy(neptunePosition);

        requestAnimationFrame(renderScene);
      }

      renderScene();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width/height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        planetAudioMap.forEach((player) => {
          if (player.state === 'started') player.stop();
        });
        planetAudioMap.clear();
      }
    }
  }, []);
  return <div ref={containerRef} />;
};
export default ThreeScene;