package com.rashtraniti.game.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

enum class PoliticalLevel(val levelIndex: Int, val titleHi: String, val titleEn: String) {
    COMMON_CITIZEN(1, "आम नागरिक", "Common Citizen"),
    PARTY_FOUNDER(2, "पार्टी संस्थापक", "Party Founder"),
    LOCAL_CANDIDATE(3, "स्थानीय प्रत्याशी", "Local Candidate"),
    ELECTED_REPRESENTATIVE(4, "निर्वाचित प्रतिनिधि", "Elected Representative"),
    STATE_POLITICIAN(5, "राज्य स्तरीय नेता", "State Politician"),
    STATE_ELECTION_WINNER(6, "राज्य विधायक दल नेता", "State Assembly Leader"),
    NATIONAL_POLITICIAN(7, "राष्ट्रीय नेता", "National Politician"),
    MEMBER_OF_PARLIAMENT(8, "सांसद (MP)", "Member of Parliament"),
    GOVERNMENT_FORMATION(9, "सरकार गठन", "Government Formation"),
    PRIME_MINISTER(10, "प्रधानमंत्री (PM)", "Prime Minister"),
    NATION_BUILDER(11, "राष्ट्र निर्माता", "National Governance"),
    NEXT_GENERAL_ELECTION(12, "पुनर्निर्वाचन अभियान", "Next General Election")
}

enum class MinistryType(val nameHi: String, val nameEn: String, val baseBudgetWeight: Double) {
    FINANCE("वित्त मंत्रालय", "Ministry of Finance", 0.15),
    HOME_AFFAIRS("गृह मंत्रालय", "Ministry of Home Affairs", 0.12),
    EDUCATION("शिक्षा मंत्रालय", "Ministry of Education", 0.10),
    HEALTHCARE("स्वास्थ्य एवं परिवार कल्याण", "Ministry of Healthcare", 0.10),
    AGRICULTURE("कृषि एवं किसान कल्याण", "Ministry of Agriculture", 0.11),
    INFRASTRUCTURE("सड़क व अवसंरचना", "Ministry of Infrastructure", 0.12),
    DEFENCE("रक्षा मंत्रालय", "Ministry of Defence", 0.14),
    TECHNOLOGY("इलेक्ट्रॉनिक्स व आईटी", "Ministry of Technology", 0.05),
    ENVIRONMENT("पर्यावरण एवं जलवायु", "Ministry of Environment", 0.04),
    TRANSPORT("रेलवे एवं परिवहन", "Ministry of Transport", 0.04),
    SOCIAL_WELFARE("सामाजिक न्याय व अधिकारिता", "Ministry of Social Welfare", 0.03)
}

enum class CampaignType(
    val titleHi: String,
    val titleEn: String,
    val baseCost: Long,
    val energyCost: Int,
    val trustBoost: Double,
    val popularityBoost: Double,
    val riskRate: Double
) {
    PUBLIC_RALLY("विशाल जनसभा", "Public Rally", 50000, 20, 4.5, 7.0, 0.10),
    DOOR_TO_DOOR("घर-घर जनसंपर्क", "Door-to-Door Campaign", 10000, 15, 6.0, 3.5, 0.02),
    PUBLIC_MEETING("नुक्कड़ सभा", "Public Meeting", 15000, 10, 3.5, 4.0, 0.04),
    TOWN_HALL("टाउन हॉल परिचर्चा", "Town Hall", 30000, 15, 5.0, 5.0, 0.05),
    LIVE_DEBATE("लाइव राजनीतिक बहस", "Live Political Debate", 25000, 25, 4.0, 8.0, 0.20),
    MANIFESTO_LAUNCH("घोषणापत्र विमोचन", "Manifesto Presentation", 40000, 15, 6.5, 6.0, 0.03),
    DIGITAL_CAMPAIGN("डिजिटल व सोशल प्रचार", "Digital Campaign", 35000, 10, 3.0, 7.5, 0.06),
    MEDIA_CAMPAIGN("टीवी व प्रिंट मीडिया प्रचार", "Media Campaign", 80000, 10, 4.0, 9.0, 0.08),
    VOLUNTEER_CAMPAIGN("कार्यकर्ता पदयात्रा", "Volunteer Outreach", 12000, 20, 5.5, 4.0, 0.01),
    COMMUNITY_DIALOGUE("सामुदायिक चौपाल", "Community Dialogue", 8000, 10, 5.0, 3.0, 0.01)
}

@Entity(tableName = "player_profile")
@Serializable
data class PlayerProfile(
    @PrimaryKey val id: String = "player_main",
    var name: String = "आलोक शर्मा",
    var age: Int = 32,
    var gender: String = "पुरुष",
    var state: String = "उत्तर प्रदेश",
    var district: String = "वाराणसी",
    var constituency: String = "वाराणसी उत्तर",
    var education: String = "स्नातकोत्तर (Post Graduate)",
    var occupation: String = "सामाजिक कार्यकर्ता (Social Activist)",
    
    // Core Attributes (0 to 100)
    var leadership: Int = 65,
    var communication: Int = 70,
    var politicalKnowledge: Int = 60,
    var publicTrust: Double = 50.0,
    var strategy: Int = 55,
    var administration: Int = 50,
    var financeSkill: Int = 52,
    var crisisManagement: Int = 58,
    
    // Resources
    var personalMoney: Long = 150000,
    var followers: Long = 1200,
    var energy: Int = 100,
    var level: PoliticalLevel = PoliticalLevel.COMMON_CITIZEN,
    var currentDay: Int = 1
)

@Entity(tableName = "political_party")
@Serializable
data class PoliticalParty(
    @PrimaryKey val id: String = "party_main",
    var name: String = "जन स्वाभिमान पार्टी",
    var shortName: String = "JSP",
    var symbol: String = "torch", // torch, balance, banyan_tree, sun, book, elephant, chakra
    var flagColorHex: String = "#FF9933",
    var slogan: String = "न्याय, विकास और राष्ट्र निर्माण",
    var ideology: String = "प्रगतिशील लोकतांत्रिक (Progressive Democratic)",
    var mainPriority: String = "शिक्षा एवं रोजगार (Education & Employment)",
    
    // Party Resources
    var partyFunds: Long = 500000,
    var totalMembers: Long = 3500,
    var activeWorkers: Long = 240,
    var volunteers: Long = 650,
    var partyOffices: Int = 3,
    
    // Support Demographic Percentages (0 - 100)
    var overallPopularity: Double = 42.0,
    var youthSupport: Double = 55.0,
    var ruralSupport: Double = 45.0,
    var urbanSupport: Double = 48.0,
    var farmerSupport: Double = 50.0,
    var workerSupport: Double = 52.0,
    var businessSupport: Double = 40.0,
    var mediaAttention: Double = 35.0,
    var electionReadiness: Double = 40.0
)

@Serializable
data class OppositionParty(
    val id: String,
    val name: String,
    val shortName: String,
    val leaderName: String,
    val colorHex: String,
    var popularity: Double,
    var funds: Long,
    var seats: Int,
    val ideology: String,
    var stanceTowardsPlayer: String = "प्रतिद्वंद्वी (Rival)"
)

@Serializable
data class Constituency(
    val id: String,
    val name: String,
    val district: String,
    val state: String,
    val totalVoters: Long,
    val ruralRatio: Double,
    val urbanRatio: Double,
    val youthRatio: Double,
    var playerSupport: Double,
    var opponentSupport: Double,
    var isUnlocked: Boolean = false,
    var winnerPartyShortName: String = ""
)

@Serializable
data class NationalEconomyState(
    var gdpInTrillionInr: Double = 310.5, // 310.5 Lakh Crore INR (~3.75T USD)
    var gdpGrowthRate: Double = 6.8,
    var inflationRate: Double = 4.8,
    var unemploymentRate: Double = 6.2,
    var nationalDebtPercentOfGdp: Double = 56.4,
    var annualBudgetTotalCrores: Long = 4800000, // 48 Lakh Crores
    var fiscalDeficitPercent: Double = 5.1,
    var publicSatisfactionRate: Double = 58.0,
    var governmentApprovalRate: Double = 62.0,
    
    // Sector Indexes (0 to 100)
    var educationIndex: Double = 65.0,
    var healthIndex: Double = 60.0,
    var infrastructureIndex: Double = 70.0,
    var agricultureIndex: Double = 68.0,
    var technologyIndex: Double = 75.0,
    var defenceReadinessIndex: Double = 82.0,
    var environmentIndex: Double = 52.0,
    var socialWelfareIndex: Double = 64.0
)

@Serializable
data class MinisterProfile(
    val id: String,
    val name: String,
    val experienceYears: Int,
    val competence: Int,
    val loyalty: Int,
    val integrity: Int,
    var assignedMinistry: MinistryType? = null
)

@Serializable
data class CrisisChoice(
    val choiceId: String,
    val textHi: String,
    val textEn: String,
    val costMoneyCrore: Long,
    val timeCostDays: Int,
    val riskPercent: Int,
    val immediateEffectHi: String,
    val immediateEffectEn: String,
    val publicTrustDelta: Double,
    val approvalDelta: Double,
    val budgetImpactCrore: Long
)

@Serializable
data class CrisisEvent(
    val id: String,
    val titleHi: String,
    val titleEn: String,
    val category: String, // "DISASTER", "MEDIA_TRIAL", "ECONOMY", "SCANDAL", "SECURITY"
    val descriptionHi: String,
    val descriptionEn: String,
    val affectedRegion: String,
    val severityLevel: Int, // 1 (Minor) to 5 (National Emergency)
    val choices: List<CrisisChoice>,
    var isResolved: Boolean = false,
    var selectedChoiceId: String? = null
)

@Serializable
data class ParliamentBill(
    val id: String,
    val titleHi: String,
    val titleEn: String,
    val summaryHi: String,
    val summaryEn: String,
    val category: MinistryType,
    val introducedByParty: String,
    var ayesVotes: Int = 0,
    var noesVotes: Int = 0,
    var isPassed: Boolean = false,
    val economicBenefit: Double,
    val socialSupportImpact: Double
)

@Serializable
data class QuizQuestion(
    val id: String,
    val category: String, // "CONSTITUTION", "PARLIAMENT", "CIVICS", "ECONOMY", "ADMINISTRATION"
    val questionHi: String,
    val questionEn: String,
    val optionsHi: List<String>,
    val optionsEn: List<String>,
    val correctIndex: Int,
    val explanationHi: String,
    val explanationEn: String,
    val statBoostField: String
)

@Serializable
data class GameAchievement(
    val id: String,
    val titleHi: String,
    val titleEn: String,
    val descHi: String,
    val descEn: String,
    var isUnlocked: Boolean = false,
    val iconName: String
)
