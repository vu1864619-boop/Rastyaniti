package com.rashtraniti.game.ui.screens

import androidx.compose.animation.*
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
fun PartyLeaderManagementScreen(
    state: GameUIState,
    isHindi: Boolean,
    onDeployMember: (FictionalPartyMember, MemberAssignment) -> Unit,
    onPromoteMember: (FictionalPartyMember, HierarchyRank) -> Unit,
    onRecruitMember: (FictionalPartyMember) -> Unit
) {
    var selectedWingFilter by remember { mutableStateOf(WingType.MAIN) }
    var showRecruitDialog by remember { mutableStateOf(false) }
    var selectedMemberForAction by remember { mutableStateOf<FictionalPartyMember?>(null) }

    // Roster of party members
    var membersList by remember {
        mutableStateOf(
            listOf(
                FictionalPartyMember("m_lead_1", "${state.player.name} (आप)", 35, "star", HierarchyRank.PARTY_LEADER, WingType.MAIN, "समस्त भारत", MemberAssignment.IDLE, 95, 92, 90, 88, 85, 80, 88, 75.0, 100.0, 5200, 15, 0),
                FictionalPartyMember("m_sen_2", "डॉ. हर्षवर्द्धन शास्त्री", 48, "person", HierarchyRank.SENIOR_LEADER, WingType.MAIN, "उत्तर प्रदेश", MemberAssignment.TV_DEBATE, 82, 88, 92, 85, 80, 72, 90, 68.0, 88.0, 3600, 10, 60000),
                FictionalPartyMember("m_st_3", "राघवेंद्र सिंह राठौड़", 42, "person", HierarchyRank.STATE_LEADER, WingType.MAIN, "बिहार", MemberAssignment.RALLY_ORGANIZER, 78, 75, 70, 80, 76, 68, 72, 62.0, 82.0, 2900, 8, 45000),
                FictionalPartyMember("m_youth_4", "सुश्री अंजलि त्रिवेदी", 28, "groups", HierarchyRank.WING_LEADER, WingType.YOUTH, "महाराष्ट्र", MemberAssignment.DOOR_TO_DOOR, 74, 86, 68, 72, 65, 55, 92, 58.0, 94.0, 2400, 7, 25000),
                FictionalPartyMember("m_wom_5", "सुमन लता देवी", 44, "face_3", HierarchyRank.WING_LEADER, WingType.WOMEN, "मध्य प्रदेश", MemberAssignment.CONSTITUENCY_BOOTH, 76, 82, 74, 75, 82, 64, 78, 65.0, 90.0, 2600, 8, 25000),
                FictionalPartyMember("m_dist_6", "प्रदीप कुमार नायर", 36, "business", HierarchyRank.DISTRICT_LEADER, WingType.MAIN, "वाराणसी", MemberAssignment.DOOR_TO_DOOR, 68, 72, 66, 70, 72, 65, 60, 52.0, 78.0, 1800, 6, 30000)
            )
        )
    }

    val recruitPool = remember { PartyDynamicsEngine.generateRecruitsPool() }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Party Leadership Overview Banner
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
                                text = if (isHindi) "पार्टी संगठनात्मक ढांचा (Leadership HQ)" else "Party Hierarchy & Leadership HQ",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = SaffronPrimary
                            )
                            Text(
                                text = if (isHindi) "राष्ट्रीय अध्यक्ष: ${state.player.name}" else "National President: ${state.player.name}",
                                fontSize = 12.sp,
                                color = GoldAccent,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        Surface(
                            color = DeepNavy,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, SaffronPrimary)
                        ) {
                            Text(
                                text = "${membersList.size} पदाधिकारी",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = SaffronPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { showRecruitDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.GroupAdd, contentDescription = null, tint = Color.Black, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "नए नेता भर्ती करें" else "Recruit Leaders",
                                color = Color.Black,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }

                        Button(
                            onClick = {
                                // Simulate mass training workshop
                                membersList = membersList.map {
                                    it.gainXP(300)
                                    it.copy()
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.School, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "कार्यकर्ता प्रशिक्षण" else "Train Cadre",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        }

        // Wing Selection Filter Tabs
        item {
            ScrollableTabRow(
                selectedTabIndex = WingType.values().indexOf(selectedWingFilter),
                containerColor = DarkSurface,
                contentColor = SaffronPrimary,
                edgePadding = 0.dp,
                modifier = Modifier.clip(RoundedCornerShape(10.dp))
            ) {
                WingType.values().forEach { wing ->
                    Tab(
                        selected = selectedWingFilter == wing,
                        onClick = { selectedWingFilter = wing },
                        text = {
                            Text(
                                text = if (isHindi) wing.titleHi else wing.titleEn,
                                fontSize = 12.sp,
                                fontWeight = if (selectedWingFilter == wing) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }
        }

        // Hierarchy Leaders List
        val filteredMembers = membersList.filter { selectedWingFilter == WingType.MAIN || it.wing == selectedWingFilter }
        items(filteredMembers) { member ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(DeepNavy),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Person, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(24.dp))
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(member.name, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 15.sp)
                                Text(
                                    text = if (isHindi) "${member.rank.titleHi.substringBefore(" (")} • प्रभार: ${member.assignedRegion}" else "${member.rank.titleEn} • ${member.assignedRegion}",
                                    fontSize = 11.sp,
                                    color = TextSecondary
                                )
                            }
                        }

                        Surface(
                            color = if (member.loyalty >= 75) IndiaGreen.copy(alpha = 0.15f) else GoldAccent.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "निष्ठा: ${member.loyalty.toInt()}%",
                                color = if (member.loyalty >= 75) IndiaGreen else GoldAccent,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Stats Grid for Member
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text("नेतृत्व: ${member.leadership}", fontSize = 11.sp, color = GoldAccent)
                            Text("रणनीति: ${member.strategy}", fontSize = 11.sp, color = TextSecondary)
                        }
                        Column {
                            Text("संवाद: ${member.communication}", fontSize = 11.sp, color = IndiaGreen)
                            Text("प्रशासन: ${member.administration}", fontSize = 11.sp, color = TextSecondary)
                        }
                        Column {
                            Text("मीडिया: ${member.mediaHandling}", fontSize = 11.sp, color = Color(0xFF60A5FA))
                            Text("जनसमर्थन: ${member.publicSupport.toInt()}%", fontSize = 11.sp, color = SaffronPrimary)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Current Assignment Badge
                    Surface(
                        color = DarkSurface,
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "वर्तमान कार्य: ${if (isHindi) member.currentAssignment.titleHi else member.currentAssignment.titleEn}",
                                fontSize = 11.sp,
                                color = TextPrimary
                            )
                            Text("Lv.${member.level} (${member.xp} XP)", fontSize = 11.sp, color = GoldAccent, fontWeight = FontWeight.Bold)
                        }
                    }

                    if (member.rank != HierarchyRank.PARTY_LEADER) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    // Deploy to Rally
                                    member.currentAssignment = MemberAssignment.RALLY_ORGANIZER
                                    member.gainXP(250)
                                    onDeployMember(member, MemberAssignment.RALLY_ORGANIZER)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(32.dp)
                            ) {
                                Text(if (isHindi) "रैली भेजें" else "Send Rally", fontSize = 11.sp, color = Color.Black, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = {
                                    // Deploy to TV Debate
                                    member.currentAssignment = MemberAssignment.TV_DEBATE
                                    member.gainXP(300)
                                    onDeployMember(member, MemberAssignment.TV_DEBATE)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(32.dp)
                            ) {
                                Text(if (isHindi) "टीवी डिबेट" else "TV Debate", fontSize = 11.sp, color = Color.White, fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = {
                                    // Promote Rank
                                    val nextRank = when (member.rank) {
                                        HierarchyRank.VOLUNTEER -> HierarchyRank.GENERAL_MEMBER
                                        HierarchyRank.GENERAL_MEMBER -> HierarchyRank.DISTRICT_LEADER
                                        HierarchyRank.DISTRICT_LEADER -> HierarchyRank.STATE_LEADER
                                        HierarchyRank.STATE_LEADER -> HierarchyRank.SENIOR_LEADER
                                        else -> HierarchyRank.SENIOR_LEADER
                                    }
                                    member.rank = nextRank
                                    member.loyalty = min(100.0, member.loyalty + 15.0)
                                    onPromoteMember(member, nextRank)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                                border = BorderStroke(1.dp, GoldAccent),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(32.dp)
                            ) {
                                Text(if (isHindi) "पदोन्नति (Promote)" else "Promote", fontSize = 10.sp, color = GoldAccent, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }

    if (showRecruitDialog) {
        AlertDialog(
            onDismissRequest = { showRecruitDialog = false },
            title = { Text(if (isHindi) "प्रतिभाशाली नेता भर्ती पूल" else "Leader Recruitment Pool", color = SaffronPrimary, fontWeight = FontWeight.Bold) },
            text = {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.height(280.dp)) {
                    items(recruitPool) { recruit ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurface),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    membersList = membersList + recruit
                                    onRecruitMember(recruit)
                                    showRecruitDialog = false
                                }
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text(recruit.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextPrimary)
                                    Text("₹${recruit.monthlySalary / 1000}k/माह", fontSize = 11.sp, color = GoldAccent)
                                }
                                Text("पद: ${recruit.rank.titleHi} | नेतृत्व: ${recruit.leadership} | संवाद: ${recruit.communication}", fontSize = 10.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showRecruitDialog = false }) {
                    Text(if (isHindi) "बंद करें" else "Close", color = TextSecondary)
                }
            }
        )
    }
}
