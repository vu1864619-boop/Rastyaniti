package com.rashtraniti.game.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.*
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUIState

@Composable
fun MultiplayerPartyScreen(
    state: GameUIState,
    isHindi: Boolean,
    onInviteFriend: (String) -> Unit,
    onAssignRole: (String, PartyRole, String) -> Unit,
    onExecuteCollaborativeTask: (String, String) -> Unit
) {
    var showInviteDialog by remember { mutableStateOf(false) }
    var friendInput by remember { mutableStateOf("") }

    // Sample multiplayer party members state
    var partyMembers by remember {
        mutableStateOf(
            listOf(
                MultiplayerMember("p_1", "alok_sharma", "आलोक शर्मा (आप)", "leader", PartyRole.PARTY_LEADER, "समस्त भारत", 4500, 12, 92, 88, 85, true),
                MultiplayerMember("p_2", "rohit_bihar", "रोहित वर्मा", "person", PartyRole.STATE_LEADER, "बिहार", 2800, 8, 78, 82, 65, true),
                MultiplayerMember("p_3", "priya_media", "प्रिया देशमुख", "campaign", PartyRole.MEDIA_MANAGER, "राष्ट्रीय मीडिया", 3100, 9, 74, 80, 94, true),
                MultiplayerMember("p_4", "aman_youth", "अमन चौधरी", "groups", PartyRole.YOUTH_WING_LEADER, "उत्तर प्रदेश", 1950, 6, 70, 86, 72, true),
                MultiplayerMember("p_5", "vikram_up", "विक्रम सिंह", "business", PartyRole.DISTRICT_LEADER, "वाराणसी", 1400, 5, 66, 75, 60, false, "15 मिनट पूर्व")
            )
        )
    }

    var activeStateSupport by remember {
        mutableStateOf(
            mapOf(
                "उत्तर प्रदेश" to 58.0,
                "बिहार" to 53.5,
                "महाराष्ट्र" to 49.0,
                "मध्य प्रदेश" to 47.0
            )
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Party Header & Invite Code
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = state.party.name,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = SaffronPrimary
                            )
                            Text(
                                text = if (isHindi) "मल्टीप्लेयर पार्टी मुख्यालय (Online HQ)" else "Online Party Headquarters",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }

                        Surface(
                            color = DeepNavy,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, GoldAccent)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "कोड: JSP-9821",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = GoldAccent
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(Icons.Default.ContentCopy, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(14.dp))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { showInviteDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.PersonAdd, contentDescription = null, tint = Color.Black, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "मित्र को जोड़ें (Invite)" else "Invite Friend",
                                color = Color.Black,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }

                        Button(
                            onClick = { },
                            colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Share, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "लिंक शेयर करें" else "Share Code",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        }

        // State Responsibilities & Live Decentralized Performance
        item {
            Text(
                text = if (isHindi) "राज्यों का लाइव प्रभार व जनसमर्थन" else "State Delegation & Real-Time Support",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                activeStateSupport.forEach { (st, pct) ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = DarkSurface),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(st, fontSize = 11.sp, color = TextSecondary, maxLines = 1)
                            Text("${pct.toInt()}%", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = if (pct >= 50) IndiaGreen else GoldAccent)
                        }
                    }
                }
            }
        }

        // Party Hierarchy Roster
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "पार्टी पदाधिकारी व सदस्य (${partyMembers.size})" else "Party Leaders & Members (${partyMembers.size})",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = if (isHindi) "4 ऑनलाइन" else "4 Online",
                    fontSize = 11.sp,
                    color = IndiaGreen,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        items(partyMembers) { member ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(DeepNavy),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Person, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(22.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(member.displayName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(if (member.isOnline) IndiaGreen else TextSecondary)
                                    )
                                }
                                Text(
                                    text = "Lv.${member.playerLevel} • ${member.xpPoints} XP • प्रभार: ${member.assignedState}",
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }

                        Surface(
                            color = SaffronPrimary.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = if (isHindi) member.role.titleHi.substringBefore(" (") else member.role.titleEn,
                                color = SaffronPrimary,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "नेतृत्व: ${member.leadershipSkill} | प्रचार: ${member.campaignSkill} | मीडिया: ${member.mediaSkill}",
                            fontSize = 11.sp,
                            color = GoldAccent
                        )

                        if (member.role != PartyRole.PARTY_LEADER) {
                            Button(
                                onClick = {
                                    // Assign new role / state task
                                    onAssignRole(member.playerId, PartyRole.STATE_LEADER, "बिहार")
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = DarkSurface),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                modifier = Modifier.height(28.dp)
                            ) {
                                Text(if (isHindi) "पद/प्रभार बदलें" else "Reassign Role", fontSize = 10.sp, color = TextPrimary)
                            }
                        }
                    }
                }
            }
        }

        // Collaborative Activity Actions
        item {
            Text(
                text = if (isHindi) "संयुक्त पार्टी गतिविधियां (Collaborative Actions)" else "Joint Campaign Operations",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "📢 बिहार राज्य महा-रैली (बिहार प्रभारी: रोहित वर्मा)",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text("₹80k", fontSize = 12.sp, color = GoldAccent, fontWeight = FontWeight.Bold)
                    }
                    Text(
                        text = "दोस्त के खाते से अभियान शुरू होने पर बिहार में लोकप्रियता +8% व पार्टी कोष में वृद्धि होगी।",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        modifier = Modifier.padding(vertical = 6.dp)
                    )
                    Button(
                        onClick = {
                            activeStateSupport = activeStateSupport.toMutableMap().apply {
                                this["बिहार"] = (this["बिहार"] ?: 50.0) + 5.5
                            }
                            onExecuteCollaborativeTask("task_bihar_rally", "बिहार")
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (isHindi) "प्रभारी को अभियान आदेश भेजें (Deploy)" else "Dispatch Joint Rally Order", color = Color.Black, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }

    if (showInviteDialog) {
        AlertDialog(
            onDismissRequest = { showInviteDialog = false },
            title = { Text(if (isHindi) "मित्र को पार्टी में आमंत्रित करें" else "Invite Friend to Party", color = SaffronPrimary, fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(if (isHindi) "मित्र की Player ID या Username दर्ज करें:" else "Enter Friend's Player ID or Username:", fontSize = 12.sp, color = TextSecondary)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = friendInput,
                        onValueChange = { friendInput = it },
                        placeholder = { Text("उदा. rohit_kumar_2026") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (friendInput.isNotBlank()) {
                            partyMembers = partyMembers + MultiplayerMember(
                                playerId = "p_${System.currentTimeMillis()}",
                                username = friendInput,
                                displayName = friendInput,
                                avatarIcon = "person",
                                role = PartyRole.STATE_LEADER,
                                assignedState = "बिहार",
                                xpPoints = 1500,
                                playerLevel = 6,
                                isOnline = true
                            )
                            onInviteFriend(friendInput)
                            showInviteDialog = false
                            friendInput = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary)
                ) {
                    Text(if (isHindi) "आमंत्रण भेजें" else "Send Invite", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showInviteDialog = false }) {
                    Text(if (isHindi) "रद्द करें" else "Cancel", color = TextSecondary)
                }
            }
        )
    }
}
