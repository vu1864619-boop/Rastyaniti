package com.rashtraniti.game.data.model

import kotlinx.serialization.Serializable

enum class ElectionDifficulty(val titleHi: String, val titleEn: String, val opponentMultiplier: Double) {
    EASY("सरल (Easy)", "Easy", 0.85),
    NORMAL("सामान्य (Normal)", "Normal", 1.0),
    HARD("कठिन (Hard)", "Hard", 1.25),
    EXPERT("विशेषज्ञ (Expert)", "Expert", 1.50)
}

enum class Day1Strategy(
    val titleHi: String,
    val titleEn: String,
    val youthBoost: Double,
    val ruralBoost: Double,
    val urbanBoost: Double,
    val trustBoost: Double
) {
    DEVELOPMENT("विकास एवं उद्योग केंद्रित", "Development & Industrial Growth", 4.0, 3.0, 7.0, 5.0),
    YOUTH("युवा एवं रोजगार केंद्रित", "Youth & Employment Focused", 9.0, 4.0, 6.0, 6.0),
    AGRICULTURE("कृषि व किसान कल्याण", "Agriculture & Rural Farmers", 2.0, 9.0, 2.0, 7.0),
    EDUCATION("शिक्षा व स्वास्थ्य सुधार", "Education & Universal Healthcare", 6.0, 5.0, 6.0, 8.0),
    INFRASTRUCTURE("सड़क व बुनियादी ढांचा", "Infrastructure & Connectivity", 3.0, 6.0, 7.0, 5.5),
    GENERAL_OUTREACH("सर्वसमावेशी जनसंपर्क", "Broad Public Outreach", 5.0, 5.0, 5.0, 6.0)
}

enum class Day2GroundAction(
    val titleHi: String,
    val titleEn: String,
    val costMoney: Long,
    val energyCost: Int,
    val volunteerReq: Int,
    val trustDelta: Double,
    val visibilityDelta: Double
) {
    DOOR_TO_DOOR("घर-घर सघन जनसंपर्क (Door-to-Door)", "Intensive Door-to-Door", 15000, 25, 40, 7.5, 3.0),
    SMALL_MEETINGS("नुक्कड़ व मोहल्ला सभाएं", "Street Corner Meetings", 20000, 20, 25, 5.0, 4.5),
    MEGA_RALLY("विशाल जनसभा एवं शक्ति प्रदर्शन", "Massive Electoral Rally", 75000, 30, 80, 4.0, 9.5),
    VOLUNTEER_MARCH("कार्यकर्ता पदयात्रा व चौपाल", "Volunteer Foot March", 12000, 20, 50, 6.0, 4.0),
    LOCAL_ISSUE_BOOTH("स्थानीय समस्याओं पर चौपाल", "Local Issue Resolution Kiosk", 18000, 15, 30, 7.0, 4.0)
}

enum class Day3MediaAction(
    val titleHi: String,
    val titleEn: String,
    val costMoney: Long,
    val reachScore: Double,
    val mediaRepDelta: Double
) {
    TV_INTERVIEW("प्राइम टाइम टीवी इंटरव्यू", "Prime Time TV Interview", 30000, 8.5, 6.0),
    PRESS_CONFERENCE("प्रेस वार्ता एवं श्वेतपत्र", "Live Press Conference", 25000, 7.0, 7.5),
    DIGITAL_CAMPAIGN("डिजिटल व सोशल मीडिया विज्ञापन", "Targeted Digital Ads", 40000, 9.0, 4.5),
    NEWSPAPER_EDITORIAL("दैनिक समाचार पत्रों में लेख", "Newspaper Op-Ed Campaign", 20000, 6.0, 5.5),
    GROUND_STATEMENT("खुला जनसंवाद वक्तव्य", "Direct Public Address", 10000, 5.0, 5.0)
}

@Serializable
data class DebateQuestion(
    val id: String,
    val topicHi: String,
    val topicEn: String,
    val questionHi: String,
    val questionEn: String,
    val optionsHi: List<String>,
    val optionsEn: List<String>,
    val correctIndex: Int,
    val impactAnalysisHi: String
)

@Serializable
data class SevenDayCampaignState(
    val constituencyName: String = "वाराणसी उत्तर",
    val totalPopulation: Long = 420000,
    val majorIssues: List<String> = listOf("रोजगार के नए अवसर", "पेयजल व सीवरेज व्यवस्था", "सड़क व विद्युत आपूर्ति"),
    var currentDay: Int = 1, // 1 to 7
    var difficulty: ElectionDifficulty = ElectionDifficulty.NORMAL,
    
    // Day 1
    var selectedStrategy: Day1Strategy? = null,
    
    // Day 2
    var selectedGroundAction: Day2GroundAction? = null,
    
    // Day 3
    var selectedMediaAction: Day3MediaAction? = null,
    var mediaMisunderstandingResolved: Boolean = false,
    
    // Day 4 Opposition Reaction
    var opponentCounterActionHi: String = "",
    var opponentCounterActionEn: String = "",
    var opponentStrengthScore: Double = 52.0,
    
    // Day 5 Surprise Crisis
    var crisisDescriptionHi: String = "",
    var crisisChoiceSelected: Int? = null,
    
    // Day 6 Debate
    var debateScore: Int = 0,
    var debateCompleted: Boolean = false,
    
    // Scores and Real-time Standing
    var campaignBudgetSpent: Long = 0,
    var playerSupportPercent: Double = 46.0,
    var opponentSupportPercent: Double = 45.0,
    var publicTrustScore: Double = 55.0,
    var mediaReputationScore: Double = 58.0,
    var groundStrengthScore: Double = 50.0,
    var isCampaignCompleted: Boolean = false
)

@Serializable
data class ComprehensiveElectionScorecard(
    val winnerPartyName: String,
    val winnerCandidateName: String,
    val isPlayerWinner: Boolean,
    val playerVotes: Long,
    val opponentVotes: Long,
    val otherVotes: Long,
    val playerVotePercent: Double,
    val opponentVotePercent: Double,
    val otherVotePercent: Double,
    val marginVotes: Long,
    val totalVoterTurnoutPercent: Double,
    val round1PlayerVotes: Long,
    val round1OpponentVotes: Long,
    val round2PlayerVotes: Long,
    val round2OpponentVotes: Long,
    val round3PlayerVotes: Long,
    val round3OpponentVotes: Long,
    val finalRoundPlayerVotes: Long,
    val finalRoundOpponentVotes: Long,
    
    // Evaluation Metrics (0 to 100)
    val strategyScore: Int,
    val publicTrustScore: Int,
    val mediaPerformanceScore: Int,
    val groundCampaignScore: Int,
    val debateScore: Int,
    val opponentChallengeScore: Int,
    val primaryReasonHi: String,
    val primaryReasonEn: String
)
