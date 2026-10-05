// Main 3D Game Application Entry Point with In-World Traffic, Rallies, and Lifecycle Management
import * as THREE from 'three';
import { gameState } from './systems/GameState.js';
import { TownWorld } from './game/TownWorld.js';
import { PlayerCharacter } from './game/PlayerCharacter.js';
import { NPCManager } from './game/NPCManager.js';
import { TrafficSystem } from './game/TrafficSystem.js';
import { DrivableVehicleSystem } from './game/DrivableVehicleSystem.js';
import { InWorldEventSystem } from './game/InWorldEventSystem.js';
import { TouchController } from './ui/TouchController.js';
import { UIManager } from './ui/UIManager.js';
import { LifeSimulationSystem } from './systems/LifeSimulationSystem.js';
import { sound } from './systems/SoundFX.js';

export class RashtraNitiGame {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    // Load saved game if exists
    gameState.load();

    this.initThree();
    this.initWorld();
    this.initPlayer();
    this.initNPCs();
    this.initTraffic();
    this.initDrivableVehicles();
    this.initEvents();
    this.initUI();
    this.initController();

    this.cameraOffset = new THREE.Vector3(0, 5.5, 9.0);
    this.currentLookTarget = new THREE.Vector3();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Daylight sky
    this.scene.fog = new THREE.FogExp2(0xcfe2f3, 0.012);

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Warm Indian sunlight & ambient illumination
    const ambientLight = new THREE.AmbientLight(0xfff6e6, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);
  }

  initWorld() {
    this.world = new TownWorld(this.scene);
  }

  initPlayer() {
    this.player = new PlayerCharacter(this.scene, gameState.player);
  }

  initNPCs() {
    this.npcManager = new NPCManager(this.scene);
  }

  initTraffic() {
    this.traffic = new TrafficSystem(this.scene, this.world.colliders);
  }

  initDrivableVehicles() {
    this.drivableSystem = new DrivableVehicleSystem(this.scene, this.world);
  }

  initEvents() {
    this.events = new InWorldEventSystem(this.scene);
  }

  initUI() {
    this.ui = new UIManager(this);
  }

  initController() {
    this.touchController = new TouchController(
      this.renderer.domElement,
      () => this.handleInteract(),
      () => this.handleJump(),
      () => this.handleTalk()
    );
  }

  handleInteract() {
    // 1. Check if driving -> Exit vehicle
    if (this.drivableSystem && this.drivableSystem.isDriving) {
      this.drivableSystem.exitVehicle(this.player);
      this.ui.showInteractionPrompt('वाहन से बाहर निकले');
      return;
    }

    // 2. Check if near a drivable vehicle -> Enter vehicle
    if (this.drivableSystem) {
      const nearVeh = this.drivableSystem.getNearbyDrivable(this.player.position);
      if (nearVeh) {
        this.drivableSystem.enterVehicle(nearVeh.vehicle, this.player);
        this.ui.showInteractionPrompt(`[कार्रवाई] ${nearVeh.vehicle.nameHi} चला रहे हैं (उतरने के लिए दबाएं)`);
        return;
      }
    }

    // 3. POIs
    const nearbyPOI = this.world.getNearbyPOI(this.player.position.x, this.player.position.z);
    if (nearbyPOI) {
      sound.playInteract();
      if (nearbyPOI.poi.type === 'GOVERNANCE') {
        this.ui.openModal('GOVERNANCE');
      } else if (nearbyPOI.poi.type === 'RALLY_GROUND' || nearbyPOI.poi.type === 'SOCIAL') {
        this.ui.openModal('CAMPAIGN');
      } else if (nearbyPOI.poi.type === 'BUSINESS') {
        this.ui.openModal('LIFE');
      } else if (nearbyPOI.poi.type === 'HOME') {
        const res = LifeSimulationSystem.restAtHome();
        this.ui.updateHUD();
        alert(res.msg);
      } else {
        this.ui.openModal('MISSIONS');
      }
      return;
    }

    // 4. NPCs
    const nearbyNPC = this.npcManager.getNearbyNPC(this.player.position);
    if (nearbyNPC) {
      this.ui.showDialogue(nearbyNPC.npc);
    }
  }

  handleTalk() {
    const nearbyNPC = this.npcManager.getNearbyNPC(this.player.position);
    if (nearbyNPC) {
      this.ui.showDialogue(nearbyNPC.npc);
    } else {
      const poiInfo = this.world.getNearbyPOI(this.player.position.x, this.player.position.z);
      if (poiInfo) {
        alert(`${poiInfo.poi.nameHi}\n${poiInfo.poi.descHi}`);
      }
    }
  }

  handleJump() {
    // Player physics jump
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateCamera(delta) {
    const yaw = this.touchController.input.cameraYaw || 0;

    const isDriving = this.drivableSystem && this.drivableSystem.isDriving;
    const camDist = isDriving ? 13.0 : 9.0;
    const camHeight = isDriving ? 6.5 : 5.0;

    const targetCamX = this.player.position.x + Math.sin(yaw) * camDist;
    const targetCamZ = this.player.position.z + Math.cos(yaw) * camDist;
    const targetCamY = this.player.position.y + camHeight;

    this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1.0, delta * 8);
    this.camera.position.y += (targetCamY - this.camera.position.y) * Math.min(1.0, delta * 8);
    this.camera.position.z += (targetCamZ - this.camera.position.z) * Math.min(1.0, delta * 8);

    const lookTarget = new THREE.Vector3(
      this.player.position.x,
      this.player.position.y + (isDriving ? 1.2 : 1.6),
      this.player.position.z
    );
    this.currentLookTarget.lerp(lookTarget, Math.min(1.0, delta * 10));
    this.camera.lookAt(this.currentLookTarget);
  }

  checkPrompts() {
    if (this.drivableSystem && this.drivableSystem.isDriving) {
      this.ui.showInteractionPrompt('[E / कार्रवाई] वाहन से बाहर उतरें');
      return;
    }

    if (this.drivableSystem) {
      const nearVeh = this.drivableSystem.getNearbyDrivable(this.player.position);
      if (nearVeh) {
        this.ui.showInteractionPrompt(`[E / कार्रवाई] ड्राइव करें: ${nearVeh.vehicle.nameHi}`);
        return;
      }
    }

    const npcMatch = this.npcManager.getNearbyNPC(this.player.position);
    if (npcMatch) {
      this.ui.showInteractionPrompt(`[E / बात करें] ${npcMatch.npc.name}`);
      return;
    }

    const poiMatch = this.world.getNearbyPOI(this.player.position.x, this.player.position.z);
    if (poiMatch) {
      this.ui.showInteractionPrompt(`[E / कार्रवाई] ${poiMatch.poi.nameHi}`);
      return;
    }

    this.ui.hideInteractionPrompt();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.drivableSystem && this.drivableSystem.isDriving) {
      this.drivableSystem.update(delta, this.touchController.input, this.player);
    } else {
      this.player.update(delta, this.touchController.input, this.world);
    }

    this.npcManager.update(delta, this.player.position);
    if (this.traffic) this.traffic.update(delta);
    if (this.events) this.events.update(delta);
    this.updateCamera(delta);
    this.checkPrompts();

    this.renderer.render(this.scene, this.camera);
  }
}

// Bootstrap on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new RashtraNitiGame();
});
