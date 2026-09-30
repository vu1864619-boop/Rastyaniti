package com.rashtraniti.game.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rashtraniti.game.data.model.*
import com.rashtraniti.game.engine.CrisisEngine
import com.rashtraniti.game.engine.ElectionEngine
import com.rashtraniti.game.engine.QuizRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.math.max
import kotlin.math.min

data class GameUIState(
    val currentScreen: String = "CINEMATIC", // CINEMATIC, PLAYER_CREATE, PARTY_CREATE, MAIN_HOME, MAP, PARTY_MGMT, CAMPAIGN, MEDIA, QUIZ, TRAINING, PARLIAMENT, GOVERNMENT, PM_DASHBOARD, BUDGET, CRISIS, MULTIPLAYER, ACHIEVEMENTS
    val isHindi: Boolean = true,
    val player: PlayerProfile = PlayerProfile(),
    val party: PoliticalParty = PoliticalParty(),
    val economy: NationalEconomyState = NationalEconomyState(),
    val oppositionParties: List<OppositionParty> = listOf(
        OppositionParty("opp_1", "राष्ट्रीय प्रगतिशील मोर्चा", "RPM", "राजेश मल्होत्रा", "#2563EB", 38.0, 12000000, 185, "रूढ़िवादी लोकतांत्रिक"),
        OppositionParty("opp_2", "समता विकास दल", "SVD", "सुश्री मीनाक्षी देवी", "#10B981", 24.0, 8000000, 92, "समाजवादी क्षेत्रीय"),
        OppositionParty("opp_3", "जन स्वाधीनता कांग्रेस", "JSK", "डॉ. कबीर सेन", "#EC4899", 18.0, 6500000, 68, "मध्यमार्गी संघीय")
    ),
    val constituencies: List<Constituency> = listOf(
        Constituency("const_varanasi_n", "वाराणसी उत्तर", "वाराणसी", "उत्तर प्रदेश", 420000, 0.25, 0.75, 0.35, 48.0, 42.0, true),
        Constituency("const_varanasi_s", "वाराणसी दक्षिण", "वाराणसी", "उत्तर प्रदेश", 390000, 0.15, 0.85, 0.32, 44.0, 46.0, true),
        Constituency("const_lucknow_c", "लखनऊ कैंट", "लखनऊ", "उत्तर प्रदेश", 480000, 0.10, 0.90, 0.40, 40.0, 45.0, false),
        Constituency("const_patna_sahib", "पटना साहिब", "पटना", "बिहार", 510000, 0.20, 0.80, 0.38, 38.0, 44.0, false),
        Constituency("const_bengaluru_s", "बेंगलुरु दक्षिण", "बेंगलुरु", "कर्नाटक", 650000, 0.05, 0.95, 0.48, 42.0, 40.0, false),
        Constituency("const_indore", "इंदौर", "इंदौर", "मध्य प्रदेश", 580000, 0.15, 0.85, 0.36, 45.0, 43.0, false),
        Constituency("const_ahmedabad_w", "अहमदाबाद पश्चिम", "अहमदाबाद", "गुजरात", 540000, 0.12, 0.88, 0.34, 39.0, 47.0, false)
    ),
    val activeCrisis: CrisisEvent? = null,
    val electionDaysRemaining: Int = 27,
    val electionObjectiveHi: String = "स्थानीय विधानसभा/संसदीय चुनाव हेतु जनता का विश्वास 60% से ऊपर ले जाएं",
    val electionObjectiveEn: String = "Elevate public trust above 60% and win local constituency election",
    val recentNotifications: List<String> = listOf(
        "चुनाव आयोग द्वारा आदर्श आचार संहिता की घोषणा की गई।",
        "युवा मतदाताओं में आपकी पार्टी का आकर्षण 8% बढ़ा है।"
    ),
    val currentQuizIndex: Int = 0,
    val quizScore: Int = 0,
    val quizAnsweredCount: Int = 0,
    val parliamentaryBills: List<ParliamentBill> = listOf(
        ParliamentBill("bill_edu_01", "राष्ट्रीय डिजिटल शिक्षा एवं कौशल विकास विधेयक", "National Digital Skill & Education Bill", "सभी ग्रामीण विद्यालयों में हाई-स्पीड इंटरनेट और एआई आधारित शिक्षा किट उपलब्ध कराना।", "Provide high-speed internet and AI-powered learning kits to all rural schools.", MinistryType.EDUCATION, "JSP", 284, 210, true, 4.5, 8.0),
        ParliamentBill("bill_agri_02", "कृषि प्रौद्योगिकी व न्यूनतम आय गारंटी सुधार विधेयक", "Agri-Tech & Farmer Income Security Bill", "फसलों का रियल-टाइम मूल्य निर्धारण और सौर ऊर्जा आधारित सिंचाई पर 70% सब्सिडी।", "Real-time crop price dashboard and 70% solar irrigation subsidies.", MinistryType.AGRICULTURE, "JSP", 298, 202, true, 6.2, 9.5),
        ParliamentBill("bill_health_03", "सार्वभौमिक निःशुल्क जीवनरक्षक दवा विधेयक", "Universal Essential Medicine Access Bill", "सभी प्राथमिक स्वास्थ्य केंद्रों पर 200 अनिवार्य दवाइयां शत-प्रतिशत निःशुल्क उपलब्ध कराना।", "Ensure 100% free availability of 200 essential medicines at all primary health centers.", MinistryType.HEALTHCARE, "JSP", 312, 180, true, 5.0, 11.0)
    ),
    val lastElectionResult: ElectionEngine.ElectionResult? = null,
    val ministryAllocations: Map<MinistryType, Double> = MinistryType.values().associateWith { it.baseBudgetWeight * 100.0 },
    val achievements: List<GameAchievement> = listOf(
        GameAchievement("ach_start", "प्रथम कदम", "First Step", "राजनीतिक यात्रा की शुरुआत की", "Started the political journey", true, "flag"),
        GameAchievement("ach_party", "पार्टी संस्थापक", "Party Founder", "अपनी राजनीतिक पार्टी का पंजीकरण किया", "Registered your political party", true, "groups"),
        GameAchievement("ach_first_win", "जनप्रतिनिधि", "People's Choice", "पहला चुनाव भारी मतों से जीता", "Won your first election victory", false, "how_to_reg"),
        GameAchievement("ach_pm", "प्रधान सेवक", "Prime Minister", "देश के सर्वोच्च पद की शपथ ली", "Sworn in as Prime Minister of India", false, "account_balance"),
        GameAchievement("ach_reformer", "राष्ट्र निर्माता", "Nation Builder", "जीडीपी विकास दर 8% के पार पहुंचाई", "Pushed national GDP growth beyond 8%", false, "trending_up")
    ),
    val zoomMapLevel: Int = 1 // 1: India, 2: State, 3: District, 4: Constituency
)

class RashtraNitiViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(GameUIState())
    val uiState: StateFlow<GameUIState> = _uiState.asStateFlow()

    fun setLanguage(isHindi: Boolean) {
        _uiState.update { it.copy(isHindi = isHindi) }
    }

    fun navigateTo(screen: String) {
        _uiState.update { it.copy(currentScreen = screen) }
    }

    fun setMapZoom(level: Int) {
        _uiState.update { it.copy(zoomMapLevel = max(1, min(4, level))) }
    }

    fun updatePlayerProfile(name: String, age: Int, state: String, district: String, constituency: String) {
        _uiState.update { current ->
            current.copy(
                player = current.player.copy(
                    name = name,
                    age = age,
                    state = state,
                    district = district,
                    constituency = constituency,
                    level = PoliticalLevel.PARTY_FOUNDER
                ),
                currentScreen = "PARTY_CREATE"
            )
        }
    }

    fun updatePartyDetails(name: String, shortName: String, slogan: String, colorHex: String, priority: String) {
        _uiState.update { current ->
            current.copy(
                party = current.party.copy(
                    name = name,
                    shortName = shortName,
                    slogan = slogan,
                    flagColorHex = colorHex,
                    mainPriority = priority
                ),
                currentScreen = "MAIN_HOME"
            )
        }
    }

    fun executeCampaign(type: CampaignType) {
        val current = _uiState.value
        if (current.party.partyFunds < type.baseCost || current.player.energy < type.energyCost) {
            return
        }

        val newFunds = current.party.partyFunds - type.baseCost
        val newEnergy = max(0, current.player.energy - type.energyCost)
        val newTrust = min(100.0, current.player.publicTrust + type.trustBoost)
        val newPopularity = min(100.0, current.party.overallPopularity + type.popularityBoost)
        val newReadiness = min(100.0, current.party.electionReadiness + 5.0)

        val notification = if (current.isHindi) {
            "${type.titleHi} सफल रही! जनविश्वास +${type.trustBoost}%, पार्टी लोकप्रियता +${type.popularityBoost}%"
        } else {
            "${type.titleEn} completed! Public Trust +${type.trustBoost}%, Party Popularity +${type.popularityBoost}%"
        }

        _uiState.update {
            it.copy(
                party = it.party.copy(
                    partyFunds = newFunds,
                    overallPopularity = newPopularity,
                    electionReadiness = newReadiness,
                    youthSupport = min(100.0, it.party.youthSupport + 3.0),
                    ruralSupport = min(100.0, it.party.ruralSupport + 2.5)
                ),
                player = it.player.copy(
                    energy = newEnergy,
                    publicTrust = newTrust,
                    leadership = min(100, it.player.leadership + 1)
                ),
                recentNotifications = listOf(notification) + it.recentNotifications.take(4)
            )
        }
    }

    fun triggerCrisis(crisis: CrisisEvent) {
        _uiState.update { it.copy(activeCrisis = crisis, currentScreen = "CRISIS") }
    }

    fun resolveCrisis(choice: CrisisChoice) {
        val current = _uiState.value
        val newTrust = max(0.0, min(100.0, current.player.publicTrust + choice.publicTrustDelta))
        val newApproval = max(0.0, min(100.0, current.economy.governmentApprovalRate + choice.approvalDelta))
        val newSatisfaction = max(0.0, min(100.0, current.economy.publicSatisfactionRate + (choice.approvalDelta * 0.8)))

        val note = if (current.isHindi) {
            "संकट निवारण निर्णय लिया गया: ${choice.immediateEffectHi}"
        } else {
            "Crisis response executed: ${choice.immediateEffectEn}"
        }

        _uiState.update {
            it.copy(
                activeCrisis = null,
                currentScreen = "MAIN_HOME",
                player = it.player.copy(publicTrust = newTrust),
                economy = it.economy.copy(
                    governmentApprovalRate = newApproval,
                    publicSatisfactionRate = newSatisfaction
                ),
                recentNotifications = listOf(note) + it.recentNotifications.take(4)
            )
        }
    }

    fun answerQuiz(questionIndex: Int, selectedOptionIndex: Int) {
        val questions = QuizRepository.getQuestions()
        if (questionIndex >= questions.size) return
        val q = questions[questionIndex]
        val isCorrect = selectedOptionIndex == q.correctIndex
        
        _uiState.update { current ->
            val newScore = if (isCorrect) current.quizScore + 10 else current.quizScore
            val updatedPlayer = if (isCorrect) {
                when (q.statBoostField) {
                    "politicalKnowledge" -> current.player.copy(politicalKnowledge = min(100, current.player.politicalKnowledge + 3))
                    "leadership" -> current.player.copy(leadership = min(100, current.player.leadership + 2))
                    "administration" -> current.player.copy(administration = min(100, current.player.administration + 3))
                    "financeSkill" -> current.player.copy(financeSkill = min(100, current.player.financeSkill + 3))
                    else -> current.player.copy(strategy = min(100, current.player.strategy + 3))
                }
            } else current.player

            current.copy(
                quizScore = newScore,
                quizAnsweredCount = current.quizAnsweredCount + 1,
                player = updatedPlayer,
                currentQuizIndex = (current.currentQuizIndex + 1) % questions.size
            )
        }
    }

    fun conductElection() {
        val current = _uiState.value
        val targetConstituency = current.constituencies.first()
        val result = ElectionEngine.simulateConstituencyElection(
            constituency = targetConstituency,
            player = current.player,
            party = current.party,
            campaignEffortLevel = 1.5
        )

        val newLevel = if (result.isWon) {
            when (current.player.level) {
                PoliticalLevel.COMMON_CITIZEN, PoliticalLevel.PARTY_FOUNDER, PoliticalLevel.LOCAL_CANDIDATE -> PoliticalLevel.ELECTED_REPRESENTATIVE
                PoliticalLevel.ELECTED_REPRESENTATIVE -> PoliticalLevel.STATE_POLITICIAN
                PoliticalLevel.STATE_POLITICIAN -> PoliticalLevel.MEMBER_OF_PARLIAMENT
                PoliticalLevel.MEMBER_OF_PARLIAMENT -> PoliticalLevel.PRIME_MINISTER
                else -> PoliticalLevel.PRIME_MINISTER
            }
        } else current.player.level

        val note = if (result.isWon) {
            if (current.isHindi) "शानदार विजय! आपने ${result.marginVotes} मतों के अंतर से जीत दर्ज की।"
            else "Historic Victory! Won by a margin of ${result.marginVotes} votes."
        } else {
            if (current.isHindi) "कड़ा मुकाबला! विपक्ष ${result.marginVotes} मतों से आगे रहा। अगली बार रणनीति और मजबूत करें।"
            else "Tough contest! Opponent led by ${result.marginVotes} votes. Refine grassroots campaign."
        }

        _uiState.update {
            it.copy(
                lastElectionResult = result,
                player = it.player.copy(
                    level = newLevel,
                    publicTrust = if (result.isWon) min(100.0, it.player.publicTrust + 12.0) else max(20.0, it.player.publicTrust - 4.0)
                ),
                electionDaysRemaining = 90,
                currentScreen = "ELECTION_DAY",
                recentNotifications = listOf(note) + it.recentNotifications.take(4)
            )
        }
    }

    fun updateBudgetSlider(ministry: MinistryType, newPercent: Double) {
        _uiState.update { current ->
            val updated = current.ministryAllocations.toMutableMap()
            updated[ministry] = newPercent
            current.copy(ministryAllocations = updated)
        }
    }

    fun passBillInParliament(bill: ParliamentBill) {
        val current = _uiState.value
        val updatedBills = current.parliamentaryBills.map {
            if (it.id == bill.id) it.copy(isPassed = true, ayesVotes = 318, noesVotes = 195) else it
        }
        val note = if (current.isHindi) "विधेयक पारित: '${bill.titleHi}' संसद से बहुमत द्वारा स्वीकृत हुआ।"
        else "Bill Passed: '${bill.titleEn}' approved with parliamentary majority."

        _uiState.update {
            it.copy(
                parliamentaryBills = updatedBills,
                economy = it.economy.copy(
                    gdpGrowthRate = min(10.5, it.economy.gdpGrowthRate + 0.3),
                    publicSatisfactionRate = min(100.0, it.economy.publicSatisfactionRate + 4.0),
                    governmentApprovalRate = min(100.0, it.economy.governmentApprovalRate + 3.5)
                ),
                recentNotifications = listOf(note) + it.recentNotifications.take(4)
            )
        }
    }
}
