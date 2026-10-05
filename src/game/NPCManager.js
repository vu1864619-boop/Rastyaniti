// Interactive Indian Town NPCs with Waypoint AI, Citizens, Students, Vendors, and Ambient Problems
import * as THREE from 'three';
import { CharacterModel } from './PlayerCharacter.js';

export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];
    this.wanderingPedestrians = [];
    this.spawnDistrictCitizens();
    this.spawnWanderingPedestrians();
  }

  spawnDistrictCitizens() {
    const npcConfigs = [
      {
        id: 'npc_sharma_ji',
        name: 'शर्मा जी (चाय वाले)',
        role: 'दुकानदार / मोहल्ला विश्लेषक',
        position: new THREE.Vector3(-12, 0, 10),
        appearance: { shirtColor: '#e0f2fe', pantsColor: '#334155', sashColor: '#ef4444', skinColor: '#c68642' },
        dialogues: [
          'अरे भाई, नमस्कार! आज की गरमा-गरम अदरक वाली चाय तैयार है। क्या चुनावी चर्चा शुरू करें?',
          'वार्ड 12 में सड़कों के गड्ढों और उड़ती धूल से रोज दुर्घटनाएं हो रही हैं। अगर कोई नेता इसे ठीक करा दे तो वोट उसी का पक्का है!',
          'राजनीति में जनसंपर्क ही सबसे बड़ा धन है। सुख-दुख में खड़े रहोगे तो संसद तक का रास्ता खुल जाएगा।',
          'चाय की दुकान पर रोजाना 200 लोग आते हैं, अगर आप कहें तो आपके पक्ष में माहौल बना दें!'
        ],
        needText: 'बाजार में नियमित सफाई व पानी का टैंकर चाहिए।'
      },
      {
        id: 'npc_gupta_kirana',
        name: 'गुप्ता जी (किराना स्टोर)',
        role: 'व्यापारी संघ अध्यक्ष',
        position: new THREE.Vector3(-19, 0, -9),
        appearance: { shirtColor: '#fef3c7', pantsColor: '#1e293b', sashColor: '#f59e0b', skinColor: '#dca180' },
        dialogues: [
          'नमस्ते जी! जीएसटी, बिजली कटौती और बाजार की पार्किंग ने हमारा व्यापार धीमा कर रखा है।',
          'अगर हमारे बाजार में सोलर स्ट्रीट लाइट लग जाएं तो रात 10 बजे तक दुकानें खुल सकती हैं।',
          'व्यापारी वर्ग हमेशा विकास और सुरक्षा का साथ देता है।'
        ],
        needText: 'बाजार में स्ट्रीट लाइट व सीसीटीवी कैमरे की मांग।'
      },
      {
        id: 'npc_master_ji',
        name: 'मास्टर जी (राधेश्याम शिक्षक)',
        role: 'वरिष्ठ शिक्षक, शासकीय विद्यालय',
        position: new THREE.Vector3(-36, 0, 24),
        appearance: { shirtColor: '#fef08a', pantsColor: '#1e293b', sashColor: '#15803d', skinColor: '#d29662' },
        dialogues: [
          'सादर प्रणाम! हमारे विद्यालय के बच्चों को बेहतर सुविधाएं चाहिए।',
          'सच्चा जननेता वही है जो आने वाली पीढ़ी की शिक्षा और स्वास्थ्य पर बजट खर्च करे!',
          'विद्यालय में गर्मियों में पीने के शुद्ध पानी और पंखों की भारी किल्लत है। कृपया मदद करें।'
        ],
        needText: 'प्राथमिक विद्यालय में वाटर कूलर और पंखों की आवश्यकता।'
      },
      {
        id: 'npc_sub_inspector',
        name: 'इंस्पेक्टर अजय राठौड़',
        role: 'थाना प्रभारी, शांतिपुर पुलिस',
        position: new THREE.Vector3(34, 0, 24),
        appearance: { shirtColor: '#856942', pantsColor: '#45351e', sashColor: '#1e3a8a', skinColor: '#b07946' },
        dialogues: [
          'जय हिंद! चुनाव का माहौल है, आचार संहिता (Model Code of Conduct) का 100% पालन होना चाहिए।',
          'किसी भी सार्वजनिक रैली या लाउडस्पीकर सभा के लिए थाने से विधिवत अनुमति जरूरी है।',
          'जनता की सुरक्षा हमारी पहली प्राथमिकता है। असामाजिक तत्वों पर कड़ी नजर है।'
        ],
        needText: 'मोहल्ले में रात्रिकालीन पुलिस गश्त और शांति व्यवस्था।'
      },
      {
        id: 'npc_doctor_anita',
        name: 'डॉ. अनीता वर्मा',
        role: 'चिकित्सा प्रभारी, स्वास्थ्य केंद्र',
        position: new THREE.Vector3(30, 0, -20),
        appearance: { shirtColor: '#ffffff', pantsColor: '#0f172a', sashColor: '#0ea5e9', skinColor: '#dfa279' },
        dialogues: [
          'नमस्ते! बदलते मौसम में अस्पताल में मरीजों की कतार लंबी है।',
          'हमें प्राथमिक स्वास्थ्य केंद्र पर आवश्यक जीवनरक्षक दवाओं की निरंतर आपूर्ति चाहिए।',
          'स्वच्छता और शुद्ध पेयजल से वार्ड की 80% मौसमी बीमारियां रोकी जा सकती हैं।'
        ],
        needText: 'मुफ्त स्वास्थ्य जांच शिविर और जीवनरक्षक दवाओं का कोटा।'
      },
      {
        id: 'npc_ward_secretary',
        name: 'बाबू दिनेश चंद्र',
        role: 'नगर पालिका प्रशासनिक सचिव',
        position: new THREE.Vector3(-32, 0, -18),
        appearance: { shirtColor: '#f1f5f9', pantsColor: '#334155', sashColor: '#475569', skinColor: '#c58b56' },
        dialogues: [
          'आइये बैठिये! नगर पालिका में जनता की 200 से अधिक फाइलें लंबित हैं।',
          'वार्ड 12 में मुख्य सड़क निर्माण और नाली सफाई का प्रस्ताव पास होने की प्रतीक्षा में है।',
          'अगर आप विकास कार्यों की फाइलें स्वीकृत करवाएं तो सीधे जनता को लाभ मिलेगा।'
        ],
        needText: 'वार्ड 12 नाली व सड़क विकास का मास्टर प्लान पास कराना।'
      },
      {
        id: 'npc_priest_shastri',
        name: 'पंडित रामगोपाल शास्त्री',
        role: 'मंदिर व शांति समिति सदस्य',
        position: new THREE.Vector3(36, 0, 8),
        appearance: { shirtColor: '#fed7aa', pantsColor: '#fff7ed', sashColor: '#ea580c', skinColor: '#c48749' },
        dialogues: [
          'सत्यमेव जयते! धर्म और राजनीति का समन्वय केवल लोक-कल्याण के लिए होना चाहिए।',
          'हमारे क्षेत्र में सभी धर्मों और वर्गों के लोग प्रेमपूर्वक रहते हैं। यह सौहार्द बना रहना चाहिए।',
          'सुबह-शाम वरिष्ठ नागरिक यहाँ बैठकर शांति और प्रार्थना में समय बिताते हैं।'
        ],
        needText: 'सार्वजनिक चबूतरे व पार्क क्षेत्र में पेयजल की व्यवस्था।'
      }
    ];

    npcConfigs.forEach(cfg => {
      const avatar = CharacterModel.createAvatarMesh({
        ...cfg.appearance,
        hasSash: true,
        scale: 0.95
      });
      avatar.mesh.position.copy(cfg.position);
      this.scene.add(avatar.mesh);

      this.npcs.push({
        id: cfg.id,
        name: cfg.name,
        role: cfg.role,
        position: cfg.position,
        dialogues: cfg.dialogues,
        dialogueIndex: 0,
        needText: cfg.needText,
        mesh: avatar.mesh,
        armLeft: avatar.leftArmGroup,
        armRight: avatar.rightArmGroup,
        idleTimer: Math.random() * 5
      });
    });
  }

  // Wandering AI Pedestrians: School Students, Workers, Elderly citizens walking on sidewalks
  spawnWanderingPedestrians() {
    const pedestrianConfigs = [
      {
        name: 'राहुल (कॉलेज छात्र)',
        waypoints: [
          new THREE.Vector3(-9.25, 0, 20),
          new THREE.Vector3(-9.25, 0, 45),
          new THREE.Vector3(-25, 0, 45),
          new THREE.Vector3(-9.25, 0, 20)
        ],
        appearance: { shirtColor: '#38bdf8', pantsColor: '#1e293b', sashColor: '#0284c7', skinColor: '#dca180' },
        speed: 3.2
      },
      {
        name: 'सोमेश (पार्टी कार्यकर्ता)',
        waypoints: [
          new THREE.Vector3(9.25, 0, -10),
          new THREE.Vector3(9.25, 0, 30),
          new THREE.Vector3(0, 0, 7),
          new THREE.Vector3(9.25, 0, -10)
        ],
        appearance: { shirtColor: '#ffffff', pantsColor: '#334155', sashColor: '#ff9933', hasGandhiCap: true, skinColor: '#c68642' },
        speed: 3.8
      },
      {
        name: 'चाचा मनोहर (वरिष्ठ नागरिक)',
        waypoints: [
          new THREE.Vector3(9.25, 0, 45),
          new THREE.Vector3(25, 0, 15),
          new THREE.Vector3(32, 0, 8),
          new THREE.Vector3(9.25, 0, 45)
        ],
        appearance: { shirtColor: '#f1f5f9', pantsColor: '#64748b', sashColor: '#94a3b8', hasGlasses: true, skinColor: '#b07946' },
        speed: 2.0
      },
      {
        name: 'कमलेश (निर्माण श्रमिक)',
        waypoints: [
          new THREE.Vector3(-9.25, 0, -15),
          new THREE.Vector3(-9.25, 0, -45),
          new THREE.Vector3(-25, 0, -25),
          new THREE.Vector3(-9.25, 0, -15)
        ],
        appearance: { shirtColor: '#fb923c', pantsColor: '#374151', sashColor: '#b45309', skinColor: '#a16207' },
        speed: 3.0
      }
    ];

    pedestrianConfigs.forEach(cfg => {
      const avatar = CharacterModel.createAvatarMesh({
        ...cfg.appearance,
        scale: 0.92
      });
      avatar.mesh.position.copy(cfg.waypoints[0]);
      this.scene.add(avatar.mesh);

      this.wanderingPedestrians.push({
        name: cfg.name,
        mesh: avatar.mesh,
        armLeft: avatar.leftArmGroup,
        armRight: avatar.rightArmGroup,
        legLeft: avatar.leftLegGroup,
        legRight: avatar.rightLegGroup,
        waypoints: cfg.waypoints,
        currentWpIdx: 0,
        speed: cfg.speed,
        walkCycle: 0
      });
    });
  }

  update(delta, playerPos) {
    // 1. Static Key NPCs smooth tracking toward player
    this.npcs.forEach(npc => {
      npc.idleTimer += delta;
      npc.armLeft.rotation.z = Math.sin(npc.idleTimer * 1.5) * 0.05;
      npc.armRight.rotation.z = -Math.sin(npc.idleTimer * 1.5) * 0.05;

      const dist = npc.position.distanceTo(playerPos);
      if (dist < 6.5) {
        const lookAngle = Math.atan2(playerPos.x - npc.position.x, playerPos.z - npc.position.z);
        let diff = lookAngle - npc.mesh.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        npc.mesh.rotation.y += diff * Math.min(1.0, delta * 5);
      }
    });

    // 2. Wandering AI Pedestrians movement between waypoints
    this.wanderingPedestrians.forEach(p => {
      const targetWp = p.waypoints[p.currentWpIdx];
      const curPos = p.mesh.position;
      const dx = targetWp.x - curPos.x;
      const dz = targetWp.z - curPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.6) {
        p.currentWpIdx = (p.currentWpIdx + 1) % p.waypoints.length;
      } else {
        const moveAngle = Math.atan2(dx, dz);
        p.mesh.rotation.y = moveAngle;
        const step = p.speed * delta;
        p.mesh.position.x += (dx / dist) * step;
        p.mesh.position.z += (dz / dist) * step;

        p.walkCycle += delta * (p.speed * 2.2);
        const swing = Math.sin(p.walkCycle) * 0.45;
        p.armLeft.rotation.x = -swing;
        p.armRight.rotation.x = swing;
        p.legLeft.rotation.x = swing;
        p.legRight.rotation.x = -swing;
      }
    });
  }

  getNearbyNPC(playerPos, maxDist = 3.5) {
    for (const npc of this.npcs) {
      const dist = npc.position.distanceTo(playerPos);
      if (dist <= maxDist) {
        return { npc, dist };
      }
    }
    return null;
  }
}
