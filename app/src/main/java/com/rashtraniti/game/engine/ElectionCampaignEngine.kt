package com.rashtraniti.game.engine

import com.rashtraniti.game.data.model.*
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

object ElectionCampaignEngine {

    fun getDebateQuestions(): List<DebateQuestion> = listOf(
        DebateQuestion(
            id = "deb_q1",
            topicHi = "रोजगार एवं स्थानीय उद्योग",
            topicEn = "Employment & Local Industrial Growth",
            questionHi = "विपक्ष का आरोप है कि आपकी पार्टी के पास स्थानीय युवाओं को रोजगार देने की कोई ठोस आर्थिक योजना नहीं है। आप क्या कदम उठाएंगे?",
            questionEn = "The opposition alleges that your party lacks a concrete fiscal roadmap for local job creation. What is your policy?",
            optionsHi = listOf(
                "स्थानीय एमएसएमई हेतु ₹500 Cr सिंगल-विंडो इंसेंटिव और 3 नए कौशल विकास केंद्र स्थापित करेंगे।",
                "केवल सरकारी विभागों में रिक्त पदों की भर्ती का वादा करेंगे।",
                "विपक्षी दल के पिछले कार्यकाल के आर्थिक घोटालों पर हमला बोलेंगे।",
                "मुद्दे को टालकर अन्य राष्ट्रीय मुद्दों पर बात करेंगे।"
            ),
            optionsEn = listOf(
                "Establish ₹500 Cr single-window MSME incentives and 3 regional skill development hubs.",
                "Promise recruitment only across pending government departmental vacancies.",
                "Attack previous corruption scandals of the opposition regime.",
                "Divert from the topic and speak on general national narratives."
            ),
            correctIndex = 0,
            impactAnalysisHi = "तथ्यपरक व रोजगारोन्मुख उत्तर से युवा व शिक्षित वर्ग में समर्थन +6% बढ़ा।"
        ),
        DebateQuestion(
            id = "deb_q2",
            topicHi = "बुनियादी ढांचा व पेयजल संकट",
            topicEn = "Infrastructure & Clean Drinking Water",
            questionHi = "विधानसभा क्षेत्र में 40% बस्तियों में स्वच्छ पेयजल की भारी किल्लत है। आपका त्वरित समाधान क्या होगा?",
            questionEn = "40% of residential zones face severe drinking water deficit. What is your immediate executive response?",
            optionsHi = listOf(
                "हर घर नल जल योजना को सोलर पंपिंग व वाटर ट्रीटमेंट प्लांट से 9 महीने में पूर्ण करेंगे।",
                "टैंकर माफिया पर पुलिस कार्रवाई करने का भाषण देंगे।",
                "बजट की कमी का हवाला देकर केंद्र सरकार को जिम्मेदार बताएंगे।",
                "समस्या का अध्ययन करने के लिए 1 साल की जांच समिति बनाएंगे।"
            ),
            optionsEn = listOf(
                "Complete solar-powered piped water grid & treatment facility within 9 months.",
                "Give a rhetorical speech on cracking down on tanker lobbies.",
                "Cite budget shortages and hold central authorities responsible.",
                "Constitute a 1-year investigative survey panel."
            ),
            correctIndex = 0,
            impactAnalysisHi = "समयबद्ध ठोस कार्ययोजना पेश करने से महिलाओं व ग्रामीण मतदाताओं में विश्वास +8% बढ़ा।"
        )
    )

    fun calculateOppositionReaction(campState: SevenDayCampaignState): Pair<String, String> {
        val strategy = campState.selectedStrategy
        val ground = campState.selectedGroundAction

        return when {
            ground == Day2GroundAction.MEGA_RALLY -> Pair(
                "विपक्ष ने आपकी विशाल रैली के भारी खर्च पर सवाल उठाए और घर-घर जाकर सादगी से सघन जनसंपर्क शुरू किया।",
                "Opposition attacked heavy rally expenditures and launched aggressive door-to-door counter campaigns."
            )
            strategy == Day1Strategy.YOUTH -> Pair(
                "विपक्षी दल ने अपना युवा घोषणापत्र जारी कर बेरोजगारी भत्ते और लैपटॉप वितरण की घोषणा की।",
                "Opposition released competing youth manifesto offering enhanced skill allowances."
            )
            strategy == Day1Strategy.AGRICULTURE -> Pair(
                "विपक्ष ने ग्रामीण चौपालों में जाकर नहरों और खाद आपूर्ति के पिछले वादों पर बहस शुरू की।",
                "Opposition mobilized farmer panchayats questioning past irrigation subsidy implementations."
            )
            else -> Pair(
                "विपक्ष ने सभी वार्डों में स्थानीय जनसभाएं कर आपके घोषणापत्र की व्यावहारिकता को चुनौती दी।",
                "Opposition escalated townhall outreach challenging feasibility of your core pledges."
            )
        }
    }

    fun computeElectionScorecard(
        campState: SevenDayCampaignState,
        player: PlayerProfile,
        party: PoliticalParty,
        opponentParty: OppositionParty
    ): ComprehensiveElectionScorecard {
        val diffMulti = campState.difficulty.opponentMultiplier

        // Core score variables (0 - 100)
        val strategyScore = min(100, (campState.publicTrustScore * 0.4 + (campState.selectedStrategy?.trustBoost ?: 5.0) * 8.0).toInt())
        val publicTrustScore = campState.publicTrustScore.toInt()
        val mediaPerformanceScore = min(100, (campState.mediaReputationScore * 0.7 + (campState.selectedMediaAction?.reachScore ?: 6.0) * 4.0).toInt())
        val groundCampaignScore = min(100, (campState.groundStrengthScore * 0.6 + (campState.selectedGroundAction?.visibilityDelta ?: 5.0) * 5.0).toInt())
        val debateScore = if (campState.debateCompleted) max(30, campState.debateScore * 10) else 50
        val opponentStrengthScore = min(100, (campState.opponentStrengthScore * diffMulti).toInt())

        // Calculate final player performance share
        val playerTotalWeight = (strategyScore * 0.20) + (publicTrustScore * 0.25) + (mediaPerformanceScore * 0.15) + (groundCampaignScore * 0.20) + (debateScore * 0.20)
        val opponentTotalWeight = opponentStrengthScore.toDouble()

        // Swing factor (+/- 3.5%)
        val swing = (Random.nextDouble() * 7.0) - 3.5
        val basePlayerPercent = (playerTotalWeight / (playerTotalWeight + opponentTotalWeight)) * 100.0
        val finalPlayerShare = max(18.0, min(82.0, basePlayerPercent + swing))
        val remainingShare = 100.0 - finalPlayerShare
        val opponentShare = remainingShare * 0.92
        val otherShare = max(1.5, remainingShare - opponentShare)

        val turnoutPercent = 64.0 + Random.nextDouble() * 10.0
        val totalPolled = (campState.totalPopulation * (turnoutPercent / 100.0)).toLong()

        val pVotes = (totalPolled * (finalPlayerShare / 100.0)).toLong()
        val oVotes = (totalPolled * (opponentShare / 100.0)).toLong()
        val othVotes = max(0L, totalPolled - pVotes - oVotes)

        val isWin = pVotes > oVotes
        val margin = abs(pVotes - oVotes)

        // Round-by-round EVM counts
        val r1P = (pVotes * 0.23).toLong()
        val r1O = (oVotes * 0.26).toLong()
        val r2P = (pVotes * 0.52).toLong()
        val r2O = (oVotes * 0.50).toLong()
        val r3P = (pVotes * 0.78).toLong()
        val r3O = (oVotes * 0.76).toLong()

        val primaryReasonHi = if (isWin) {
            when {
                debateScore >= 80 -> "लाइव टीवी डिबेट में उत्कृष्ट प्रदर्शन और युवा वर्ग के भारी समर्थन ने निर्णायक बढ़त दिलाई।"
                groundCampaignScore >= 75 -> "घर-घर सघन जनसंपर्क और मजबूत बूथ प्रबंधन से ग्रामीण व शहरी दोनों क्षेत्रों में बढ़त बनी।"
                else -> "जनविश्वास और संतुलित चुनावी घोषणापत्र पर मतदाताओं का अटूट भरोसा जीत का कारण बना।"
            }
        } else {
            when {
                opponentStrengthScore >= 75 -> "विपक्ष की संगठित चुनावी घेराबंदी और मजबूत क्षेत्रीय पकड़ के कारण मुकाबला हाथ से फिसल गया।"
                debateScore < 60 -> "फाइनल डिबेट में कमजोर रणनीति और मीडिया में विपक्षी हमलों का समय पर जवाब न दे पाना हार का मुख्य कारण रहा।"
                else -> "ग्राउंड अभियान में कार्यकर्ताओं की कमी और बूथ स्तर पर कमजोर उपस्थिति से मतों का अंतर नहीं पट सका।"
            }
        }

        val primaryReasonEn = if (isWin) {
            "Strong debate performance & decisive ground mobilization secured broad voter mandate."
        } else {
            "Opposition maintained superior rural booth outreach and counter-campaign pressure."
        }

        return ComprehensiveElectionScorecard(
            winnerPartyName = if (isWin) party.name else opponentParty.name,
            winnerCandidateName = if (isWin) player.name else opponentParty.leaderName,
            isPlayerWinner = isWin,
            playerVotes = pVotes,
            opponentVotes = oVotes,
            otherVotes = othVotes,
            playerVotePercent = finalPlayerShare,
            opponentVotePercent = opponentShare,
            otherVotePercent = otherShare,
            marginVotes = margin,
            totalVoterTurnoutPercent = turnoutPercent,
            round1PlayerVotes = r1P,
            round1OpponentVotes = r1O,
            round2PlayerVotes = r2P,
            round2OpponentVotes = r2O,
            round3PlayerVotes = r3P,
            round3OpponentVotes = r3O,
            finalRoundPlayerVotes = pVotes,
            finalRoundOpponentVotes = oVotes,
            strategyScore = strategyScore,
            publicTrustScore = publicTrustScore,
            mediaPerformanceScore = mediaPerformanceScore,
            groundCampaignScore = groundCampaignScore,
            debateScore = debateScore,
            opponentChallengeScore = opponentStrengthScore,
            primaryReasonHi = primaryReasonHi,
            primaryReasonEn = primaryReasonEn
        )
    }
}
