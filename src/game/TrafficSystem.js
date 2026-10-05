// 3D Animated Traffic & Moving Vehicles System for Indian District
// Renders and moves Auto-rickshaws, Maruti-style 800/Ambassador cars, City buses, Scooters
import * as THREE from 'three';

export class TrafficSystem {
  constructor(scene, colliders) {
    this.scene = scene;
    this.colliders = colliders;
    this.vehicles = [];
    this.initVehicleMaterials();
    this.spawnTraffic();
  }

  initVehicleMaterials() {
    this.matAutoGreen = new THREE.MeshLambertMaterial({ color: 0x15803d });
    this.matAutoYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    this.matCarWhite = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    this.matCarRed = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    this.matBusBlue = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
    this.matGlass = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
    this.matWheel = new THREE.MeshLambertMaterial({ color: 0x18181b });
  }

  createAutoRickshaw() {
    const group = new THREE.Group();
    // Lower body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 2.8), this.matAutoGreen);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);
    // Yellow hood / top
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 2.2), this.matAutoYellow);
    top.position.set(0, 1.5, -0.2);
    group.add(top);
    // Windshield
    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.1), this.matGlass);
    glass.position.set(0, 1.4, 0.95);
    group.add(glass);
    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
    wGeo.rotateZ(Math.PI / 2);
    const wFront = new THREE.Mesh(wGeo, this.matWheel);
    wFront.position.set(0, 0.3, 1.0);
    const wBackL = new THREE.Mesh(wGeo, this.matWheel);
    wBackL.position.set(0.75, 0.3, -0.8);
    const wBackR = new THREE.Mesh(wGeo, this.matWheel);
    wBackR.position.set(-0.75, 0.3, -0.8);
    group.add(wFront, wBackL, wBackR);
    return group;
  }

  createIndianCar(colorMat) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 3.8), colorMat);
    body.position.y = 0.6;
    body.castShadow = true;
    group.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 2.0), colorMat);
    cabin.position.set(0, 1.25, -0.2);
    group.add(cabin);
    const glassF = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.1), this.matGlass);
    glassF.position.set(0, 1.25, 0.85);
    group.add(glassF);
    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 8);
    wGeo.rotateZ(Math.PI / 2);
    [
      { x: 0.9, z: 1.1 }, { x: -0.9, z: 1.1 },
      { x: 0.9, z: -1.1 }, { x: -0.9, z: -1.1 }
    ].forEach(p => {
      const w = new THREE.Mesh(wGeo, this.matWheel);
      w.position.set(p.x, 0.35, p.z);
      group.add(w);
    });
    return group;
  }

  createCityBus() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 7.5), this.matBusBlue);
    body.position.y = 1.6;
    body.castShadow = true;
    group.add(body);
    // Windshield
    const glassF = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.0, 0.1), this.matGlass);
    glassF.position.set(0, 2.0, 3.76);
    group.add(glassF);
    // Slogan board on bus: "राज्य सड़क परिवहन निगम"
    const sign = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    sign.position.set(0, 2.7, 3.76);
    group.add(sign);
    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 10);
    wGeo.rotateZ(Math.PI / 2);
    [
      { x: 1.2, z: 2.2 }, { x: -1.2, z: 2.2 },
      { x: 1.2, z: -2.2 }, { x: -1.2, z: -2.2 }
    ].forEach(p => {
      const w = new THREE.Mesh(wGeo, this.matWheel);
      w.position.set(p.x, 0.45, p.z);
      group.add(w);
    });
    return group;
  }

  spawnTraffic() {
    // Road lanes:
    // Main Road (Z axis): lane1 x: -4 (moving North to South, z+), lane2 x: 4 (moving South to North, z-)
    // Cross Road (X axis): lane1 z: -3.5 (moving West to East, x+), lane2 z: 3.5 (moving East to West, x-)

    // 1. Auto 1 on Main Road (Moving +Z)
    const auto1 = this.createAutoRickshaw();
    auto1.position.set(-4, 0, -50);
    this.scene.add(auto1);
    this.vehicles.push({
      mesh: auto1,
      axis: 'z',
      dir: 1,
      speed: 7.5,
      minLimit: -65,
      maxLimit: 65,
      fixedPos: -4
    });

    // 2. White Car on Main Road (Moving -Z)
    const car1 = this.createIndianCar(this.matCarWhite);
    car1.rotation.y = Math.PI;
    car1.position.set(4, 0, 50);
    this.scene.add(car1);
    this.vehicles.push({
      mesh: car1,
      axis: 'z',
      dir: -1,
      speed: 10.0,
      minLimit: -65,
      maxLimit: 65,
      fixedPos: 4
    });

    // 3. City Bus on Cross Road (Moving +X)
    const bus1 = this.createCityBus();
    bus1.rotation.y = -Math.PI / 2;
    bus1.position.set(-60, 0, -3.5);
    this.scene.add(bus1);
    this.vehicles.push({
      mesh: bus1,
      axis: 'x',
      dir: 1,
      speed: 6.0,
      minLimit: -70,
      maxLimit: 70,
      fixedPos: -3.5
    });

    // 4. Red Car on Cross Road (Moving -X)
    const car2 = this.createIndianCar(this.matCarRed);
    car2.rotation.y = Math.PI / 2;
    car2.position.set(60, 0, 3.5);
    this.scene.add(car2);
    this.vehicles.push({
      mesh: car2,
      axis: 'x',
      dir: -1,
      speed: 9.0,
      minLimit: -70,
      maxLimit: 70,
      fixedPos: 3.5
    });

    // 5. Auto 2 on Main Road (Moving -Z)
    const auto2 = this.createAutoRickshaw();
    auto2.rotation.y = Math.PI;
    auto2.position.set(4, 0, 10);
    this.scene.add(auto2);
    this.vehicles.push({
      mesh: auto2,
      axis: 'z',
      dir: -1,
      speed: 8.0,
      minLimit: -65,
      maxLimit: 65,
      fixedPos: 4
    });
  }

  update(delta) {
    this.vehicles.forEach(v => {
      if (v.axis === 'z') {
        v.mesh.position.z += v.dir * v.speed * delta;
        if (v.dir > 0 && v.mesh.position.z > v.maxLimit) {
          v.mesh.position.z = v.minLimit;
        } else if (v.dir < 0 && v.mesh.position.z < v.minLimit) {
          v.mesh.position.z = v.maxLimit;
        }
      } else if (v.axis === 'x') {
        v.mesh.position.x += v.dir * v.speed * delta;
        if (v.dir > 0 && v.mesh.position.x > v.maxLimit) {
          v.mesh.position.x = v.minLimit;
        } else if (v.dir < 0 && v.mesh.position.x < v.minLimit) {
          v.mesh.position.x = v.maxLimit;
        }
      }
    });
  }
}
