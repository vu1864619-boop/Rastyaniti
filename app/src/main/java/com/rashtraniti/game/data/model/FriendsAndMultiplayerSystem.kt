package com.rashtraniti.game.data.model

import kotlinx.serialization.Serializable

@Serializable
data class FriendAccount(
    val playerId: String,
    val username: String,
    val displayName: String,
    val avatarIcon: String = "person",
    val level: Int = 5,
    val xp: Long = 2400,
    val isOnline: Boolean = true,
    val currentPartyId: String? = null,
    val currentPartyName: String? = null,
    val currentPartyRole: String = "निर्दलीय (Independent)",
    
    // Skills
    val leadership: Int = 72,
    val communication: Int = 78,
    val politicalKnowledge: Int = 68,
    val strategy: Int = 75,
    val administration: Int = 70,
    val mediaHandling: Int = 80,
    
    // Stats
    val totalCampaignsWon: Int = 14,
    val totalElectionsFought: Int = 6,
    val contributionPoints: Long = 680
)

@Serializable
data class PartyInvitation(
    val invitationId: String,
    val partyId: String,
    val partyName: String,
    val partyCode: String,
    val inviterPlayerId: String,
    val inviterName: String,
    val invitedPlayerId: String,
    val invitedUsername: String,
    val proposedRole: PartyRole = PartyRole.STATE_LEADER,
    val proposedState: String = "बिहार",
    val timestamp: Long = System.currentTimeMillis(),
    val status: String = "PENDING" // "PENDING", "ACCEPTED", "DECLINED", "EXPIRED"
)

@Serializable
data class PartyChatMessage(
    val messageId: String,
    val senderPlayerId: String,
    val senderName: String,
    val senderRole: String,
    val messageText: String,
    val timestamp: String,
    val isAnnouncement: Boolean = false
)

@Serializable
data class MemberContributionRecord(
    val playerId: String,
    val playerName: String,
    val roleTitle: String,
    val campaignContribution: Long = 320,
    val electionContribution: Long = 280,
    val fundContribution: Long = 150,
    val volunteerContribution: Long = 120,
    val mediaContribution: Long = 210,
    val totalPoints: Long = 1080,
    val rankPosition: Int = 1
)

@Serializable
data class DelegatedAssignment(
    val assignmentId: String,
    val titleHi: String,
    val titleEn: String,
    val targetRegion: String, // "बिहार", "उत्तर प्रदेश", etc.
    val assignedToPlayerId: String,
    val assignedToPlayerName: String,
    val objectiveDescriptionHi: String,
    val objectiveDescriptionEn: String,
    val rewardXP: Long = 450,
    val rewardContributionPoints: Long = 120,
    var status: String = "PENDING" // "PENDING", "ACTIVE", "COMPLETED", "DECLINED"
)
