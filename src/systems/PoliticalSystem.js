// Campaign, Election Simulation, and Governance Logic
import { gameState } from './GameState.js';
import { sound } from './SoundFX.js';

export const CAMPAIGN_ACTIONS = [
  {
    id: 'door_to_door',
    nameHi: 'घर-घर जनसंपर्क (Door to Door Canvassing)',
    cost: 500,
    energyCost: 15,
    repGain: 20,
    supportBoost: 3.5,
    desc: 'वार्ड के परिवारों से सीधे मिलकर उनकी समस्याएं सुनें और विश्वास अर्जित करें।'
  },
  {
    id: 'chowk_rally',
    nameHi: 'तिरंगा चौक पर जनसभा (Public Chowk Rally)',
    cost: 3500,
    energyCost: 25,
    repGain: 60,
    supportBoost: 7.0,
    desc: 'लाउडस्पीकर सभा में स्थानीय मुद्दों और विकास के विज़न पर प्रभावशाली भाषण दें।'
  },
  {
    id: 'pamphlet_drive',
    nameHi: 'घोषणापत्र व पर्चा वितरण (Manifesto Distribution)',
    cost: 1200,
    energyCost: 10,
    repGain: 25,
    supportBoost: 4.0,
    desc: 'वार्ड के प्रमुख चौराहों और बाजारों में अपनी नीतियों का संकल्प पत्र बांटें।'
  },
  {
    id: 'chai_discussion',
    nameHi: 'चाय पर चर्चा व वरिष्ठ नागरिकों से संवाद',
    cost: 300,
    energyCost: 10,
    repGain: 15,
    supportBoost: 2.8,
    desc: 'स्थानीय चाय की दुकान पर मोहल्ले के प्रबुद्ध नागरिकों से राय-मशविरा करें।'
  }
];

export class PoliticalCampaignSystem {
  static runCampaignAction(actionId) {
    const action = CAMPAIGN_ACTIONS.find(a => a.id === actionId);
    if (!action) return { success: false, msg: 'अमान्य प्रचार गतिविधि!' };

    if (gameState.player.money < action.cost) {
      return { success: false, msg: `पर्याप्त धन नहीं है! ₹${action.cost} की आवश्यकता है।` };
    }

    if (gameState.player.energy < action.energyCost) {
      return { success: false, msg: `थकान अधिक है! ऊर्जा (Energy) बढ़ाने के लिए घर जाकर विश्राम करें।` };
    }

    gameState.player.money -= action.cost;
    gameState.player.energy -= action.energyCost;
    gameState.addReputation(action.repGain);

    // Boost voter support and calculate swing
    const currentSupport = gameState.election.playerSupport;
    const gained = action.supportBoost + Math.random() * 1.5;
    gameState.election.playerSupport = Math.min(88, Math.round((currentSupport + gained) * 10) / 10);

    // Opponent counter-move simulation
    gameState.election.opponents.forEach(opp => {
      const oppDelta = (Math.random() - 0.45) * 1.8;
      opp.support = Math.max(10, Math.round((opp.support + oppDelta) * 10) / 10);
    });

    gameState.advanceTime(90);
    gameState.save();
    sound.playVoteSlogan();

    return {
      success: true,
      msg: `${action.nameHi} सफल रहा! जनसमर्थन बढ़कर ${gameState.election.playerSupport}% हुआ। प्रतिष्ठा +${action.repGain}`
    };
  }

  static contestElection() {
    const pSupport = gameState.election.playerSupport;
    const opp1 = gameState.election.opponents[0];
    const opp2 = gameState.election.opponents[1];

    // Total votes model
    const totalVoters = 12500;
    const turnoutPercent = gameState.election.voterTurnoutExpected + Math.floor(Math.random() * 8 - 4);
    const votesPolled = Math.floor(totalVoters * (turnoutPercent / 100));

    // Calculate actual share
    const totalWeight = pSupport + opp1.support + opp2.support;
    const pVotes = Math.round((pSupport / totalWeight) * votesPolled);
    const opp1Votes = Math.round((opp1.support / totalWeight) * votesPolled);
    const opp2Votes = votesPolled - (pVotes + opp1Votes);

    const isWinner = pVotes > opp1Votes && pVotes > opp2Votes;
    const margin = pVotes - Math.max(opp1Votes, opp2Votes);

    if (isWinner) {
      gameState.addReputation(500);
      gameState.player.money += 25000; // Honorarium / MLA/Ward fund
      gameState.checkRankPromotion();
      sound.playMissionComplete();
      gameState.election.isAnnounced = false;
      gameState.save();

      return {
        won: true,
        pVotes,
        opp1Votes,
        opp2Votes,
        margin,
        turnoutPercent,
        msg: `🎉 ऐतिहासिक विजय! आपने ${margin} मतों से चुनाव जीता है! आप वार्ड पार्षद निर्वाचित घोषित किए गए।`
      };
    } else {
      sound.playClick();
      return {
        won: false,
        pVotes,
        opp1Votes,
        opp2Votes,
        margin: Math.abs(margin),
        turnoutPercent,
        msg: `चुनाव परिणाम: आप ${Math.abs(margin)} मतों से पीछे रह गए। जनसेवा और विकास कार्यों से जनता का विश्वास पुनः जीतें!`
      };
    }
  }

  static approveComplaint(complaintId) {
    const comp = gameState.governance.pendingComplaints.find(c => c.id === complaintId);
    if (!comp || comp.status === 'APPROVED') return { success: false, msg: 'कार्य पहले से स्वीकृत है।' };

    if (gameState.governance.budget < comp.cost) {
      return { success: false, msg: 'सरकारी बजट में पर्याप्त राशि नहीं है!' };
    }

    gameState.governance.budget -= comp.cost;
    comp.status = 'APPROVED';
    gameState.governance.completedProjects.push(comp.title);
    gameState.worldStats.publicSatisfaction = Math.min(100, gameState.worldStats.publicSatisfaction + comp.satisfactionImpact);
    gameState.addReputation(50);
    gameState.save();
    sound.playInteract();

    return {
      success: true,
      msg: `योजना स्वीकृत: "${comp.title}" के लिए ₹${comp.cost} जारी। जनता की संतुष्टि +${comp.satisfactionImpact}%`
    };
  }
}
