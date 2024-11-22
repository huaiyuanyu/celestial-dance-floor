import * as THREE from 'three';

export default function createEarthPath() {
  const radius = 6;
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