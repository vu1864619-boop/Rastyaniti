// 3D Avatar Generator and Controller for Player and Indian NPCs
import * as THREE from 'three';
import { sound } from '../systems/SoundFX.js';

export class CharacterModel {
  static createAvatarMesh(options = {}) {
    const {
      skinColor = '#dca180',
      hairColor = '#1a1a1a',
      shirtColor = '#f8fafc',
      pantsColor = '#1e293b',
      sashColor = '#ff9933',
      hasSash = true,
      scale = 1.0
    } = options;

    const group = new THREE.Group();

    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const hairMat = new THREE.MeshLambertMaterial({ color: hairColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x332211 });
    const sashMat = new THREE.MeshLambertMaterial({ color: sashColor });

    // Torso / Kurta
    const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.4);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 1.25;
    torso.castShadow = true;
    group.add(torso);

    // Kurta Lower flare (traditional Indian long kurta hem)
    const kurtaLowerGeo = new THREE.BoxGeometry(0.72, 0.4, 0.42);
    const kurtaLower = new THREE.Mesh(kurtaLowerGeo, shirtMat);
    kurtaLower.position.y = 0.65;
    kurtaLower.castShadow = true;
    group.add(kurtaLower);

    // Head
    const headGeo = new THREE.BoxGeometry(0.42, 0.46, 0.42);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.95;
    head.castShadow = true;
    group.add(head);

    // Hair
    const hairGeo = new THREE.BoxGeometry(0.46, 0.22, 0.46);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 2.15, 0);
    group.add(hair);

    // Political stole / Gamchha / Angavastram (Iconic Indian political attire)
    if (hasSash) {
      const sashGeo = new THREE.BoxGeometry(0.74, 0.95, 0.44);
      const sash = new THREE.Mesh(sashGeo, sashMat);
      sash.position.y = 1.25;
      group.add(sash);
    }

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.45, 1.6, 0);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), shirtMat);
    leftArm.position.y = -0.35;
    leftArmGroup.add(leftArm);
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.18), skinMat);
    leftHand.position.y = -0.75;
    leftArmGroup.add(leftHand);
    group.add(leftArmGroup);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.45, 1.6, 0);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), shirtMat);
    rightArm.position.y = -0.35;
    rightArmGroup.add(rightArm);
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.18), skinMat);
    rightHand.position.y = -0.75;
    rightArmGroup.add(rightHand);
    group.add(rightArmGroup);

    // Left Leg / Pyjama
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.2, 0.65, 0);
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), pantsMat);
    leftLeg.position.y = -0.32;
    leftLegGroup.add(leftLeg);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.38), shoeMat);
    leftShoe.position.set(0, -0.68, 0.06);
    leftLegGroup.add(leftShoe);
    group.add(leftLegGroup);

    // Right Leg / Pyjama
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-0.2, 0.65, 0);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), pantsMat);
    rightLeg.position.y = -0.32;
    rightLegGroup.add(rightLeg);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.38), shoeMat);
    rightShoe.position.set(0, -0.68, 0.06);
    rightLegGroup.add(rightShoe);
    group.add(rightLegGroup);

    group.scale.set(scale, scale, scale);

    return {
      mesh: group,
      leftArmGroup,
      rightArmGroup,
      leftLegGroup,
      rightLegGroup
    };
  }
}

export class PlayerCharacter {
  constructor(scene, customData) {
    this.scene = scene;
    this.position = new THREE.Vector3(0, 0, 15);
    this.rotation = 0;
    this.velocity = new THREE.Vector3();
    this.speed = 9.0;
    this.walkCycle = 0;
    this.isMoving = false;
    this.isGrounded = true;
    this.verticalVelocity = 0;
    this.stepTimer = 0;

    this.rebuild(customData);
  }

  rebuild(customData = {}) {
    if (this.avatar && this.avatar.mesh) {
      this.scene.remove(this.avatar.mesh);
    }

    this.customData = customData;
    this.avatar = CharacterModel.createAvatarMesh({
      skinColor: customData.skinColor || '#dca180',
      hairColor: customData.hairColor || '#1a1a1a',
      shirtColor: customData.shirtColor || '#f8fafc',
      pantsColor: customData.pantsColor || '#1e293b',
      sashColor: customData.sashColor || '#ff9933',
      hasSash: true
    });

    this.avatar.mesh.position.copy(this.position);
    this.scene.add(this.avatar.mesh);
  }

  update(delta, input, world) {
    let moveX = 0;
    let moveZ = 0;

    if (input.moveForward) moveZ -= 1;
    if (input.moveBackward) moveZ += 1;
    if (input.moveLeft) moveX -= 1;
    if (input.moveRight) moveX += 1;

    // Joystick virtual inputs
    if (input.joystickX !== undefined && input.joystickY !== undefined) {
      if (Math.abs(input.joystickX) > 0.05 || Math.abs(input.joystickY) > 0.05) {
        moveX += input.joystickX;
        moveZ += input.joystickY;
      }
    }

    const moveMag = Math.hypot(moveX, moveZ);
    this.isMoving = moveMag > 0.1;

    if (this.isMoving) {
      // Normalize vector
      const normX = moveX / (moveMag || 1);
      const normZ = moveZ / (moveMag || 1);

      // Camera relative movement
      const forwardAngle = input.cameraYaw || 0;
      const cos = Math.cos(forwardAngle);
      const sin = Math.sin(forwardAngle);

      const worldX = normX * cos - normZ * sin;
      const worldZ = normX * sin + normZ * cos;

      const targetAngle = Math.atan2(worldX, worldZ);
      // Smooth player yaw
      let angleDiff = targetAngle - this.rotation;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.rotation += angleDiff * Math.min(1.0, delta * 12);
      this.avatar.mesh.rotation.y = this.rotation;

      // Predict next step with world collision
      const stepDist = this.speed * delta * Math.min(1.0, moveMag);
      const nextX = this.position.x + worldX * stepDist;
      const nextZ = this.position.z + worldZ * stepDist;

      if (!world.checkCollision(nextX, this.position.z)) {
        this.position.x = nextX;
      }
      if (!world.checkCollision(this.position.x, nextZ)) {
        this.position.z = nextZ;
      }

      // Animate limb swing
      this.walkCycle += delta * 10;
      const swing = Math.sin(this.walkCycle) * 0.6;
      this.avatar.leftArmGroup.rotation.x = -swing;
      this.avatar.rightArmGroup.rotation.x = swing;
      this.avatar.leftLegGroup.rotation.x = swing;
      this.avatar.rightLegGroup.rotation.x = -swing;

      // Footstep sound interval
      this.stepTimer += delta;
      if (this.stepTimer > 0.35) {
        sound.playFootstep();
        this.stepTimer = 0;
      }
    } else {
      // Idle pose smooth reset
      this.avatar.leftArmGroup.rotation.x *= 0.8;
      this.avatar.rightArmGroup.rotation.x *= 0.8;
      this.avatar.leftLegGroup.rotation.x *= 0.8;
      this.avatar.rightLegGroup.rotation.x *= 0.8;
      this.walkCycle = 0;
    }

    // Jump / Gravity
    if (input.jump && this.isGrounded) {
      this.verticalVelocity = 6.0;
      this.isGrounded = false;
      sound.playClick();
    }

    if (!this.isGrounded) {
      this.verticalVelocity -= 18.0 * delta;
      this.position.y += this.verticalVelocity * delta;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.verticalVelocity = 0;
        this.isGrounded = true;
      }
    }

    this.avatar.mesh.position.copy(this.position);
  }
}
