// Drivable Vehicle System for RashtraNiti 3D
// Allows player to enter parked vehicles (e.g. Campaign SUV / White Ambassador / Auto-Rickshaw),
// drive around the district roads, and exit anywhere.
import * as THREE from 'three';
import { sound } from '../systems/SoundFX.js';

export class DrivableVehicleSystem {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.drivableVehicles = [];
    this.currentVehicle = null;
    this.isDriving = false;

    this.spawnDrivableVehicles();
  }

  spawnDrivableVehicles() {
    // 1. Campaign White SUV / Leader's Vehicle near Tiranga Chowk / Bus Stop
    const suvGroup = this.createSuvMesh(0xf8fafc, '🇮🇳 जनसंपर्क वाहन');
    suvGroup.position.set(16, 0, 16);
    suvGroup.rotation.y = -Math.PI / 2;
    this.scene.add(suvGroup);

    this.drivableVehicles.push({
      id: 'veh_campaign_suv',
      nameHi: 'श्वेत जनसंपर्क वाहन (Campaign SUV)',
      mesh: suvGroup,
      speed: 0,
      maxSpeed: 16.0,
      turnSpeed: 2.2,
      acceleration: 14.0,
      friction: 8.0,
      position: suvGroup.position,
      rotation: suvGroup.rotation.y,
      steeringAngle: 0
    });

    // 2. Yellow-Green Auto-Rickshaw parked near Gupta Kirana / Market
    const autoGroup = this.createAutoMesh();
    autoGroup.position.set(-16, 0, 15);
    autoGroup.rotation.y = Math.PI / 2;
    this.scene.add(autoGroup);

    this.drivableVehicles.push({
      id: 'veh_local_auto',
      nameHi: 'स्थानीय ऑटो-रिक्शा (District Auto)',
      mesh: autoGroup,
      speed: 0,
      maxSpeed: 12.0,
      turnSpeed: 2.8,
      acceleration: 12.0,
      friction: 9.0,
      position: autoGroup.position,
      rotation: autoGroup.rotation.y,
      steeringAngle: 0
    });
  }

  createSuvMesh(colorHex, labelText) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: colorHex });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const chromeMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const saffronMat = new THREE.MeshBasicMaterial({ color: 0xff9933 });

    // Chassis / lower body
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 4.4), bodyMat);
    lowerBody.position.y = 0.75;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // Upper Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.85, 2.6), bodyMat);
    cabin.position.set(0, 1.5, -0.3);
    group.add(cabin);

    // Windshield front
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.65, 0.1), glassMat);
    frontGlass.position.set(0, 1.5, 1.02);
    group.add(frontGlass);

    // Rear Glass
    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.6, 0.1), glassMat);
    rearGlass.position.set(0, 1.5, -1.62);
    group.add(rearGlass);

    // Side Glasses
    [-0.93, 0.93].forEach(gx => {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 2.2), glassMat);
      sideGlass.position.set(gx, 1.52, -0.3);
      group.add(sideGlass);
    });

    // Front Bumper / Grille
    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 0.15), chromeMat);
    grille.position.set(0, 0.65, 2.22);
    group.add(grille);

    // Roof Flag / Saffron Banner
    const banner = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.25, 0.08), saffronMat);
    banner.position.set(0, 2.05, 0.2);
    group.add(banner);

    // 4 Wheels
    const wGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12);
    wGeo.rotateZ(Math.PI / 2);
    [
      { x: 1.05, z: 1.3 }, { x: -1.05, z: 1.3 },
      { x: 1.05, z: -1.3 }, { x: -1.05, z: -1.3 }
    ].forEach(p => {
      const w = new THREE.Mesh(wGeo, wheelMat);
      w.position.set(p.x, 0.42, p.z);
      group.add(w);
    });

    // Headlights
    [-0.7, 0.7].forEach(hx => {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      light.position.set(hx, 0.75, 2.22);
      group.add(light);
    });

    return group;
  }

  createAutoMesh() {
    const group = new THREE.Group();
    const greenMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const yellowMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x18181b });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 2.8), greenMat);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 2.2), yellowMat);
    hood.position.set(0, 1.5, -0.2);
    group.add(hood);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.1), glassMat);
    glass.position.set(0, 1.4, 0.95);
    group.add(glass);

    const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 10);
    wGeo.rotateZ(Math.PI / 2);
    const wFront = new THREE.Mesh(wGeo, wheelMat);
    wFront.position.set(0, 0.32, 1.05);
    const wBackL = new THREE.Mesh(wGeo, wheelMat);
    wBackL.position.set(0.75, 0.32, -0.8);
    const wBackR = new THREE.Mesh(wGeo, wheelMat);
    wBackR.position.set(-0.75, 0.32, -0.8);
    group.add(wFront, wBackL, wBackR);

    return group;
  }

  getNearbyDrivable(playerPos, maxDist = 4.0) {
    for (const v of this.drivableVehicles) {
      const dist = v.mesh.position.distanceTo(playerPos);
      if (dist <= maxDist) {
        return { vehicle: v, dist };
      }
    }
    return null;
  }

  enterVehicle(vehicle, player) {
    this.currentVehicle = vehicle;
    this.isDriving = true;
    sound.playInteract();

    // Hide player mesh or position player inside
    player.avatar.mesh.visible = false;
    player.position.copy(vehicle.mesh.position);
  }

  exitVehicle(player) {
    if (!this.currentVehicle) return;
    const v = this.currentVehicle;
    this.isDriving = false;

    // Place player right beside the vehicle
    const exitAngle = v.rotation + Math.PI / 2;
    player.position.x = v.mesh.position.x + Math.sin(exitAngle) * 2.2;
    player.position.z = v.mesh.position.z + Math.cos(exitAngle) * 2.2;
    player.position.y = 0;
    player.avatar.mesh.visible = true;
    player.avatar.mesh.position.copy(player.position);

    v.speed = 0;
    this.currentVehicle = null;
    sound.playClick();
  }

  update(delta, input, player) {
    if (!this.isDriving || !this.currentVehicle) return;

    const v = this.currentVehicle;

    // Movement inputs: forward (W/Up/JoystickY < 0), backward (S/Down/JoystickY > 0)
    let accelInput = 0;
    let steerInput = 0;

    if (input.moveForward) accelInput += 1;
    if (input.moveBackward) accelInput -= 1;
    if (input.moveLeft) steerInput += 1;
    if (input.moveRight) steerInput -= 1;

    if (input.joystickY !== undefined && Math.abs(input.joystickY) > 0.08) {
      accelInput -= input.joystickY; // dragging up moves forward
    }
    if (input.joystickX !== undefined && Math.abs(input.joystickX) > 0.08) {
      steerInput -= input.joystickX; // dragging left steers left
    }

    accelInput = Math.max(-1, Math.min(1, accelInput));
    steerInput = Math.max(-1, Math.min(1, steerInput));

    // Acceleration & Braking
    if (accelInput !== 0) {
      v.speed += accelInput * v.acceleration * delta;
      v.speed = Math.max(-v.maxSpeed * 0.45, Math.min(v.maxSpeed, v.speed));
    } else {
      // Natural rolling friction
      if (v.speed > 0) {
        v.speed = Math.max(0, v.speed - v.friction * delta);
      } else if (v.speed < 0) {
        v.speed = Math.min(0, v.speed + v.friction * delta);
      }
    }

    // Steering (effective when moving)
    if (Math.abs(v.speed) > 0.1 && steerInput !== 0) {
      const dirMultiplier = v.speed >= 0 ? 1 : -1;
      v.rotation += steerInput * v.turnSpeed * delta * dirMultiplier;
      v.mesh.rotation.y = v.rotation;
    }

    // Move in heading direction
    const moveDist = v.speed * delta;
    const nextX = v.mesh.position.x + Math.sin(v.rotation) * moveDist;
    const nextZ = v.mesh.position.z + Math.cos(v.rotation) * moveDist;

    // Collision check with world buildings
    if (!this.world.checkCollision(nextX, v.mesh.position.z, 1.2)) {
      v.mesh.position.x = nextX;
    } else {
      v.speed = 0;
    }

    if (!this.world.checkCollision(v.mesh.position.x, nextZ, 1.2)) {
      v.mesh.position.z = nextZ;
    } else {
      v.speed = 0;
    }

    // Sync player position to vehicle for camera follow
    player.position.copy(v.mesh.position);
  }
}
