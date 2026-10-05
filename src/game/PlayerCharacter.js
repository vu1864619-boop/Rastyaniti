// 3D Realistic Character Model with customizable face, hair, Indian attire progression, and accessories
import * as THREE from 'three';
import { sound } from '../systems/SoundFX.js';

export class CharacterModel {
  static createAvatarMesh(options = {}) {
    const {
      skinColor = '#dca180',
      hairColor = '#1a1a1a',
      hairStyle = 'modern', // 'modern', 'traditional', 'cap'
      shirtColor = '#f8fafc',
      pantsColor = '#1e293b',
      sashColor = '#ff9933',
      hasSash = true,
      hasGlasses = false,
      hasNehruJacket = false,
      jacketColor = '#78350f',
      hasGandhiCap = false,
      scale = 1.0
    } = options;

    const group = new THREE.Group();

    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const hairMat = new THREE.MeshLambertMaterial({ color: hairColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x271c19 });
    const sashMat = new THREE.MeshLambertMaterial({ color: sashColor });
    const jacketMat = new THREE.MeshLambertMaterial({ color: jacketColor });
    const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const darkDetail = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const goldDetail = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    // 1. Torso & Traditional Indian Kurta
    const torsoGeo = new THREE.BoxGeometry(0.72, 0.92, 0.42);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 1.26;
    torso.castShadow = true;
    group.add(torso);

    // Kurta flared lower skirt (authentic Indian silhouette)
    const kurtaLowerGeo = new THREE.BoxGeometry(0.74, 0.45, 0.44);
    const kurtaLower = new THREE.Mesh(kurtaLowerGeo, shirtMat);
    kurtaLower.position.y = 0.65;
    kurtaLower.castShadow = true;
    group.add(kurtaLower);

    // Nehru / Modi Political Waistcoat Jacket (Unlocked with political rank)
    if (hasNehruJacket) {
      const jacketGeo = new THREE.BoxGeometry(0.76, 0.94, 0.46);
      const jacket = new THREE.Mesh(jacketGeo, jacketMat);
      jacket.position.y = 1.26;
      jacket.castShadow = true;
      group.add(jacket);

      // Brass buttons
      for (let by = 0.95; by <= 1.55; by += 0.15) {
        const btn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.48), goldDetail);
        btn.position.y = by;
        group.add(btn);
      }
    }

    // 2. Head & Detailed Facial Features
    const headGeo = new THREE.BoxGeometry(0.44, 0.48, 0.44);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.96;
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.02);
    const eyeL = new THREE.Mesh(eyeGeo, darkDetail);
    eyeL.position.set(0.12, 1.98, 0.23);
    const eyeR = new THREE.Mesh(eyeGeo, darkDetail);
    eyeR.position.set(-0.12, 1.98, 0.23);
    group.add(eyeL, eyeR);

    // Eyebrows / Tilak
    const tilak = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.02), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    tilak.position.set(0, 2.05, 0.23);
    group.add(tilak);

    // Mustache option for Indian statesman look
    const stache = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.02), darkDetail);
    stache.position.set(0, 1.86, 0.23);
    group.add(stache);

    // Spectacles / Glasses
    if (hasGlasses) {
      const glassesFrame = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.04), darkDetail);
      glassesFrame.position.set(0, 1.98, 0.24);
      group.add(glassesFrame);
    }

    // Hair Style / Cap
    if (hasGandhiCap || hairStyle === 'cap') {
      // Iconic Gandhi / Indian National Topi
      const capGeo = new THREE.BoxGeometry(0.46, 0.16, 0.48);
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(0, 2.24, 0);
      group.add(cap);
    } else {
      const hairGeo = new THREE.BoxGeometry(0.48, 0.20, 0.48);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 2.18, 0);
      group.add(hair);
    }

    // 3. Political stole / Angavastram / Gamchha
    if (hasSash) {
      const sashGeo = new THREE.BoxGeometry(0.76, 0.98, 0.46);
      const sash = new THREE.Mesh(sashGeo, sashMat);
      sash.position.y = 1.25;
      group.add(sash);
    }

    // 4. Limbs Rigging
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(0.46, 1.62, 0);
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), shirtMat);
    leftArm.position.y = -0.35;
    leftArm.castShadow = true;
    leftArmGroup.add(leftArm);
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.18), skinMat);
    leftHand.position.y = -0.75;
    leftArmGroup.add(leftHand);
    group.add(leftArmGroup);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(-0.46, 1.62, 0);
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), shirtMat);
    rightArm.position.y = -0.35;
    rightArm.castShadow = true;
    rightArmGroup.add(rightArm);
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.18), skinMat);
    rightHand.position.y = -0.75;
    rightArmGroup.add(rightHand);
    group.add(rightArmGroup);

    // Left Leg
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(0.2, 0.65, 0);
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), pantsMat);
    leftLeg.position.y = -0.32;
    leftLeg.castShadow = true;
    leftLegGroup.add(leftLeg);
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.40), shoeMat);
    leftShoe.position.set(0, -0.68, 0.06);
    leftLegGroup.add(leftShoe);
    group.add(leftLegGroup);

    // Right Leg
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(-0.2, 0.65, 0);
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), pantsMat);
    rightLeg.position.y = -0.32;
    rightLeg.castShadow = true;
    rightLegGroup.add(rightLeg);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.40), shoeMat);
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
    // Rank-based appearance upgrades
    const rankIdx = customData.rankIndex || 0;
    const hasNehruJacket = rankIdx >= 3; // Ward Councillor and above wears Nehru jacket
    const hasGandhiCap = rankIdx >= 2;   // Party worker and above wears topi/gamchha
    const hasGlasses = rankIdx >= 4;     // MLA / Senior leader spectacles

    this.avatar = CharacterModel.createAvatarMesh({
      skinColor: customData.skinColor || '#dca180',
      hairColor: customData.hairColor || '#1a1a1a',
      hairStyle: customData.hairStyle || 'modern',
      shirtColor: customData.shirtColor || '#f8fafc',
      pantsColor: customData.pantsColor || '#1e293b',
      sashColor: customData.sashColor || '#ff9933',
      hasSash: true,
      hasNehruJacket,
      hasGandhiCap,
      hasGlasses
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
      const normX = moveX / (moveMag || 1);
      const normZ = moveZ / (moveMag || 1);

      const forwardAngle = input.cameraYaw || 0;
      const cos = Math.cos(forwardAngle);
      const sin = Math.sin(forwardAngle);

      const worldX = normX * cos - normZ * sin;
      const worldZ = normX * sin + normZ * cos;

      const targetAngle = Math.atan2(worldX, worldZ);
      let angleDiff = targetAngle - this.rotation;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.rotation += angleDiff * Math.min(1.0, delta * 12);
      this.avatar.mesh.rotation.y = this.rotation;

      const speedMultiplier = input.isRunning ? 1.55 : 1.0;
      const stepDist = this.speed * speedMultiplier * delta * Math.min(1.0, moveMag);
      const nextX = this.position.x + worldX * stepDist;
      const nextZ = this.position.z + worldZ * stepDist;

      if (!world.checkCollision(nextX, this.position.z)) {
        this.position.x = nextX;
      }
      if (!world.checkCollision(this.position.x, nextZ)) {
        this.position.z = nextZ;
      }

      this.walkCycle += delta * (input.isRunning ? 14 : 10);
      const swing = Math.sin(this.walkCycle) * 0.6;
      this.avatar.leftArmGroup.rotation.x = -swing;
      this.avatar.rightArmGroup.rotation.x = swing;
      this.avatar.leftLegGroup.rotation.x = swing;
      this.avatar.rightLegGroup.rotation.x = -swing;

      this.stepTimer += delta;
      const stepInterval = input.isRunning ? 0.24 : 0.35;
      if (this.stepTimer > stepInterval) {
        sound.playFootstep();
        this.stepTimer = 0;
      }
    } else {
      this.avatar.leftArmGroup.rotation.x *= 0.8;
      this.avatar.rightArmGroup.rotation.x *= 0.8;
      this.avatar.leftLegGroup.rotation.x *= 0.8;
      this.avatar.rightLegGroup.rotation.x *= 0.8;
      this.walkCycle = 0;
    }

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
