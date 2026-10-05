// Life Simulation Activities: Daily livelihood, living expenses, helping citizens, and citizen trust
import { gameState } from './GameState.js';
import { sound } from './SoundFX.js';

export const LIFE_JOBS = [
  {
    id: 'job_clerk',
    titleHi: 'दुकान / कार्यालय सहायक (Assistant Work)',
    income: 600,
    energyCost: 20,
    timeMinutes: 180,
    desc: 'किराना दुकान या स्थानीय कार्यालय में 3 घंटे कार्य करके ईमानदारी की दैनिक आजीविका कमाएं।'
  },
  {
    id: 'job_tuition',
    titleHi: 'मोहल्ला कोचिंग व ट्यूशन (Teaching Students)',
    income: 900,
    energyCost: 15,
    timeMinutes: 120,
    desc: 'प्राथमिक विद्यालय के गरीब बच्चों को 2 घंटे पढ़ाएं। धन के साथ-साथ समाज में सम्मान प्राप्त करें।',
    repGain: 15
  },
  {
    id: 'job_advocacy_aid',
    titleHi: 'नागरिक विधिक व दस्तावेजी सहायता (Civic Helpdesk)',
    income: 1200,
    energyCost: 25,
    timeMinutes: 150,
    desc: 'तहसील व पालिका में बुजुर्गों के राशन कार्ड व पेंशन फॉर्म भरवाने में मदद करें।',
    repGain: 30
  }
];

export const DIRECT_CITIZEN_AIDS = [
  {
    id: 'aid_medical_senior',
    titleHi: 'बुजुर्ग मरीज को दवा व उपचार सहायता',
    cost: 500,
    repGain: 40,
    trustBoost: 5,
    desc: 'अस्पताल के बाहर खड़े जरूरतमंद वरिष्ठ नागरिक को आवश्यक दवाइयां उपलब्ध कराएं।'
  },
  {
    id: 'aid_school_uniform',
    titleHi: 'जरूरतमंद छात्र को पुस्तकें व यूनिफॉर्म',
    cost: 800,
    repGain: 60,
    trustBoost: 8,
    desc: 'विद्यालय के मेधावी विद्यार्थी को पाठ्य सामग्री व स्कूल बैग उपहार में दें।'
  },
  {
    id: 'aid_market_drinking_water',
    titleHi: 'सब्जी मंडी में शीतल पेयजल मटका सेवा',
    cost: 350,
    repGain: 35,
    trustBoost: 4,
    desc: 'गर्मी के मौसम में सब्जी विक्रेताओं व खरीदारों हेतु शीतल पेयजल मटके स्थापित करें।'
  }
];

export class LifeSimulationSystem {
  static performJob(jobId) {
    const job = LIFE_JOBS.find(j => j.id === jobId);
    if (!job) return { success: false, msg: 'अमान्य कार्य!' };

    if (gameState.player.energy < job.energyCost) {
      return { success: false, msg: 'थकान अधिक है! ऊर्जा (Energy) बढ़ाने के लिए घर जाकर विश्राम करें।' };
    }

    gameState.player.energy -= job.energyCost;
    gameState.addMoney(job.income);
    if (job.repGain) gameState.addReputation(job.repGain);
    gameState.advanceTime(job.timeMinutes);
    sound.playClick();

    return {
      success: true,
      msg: `कार्य पूर्ण! आपने ₹${job.income} कमाए। (समय व्यतीत: ${job.timeMinutes / 60} घंटे)`
    };
  }

  static provideDirectAid(aidId) {
    const aid = DIRECT_CITIZEN_AIDS.find(a => a.id === aidId);
    if (!aid) return { success: false, msg: 'अमान्य सहायता!' };

    if (gameState.player.money < aid.cost) {
      return { success: false, msg: `पर्याप्त धन नहीं है! ₹${aid.cost} की आवश्यकता है।` };
    }

    gameState.player.money -= aid.cost;
    gameState.addReputation(aid.repGain);
    gameState.worldStats.publicSatisfaction = Math.min(100, gameState.worldStats.publicSatisfaction + aid.trustBoost);
    gameState.advanceTime(45);
    gameState.save();
    sound.playInteract();

    return {
      success: true,
      msg: `सराहनीय कार्य! "${aid.titleHi}" प्रदान की गई। जनता का विश्वास +${aid.trustBoost}%, प्रतिष्ठा +${aid.repGain}`
    };
  }

  static restAtHome() {
    gameState.player.energy = 100;
    gameState.advanceTime(240); // 4 hours rest
    gameState.save();
    sound.playMissionComplete();
    return {
      success: true,
      msg: 'घर पर विश्राम किया! आपकी ऊर्जा (Energy) 100% हो गई है।'
    };
  }
}
