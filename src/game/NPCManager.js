// Interactive Indian Town NPCs with dialogues, community problems, needs, and quests
import * as THREE from 'three';
import { CharacterModel } from './PlayerCharacter.js';

export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];
    this.spawnDistrictCitizens();
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
          'अरे भाई, नमस्कार! आज की गरमा-गरम चाय के साथ क्या चुनावी चर्चा शुरू करें?',
          'वार्ड में टूटी सड़कों और उड़ती धूल से जनता परेशान है। अगर कोई नेता इसे ठीक करा दे तो वोट उसी का पक्का है!',
          'राजनीति में जनसंपर्क ही सबसे बड़ा धन है। लोगों के सुख-दुख में खड़े रहोगे तो संसद तक का रास्ता खुल जाएगा।'
        ],
        quests: [
          {
            missionId: 'quest_clean_chowk',
            title: 'मोहल्ला स्वच्छता अभियान (Cleanliness Drive)',
            desc: 'तिरंगा चौक व मार्केट क्षेत्र में स्वच्छता अभियान शुरू करें और लोगों को जागरूक करें।',
            rewardMoney: 1500,
            rewardRep: 60,
            reqCost: 500
          }
        ]
      },
      {
        id: 'npc_master_ji',
        name: 'मास्टर जी (राधेश्याम शिक्षक)',
        role: 'वरिष्ठ शिक्षक, प्राथमिक विद्यालय',
        position: new THREE.Vector3(-36, 0, 24),
        appearance: { shirtColor: '#fef08a', pantsColor: '#1e293b', sashColor: '#15803d', skinColor: '#d29662' },
        dialogues: [
          'सादर प्रणाम! हमारे विद्यालय के बच्चों को बेहतर सुविधाएं चाहिए।',
          'सच्चा नेता वही है जो आने वाली पीढ़ी की शिक्षा और स्वास्थ्य पर बजट खर्च करे!',
          'अगर आप विद्यालय के लिए पुस्तकें और पंखे उपलब्ध करा सकें तो पूरे अभिभावक संघ का समर्थन आपको मिलेगा।'
        ],
        quests: [
          {
            missionId: 'quest_school_help',
            title: 'सरकारी प्राथमिक विद्यालय सहायता (Help Primary School)',
            desc: 'विद्यालय में बच्चों के लिए अध्ययन सामग्री व पेयजल व्यवस्था हेतु ₹2,000 की सहायता स्वीकृत कराएं।',
            rewardMoney: 0,
            rewardRep: 120,
            reqCost: 2000
          }
        ]
      },
      {
        id: 'npc_sub_inspector',
        name: 'इंस्पेक्टर अजय राठौड़',
        role: 'थाना प्रभारी, शांतिपुर पुलिस',
        position: new THREE.Vector3(34, 0, 24),
        appearance: { shirtColor: '#856942', pantsColor: '#45351e', sashColor: '#1e3a8a', skinColor: '#b07946' },
        dialogues: [
          'जय हिंद! चुनाव का माहौल है, आचार संहिता (Model Code of Conduct) का पूरा पालन होना चाहिए।',
          'किसी भी सार्वजनिक रैली या लाउडस्पीकर सभा के लिए थाने से विधिवत अनुमति जरूरी है।',
          'जनता की सुरक्षा हमारी पहली प्राथमिकता है। शांति बनाए रखने में हमारा सहयोग करें।'
        ],
        quests: [
          {
            missionId: 'quest_night_patrol',
            title: 'मोहल्ला सुरक्षा निगरानी (Neighborhood Safety Support)',
            desc: 'बाजार क्षेत्र में स्ट्रीट लाइट और सीसीटीवी कैमरे लगाने का ज्ञापन नगर पालिका में प्रस्तुत करें।',
            rewardMoney: 2000,
            rewardRep: 80,
            reqCost: 1000
          }
        ]
      },
      {
        id: 'npc_doctor_anita',
        name: 'डॉ. अनीता वर्मा',
        role: 'चिकित्सा प्रभारी, स्वास्थ्य केंद्र',
        position: new THREE.Vector3(30, 0, -20),
        appearance: { shirtColor: '#ffffff', pantsColor: '#0f172a', sashColor: '#0ea5e9', skinColor: '#dfa279' },
        dialogues: [
          'नमस्ते! बदलते मौसम में अस्पताल में मरीजों की कतार लंबी है।',
          'हमें प्राथमिक स्वास्थ्य केंद्र पर आवश्यक दवाओं की निरंतर आपूर्ति चाहिए।',
          'स्वच्छता और शुद्ध पेयजल से 80% मौसमी बीमारियां रोकी जा सकती हैं।'
        ],
        quests: [
          {
            missionId: 'quest_health_camp',
            title: 'मुफ्त जन-स्वास्थ्य शिविर (Free Health Checkup Camp)',
            desc: 'वार्ड 12 के नागरिकों के लिए स्वास्थ्य जांच शिविर का आयोजन करवाएं।',
            rewardMoney: 1000,
            rewardRep: 150,
            reqCost: 2500
          }
        ]
      },
      {
        id: 'npc_ward_secretary',
        name: 'बाबू दिनेश चंद्र',
        role: 'नगर पालिका सचिव / प्रशासनिक लिपिक',
        position: new THREE.Vector3(-32, 0, -18),
        appearance: { shirtColor: '#f1f5f9', pantsColor: '#334155', sashColor: '#475569', skinColor: '#c58b56' },
        dialogues: [
          'आइये बैठिये! नगर पालिका में जनता की 200 से अधिक फाइलें लंबित हैं।',
          'वार्ड 12 में मुख्य सड़क निर्माण और नाली सफाई का प्रस्ताव पास होने की प्रतीक्षा में है।',
          'अगर आप विकास कार्यों की निगरानी करेंगे तो बजट सही जगह पहुंचेगा।'
        ],
        quests: [
          {
            missionId: 'quest_road_proposal',
            title: 'सड़क व नाली विकास प्रस्ताव (Submit Road Proposal)',
            desc: 'टूटी मुख्य सड़क के पुनर्निर्माण का नागरिक प्रस्ताव तैयार कर पालिका में दर्ज कराएं।',
            rewardMoney: 3000,
            rewardRep: 100,
            reqCost: 800
          }
        ]
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
        quests: cfg.quests,
        mesh: avatar.mesh,
        armLeft: avatar.leftArmGroup,
        armRight: avatar.rightArmGroup,
        idleTimer: Math.random() * 5
      });
    });
  }

  update(delta, playerPos) {
    this.npcs.forEach(npc => {
      npc.idleTimer += delta;
      // Gentle idle breathing sway
      npc.armLeft.rotation.z = Math.sin(npc.idleTimer * 1.5) * 0.05;
      npc.armRight.rotation.z = -Math.sin(npc.idleTimer * 1.5) * 0.05;

      // Rotate NPC smoothly toward player if player is within 6 units
      const dist = npc.position.distanceTo(playerPos);
      if (dist < 6.0) {
        const lookAngle = Math.atan2(playerPos.x - npc.position.x, playerPos.z - npc.position.z);
        let diff = lookAngle - npc.mesh.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        npc.mesh.rotation.y += diff * Math.min(1.0, delta * 4);
      }
    });
  }

  getNearbyNPC(playerPos, maxDist = 3.2) {
    for (const npc of this.npcs) {
      const dist = npc.position.distanceTo(playerPos);
      if (dist <= maxDist) {
        return { npc, dist };
      }
    }
    return null;
  }
}
