// Community Missions and Career Progression Manager
import { gameState } from './GameState.js';
import { sound } from './SoundFX.js';

export const INITIAL_COMMUNITY_MISSIONS = [
  {
    id: 'mission_broken_road',
    titleHi: 'टूटी मुख्य सड़क की रिपोर्ट व नागरिक हस्ताक्षर',
    titleEn: 'Report Broken Road & Citizen Signature',
    category: 'INFRASTRUCTURE',
    locationName: 'वार्ड 12 मुख्य मार्ग',
    descHi: 'मुख्य सड़क के गड्ढों से दुर्घटनाएं हो रही हैं। 50 नागरिकों से हस्ताक्षर कराकर नगर पालिका में ज्ञापन सौंपें।',
    cost: 400,
    rewardMoney: 1200,
    rewardRep: 80,
    statImpact: { roadsQuality: +6, publicSatisfaction: +5 },
    isCompleted: false
  },
  {
    id: 'mission_cleanliness_drive',
    titleHi: 'तिरंगा चौक व मार्केट में स्वच्छता अभियान',
    titleEn: 'Cleanliness Drive at Tiranga Chowk',
    category: 'CIVIC',
    locationName: 'तिरंगा चौक एवं सब्जी मंडी',
    descHi: 'स्थानीय युवाओं के साथ मिलकर कूड़ा निस्तारण अभियान चलाएं और डस्टबिन स्थापित करवाएं।',
    cost: 600,
    rewardMoney: 1500,
    rewardRep: 100,
    statImpact: { cleanliness: +10, publicSatisfaction: +7 },
    isCompleted: false
  },
  {
    id: 'mission_school_aid',
    titleHi: 'प्राथमिक विद्यालय में पेयजल व पंखों की व्यवस्था',
    titleEn: 'Drinking Water & Fan Aid for Primary School',
    category: 'EDUCATION',
    locationName: 'शासकीय प्राथमिक विद्यालय',
    descHi: 'गर्मियों में बच्चों की सुविधा हेतु विद्यालय में वाटर कूलर व सीलिंग फैन की व्यवस्था कराएं।',
    cost: 2000,
    rewardMoney: 0,
    rewardRep: 150,
    statImpact: { educationHealth: +12, publicSatisfaction: +9 },
    isCompleted: false
  },
  {
    id: 'mission_health_camp',
    titleHi: 'निःशुल्क जन-स्वास्थ्य व दवा वितरण शिविर',
    titleEn: 'Free Health Checkup & Medicine Camp',
    category: 'HEALTH',
    locationName: 'सामुदायिक स्वास्थ्य केंद्र',
    descHi: 'डॉ. अनीता वर्मा के सहयोग से वरिष्ठ नागरिकों और बच्चों के लिए निशुल्क स्वास्थ्य परामर्श शिविर लगवाएं।',
    cost: 2500,
    rewardMoney: 800,
    rewardRep: 180,
    statImpact: { educationHealth: +14, publicSatisfaction: +10 },
    isCompleted: false
  },
  {
    id: 'mission_ward_development_proposal',
    titleHi: 'वार्ड 12 समग्र विकास कार्ययोजना (Master Plan)',
    titleEn: 'Ward 12 Master Development Plan',
    category: 'POLITICS',
    locationName: 'नगर पालिका सभागार',
    descHi: 'स्ट्रीट लाइट, नाली अंडरग्राउंड और पार्क सुंदरीकरण का मास्टर प्लान बनाकर जिला योजना समिति में रखें।',
    cost: 3000,
    rewardMoney: 5000,
    rewardRep: 250,
    statImpact: { roadsQuality: +8, publicSafety: +6, publicSatisfaction: +12 },
    isCompleted: false
  }
];

export class MissionSystem {
  constructor() {
    this.missions = [...INITIAL_COMMUNITY_MISSIONS];
    this.syncWithState();
  }

  syncWithState() {
    if (gameState.completedMissions && gameState.completedMissions.length > 0) {
      this.missions.forEach(m => {
        if (gameState.completedMissions.includes(m.id)) {
          m.isCompleted = true;
        }
      });
    }
  }

  getActiveMissions() {
    return this.missions.filter(m => !m.isCompleted);
  }

  getCompletedMissions() {
    return this.missions.filter(m => m.isCompleted);
  }

  canComplete(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission || mission.isCompleted) return false;
    return gameState.player.money >= mission.cost;
  }

  completeMission(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (!mission || mission.isCompleted) return { success: false, msg: 'मिशन अनुपलब्ध या पूर्ण हो चुका है।' };

    if (gameState.player.money < mission.cost) {
      return { success: false, msg: `पर्याप्त धन नहीं है! ₹${mission.cost} आवश्यक हैं।` };
    }

    // Deduct cost and grant rewards
    gameState.player.money -= mission.cost;
    gameState.player.money += mission.rewardMoney;
    gameState.addReputation(mission.rewardRep);

    // Update district world statistics
    if (mission.statImpact) {
      Object.keys(mission.statImpact).forEach(key => {
        if (gameState.worldStats[key] !== undefined) {
          gameState.worldStats[key] = Math.min(100, Math.max(0, gameState.worldStats[key] + mission.statImpact[key]));
        }
      });
    }

    mission.isCompleted = true;
    if (!gameState.completedMissions.includes(mission.id)) {
      gameState.completedMissions.push(mission.id);
    }

    gameState.advanceTime(60); // 1 hour spent
    gameState.save();
    sound.playMissionComplete();

    return {
      success: true,
      msg: `सफलता! "${mission.titleHi}" पूर्ण हुआ। प्रतिष्ठा +${mission.rewardRep}, धन +₹${mission.rewardMoney - mission.cost}।`
    };
  }
}

export const missionSystem = new MissionSystem();
