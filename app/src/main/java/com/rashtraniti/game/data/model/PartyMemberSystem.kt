package com.rashtraniti.game.data.model

import kotlinx.serialization.Serializable
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

enum class HierarchyRank(val level: Int, val titleHi: String, val titleEn: String, val salaryPerMonth: Long) {
    PARTY_LEADER(1, "पार्टी राष्ट्रीय अध्यक्ष (Party President)", "National Party President", 0),
    SENIOR_LEADER(2, "वरिष्ठ राष्ट्रीय नेता (Senior Leader)", "Senior National Leader", 60000),
    STATE_LEADER(3, "प्रदेश अध्यक्ष (State Leader)", "State Party President", 45000),
    DISTRICT_LEADER(4, "जिलाध्यक्ष (District Leader)", "District Party Leader", 30000),
    CONSTITUENCY_LEADER(5, "क्षेत्रीय प्रभारी (Constituency Leader)", "Constituency In-Charge", 20000),
    WING_LEADER(6, "मोर्चा अध्यक्ष (Youth / Women / Student Wing)", "Wing President", 25000),
    GENERAL_MEMBER(7, "पार्टी सदस्य (General Member)", "General Party Member", 5000),
    VOLUNTEER(8, "सक्रिय स्वयंसेवक (Volunteer)", "Active Volunteer", 0)
}

enum class WingType(val titleHi: String, val titleEn: String) {
    MAIN("मुख्य दल", "Main Party"),
    YOUTH("युवा मोर्चा", "Youth Wing"),
    WOMEN("महिला मोर्चा", "Women Wing"),
    STUDENT("छात्र परिषद", "Student Union"),
    FARMER("किसान मोर्चा", "Farmer Wing"),
    LABOUR("श्रमिक प्रकोष्ठ", "Labour Wing")
}

enum class MemberAssignment(val titleHi: String, val titleEn: String) {
    IDLE("मुख्यालय पर उपस्थित (Idle at HQ)", "Available at HQ"),
    DOOR_TO_DOOR("घर-घर जनसंपर्क अभियान", "Door-to-Door Campaign"),
    RALLY_ORGANIZER("महा-रैली संचालन", "Rally Management"),
    TV_DEBATE("प्राइम टाइम टीवी डिबेट", "Prime Time TV Debate"),
    PRESS_CONFERENCE("प्रेस वार्ता प्रवक्ता", "Press Conference Briefing"),
    CONSTITUENCY_BOOTH("बूथ व मतदाता प्रबंधन", "Booth Management"),
    MINISTER_GOVERNMENT("मंत्रालय प्रशासन (Minister)", "Cabinet Minister Duty")
}

@Serializable
data class FictionalPartyMember(
    val id: String,
    var name: String,
    var age: Int,
    var avatarIcon: String = "person",
    var rank: HierarchyRank,
    var wing: WingType = WingType.MAIN,
    var assignedRegion: String = "उत्तर प्रदेश",
    var currentAssignment: MemberAssignment = MemberAssignment.IDLE,
    
    // Core Attributes (0 to 100)
    var leadership: Int = 60,
    var communication: Int = 65,
    var politicalKnowledge: Int = 55,
    var strategy: Int = 58,
    var administration: Int = 50,
    var financeSkill: Int = 52,
    var mediaHandling: Int = 60,
    var publicSupport: Double = 45.0,
    var loyalty: Double = 80.0, // Drops if neglected or passed over for promotion
    
    // Growth
    var xp: Long = 500,
    var level: Int = 3,
    var monthlySalary: Long = 30000,
    var isAssignedToMinistry: Boolean = false,
    var assignedMinistry: MinistryType? = null
) {
    fun gainXP(amount: Long) {
        xp += amount
        if (xp >= level * 800L) {
            level += 1
            leadership = min(100, leadership + 2)
            communication = min(100, communication + 2)
            strategy = min(100, strategy + 2)
            administration = min(100, administration + 2)
            mediaHandling = min(100, mediaHandling + 2)
            loyalty = min(100.0, loyalty + 4.0)
        }
    }
}

@Serializable
data class InternalPartyEvent(
    val id: String,
    val titleHi: String,
    val titleEn: String,
    val descriptionHi: String,
    val descriptionEn: String,
    val involvedMemberId: String,
    val severity: String, // "LOW", "MEDIUM", "HIGH"
    val optionsHi: List<String>,
    val optionsEn: List<String>
)

object PartyDynamicsEngine {
    fun generateRecruitsPool(): List<FictionalPartyMember> = listOf(
        FictionalPartyMember(
            id = "rec_1",
            name = "डॉ. हर्षवर्द्धन शास्त्री",
            age = 44,
            rank = HierarchyRank.SENIOR_LEADER,
            wing = WingType.MAIN,
            assignedRegion = "उत्तर प्रदेश",
            leadership = 78,
            communication = 82,
            politicalKnowledge = 88,
            strategy = 80,
            administration = 75,
            financeSkill = 70,
            mediaHandling = 85,
            publicSupport = 62.0,
            loyalty = 85.0,
            monthlySalary = 60000
        ),
        FictionalPartyMember(
            id = "rec_2",
            name = "सुश्री अंजलि त्रिवेदी",
            age = 29,
            rank = HierarchyRank.WING_LEADER,
            wing = WingType.YOUTH,
            assignedRegion = "बिहार",
            leadership = 72,
            communication = 86,
            politicalKnowledge = 68,
            strategy = 74,
            administration = 60,
            financeSkill = 55,
            mediaHandling = 90,
            publicSupport = 58.0,
            loyalty = 92.0,
            monthlySalary = 25000
        ),
        FictionalPartyMember(
            id = "rec_3",
            name = "राघवेंद्र सिंह राठौड़",
            age = 38,
            rank = HierarchyRank.STATE_LEADER,
            wing = WingType.MAIN,
            assignedRegion = "राजस्थान",
            leadership = 80,
            communication = 70,
            politicalKnowledge = 75,
            strategy = 82,
            administration = 78,
            financeSkill = 65,
            mediaHandling = 68,
            publicSupport = 64.0,
            loyalty = 78.0,
            monthlySalary = 45000
        ),
        FictionalPartyMember(
            id = "rec_4",
            name = "सुमन लता देवी",
            age = 42,
            rank = HierarchyRank.WING_LEADER,
            wing = WingType.WOMEN,
            assignedRegion = "मध्य प्रदेश",
            leadership = 75,
            communication = 80,
            politicalKnowledge = 72,
            strategy = 70,
            administration = 80,
            financeSkill = 60,
            mediaHandling = 75,
            publicSupport = 66.0,
            loyalty = 88.0,
            monthlySalary = 25000
        ),
        FictionalPartyMember(
            id = "rec_5",
            name = "प्रदीप कुमार नायर",
            age = 34,
            rank = HierarchyRank.DISTRICT_LEADER,
            wing = WingType.MAIN,
            assignedRegion = "कर्नाटक",
            leadership = 68,
            communication = 74,
            politicalKnowledge = 65,
            strategy = 72,
            administration = 70,
            financeSkill = 68,
            mediaHandling = 62,
            publicSupport = 54.0,
            loyalty = 84.0,
            monthlySalary = 30000
        )
    )

    fun checkInternalPartyEvents(members: List<FictionalPartyMember>): InternalPartyEvent? {
        val dissatisfied = members.filter { it.loyalty < 55.0 && it.rank != HierarchyRank.PARTY_LEADER }
        if (dissatisfied.isEmpty()) return null

        val member = dissatisfied.random()
        return InternalPartyEvent(
            id = "event_friction_${System.currentTimeMillis()}",
            titleHi = "पार्टी में आंतरिक मतभेद की स्थिति",
            titleEn = "Internal Factional Friction Alert",
            descriptionHi = "${member.rank.titleHi} ${member.name} अपने वर्तमान प्रभार व पदोन्नति में देरी से असंतुष्ट हैं और उन्होंने पार्टी नेतृत्व के सामने अपनी नाराजगी व्यक्त की है।",
            descriptionEn = "${member.rank.titleEn} ${member.name} expresses discontent over delayed promotions and regional portfolio delegation.",
            involvedMemberId = member.id,
            severity = if (member.loyalty < 40.0) "HIGH" else "MEDIUM",
            optionsHi = listOf(
                "वरिष्ठ पद पर पदोन्नत करें और राज्य चुनाव समिति का सदस्य बनाएं (निष्ठा +25%)",
                "व्यक्तिगत संवाद कर आगामी सरकार में मंत्रालय का आश्वासन दें (निष्ठा +15%)",
                "अनुशासनात्मक चेतावनी जारी करें और पद सीमित करें (निष्ठा -20%)"
            ),
            optionsEn = listOf(
                "Promote to Senior Rank & State Election Board (Loyalty +25%)",
                "Hold 1-on-1 dialogue & promise ministerial portfolio post-election (Loyalty +15%)",
                "Issue disciplinary caution & restrict regional charge (Loyalty -20%)"
            )
        )
    }
}
