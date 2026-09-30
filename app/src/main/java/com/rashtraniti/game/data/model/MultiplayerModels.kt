package com.rashtraniti.game.data.model

import kotlinx.serialization.Serializable

enum class PartyRole(val titleHi: String, val titleEn: String, val permissions: List<String>) {
    PARTY_LEADER("राष्ट्रीय अध्यक्ष (Party Leader)", "National Party Leader", listOf("ALL", "ASSIGN_ROLES", "MANAGE_FUNDS", "CABINET")),
    SENIOR_LEADER("वरिष्ठ राष्ट्रीय नेता", "Senior Leader", listOf("NATIONAL_CAMPAIGN", "MANIFESTO", "MEDIA_DEBATE")),
    STATE_LEADER("प्रदेश अध्यक्ष (State Leader)", "State Leader", listOf("STATE_CAMPAIGN", "STATE_TICKETS", "STATE_RALLIES")),
    DISTRICT_LEADER("जिलाध्यक्ष (District Leader)", "District Leader", listOf("DISTRICT_CAMPAIGN", "DOOR_TO_DOOR", "VOLUNTEER_MGMT")),
    CAMPAIGN_MANAGER("मुख्य चुनाव प्रबंधक", "Campaign Manager", listOf("PLAN_RALLIES", "AD_BUDGET", "SURVEYS")),
    MEDIA_MANAGER("मुख्य मीडिया व प्रवक्ता", "Media Manager", listOf("PRESS_CONFERENCE", "TV_DEBATE", "DIGITAL_ADS")),
    YOUTH_WING_LEADER("युवा मोर्चा अध्यक्ष", "Youth Wing Leader", listOf("YOUTH_RALLIES", "CAMPUS_OUTREACH", "DIGITAL_VOLUNTEERS")),
    GENERAL_MEMBER("पार्टी सदस्य", "General Member", listOf("VOTE", "SHARE_MANIFESTO")),
    VOLUNTEER("सक्रिय स्वयंसेवक", "Active Volunteer", listOf("GROUND_WORK", "CANVASSING"))
}

@Serializable
data class MultiplayerMember(
    val playerId: String,
    val username: String,
    val displayName: String,
    val avatarIcon: String,
    var role: PartyRole,
    var assignedState: String = "उत्तर प्रदेश",
    var xpPoints: Long = 1200,
    var playerLevel: Int = 5,
    var leadershipSkill: Int = 68,
    var campaignSkill: Int = 74,
    var mediaSkill: Int = 62,
    var isOnline: Boolean = true,
    var lastActive: String = "अभी सक्रिय (Online Now)"
)

@Serializable
data class MultiplayerPartyRoom(
    val partyId: String = "party_jsp_online",
    val partyName: String = "जन स्वाभिमान पार्टी",
    val partyCode: String = "JSP",
    val inviteCode: String = "JSP-9821",
    val creatorPlayerId: String = "player_leader_01",
    var totalPartyFunds: Long = 8500000,
    var overallPartyPopularity: Double = 54.5,
    var members: List<MultiplayerMember> = emptyList(),
    var activeStateCampaigns: Map<String, Double> = mapOf(
        "उत्तर प्रदेश" to 58.0,
        "बिहार" to 52.0,
        "महाराष्ट्र" to 48.0,
        "मध्य प्रदेश" to 46.0,
        "कर्नाटक" to 44.0
    )
)

@Serializable
data class CollaborativeCampaignTask(
    val taskId: String,
    val titleHi: String,
    val titleEn: String,
    val targetState: String,
    val assignedRole: PartyRole,
    val costFunds: Long,
    val expectedTrustGain: Double,
    val expectedPopularityGain: Double,
    var isCompleted: Boolean = false,
    var completedByPlayerName: String? = null
)
