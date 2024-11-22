import * as THREE from 'three';

export default function createEarthObject() {
  const group = new THREE.Group();

  const geometry = new THREE.SphereGeometry(1);
  const material = new THREE.MeshBasicMaterial({color: 0xbdd28d})
  const sphere = new THREE.Mesh(geometry, material);

  group.add(sphere);

  // const light = new THREE.PointLight(0xffffff, 5, 100);
  // light.position.set(3, 3, 3);
  // group.add(light);

  return group;

}