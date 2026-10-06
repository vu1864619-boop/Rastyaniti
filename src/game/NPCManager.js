// Interactive Indian Town NPCs with Waypoint AI, Citizens, Students, Vendors, and Ambient Problems
// Features 24 lightweight distinct Indian NPCs across key roles:
// Citizen, Shopkeeper, Student, Worker, Elderly Citizen, Political Worker, Police, Govt Employee
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
      // 1. Sharma Ji (Chai Vendor / Analyst)
      {
        id: 'npc_sharma_ji',
        name: 'शर्मा जी (चाय वाले)',
        role: 'दुकानदार / मोहल्ला विश्लेषक',
        category: 'Shopkeeper',
        position: new THREE.Vector3(-12, 0, 10),
        appearance: { shirtColor: '#e0f2fe', pantsColor: '#334155', sashColor: '#ef4444', skinColor: '#c68642' },
        dialogues: [
          'अरे भाई, नमस्कार! आज की गरमा-गरम अदरक वाली चाय तैयार है। क्या चुनावी चर्चा शुरू करें?',
          'वार्ड 12 में सड़कों के गड्ढों और उड़ती धूल से रोज दुर्घटनाएं हो रही हैं। अगर कोई नेता इसे ठीक करा दे तो वोट उसी का पक्का है!',
          'राजनीति में जनसंपर्क ही सबसे बड़ा धन है। सुख-दुख में खड़े रहोगे तो संसद तक का रास्ता खुल जाएगा।',
          'चाय की दुकान पर रोजाना 200 लोग आते हैं, अगर आप कहें तो आपके पक्ष में माहौल बना दें!'
        ],
        needText: 'बाजार में नियमित सफाई व पानी का टैंकर चाहिए।',
        missionId: 'mission_cleanliness_drive'
      },
      // 2. Gupta Ji (Kirana Store / Trader President)
      {
        id: 'npc_gupta_kirana',
        name: 'गुप्ता जी (किराना स्टोर)',
        role: 'दुकानदार / व्यापार संघ अध्यक्ष',
        category: 'Shopkeeper',
        position: new THREE.Vector3(-19, 0, -9),
        appearance: { shirtColor: '#fef3c7', pantsColor: '#1e293b', sashColor: '#f59e0b', skinColor: '#dca180' },
        dialogues: [
          'नमस्ते जी! जीएसटी, बिजली कटौती और बाजार की पार्किंग ने हमारा व्यापार धीमा कर रखा है।',
          'अगर हमारे बाजार में सोलर स्ट्रीट लाइट लग जाएं तो रात 10 बजे तक दुकानें खुल सकती हैं।',
          'व्यापारी वर्ग हमेशा विकास और सुरक्षा का साथ देता है।'
        ],
        needText: 'बाजार में स्ट्रीट लाइट व सीसीटीवी कैमरे की मांग।',
        missionId: 'mission_broken_road'
      },
      // 3. Master Ji (Senior Teacher)
      {
        id: 'npc_master_ji',
        name: 'मास्टर जी (राधेश्याम शिक्षक)',
        role: 'वरिष्ठ शिक्षक, शासकीय विद्यालय',
        category: 'Government Employee',
        position: new THREE.Vector3(-36, 0, 24),
        appearance: { shirtColor: '#fef08a', pantsColor: '#1e293b', sashColor: '#15803d', skinColor: '#d29662' },
        dialogues: [
          'सादर प्रणाम! हमारे विद्यालय के बच्चों को बेहतर सुविधाएं चाहिए।',
          'सच्चा जननेता वही है जो आने वाली पीढ़ी की शिक्षा और स्वास्थ्य पर बजट खर्च करे!',
          'विद्यालय में गर्मियों में पीने के शुद्ध पानी और पंखों की भारी किल्लत है। कृपया मदद करें।'
        ],
        needText: 'प्राथमिक विद्यालय में वाटर कूलर और पंखों की आवश्यकता।',
        missionId: 'mission_school_aid'
      },
      // 4. Sub Inspector Rathore (Police)
      {
        id: 'npc_sub_inspector',
        name: 'इंस्पेक्टर अजय राठौड़',
        role: 'थाना प्रभारी, शांतिपुर पुलिस',
        category: 'Police',
        position: new THREE.Vector3(34, 0, 24),
        appearance: { shirtColor: '#856942', pantsColor: '#45351e', sashColor: '#1e3a8a', skinColor: '#b07946' },
        dialogues: [
          'जय हिंद! चुनाव का माहौल है, आचार संहिता (Model Code of Conduct) का 100% पालन होना चाहिए।',
          'किसी भी सार्वजनिक रैली या लाउडस्पीकर सभा के लिए थाने से विधिवत अनुमति जरूरी है।',
          'जनता की सुरक्षा हमारी पहली प्राथमिकता है। असामाजिक तत्वों पर कड़ी नजर है।'
        ],
        needText: 'मोहल्ले में रात्रिकालीन पुलिस गश्त और शांति व्यवस्था।'
      },
      // 5. Dr. Anita Verma (Doctor / Hospital)
      {
        id: 'npc_doctor_anita',
        name: 'डॉ. अनीता वर्मा',
        role: 'चिकित्सा प्रभारी, स्वास्थ्य केंद्र',
        category: 'Government Employee',
        position: new THREE.Vector3(30, 0, -20),
        appearance: { shirtColor: '#ffffff', pantsColor: '#0f172a', sashColor: '#0ea5e9', skinColor: '#dfa279' },
        dialogues: [
          'नमस्ते! बदलते मौसम में अस्पताल में मरीजों की कतार लंबी है।',
          'हमें प्राथमिक स्वास्थ्य केंद्र पर आवश्यक जीवनरक्षक दवाओं की निरंतर आपूर्ति चाहिए।',
          'स्वच्छता और शुद्ध पेयजल से वार्ड की 80% मौसमी बीमारियां रोकी जा सकती हैं।'
        ],
        needText: 'मुफ्त स्वास्थ्य जांच शिविर और जीवनरक्षक दवाओं का कोटा।',
        missionId: 'mission_health_camp'
      },
      // 6. Babu Dinesh Chandra (Municipal Secretary)
      {
        id: 'npc_ward_secretary',
        name: 'बाबू दिनेश चंद्र',
        role: 'नगर पालिका प्रशासनिक सचिव',
        category: 'Government Employee',
        position: new THREE.Vector3(-32, 0, -18),
        appearance: { shirtColor: '#f1f5f9', pantsColor: '#334155', sashColor: '#475569', skinColor: '#c58b56' },
        dialogues: [
          'आइये बैठिये! नगर पालिका में जनता की 200 से अधिक फाइलें लंबित हैं।',
          'वार्ड 12 में मुख्य सड़क निर्माण और नाली सफाई का प्रस्ताव पास होने की प्रतीक्षा में है।',
          'अगर आप विकास कार्यों की फाइलें स्वीकृत करवाएं तो सीधे जनता को लाभ मिलेगा।'
        ],
        needText: 'वार्ड 12 नाली व सड़क विकास का मास्टर प्लान पास कराना।',
        missionId: 'mission_ward_development_proposal'
      },
      // 7. Pandit Ramgopal Shastri (Sanctuary / Elder)
      {
        id: 'npc_priest_shastri',
        name: 'पंडित रामगोपाल शास्त्री',
        role: 'मंदिर व शांति समिति सदस्य',
        category: 'Elderly Citizen',
        position: new THREE.Vector3(36, 0, 8),
        appearance: { shirtColor: '#fed7aa', pantsColor: '#fff7ed', sashColor: '#ea580c', skinColor: '#c48749' },
        dialogues: [
          'सत्यमेव जयते! धर्म और राजनीति का समन्वय केवल लोक-कल्याण के लिए होना चाहिए।',
          'हमारे क्षेत्र में सभी धर्मों और वर्गों के लोग प्रेमपूर्वक रहते हैं। यह सौहार्द बना रहना चाहिए।',
          'सुबह-शाम वरिष्ठ नागरिक यहाँ बैठकर शांति और प्रार्थना में समय बिताते हैं।'
        ],
        needText: 'सार्वजनिक चबूतरे व पार्क क्षेत्र में पेयजल की व्यवस्था।'
      },
      // 8. Munna Sabziwala (Market Vendor)
      {
        id: 'npc_munna_veg',
        name: 'मुन्ना भाई (सब्जी विक्रेता)',
        role: 'सब्जी विक्रेता / स्ट्रीट वेंडर',
        category: 'Worker',
        position: new THREE.Vector3(-24, 0, 9),
        appearance: { shirtColor: '#bbf7d0', pantsColor: '#1f2937', sashColor: '#16a34a', skinColor: '#b47743' },
        dialogues: [
          'ताजा हरी सब्जियां ले लो बाबूजी! सुबह 4 बजे मंडी से माल लाते हैं।',
          'बाजार में कोई शेड या पक्की नाली नहीं है, बारिश में कीचड़ भर जाता है और हमारा माल खराब हो जाता है।',
          'अगर वेंडिंग जोन बन जाए तो हम सम्मान से रोजी-रोटी कमा सकेंगे।'
        ],
        needText: 'स्ट्रीट वेंडरों के लिए पक्का शेड और सफाई व्यवस्था।'
      },
      // 9. Constable Manoj (Police Beat)
      {
        id: 'npc_constable_manoj',
        name: 'कांस्टेबल मनोज कुमार',
        role: 'बीट सिपाही, शांतिपुर थाना',
        category: 'Police',
        position: new THREE.Vector3(26, 0, 18),
        appearance: { shirtColor: '#856942', pantsColor: '#45351e', sashColor: '#1e3a8a', skinColor: '#a16207' },
        dialogues: [
          'नमस्ते! मुख्य चौराहे पर ट्रैफिक सुचारू रखना हमारी जिम्मेदारी है।',
          'शाम के समय बाजार में भारी भीड़ होती है। असामाजिक तत्वों पर कड़ी निगरानी रहती है।'
        ],
        needText: 'बाजार तिराहे पर ट्रैफिक बैरिकेड और जेब्रा क्रॉसिंग।'
      },
      // 10. Nurse Shanti (Community Health Worker)
      {
        id: 'npc_nurse_shanti',
        name: 'शांति देवी (एएनएम / स्वास्थ्य कार्यकर्ता)',
        role: 'स्वास्थ्य कार्यकर्ता, मातृ एवं शिशु केंद्र',
        category: 'Government Employee',
        position: new THREE.Vector3(37, 0, -18),
        appearance: { shirtColor: '#fbcfe8', pantsColor: '#0f172a', sashColor: '#db2777', skinColor: '#dca180' },
        dialogues: [
          'नमस्ते! हम घर-घर जाकर टीकाकरण और पोषण की जानकारी देते हैं।',
          'मोहल्ले में स्वच्छ जल और नालियों की नियमित दवा छिड़काव से डेंगू-मलेरिया से बचाव होगा।'
        ],
        needText: 'वार्ड 12 में फॉगिंग मशीन और मच्छर रोधी दवा छिड़काव।'
      },
      // 11. Tiwari Ji (Senior Retired Citizen in Gandhi Vatika)
      {
        id: 'npc_tiwari_elder',
        name: 'तिवारी जी (सेवानिवृत्त शिक्षक)',
        role: 'अध्यक्ष, सीनियर सिटीजन क्लब',
        category: 'Elderly Citizen',
        position: new THREE.Vector3(-20, 0, 32),
        appearance: { shirtColor: '#f8fafc', pantsColor: '#475569', sashColor: '#64748b', hasGlasses: true, skinColor: '#c58b56' },
        dialogues: [
          'खुश रहो बेटा! हम बुजुर्ग रोज गांधी वाटिका में बैठते हैं।',
          'पार्क के वॉकिंग ट्रैक पर लाइटें खराब हैं और कुछ बेंच टूटी हुई हैं।',
          'अगर पार्क में ओपन जिम और सोलर लाइट लग जाएं तो स्वास्थ्य लाभ होगा।'
        ],
        needText: 'गांधी वाटिका पार्क में सोलर लैंप और बेंचों की मरम्मत।'
      },
      // 12. Rekha Tai (Self-Help Group Leader)
      {
        id: 'npc_rekha_tai',
        name: 'रेखा ताई (महिला स्व-सहायता समूह)',
        role: 'महिला उद्यमी व सामाजिक कार्यकर्ता',
        category: 'Citizen',
        position: new THREE.Vector3(-18, 0, -25),
        appearance: { shirtColor: '#f43f5e', pantsColor: '#1e293b', sashColor: '#f59e0b', skinColor: '#dfa279' },
        dialogues: [
          'जय हिंद! हमारी महिलाएं सिलाई और हस्तशिल्प से स्वावलंबी बन रही हैं।',
          'अगर नगर निगम में हमारे उत्पादों की बिक्री के लिए एक छोटा स्टॉल मिल जाए तो बहुत मदद होगी।'
        ],
        needText: 'महिला स्व-सहायता समूह के लिए सिलाई केंद्र व प्रशिक्षण सहायता।'
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
        category: cfg.category,
        position: cfg.position,
        dialogues: cfg.dialogues,
        dialogueIndex: 0,
        needText: cfg.needText,
        missionId: cfg.missionId || null,
        mesh: avatar.mesh,
        armLeft: avatar.leftArmGroup,
        armRight: avatar.rightArmGroup,
        idleTimer: Math.random() * 5
      });
    });
  }

  // Wandering AI Pedestrians: 12 dynamic moving citizens
  spawnWanderingPedestrians() {
    const pedestrianConfigs = [
      // 1. College Student
      {
        name: 'राहुल (कॉलेज छात्र)',
        category: 'Student',
        waypoints: [
          new THREE.Vector3(-9.25, 0, 20),
          new THREE.Vector3(-9.25, 0, 48),
          new THREE.Vector3(-25, 0, 48),
          new THREE.Vector3(-9.25, 0, 20)
        ],
        appearance: { shirtColor: '#38bdf8', pantsColor: '#1e293b', sashColor: '#0284c7', skinColor: '#dca180' },
        speed: 3.4
      },
      // 2. Party Worker
      {
        name: 'सोमेश (पार्टी कार्यकर्ता)',
        category: 'Political Worker',
        waypoints: [
          new THREE.Vector3(9.25, 0, -10),
          new THREE.Vector3(9.25, 0, 32),
          new THREE.Vector3(0, 0, 8),
          new THREE.Vector3(9.25, 0, -10)
        ],
        appearance: { shirtColor: '#ffffff', pantsColor: '#334155', sashColor: '#ff9933', hasGandhiCap: true, skinColor: '#c68642' },
        speed: 3.8
      },
      // 3. Senior Citizen
      {
        name: 'चाचा मनोहर (वरिष्ठ नागरिक)',
        category: 'Elderly Citizen',
        waypoints: [
          new THREE.Vector3(9.25, 0, 45),
          new THREE.Vector3(25, 0, 15),
          new THREE.Vector3(32, 0, 8),
          new THREE.Vector3(9.25, 0, 45)
        ],
        appearance: { shirtColor: '#f1f5f9', pantsColor: '#64748b', sashColor: '#94a3b8', hasGlasses: true, skinColor: '#b07946' },
        speed: 2.1
      },
      // 4. Construction Worker
      {
        name: 'कमलेश (निर्माण श्रमिक)',
        category: 'Worker',
        waypoints: [
          new THREE.Vector3(-9.25, 0, -15),
          new THREE.Vector3(-9.25, 0, -48),
          new THREE.Vector3(-25, 0, -28),
          new THREE.Vector3(-9.25, 0, -15)
        ],
        appearance: { shirtColor: '#fb923c', pantsColor: '#374151', sashColor: '#b45309', skinColor: '#a16207' },
        speed: 3.0
      },
      // 5. School Girl (Pooja)
      {
        name: 'पूजा (स्कूली छात्रा)',
        category: 'Student',
        waypoints: [
          new THREE.Vector3(-28, 0, 20),
          new THREE.Vector3(-36, 0, 28),
          new THREE.Vector3(-18, 0, 35),
          new THREE.Vector3(-28, 0, 20)
        ],
        appearance: { shirtColor: '#fef08a', pantsColor: '#1e3a8a', sashColor: '#ef4444', skinColor: '#e0a96d' },
        speed: 3.1
      },
      // 6. Youth Volunteer (Vikash)
      {
        name: 'विकास (युवा स्वयंसेवक)',
        category: 'Political Worker',
        waypoints: [
          new THREE.Vector3(0, 0, -5),
          new THREE.Vector3(12, 0, -15),
          new THREE.Vector3(-12, 0, -15),
          new THREE.Vector3(0, 0, -5)
        ],
        appearance: { shirtColor: '#ffedd5', pantsColor: '#0f172a', sashColor: '#ea580c', skinColor: '#b87b4b' },
        speed: 3.6
      },
      // 7. Electrician / Lineman
      {
        name: 'बबलू (लाइनमैन / बिजली मिस्त्री)',
        category: 'Worker',
        waypoints: [
          new THREE.Vector3(-15, 0, -35),
          new THREE.Vector3(-9.25, 0, -20),
          new THREE.Vector3(-9.25, 0, 5),
          new THREE.Vector3(-15, 0, -35)
        ],
        appearance: { shirtColor: '#0284c7', pantsColor: '#1e293b', sashColor: '#facc15', skinColor: '#c58b56' },
        speed: 3.3
      },
      // 8. Mother and Citizen (Sunita)
      {
        name: 'सुनीता जी (गृहणी व नागरिक)',
        category: 'Citizen',
        waypoints: [
          new THREE.Vector3(-25, 0, -20),
          new THREE.Vector3(-18, 0, 5),
          new THREE.Vector3(-22, 0, 12),
          new THREE.Vector3(-25, 0, -20)
        ],
        appearance: { shirtColor: '#c084fc', pantsColor: '#3b0764', sashColor: '#ec4899', skinColor: '#dfa279' },
        speed: 2.8
      },
      // 9. Hospital Visitor (Ramesh)
      {
        name: 'रमेश (अस्पताल आगंतुक)',
        category: 'Citizen',
        waypoints: [
          new THREE.Vector3(20, 0, -18),
          new THREE.Vector3(32, 0, -12),
          new THREE.Vector3(9.25, 0, -5),
          new THREE.Vector3(20, 0, -18)
        ],
        appearance: { shirtColor: '#e2e8f0', pantsColor: '#334155', sashColor: '#0284c7', skinColor: '#a16207' },
        speed: 2.9
      },
      // 10. Auto Driver Off-duty (Aslam)
      {
        name: 'असलम (ऑटो चालक)',
        category: 'Worker',
        waypoints: [
          new THREE.Vector3(14, 0, 18),
          new THREE.Vector3(9.25, 0, 8),
          new THREE.Vector3(-9.25, 0, 8),
          new THREE.Vector3(14, 0, 18)
        ],
        appearance: { shirtColor: '#cbd5e1', pantsColor: '#15803d', sashColor: '#facc15', skinColor: '#b07946' },
        speed: 3.5
      },
      // 11. Advocate Clerk (Shrivastav Ji)
      {
        name: 'श्रीवास्तव (अधिवक्ता सहायक)',
        category: 'Government Employee',
        waypoints: [
          new THREE.Vector3(-30, 0, -12),
          new THREE.Vector3(-15, 0, -12),
          new THREE.Vector3(-9.25, 0, -5),
          new THREE.Vector3(-30, 0, -12)
        ],
        appearance: { shirtColor: '#ffffff', pantsColor: '#000000', sashColor: '#475569', hasGlasses: true, skinColor: '#c68642' },
        speed: 3.2
      },
      // 12. Temple Devotee (Gauri)
      {
        name: 'गौरी (श्रद्धालु)',
        category: 'Citizen',
        waypoints: [
          new THREE.Vector3(30, 0, 12),
          new THREE.Vector3(38, 0, 15),
          new THREE.Vector3(25, 0, 25),
          new THREE.Vector3(30, 0, 12)
        ],
        appearance: { shirtColor: '#fed7aa', pantsColor: '#9a3412', sashColor: '#ea580c', skinColor: '#dca180' },
        speed: 2.6
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
        category: cfg.category,
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
    // Check static key NPCs
    for (const npc of this.npcs) {
      const dist = npc.position.distanceTo(playerPos);
      if (dist <= maxDist) {
        return { npc, dist };
      }
    }

    // Also check wandering pedestrians when standing close
    for (const p of this.wanderingPedestrians) {
      const dist = p.mesh.position.distanceTo(playerPos);
      if (dist <= maxDist) {
        return {
          npc: {
            id: 'pedestrian_' + p.name,
            name: p.name,
            role: p.category,
            dialogues: [
              `नमस्ते! मैं ${p.name} हूँ। हमारे मोहल्ले में विकास और शांति की बहुत ज़रूरत है।`,
              'सड़कें अच्छी हों, अस्पताल में डॉक्टर मिलें और युवाओं को रोजगार मिले — तभी सच्चा बदलाव आएगा!'
            ],
            dialogueIndex: 0,
            needText: 'मोहल्ले में विकास और जनसेवा की निरंतरता।'
          },
          dist
        };
      }
    }
    return null;
  }
}
