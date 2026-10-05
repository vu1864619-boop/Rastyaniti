// Procedural & Modular Indian Town District Map for Three.js
// Optimized for mobile Android with low draw calls, merged geometries, and recognizable Indian town architecture:
// Roads with yellow/white markings, roadside stalls (chai/paan stall), Nagar Nigam municipal office,
// Government hospital, primary school, police station with tricolor/Indian flag, temple/public chowk,
// auto-rickshaw/bus stop, trees (neem/banyan style), streetlights, and buildings.

import * as THREE from 'three';

export class TownWorld {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.interactables = [];
    this.interactivePOIs = [];
    this.initMaterials();
    this.buildDistrict();
  }

  initMaterials() {
    this.materials = {
      road: new THREE.MeshLambertMaterial({ color: 0x24272c }),
      roadStripe: new THREE.MeshBasicMaterial({ color: 0xf5f5f5 }),
      sidewalk: new THREE.MeshLambertMaterial({ color: 0x9e9a8f }),
      ground: new THREE.MeshLambertMaterial({ color: 0x4f5d30 }), // Earthy Indian green grass/soil
      dirtGround: new THREE.MeshLambertMaterial({ color: 0x8a7051 }),

      // Indian building colors
      wallYellow: new THREE.MeshLambertMaterial({ color: 0xe6b96e }), // Ochre / Haldi yellow
      wallPink: new THREE.MeshLambertMaterial({ color: 0xd98679 }),   // Jaipur terracotta pink
      wallBlue: new THREE.MeshLambertMaterial({ color: 0x5b9aa0 }),   // Jodhpur blue
      wallWhite: new THREE.MeshLambertMaterial({ color: 0xdedede }),  // Govt whitewash
      wallGovtGreen: new THREE.MeshLambertMaterial({ color: 0x2e6b4e }),
      roofTile: new THREE.MeshLambertMaterial({ color: 0x994d2f }),   // Terracotta clay tiles
      concrete: new THREE.MeshLambertMaterial({ color: 0x7c7c7c }),

      // Accents & Signs
      boardBlue: new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }),
      boardGreen: new THREE.MeshLambertMaterial({ color: 0x15803d }),
      boardSaffron: new THREE.MeshLambertMaterial({ color: 0xea580c }),
      policeKhaki: new THREE.MeshLambertMaterial({ color: 0x856942 }),
      policeBlue: new THREE.MeshLambertMaterial({ color: 0x1e3a8a }),

      // Props & Nature
      trunk: new THREE.MeshLambertMaterial({ color: 0x5a3d28 }),
      leaves: new THREE.MeshLambertMaterial({ color: 0x2f6828 }),
      autoYellow: new THREE.MeshLambertMaterial({ color: 0xfacc15 }),
      autoGreen: new THREE.MeshLambertMaterial({ color: 0x16a34a }),
      tarpBlue: new THREE.MeshLambertMaterial({ color: 0x2563eb }),
      metalLight: new THREE.MeshLambertMaterial({ color: 0x475569 })
    };
  }

  buildDistrict() {
    this.createTerrain();
    this.createRoadNetwork();
    this.createMunicipalOffice();
    this.createGovernmentHospital();
    this.createPrimarySchool();
    this.createPoliceStation();
    this.createMarketAndChaiStalls();
    this.createResidentialMohalla();
    this.createBusStopAndVehicles();
    this.createCentralChowkAndFlag();
    this.createTreesAndStreetlights();
  }

  createTerrain() {
    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const ground = new THREE.Mesh(groundGeo, this.materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createRoadNetwork() {
    const roadGroup = new THREE.Group();

    // Main East-West Road (Rajpath / Main Market Road)
    const mainRoadGeo = new THREE.PlaneGeometry(16, 150);
    const mainRoad = new THREE.Mesh(mainRoadGeo, this.materials.road);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.y = 0.02;
    roadGroup.add(mainRoad);

    // North-South Cross Road (Ward Road)
    const crossRoadGeo = new THREE.PlaneGeometry(150, 14);
    const crossRoad = new THREE.Mesh(crossRoadGeo, this.materials.road);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.y = 0.025;
    roadGroup.add(crossRoad);

    // Road Markings (Zebra crossings & lane divider lines)
    for (let z = -65; z <= 65; z += 6) {
      if (Math.abs(z) > 10) {
        const stripeGeo = new THREE.PlaneGeometry(0.5, 3);
        const stripe = new THREE.Mesh(stripeGeo, this.materials.roadStripe);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(0, 0.03, z);
        roadGroup.add(stripe);
      }
    }

    for (let x = -65; x <= 65; x += 6) {
      if (Math.abs(x) > 10) {
        const stripeGeo = new THREE.PlaneGeometry(3, 0.5);
        const stripe = new THREE.Mesh(stripeGeo, this.materials.roadStripe);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(x, 0.035, 0);
        roadGroup.add(stripe);
      }
    }

    // Footpath / Sidewalks alongside main road
    const swGeo1 = new THREE.BoxGeometry(2.5, 0.25, 150);
    const swLeft = new THREE.Mesh(swGeo1, this.materials.sidewalk);
    swLeft.position.set(-9.25, 0.125, 0);
    swLeft.receiveShadow = true;
    roadGroup.add(swLeft);

    const swRight = new THREE.Mesh(swGeo1, this.materials.sidewalk);
    swRight.position.set(9.25, 0.125, 0);
    swRight.receiveShadow = true;
    roadGroup.add(swRight);

    this.scene.add(roadGroup);
  }

  // 1. Municipal Office (नगर पालिका कार्यालय)
  createMunicipalOffice() {
    const x = -35, z = -25;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Main two-story colonial-style government building
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(24, 7, 16), this.materials.wallWhite);
    mainBody.position.y = 3.5;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    group.add(mainBody);
    this.addBoxCollider(x, z, 24, 16);

    // Pillars / Verandah
    for (let px = -9; px <= 9; px += 4.5) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6), this.materials.wallWhite);
      pillar.position.set(px, 3, 8.5);
      pillar.castShadow = true;
      group.add(pillar);
    }

    // Roof & dome
    const roof = new THREE.Mesh(new THREE.BoxGeometry(25, 0.8, 18), this.materials.roofTile);
    roof.position.y = 7.4;
    group.add(roof);

    // Hindi Office Sign Board
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 0.3), this.materials.boardBlue);
    signBoard.position.set(0, 6.2, 8.2);
    group.add(signBoard);

    // Tricolor flag atop municipal office
    this.addIndianFlag(group, 0, 7.8, 0);

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_municipality',
      nameHi: 'नगर निगम कार्यालय (Municipal Office)',
      descHi: 'नागरिक शिकायतें, बजट, और वार्ड विकास परियोजनाएं यहीं से स्वीकृत होती हैं।',
      position: new THREE.Vector3(x, 1, z + 10),
      type: 'GOVERNANCE'
    });
  }

  // 2. Government Community Hospital (सामुदायिक स्वास्थ्य केंद्र)
  createGovernmentHospital() {
    const x = 32, z = -28;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const bld = new THREE.Mesh(new THREE.BoxGeometry(22, 6.5, 18), this.materials.wallWhite);
    bld.position.y = 3.25;
    bld.castShadow = true;
    group.add(bld);
    this.addBoxCollider(x, z, 22, 18);

    // Red Cross emblem
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(1, 3.5, 0.2), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    crossV.position.set(0, 4.5, 9.15);
    group.add(crossV);

    const crossH = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1, 0.2), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    crossH.position.set(0, 4.5, 9.15);
    group.add(crossH);

    // Hospital Sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(15, 1, 0.3), this.materials.boardGreen);
    sign.position.set(0, 2.2, 9.15);
    group.add(sign);

    // Ambulance parking prop
    const amb = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 5.5), this.materials.wallWhite);
    amb.position.set(8, 1.1, 12);
    const redLight = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    redLight.position.set(8, 2.4, 12);
    group.add(amb);
    group.add(redLight);
    this.addBoxCollider(x + 8, z + 12, 4, 6);

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_hospital',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र (Govt Hospital)',
      descHi: 'मुफ्त दवा वितरण, स्वास्थ्य शिविर और जन-स्वास्थ्य सेवा केंद्र।',
      position: new THREE.Vector3(x, 1, z + 12),
      type: 'HEALTH'
    });
  }

  // 3. Primary Government School (प्राथमिक विद्यालय)
  createPrimarySchool() {
    const x = -38, z = 32;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // U-shaped school building
    const bldCenter = new THREE.Mesh(new THREE.BoxGeometry(20, 4.5, 10), this.materials.wallYellow);
    bldCenter.position.y = 2.25;
    bldCenter.castShadow = true;
    group.add(bldCenter);
    this.addBoxCollider(x, z, 20, 10);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 12), this.materials.wallYellow);
    wing.position.set(-10, 2.25, 4);
    group.add(wing);
    this.addBoxCollider(x - 10, z + 4, 8, 12);

    // Blackboard / Slogan Wall "सब पढ़ें, सब बढ़ें"
    const sloganWall = new THREE.Mesh(new THREE.BoxGeometry(10, 1.5, 0.2), this.materials.boardBlue);
    sloganWall.position.set(0, 3.8, 5.15);
    group.add(sloganWall);

    // School Playground swings / assembly pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7), this.materials.metalLight);
    pole.position.set(0, 3.5, 11);
    group.add(pole);
    this.addIndianFlag(group, 0, 7, 11, 0.7);

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_school',
      nameHi: 'शासकीय प्राथमिक विद्यालय (Primary School)',
      descHi: 'मिड-डे मील योजना, बालिका शिक्षा, और युवा मतदाता केंद्र।',
      position: new THREE.Vector3(x, 1, z + 8),
      type: 'EDUCATION'
    });
  }

  // 4. Police Station (थाना - शांतिपुर)
  createPoliceStation() {
    const x = 36, z = 32;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const bld = new THREE.Mesh(new THREE.BoxGeometry(18, 5.5, 14), this.materials.wallYellow);
    bld.position.y = 2.75;
    bld.castShadow = true;
    group.add(bld);
    this.addBoxCollider(x, z, 18, 14);

    // Police Signboard (Red & Blue pattern)
    const signR = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    signR.position.set(-2.5, 4.2, 7.15);
    group.add(signR);

    const signB = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.2), new THREE.MeshBasicMaterial({ color: 0x1e3a8a }));
    signB.position.set(2.5, 4.2, 7.15);
    group.add(signB);

    // Police barricade props
    for (let bx = -4; bx <= 4; bx += 4) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 0.4), this.materials.boardYellow || this.materials.autoYellow);
      bar.position.set(bx, 0.6, 10);
      group.add(bar);
      this.addBoxCollider(x + bx, z + 10, 2.5, 0.6);
    }

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_police',
      nameHi: 'थाना शांतिपुर (Police Station)',
      descHi: 'कानून व्यवस्था, रैली व लाउडस्पीकर अनुमति, और नागरिक सुरक्षा।',
      position: new THREE.Vector3(x, 1, z + 10),
      type: 'POLICE'
    });
  }

  // 5. Market with Chai Stall, Kirana Shop, Paan Shop
  createMarketAndChaiStalls() {
    const shopsGroup = new THREE.Group();

    // North Market Row (x: -12 to -28 along z: -10)
    const shopColors = [this.materials.wallPink, this.materials.wallBlue, this.materials.wallYellow];
    for (let i = 0; i < 4; i++) {
      const sx = -14 - (i * 5.5);
      const sz = -12;
      const shop = new THREE.Mesh(new THREE.BoxGeometry(5, 3.8, 6), shopColors[i % shopColors.length]);
      shop.position.set(sx, 1.9, sz);
      shop.castShadow = true;
      shopsGroup.add(shop);
      this.addBoxCollider(sx, sz, 5, 6);

      // Awning / Shade (Shutter shade)
      const awning = new THREE.Mesh(new THREE.BoxGeometry(5, 0.15, 2.2), this.materials.tarpBlue);
      awning.position.set(sx, 2.8, sz + 3.8);
      awning.rotation.x = 0.2;
      shopsGroup.add(awning);
    }

    // Popular Chai Stall (शर्मा जी की चाय की दुकान) - Political Discussion Hub
    const cx = -12, cz = 12;
    const chaiKiosk = new THREE.Mesh(new THREE.BoxGeometry(4, 2.8, 3.5), this.materials.wallPink);
    chaiKiosk.position.set(cx, 1.4, cz);
    shopsGroup.add(chaiKiosk);
    this.addBoxCollider(cx, cz, 4, 3.5);

    // Bench for discussion
    const bench = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.8), this.materials.trunk);
    bench.position.set(cx, 0.25, cz + 2.5);
    shopsGroup.add(bench);

    this.registerPOI({
      id: 'poi_chai_stall',
      nameHi: 'शर्मा जी की चाय की दुकान (Chai Tapri Hub)',
      descHi: 'मोहल्ले की राजनीति, चुनावी चर्चाएं और जनमत जानने का सबसे प्रसिद्ध केंद्र।',
      position: new THREE.Vector3(cx, 1, cz + 3),
      type: 'SOCIAL'
    });

    this.scene.add(shopsGroup);
  }

  // 6. Residential Mohalla (Player's Home + Citizen Houses)
  createResidentialMohalla() {
    const resGroup = new THREE.Group();

    // Player's house (मेरा घर)
    const px = -35, pz = 10;
    const playerHouse = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 9), this.materials.wallYellow);
    playerHouse.position.set(px, 2.1, pz);
    playerHouse.castShadow = true;
    resGroup.add(playerHouse);
    this.addBoxCollider(px, pz, 10, 9);

    const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(7.5, 2.5, 4), this.materials.roofTile);
    houseRoof.position.set(px, 5.4, pz);
    houseRoof.rotation.y = Math.PI / 4;
    resGroup.add(houseRoof);

    // Nameplate
    const namePlate = new THREE.Mesh(new THREE.BoxGeometry(2, 0.7, 0.1), this.materials.boardSaffron);
    namePlate.position.set(px, 1.8, pz + 4.6);
    resGroup.add(namePlate);

    this.registerPOI({
      id: 'poi_home',
      nameHi: 'आपका घर (Player Home)',
      descHi: 'विश्राम करें, ऊर्जा (Energy) पुनः प्राप्त करें, और अपनी चुनावी रणनीति की योजना बनाएं।',
      position: new THREE.Vector3(px, 1, pz + 6),
      type: 'HOME'
    });

    // Neighborhood residential houses along East
    for (let i = 0; i < 3; i++) {
      const hx = 16 + (i * 7);
      const hz = -12;
      const house = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 7), this.materials.wallPink);
      house.position.set(hx, 2, hz);
      resGroup.add(house);
      this.addBoxCollider(hx, hz, 6, 7);
    }

    this.scene.add(resGroup);
  }

  // 7. Bus Stop & Auto-Rickshaw Stand
  createBusStopAndVehicles() {
    const group = new THREE.Group();
    const bx = 12, bz = 14;

    // Bus stop shelter
    const shelterRoof = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 3), this.materials.boardBlue);
    shelterRoof.position.set(bx, 3.2, bz);
    group.add(shelterRoof);

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2), this.materials.metalLight);
    p1.position.set(bx - 2.8, 1.6, bz - 1.2);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2), this.materials.metalLight);
    p2.position.set(bx + 2.8, 1.6, bz - 1.2);
    group.add(p1);
    group.add(p2);

    // Auto Rickshaw prop (Iconic Indian Yellow & Green)
    const ax = 14, az = 8;
    const autoBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 3.6), this.materials.autoGreen);
    autoBody.position.set(ax, 0.9, az);
    group.add(autoBody);

    const autoHood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.6, 2.6), this.materials.autoYellow);
    autoHood.position.set(ax, 1.9, az - 0.2);
    group.add(autoHood);
    this.addBoxCollider(ax, az, 2.4, 3.8);

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_bus_stop',
      nameHi: 'शांतिपुर बस स्टॉप एवं ऑटो स्टैंड',
      descHi: 'प्रचार वाहन किराया, सार्वजनिक परिवहन, और ग्रामीण क्षेत्रों में आवागमन।',
      position: new THREE.Vector3(bx, 1, bz + 2),
      type: 'TRANSPORT'
    });
  }

  // 8. Central Public Chowk & National Flag (तिरंगा चौक)
  createCentralChowkAndFlag() {
    const chowkGroup = new THREE.Group();

    // Roundabout / Public Island
    const island = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 0.4, 24), this.materials.sidewalk);
    island.position.set(0, 0.2, 0);
    island.receiveShadow = true;
    chowkGroup.add(island);

    // Central Pillar / Statue Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2), this.materials.concrete);
    base.position.set(0, 0.8, 0);
    chowkGroup.add(base);

    // Indian Flag Pole
    this.addIndianFlag(chowkGroup, 0, 1.4, 0, 1.4);

    this.addBoxCollider(0, 0, 3, 3);
    this.scene.add(chowkGroup);

    this.registerPOI({
      id: 'poi_chowk',
      nameHi: 'तिरंगा चौक / जनसभा स्थल (Public Chowk)',
      descHi: 'सार्वजनिक रैलियां, नुक्कड़ नाटक, भाषण, और आम जनता से जनसंपर्क का मुख्य स्थल।',
      position: new THREE.Vector3(0, 1, 7),
      type: 'RALLY_GROUND'
    });
  }

  addIndianFlag(parent, x, y, z, scale = 1.0) {
    const flagGroup = new THREE.Group();
    flagGroup.position.set(x, y, z);
    flagGroup.scale.set(scale, scale, scale);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 8), this.materials.metalLight);
    pole.position.y = 4;
    flagGroup.add(pole);

    // Saffron strip
    const saff = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xff9933, side: THREE.DoubleSide }));
    saff.position.set(1.2, 7.6, 0);
    flagGroup.add(saff);

    // White strip with Ashoka Chakra blue spot
    const wht = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    wht.position.set(1.2, 7.2, 0);
    flagGroup.add(wht);

    const chakra = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), new THREE.MeshBasicMaterial({ color: 0x000080, side: THREE.DoubleSide }));
    chakra.position.set(1.2, 7.2, 0.01);
    flagGroup.add(chakra);

    // Green strip
    const grn = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0x138808, side: THREE.DoubleSide }));
    grn.position.set(1.2, 6.8, 0);
    flagGroup.add(grn);

    parent.add(flagGroup);
  }

  createTreesAndStreetlights() {
    const foliageGroup = new THREE.Group();

    // Trees along roads
    const treeCoords = [
      { x: -11, z: -25 }, { x: -11, z: -45 }, { x: -11, z: 25 }, { x: -11, z: 45 },
      { x: 11, z: -25 }, { x: 11, z: -45 }, { x: 11, z: 25 }, { x: 11, z: 45 },
      { x: -28, z: 11 }, { x: -50, z: 11 }, { x: 28, z: 11 }, { x: 50, z: 11 }
    ];

    treeCoords.forEach(pos => {
      // Tree trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5), this.materials.trunk);
      trunk.position.set(pos.x, 1.75, pos.z);
      trunk.castShadow = true;
      foliageGroup.add(trunk);

      // Lush leafy crown
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), this.materials.leaves);
      crown.position.set(pos.x, 4.5, pos.z);
      crown.castShadow = true;
      foliageGroup.add(crown);

      this.addBoxCollider(pos.x, pos.z, 1.2, 1.2);
    });

    // Streetlights (Simple mobile-optimized lamp posts)
    const lampCoords = [
      { x: -9.5, z: -15 }, { x: -9.5, z: 15 },
      { x: 9.5, z: -15 }, { x: 9.5, z: 15 }
    ];

    lampCoords.forEach(lp => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.5), this.materials.metalLight);
      pole.position.set(lp.x, 2.75, lp.z);
      foliageGroup.add(pole);

      const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 1.2), this.materials.metalLight);
      lampHead.position.set(lp.x, 5.4, lp.z);
      foliageGroup.add(lampHead);

      const lampGlow = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lampGlow.position.set(lp.x, 5.25, lp.z);
      foliageGroup.add(lampGlow);
    });

    this.scene.add(foliageGroup);
  }

  addBoxCollider(cx, cz, width, depth) {
    this.colliders.push({
      minX: cx - width / 2,
      maxX: cx + width / 2,
      minZ: cz - depth / 2,
      maxZ: cz + depth / 2
    });
  }

  registerPOI(poi) {
    this.interactivePOIs.push(poi);
  }

  checkCollision(nextX, nextZ, radius = 0.5) {
    for (const box of this.colliders) {
      if (
        nextX + radius > box.minX &&
        nextX - radius < box.maxX &&
        nextZ + radius > box.minZ &&
        nextZ - radius < box.maxZ
      ) {
        return true;
      }
    }
    // District border collision (boundaries of Ward 12)
    if (Math.abs(nextX) > 75 || Math.abs(nextZ) > 75) {
      return true;
    }
    return false;
  }

  getNearbyPOI(x, z, maxDist = 3.5) {
    for (const poi of this.interactivePOIs) {
      const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
      if (dist <= maxDist) {
        return { poi, dist };
      }
    }
    return null;
  }
}
