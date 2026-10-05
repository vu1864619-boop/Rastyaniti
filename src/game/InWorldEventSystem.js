// 3D In-World Visible Event Simulator for Rallies, Citizen Gatherings, and Governance Office
import * as THREE from 'three';
import { CharacterModel } from './PlayerCharacter.js';

export class InWorldEventSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeEventGroup = null;
    this.eventTimer = 0;
  }

  // 1. Visible 3D Chowk Rally Crowd (When holding a rally at Tiranga Chowk)
  spawnRallyCrowd(supportLevel = 50) {
    this.clearEventVisuals();
    this.activeEventGroup = new THREE.Group();
    this.activeEventGroup.name = 'rally_crowd';

    const crowdSize = Math.min(24, Math.floor(supportLevel / 3) + 6);
    const colors = ['#ea580c', '#16a34a', '#facc15', '#ffffff', '#3b82f6'];

    for (let i = 0; i < crowdSize; i++) {
      const angle = (i / crowdSize) * Math.PI * 1.8 + 0.2;
      const radius = 7.5 + (i % 3) * 1.8;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const supporter = CharacterModel.createAvatarMesh({
        shirtColor: colors[i % colors.length],
        sashColor: '#ff9933',
        hasSash: true,
        scale: 0.88
      });
      supporter.mesh.position.set(x, 0, z);

      // Face towards central chowk podium (0, 0, 0)
      supporter.mesh.lookAt(0, 0, 0);

      // Wave arms in enthusiasm
      supporter.leftArmGroup.rotation.x = -1.2;
      supporter.rightArmGroup.rotation.x = -1.2;

      // Small party flag in right hand
      const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
      flagPole.position.set(-0.25, 0.4, 0.3);
      const flagCloth = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), new THREE.MeshBasicMaterial({ color: 0xff9933, side: THREE.DoubleSide }));
      flagCloth.position.set(-0.5, 1.1, 0.3);
      supporter.mesh.add(flagPole, flagCloth);

      this.activeEventGroup.add(supporter.mesh);
    }

    this.scene.add(this.activeEventGroup);
  }

  // 2. Visible 3D Governance Meeting Table with Advisors & Documents inside Municipal Office
  spawnGovernanceMeetingScene() {
    this.clearEventVisuals();
    this.activeEventGroup = new THREE.Group();
    this.activeEventGroup.name = 'governance_meeting';

    // Position outside verandah or inside municipal hall (-35, 0, -17)
    const mx = -35, mz = -17;
    const tableMat = new THREE.MeshLambertMaterial({ color: 0x451a03 }); // Dark mahogany meeting table
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Big Executive Meeting Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.85, 2.8), tableMat);
    table.position.set(mx, 0.85, mz);
    this.activeEventGroup.add(table);

    // Official Files and Laptops on table
    [-1.8, 0, 1.8].forEach(ox => {
      const fileDoc = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.6), paperMat);
      fileDoc.position.set(mx + ox, 1.3, mz);
      this.activeEventGroup.add(fileDoc);
    });

    // Seated / Standing Advisors & Engineers
    const advisors = [
      { offset: -2.2, role: 'मुख्य अभियंता (Chief Engineer)', color: '#1e293b' },
      { offset: 0, role: 'जिला योजना अधिकारी (Planning Officer)', color: '#334155' },
      { offset: 2.2, role: 'जनसम्पर्क सलाहकार (PR Advisor)', color: '#475569' }
    ];

    advisors.forEach(adv => {
      const char = CharacterModel.createAvatarMesh({
        shirtColor: '#f8fafc',
        pantsColor: adv.color,
        hasNehruJacket: true,
        jacketColor: adv.color,
        scale: 0.92
      });
      char.mesh.position.set(mx + adv.offset, 0, mz - 1.8);
      char.mesh.rotation.y = 0; // Look towards player side
      this.activeEventGroup.add(char.mesh);
    });

    this.scene.add(this.activeEventGroup);
  }

  clearEventVisuals() {
    if (this.activeEventGroup) {
      this.scene.remove(this.activeEventGroup);
      this.activeEventGroup = null;
    }
  }

  update(delta) {
    if (this.activeEventGroup && this.activeEventGroup.name === 'rally_crowd') {
      this.eventTimer += delta;
      // Crowd chanting arm wave animation
      this.activeEventGroup.children.forEach((supporter, idx) => {
        const wave = Math.sin(this.eventTimer * 6 + idx) * 0.35 - 1.2;
        if (supporter.children[3]) { // leftArm
          supporter.children[3].rotation.x = wave;
        }
      });
    }
  }
}
