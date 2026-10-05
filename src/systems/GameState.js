// Game State & Save System for RashtraNiti 3D
export const RANKS = [
  { id: 'CITIZEN', hi: 'आम नागरिक', en: 'Ordinary Citizen', reqRep: 0, perk: 'बुनियादी नागरिक अधिकार' },
  { id: 'VOLUNTEER', hi: 'समाजसेवी / वालंटियर', en: 'Community Volunteer', reqRep: 100, perk: 'स्थानीय लोगों से संवाद' },
  { id: 'PARTY_WORKER', hi: 'पार्टी कार्यकर्ता', en: 'Party Worker', reqRep: 300, perk: 'पर्चा वितरण व सभा' },
  { id: 'WARD_COUNCILLOR', hi: 'वार्ड पार्षद (नगर सेवक)', en: 'Ward Councillor', reqRep: 700, perk: 'वार्ड विकास बजट नियंत्रण' },
  { id: 'MLA', hi: 'विधायक (विधान सभा)', en: 'Member of Legislative Assembly (MLA)', reqRep: 1500, perk: 'राज्य निधि व जिला योजना' },
  { id: 'CHIEF_MINISTER', hi: 'मुख्यमंत्री (CM)', en: 'Chief Minister', reqRep: 3500, perk: 'राज्य कैबिनेट व पुलिस प्रशासन' },
  { id: 'MP', hi: 'सांसद (लोक सभा)', en: 'Member of Parliament (MP)', reqRep: 6000, perk: 'राष्ट्रीय संसदीय बहस' },
  { id: 'PRIME_MINISTER', hi: 'प्रधानमंत्री (PM)', en: 'Prime Minister of India', reqRep: 10000, perk: 'राष्ट्रीय बजट, विदेश नीति व संपूर्ण शासन' }
];

export const BACKGROUNDS = [
  {
    id: 'STUDENT_LEADER',
    nameHi: 'छात्र नेता (Student Leader)',
    descHi: 'विश्वविद्यालय छात्र संघ में सक्रिय। वाद-विवाद कला और युवाओं में मजबूत पकड़।',
    money: 12000,
    reputation: 120,
    skills: { publicSpeaking: 40, administration: 15, negotiation: 25 },
    contacts: ['प्रोफेसर शास्त्री', 'छात्र संघ अध्यक्ष']
  },
  {
    id: 'GRASSROOTS_WORKER',
    nameHi: 'जमीनी समाजसेवी (Social Worker)',
    descHi: 'गांव और मोहल्ले के लोगों के सुख-दुख में हमेशा साथ। जनता का अटूट भरोसा।',
    money: 8000,
    reputation: 250,
    skills: { publicSpeaking: 25, administration: 20, negotiation: 35 },
    contacts: ['मोहल्ला अध्यक्ष', 'दवाखाना डॉक्टर']
  },
  {
    id: 'SMALL_BUSINESS',
    nameHi: 'स्थानीय व्यापारी (Small Business Owner)',
    descHi: 'बाजार और व्यापार मंडल में पहचान। वित्तीय समझ और संसाधन जुटाने में माहिर।',
    money: 60000,
    reputation: 80,
    skills: { publicSpeaking: 20, administration: 35, negotiation: 40 },
    contacts: ['व्यापार मंडल सचिव', 'बैंक प्रबंधक']
  },
  {
    id: 'LAWYER_ADVOCATE',
    nameHi: 'वकील / विधिक सलाहकार (Advocate)',
    descHi: 'संविधान और कानून के जानकार। सरकारी दफ्तरों और अदालती बारीकियों के विशेषज्ञ।',
    money: 30000,
    reputation: 150,
    skills: { publicSpeaking: 35, administration: 45, negotiation: 30 },
    contacts: ['सरकारी वकील', 'थाना प्रभारी']
  }
];

export class GameState {
  constructor() {
    this.SAVE_KEY = 'rashtraniti_3d_savedata_v2';
    this.reset();
  }

  reset() {
    this.player = {
      name: 'विक्रम शर्मा',
      age: 26,
      background: 'STUDENT_LEADER',
      skinColor: '#dca180',
      hairStyle: 'modern',
      hairColor: '#1a1a1a',
      shirtColor: '#f8fafc', // Indian Kurta white
      pantsColor: '#1e293b',
      sashColor: '#ff9933', // Saffron stole
      money: 15000,
      reputation: 100,
      energy: 100,
      skills: {
        publicSpeaking: 25,
        administration: 20,
        negotiation: 25
      },
      rankIndex: 0,
      partyId: null,
      partyName: '',
      partySymbol: '🇮🇳',
      homeLocation: { x: -35, z: 25 },
      currentDistrict: 'आनंद नगर (वार्ड 12, जिला शांतिपुर)'
    };

    this.party = null;

    this.time = {
      day: 1,
      hour: 8,
      minute: 0,
      phase: 'सुबह'
    };

    this.worldStats = {
      cleanliness: 45,
      roadsQuality: 40,
      educationHealth: 50,
      publicSafety: 60,
      publicSatisfaction: 52
    };

    this.activeMissions = [];
    this.completedMissions = [];

    // Fictional election state
    this.election = {
      isAnnounced: false,
      daysLeft: 7,
      contestedPost: 'WARD_COUNCILLOR',
      voterTurnoutExpected: 68,
      opponents: [
        { name: 'रामसेवक त्रिपाठी', party: 'जन चेतना दल', support: 38 },
        { name: 'इम्तियाज अली', party: 'प्रगतिशील मंच', support: 26 }
      ],
      playerSupport: 36
    };

    // Governance Dashboard
    this.governance = {
      budget: 500000,
      ongoingProjects: [],
      completedProjects: [],
      pendingComplaints: [
        { id: 'c1', title: 'वार्ड 12 नाली ओवरफ्लो समस्या', status: 'PENDING', cost: 15000, satisfactionImpact: 6 },
        { id: 'c2', title: 'सरकारी प्राथमिक विद्यालय में पंखे व ब्लैकबोर्ड', status: 'PENDING', cost: 25000, satisfactionImpact: 10 },
        { id: 'c3', title: 'मेन मार्केट में स्ट्रीट लाइट मरम्मत', status: 'PENDING', cost: 12000, satisfactionImpact: 7 },
        { id: 'c4', title: 'बस स्टैंड पर महिला प्रतीक्षा शेड', status: 'PENDING', cost: 40000, satisfactionImpact: 12 }
      ]
    };
  }

  save() {
    try {
      const data = {
        player: this.player,
        party: this.party,
        time: this.time,
        worldStats: this.worldStats,
        activeMissions: this.activeMissions,
        completedMissions: this.completedMissions,
        election: this.election,
        governance: this.governance
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save game:', e);
      return false;
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data && data.player) {
        Object.assign(this.player, data.player);
        if (data.party) this.party = data.party;
        if (data.time) this.time = data.time;
        if (data.worldStats) this.worldStats = data.worldStats;
        if (data.activeMissions) this.activeMissions = data.activeMissions;
        if (data.completedMissions) this.completedMissions = data.completedMissions;
        if (data.election) this.election = data.election;
        if (data.governance) this.governance = data.governance;
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error loading save:', e);
      return false;
    }
  }

  hasSave() {
    return !!localStorage.getItem(this.SAVE_KEY);
  }

  addMoney(amount) {
    this.player.money += amount;
    if (this.player.money < 0) this.player.money = 0;
    this.save();
  }

  addReputation(amount) {
    this.player.reputation += amount;
    this.checkRankPromotion();
    this.save();
  }

  checkRankPromotion() {
    const currentRank = RANKS[this.player.rankIndex];
    const nextRank = RANKS[this.player.rankIndex + 1];
    if (nextRank && this.player.reputation >= nextRank.reqRep) {
      this.player.rankIndex++;
      return nextRank;
    }
    return null;
  }

  advanceTime(minutes = 15) {
    this.time.minute += minutes;
    while (this.time.minute >= 60) {
      this.time.minute -= 60;
      this.time.hour++;
    }
    if (this.time.hour >= 24) {
      this.time.hour = 0;
      this.time.day++;
      if (this.election.isAnnounced && this.election.daysLeft > 0) {
        this.election.daysLeft--;
      }
    }
    if (this.time.hour >= 5 && this.time.hour < 12) this.time.phase = 'सुबह';
    else if (this.time.hour >= 12 && this.time.hour < 16) this.time.phase = 'दोपहर';
    else if (this.time.hour >= 16 && this.time.hour < 19) this.time.phase = 'शाम';
    else this.time.phase = 'रात';
  }

  getCurrentRank() {
    return RANKS[this.player.rankIndex] || RANKS[0];
  }
}

export const gameState = new GameState();
