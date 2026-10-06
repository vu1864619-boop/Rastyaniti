// Enhanced Procedural Indian Town District Map for Three.js
// Features: Kirana store, Chai stall, Nagar Nigam, Hospital, School, Police Station,
// Mandir/Peace Garden, Park with benches, residential houses, parked autos, street lamps, and collision grid.

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
      ground: new THREE.MeshLambertMaterial({ color: 0x4f5d30 }), // Earthy Indian green grass
      parkGrass: new THREE.MeshLambertMaterial({ color: 0x3d702d }),
      dirtGround: new THREE.MeshLambertMaterial({ color: 0x8a7051 }),

      // Indian building colors
      wallYellow: new THREE.MeshLambertMaterial({ color: 0xe6b96e }), // Ochre / Haldi yellow
      wallPink: new THREE.MeshLambertMaterial({ color: 0xd98679 }),   // Jaipur terracotta pink
      wallBlue: new THREE.MeshLambertMaterial({ color: 0x5b9aa0 }),   // Jodhpur blue
      wallWhite: new THREE.MeshLambertMaterial({ color: 0xdedede }),  // Govt whitewash
      wallTempleSaffron: new THREE.MeshLambertMaterial({ color: 0xf97316 }), // Sacred saffron ochre
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
      metalLight: new THREE.MeshLambertMaterial({ color: 0x475569 }),

      // Architectural & Environmental details
      windowGlass: new THREE.MeshLambertMaterial({ color: 0x60a5fa }),
      windowFrame: new THREE.MeshLambertMaterial({ color: 0x1e293b }),
      doorWood: new THREE.MeshLambertMaterial({ color: 0x78350f }),
      sintexBlack: new THREE.MeshLambertMaterial({ color: 0x171717 }),
      solarBlue: new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }),
      posterGold: new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
      brickTrim: new THREE.MeshLambertMaterial({ color: 0xb45309 }),
      signWhite: new THREE.MeshLambertMaterial({ color: 0xffffff })
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
    this.createTemplePeaceSanctuary();
    this.createPublicPark();
    this.createTreesAndStreetlights();
  }

  createTerrain() {
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const ground = new THREE.Mesh(groundGeo, this.materials.ground);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createRoadNetwork() {
    const roadGroup = new THREE.Group();

    // Main East-West Road (Rajpath)
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

    // Road Markings (Zebra crossings & divider stripes)
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

    // Footpaths / Sidewalks alongside main road
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

    // Windows and Entrance Door for Municipal Office
    const door = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 0.2), this.materials.doorWood);
    door.position.set(0, 2.1, 8.05);
    group.add(door);

    [-6, 6].forEach(wx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.2), this.materials.windowGlass);
      win.position.set(wx, 3.8, 8.05);
      group.add(win);
    });

    // Rooftop Sintex Water Tank
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.0, 12), this.materials.sintexBlack);
    tank.position.set(-8, 8.8, -4);
    group.add(tank);

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

    // Hospital Windows
    for (let hx = -7; hx <= 7; hx += 4.5) {
      const hWin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 0.2), this.materials.windowGlass);
      hWin.position.set(hx, 4.2, 9.05);
      group.add(hWin);
    }

    // Glass Double Door
    const hDoor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 0.2), this.materials.windowGlass);
    hDoor.position.set(0, 1.6, 9.05);
    group.add(hDoor);

    // Rooftop Solar Panel array
    const solar = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.2, 4.0), this.materials.solarBlue);
    solar.position.set(-5, 6.8, -2);
    solar.rotation.x = 0.15;
    group.add(solar);

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

    // Ambulance prop
    const amb = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.2, 5.5), this.materials.wallWhite);
    amb.position.set(8, 1.1, 12);
    const redLight = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    redLight.position.set(8, 2.4, 12);
    group.add(amb, redLight);
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

  // 3. Primary Government School (शासकीय प्राथमिक विद्यालय)
  createPrimarySchool() {
    const x = -38, z = 32;
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const bldCenter = new THREE.Mesh(new THREE.BoxGeometry(20, 4.5, 10), this.materials.wallYellow);
    bldCenter.position.y = 2.25;
    bldCenter.castShadow = true;
    group.add(bldCenter);
    this.addBoxCollider(x, z, 20, 10);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 12), this.materials.wallYellow);
    wing.position.set(-10, 2.25, 4);
    group.add(wing);
    this.addBoxCollider(x - 10, z + 4, 8, 12);

    // Classroom Windows with Iron Grills
    [-6, 6].forEach(sx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.2), this.materials.windowGlass);
      win.position.set(sx, 2.4, 5.05);
      group.add(win);
    });

    // School Wooden Door
    const schoolDoor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.2, 0.2), this.materials.doorWood);
    schoolDoor.position.set(0, 1.6, 5.05);
    group.add(schoolDoor);

    const sloganWall = new THREE.Mesh(new THREE.BoxGeometry(10, 1.5, 0.2), this.materials.boardBlue);
    sloganWall.position.set(0, 3.8, 5.15);
    group.add(sloganWall);

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

    // Police Red/Blue Sign
    const signR = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    signR.position.set(-2.5, 4.2, 7.15);
    const signB = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.2), new THREE.MeshBasicMaterial({ color: 0x1e3a8a }));
    signB.position.set(2.5, 4.2, 7.15);
    group.add(signR, signB);

    // Police Station Wooden Door
    const polDoor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 0.2), this.materials.doorWood);
    polDoor.position.set(0, 1.6, 7.05);
    group.add(polDoor);

    // Police Radio / Wireless Antenna Tower on Roof
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6.0), this.materials.metalLight);
    antenna.position.set(7, 8.2, -4);
    group.add(antenna);

    // Police Yellow/Black Barricades
    for (let bx = -4; bx <= 4; bx += 4) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 0.4), this.materials.autoYellow);
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

  // 5. Market with Chai Stall & Kirana Store
  createMarketAndChaiStalls() {
    const shopsGroup = new THREE.Group();

    // North Market Row
    const shopColors = [this.materials.wallPink, this.materials.wallBlue, this.materials.wallYellow];
    for (let i = 0; i < 4; i++) {
      const sx = -14 - (i * 5.5);
      const sz = -12;
      const shop = new THREE.Mesh(new THREE.BoxGeometry(5, 3.8, 6), shopColors[i % shopColors.length]);
      shop.position.set(sx, 1.9, sz);
      shop.castShadow = true;
      shopsGroup.add(shop);
      this.addBoxCollider(sx, sz, 5, 6);

      const awning = new THREE.Mesh(new THREE.BoxGeometry(5, 0.15, 2.2), this.materials.tarpBlue);
      awning.position.set(sx, 2.8, sz + 3.8);
      awning.rotation.x = 0.2;
      shopsGroup.add(awning);
    }

    // Gupta Kirana Store Signboard
    const kiranaSign = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.8, 0.2), this.materials.boardGreen);
    kiranaSign.position.set(-19.5, 3.4, -8.1);
    shopsGroup.add(kiranaSign);

    this.registerPOI({
      id: 'poi_kirana',
      nameHi: 'गुप्ता जी किराना एवं जनरल स्टोर (Kirana Store)',
      descHi: 'स्थानीय व्यापार व राशन आपूर्ति। दैनिक रोजगार व छोटे व्यापारिक मुद्दे।',
      position: new THREE.Vector3(-19.5, 1, -7.5),
      type: 'BUSINESS'
    });

    // Popular Chai Stall (शर्मा जी की चाय की दुकान)
    const cx = -12, cz = 12;
    const chaiKiosk = new THREE.Mesh(new THREE.BoxGeometry(4, 2.8, 3.5), this.materials.wallPink);
    chaiKiosk.position.set(cx, 1.4, cz);
    shopsGroup.add(chaiKiosk);
    this.addBoxCollider(cx, cz, 4, 3.5);

    const bench = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.8), this.materials.trunk);
    bench.position.set(cx, 0.25, cz + 2.5);
    shopsGroup.add(bench);

    // Chai Tapri Kiosk details: Counter, Gas Stove, and Tea Kettle (केटली)
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.0, 1.2), this.materials.concrete);
    counter.position.set(cx, 0.5, cz + 1.8);
    shopsGroup.add(counter);

    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.5), this.materials.metalLight);
    kettle.position.set(cx + 0.8, 1.25, cz + 1.8);
    shopsGroup.add(kettle);

    // Kirana store grain sacks (बोरी)
    [-17.5, -21.5].forEach(kx => {
      const sack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.0), this.materials.dirtGround);
      sack.position.set(kx, 0.4, -8.6);
      shopsGroup.add(sack);
    });

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

    // Front Door & Windows for Player House
    const pDoor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.2), this.materials.doorWood);
    pDoor.position.set(px, 1.4, pz + 4.55);
    resGroup.add(pDoor);

    [-3, 3].forEach(wx => {
      const pWin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.2), this.materials.windowGlass);
      pWin.position.set(px + wx, 2.4, pz + 4.55);
      resGroup.add(pWin);
    });

    const namePlate = new THREE.Mesh(new THREE.BoxGeometry(2, 0.7, 0.1), this.materials.boardSaffron);
    namePlate.position.set(px, 1.8, pz + 4.6);
    resGroup.add(namePlate);

    // Water Tank for Player House
    const pTank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.4, 10), this.materials.sintexBlack);
    pTank.position.set(px + 3, 6.2, pz - 2);
    resGroup.add(pTank);

    this.registerPOI({
      id: 'poi_home',
      nameHi: 'आपका घर (Player Home)',
      descHi: 'विश्राम करें, ऊर्जा (Energy) पुनः प्राप्त करें, और अपनी चुनावी रणनीति की योजना बनाएं।',
      position: new THREE.Vector3(px, 1, pz + 6),
      type: 'HOME'
    });

    // Citizen residential houses along East
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

    const shelterRoof = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 3), this.materials.boardBlue);
    shelterRoof.position.set(bx, 3.2, bz);
    group.add(shelterRoof);

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2), this.materials.metalLight);
    p1.position.set(bx - 2.8, 1.6, bz - 1.2);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.2), this.materials.metalLight);
    p2.position.set(bx + 2.8, 1.6, bz - 1.2);
    group.add(p1, p2);

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

    const island = new THREE.Mesh(new THREE.CylinderGeometry(6, 6.4, 0.4, 24), this.materials.sidewalk);
    island.position.set(0, 0.2, 0);
    island.receiveShadow = true;
    chowkGroup.add(island);

    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2), this.materials.concrete);
    base.position.set(0, 0.8, 0);
    chowkGroup.add(base);

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

  // 9. Temple / Peace Environmental Sanctuary (Neutral Cultural Landmark)
  createTemplePeaceSanctuary() {
    const tx = 38, tz = 8;
    const group = new THREE.Group();
    group.position.set(tx, 0, tz);

    // Stone base platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 14), this.materials.concrete);
    platform.position.y = 0.3;
    group.add(platform);

    // Inner Sanctum
    const body = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 8), this.materials.wallTempleSaffron);
    body.position.y = 2.85;
    body.castShadow = true;
    group.add(body);
    this.addBoxCollider(tx, tz, 9, 9);

    // Traditional Shikhara / Dome pyramid
    const shikhara = new THREE.Mesh(new THREE.ConeGeometry(5.2, 5.0, 4), this.materials.roofTile);
    shikhara.position.y = 7.6;
    shikhara.rotation.y = Math.PI / 4;
    group.add(shikhara);

    // Kalash on top
    const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    kalash.position.y = 10.3;
    group.add(kalash);

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_temple',
      nameHi: 'शांति धाम / सार्वजनिक चबूतरा (Peace Sanctuary)',
      descHi: 'सामुदायिक सद्भाव, बुजुर्गों की चौपाल, और शांति समिति का केंद्र।',
      position: new THREE.Vector3(tx, 1, tz + 8),
      type: 'CULTURE'
    });
  }

  // 10. Public Community Park & Benches (वार्ड 12 वाटिका)
  createPublicPark() {
    const px = 18, pz = 32;
    const group = new THREE.Group();
    group.position.set(px, 0, pz);

    // Grass lawn
    const lawn = new THREE.Mesh(new THREE.PlaneGeometry(18, 16), this.materials.parkGrass);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0.03;
    group.add(lawn);

    // Park Pathway
    const path = new THREE.Mesh(new THREE.PlaneGeometry(3, 16), this.materials.sidewalk);
    path.rotation.x = -Math.PI / 2;
    path.position.y = 0.035;
    group.add(path);

    // Park Benches
    [-4, 4].forEach(bx => {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 0.8), this.materials.trunk);
      bench.position.set(bx, 0.25, 0);
      group.add(bench);
    });

    this.scene.add(group);

    this.registerPOI({
      id: 'poi_park',
      nameHi: 'गांधी वाटिका / जन-पार्क (Public Park)',
      descHi: 'युवाओं और नागरिकों से अनौपचारिक जनसंपर्क व संवाद का हरा-भरा स्थान।',
      position: new THREE.Vector3(px, 1, pz),
      type: 'PARK'
    });
  }

  addIndianFlag(parent, x, y, z, scale = 1.0) {
    const flagGroup = new THREE.Group();
    flagGroup.position.set(x, y, z);
    flagGroup.scale.set(scale, scale, scale);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 8), this.materials.metalLight);
    pole.position.y = 4;
    flagGroup.add(pole);

    const saff = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xff9933, side: THREE.DoubleSide }));
    saff.position.set(1.2, 7.6, 0);
    flagGroup.add(saff);

    const wht = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    wht.position.set(1.2, 7.2, 0);
    flagGroup.add(wht);

    const chakra = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), new THREE.MeshBasicMaterial({ color: 0x000080, side: THREE.DoubleSide }));
    chakra.position.set(1.2, 7.2, 0.01);
    flagGroup.add(chakra);

    const grn = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.4), new THREE.MeshBasicMaterial({ color: 0x138808, side: THREE.DoubleSide }));
    grn.position.set(1.2, 6.8, 0);
    flagGroup.add(grn);

    parent.add(flagGroup);
  }

  createTreesAndStreetlights() {
    const foliageGroup = new THREE.Group();

    const treeCoords = [
      { x: -11, z: -25 }, { x: -11, z: -45 }, { x: -11, z: 25 }, { x: -11, z: 45 },
      { x: 11, z: -25 }, { x: 11, z: -45 }, { x: 11, z: 25 }, { x: 11, z: 45 },
      { x: -28, z: 11 }, { x: -50, z: 11 }, { x: 28, z: 11 }, { x: 50, z: 11 },
      { x: 12, z: 32 }, { x: 24, z: 32 }
    ];

    treeCoords.forEach(pos => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5), this.materials.trunk);
      trunk.position.set(pos.x, 1.75, pos.z);
      trunk.castShadow = true;
      foliageGroup.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), this.materials.leaves);
      crown.position.set(pos.x, 4.5, pos.z);
      crown.castShadow = true;
      foliageGroup.add(crown);

      this.addBoxCollider(pos.x, pos.z, 1.2, 1.2);
    });

    const lampCoords = [
      { x: -9.5, z: -15 }, { x: -9.5, z: 15 },
      { x: 9.5, z: -15 }, { x: 9.5, z: 15 },
      { x: -9.5, z: 35 }, { x: 9.5, z: 35 }
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
    if (Math.abs(nextX) > 75 || Math.abs(nextZ) > 75) {
      return true;
    }
    return false;
  }

  getNearbyPOI(x, z, maxDist = 3.8) {
    for (const poi of this.interactivePOIs) {
      const dist = Math.hypot(x - poi.position.x, z - poi.position.z);
      if (dist <= maxDist) {
        return { poi, dist };
      }
    }
    return null;
  }
}
