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
fun FriendsAndPartyHubScreen(
    state: GameUIState,
    isHindi: Boolean,
    onBack: () -> Unit
) {
    var selectedHubTab by remember { mutableStateOf(0) } // 0: Members, 1: Friends, 2: Chat, 3: Leaderboard
    var searchFriendQuery by remember { mutableStateOf("") }
    var chatInputText by remember { mutableStateOf("") }
    var selectedFriendForProfile by remember { mutableStateOf<FriendAccount?>(null) }
    var showDelegateDialog by remember { mutableStateOf(false) }
    var delegateTargetFriend by remember { mutableStateOf<FriendAccount?>(null) }

    // Friends List State
    var friendsList by remember {
        mutableStateOf(
            listOf(
                FriendAccount("fr_1", "rahul_gaming", "राहुल सिंह", "person", 8, 3800, true, state.party.id, state.party.name, "वरिष्ठ राष्ट्रीय नेता", 84, 88, 76, 82, 78, 86, 18, 8, 850),
                FriendAccount("fr_2", "amit_patna", "अमित वर्मा", "person", 7, 3100, true, state.party.id, state.party.name, "प्रदेश अध्यक्ष (बिहार)", 78, 82, 80, 75, 72, 74, 12, 5, 720),
                FriendAccount("fr_3", "priya_deshmukh", "प्रिया देशमुख", "campaign", 9, 4400, true, state.party.id, state.party.name, "मुख्य मीडिया प्रबंधक", 75, 90, 85, 78, 80, 94, 22, 10, 940),
                FriendAccount("fr_4", "vikas_up", "विकास कुमार", "groups", 6, 2200, false, null, null, "निर्दलीय (Independent)", 68, 74, 65, 70, 68, 62, 8, 3, 420),
                FriendAccount("fr_5", "neha_delhi", "नेहा कपूर", "face_3", 5, 1800, true, null, null, "निर्दलीय (Independent)", 72, 80, 70, 74, 76, 82, 6, 2, 380)
            )
        )
    }

    // Party Chat Messages
    var chatMessages by remember {
        mutableStateOf(
            listOf(
                PartyChatMessage("msg_1", "p_lead", state.player.name, "राष्ट्रीय अध्यक्ष", "साथियों, आगामी चुनाव में बिहार और यूपी में घर-घर जनसंपर्क तेज करना है!", "10:15 AM", true),
                PartyChatMessage("msg_2", "fr_2", "अमित वर्मा", "बिहार प्रभारी", "अध्यक्ष जी, पटना और मुजफ्फरपुर में 50 नए बूथ कार्यकर्ता तैयार हैं।", "10:18 AM"),
                PartyChatMessage("msg_3", "fr_3", "प्रिया देशमुख", "मीडिया प्रभारी", "आज शाम 7 बजे राष्ट्रीय चैनल पर डिबेट के लिए पार्टी का श्वेतपत्र तैयार है।", "10:22 AM")
            )
        )
    }

    // Leaderboard Records
    val leaderboardRecords = remember {
        listOf(
            MemberContributionRecord("fr_3", "प्रिया देशमुख", "मुख्य मीडिया प्रबंधक", 340, 290, 160, 110, 240, 1140, 1),
            MemberContributionRecord("fr_1", "राहुल सिंह", "वरिष्ठ राष्ट्रीय नेता", 310, 270, 180, 140, 180, 1080, 2),
            MemberContributionRecord("fr_2", "अमित वर्मा", "प्रदेश अध्यक्ष (बिहार)", 280, 240, 120, 160, 150, 950, 3),
            MemberContributionRecord("p_lead", state.player.name, "राष्ट्रीय अध्यक्ष", 220, 200, 200, 100, 160, 880, 4)
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Header
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = if (isHindi) "मल्टीप्लेयर पार्टी एवं मित्र केंद्र" else "Multiplayer Party & Friends Hub",
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = SaffronPrimary
                            )
                            Text(
                                text = "पार्टी: ${state.party.name} (कोड: JSP-9821)",
                                fontSize = 11.sp,
                                color = GoldAccent
                            )
                        }
                        Surface(
                            color = DeepNavy,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, SaffronPrimary)
                        ) {
                            Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(IndiaGreen))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("4 मित्र ऑनलाइन", fontSize = 11.sp, color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // 4-Tab Navigation Selector
        item {
            TabRow(
                selectedTabIndex = selectedHubTab,
                containerColor = DarkSurface,
                contentColor = SaffronPrimary,
                modifier = Modifier.clip(RoundedCornerShape(10.dp))
            ) {
                Tab(
                    selected = selectedHubTab == 0,
                    onClick = { selectedHubTab = 0 },
                    text = { Text(if (isHindi) "पार्टी सदस्य" else "Members", fontSize = 11.sp) }
                )
                Tab(
                    selected = selectedHubTab == 1,
                    onClick = { selectedHubTab = 1 },
                    text = { Text(if (isHindi) "मित्र सूची" else "Friends", fontSize = 11.sp) }
                )
                Tab(
                    selected = selectedHubTab == 2,
                    onClick = { selectedHubTab = 2 },
                    text = { Text(if (isHindi) "पार्टी चैट" else "Chat", fontSize = 11.sp) }
                )
                Tab(
                    selected = selectedHubTab == 3,
                    onClick = { selectedHubTab = 3 },
                    text = { Text(if (isHindi) "लीडरबोर्ड" else "Ranks", fontSize = 11.sp) }
                )
            }
        }

        // Tab Content Switching
        when (selectedHubTab) {
            0 -> {
                // TAB 0: Party Members & Task Delegation
                item {
                    Text(
                        text = if (isHindi) "सक्रिय पार्टी सदस्य व क्षेत्रीय प्रभार" else "Active Party Members & Region Delegation",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }

                items(friendsList.filter { it.currentPartyId == state.party.id }) { member ->
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
                                        modifier = Modifier.size(36.dp).clip(CircleShape).background(DeepNavy),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(Icons.Default.Person, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(20.dp))
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(member.displayName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 13.sp)
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(if (member.isOnline) IndiaGreen else TextSecondary))
                                        }
                                        Text(member.currentPartyRole, fontSize = 11.sp, color = GoldAccent)
                                    }
                                }

                                Button(
                                    onClick = {
                                        delegateTargetFriend = member
                                        showDelegateDialog = true
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                    modifier = Modifier.height(28.dp)
                                ) {
                                    Text(if (isHindi) "कार्य सौंपें (Assign)" else "Assign Task", fontSize = 10.sp, color = Color.Black, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "योगदान अंक: ${member.contributionPoints} pts | चुनाव जीत: ${member.totalCampaignsWon} | स्तर: Lv.${member.level}",
                                fontSize = 10.sp,
                                color = TextSecondary
                            )
                        }
                    }
                }
            }

            1 -> {
                // TAB 1: Friends List & Search / Add
                item {
                    OutlinedTextField(
                        value = searchFriendQuery,
                        onValueChange = { searchFriendQuery = it },
                        placeholder = { Text(if (isHindi) "मित्र खोजें (Username / Player ID)" else "Search Friend ID...") },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SaffronPrimary) },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                items(friendsList.filter { it.username.contains(searchFriendQuery, ignoreCase = true) || it.displayName.contains(searchFriendQuery, ignoreCase = true) }) { friend ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier.size(36.dp).clip(CircleShape).background(DeepNavy),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Person, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(20.dp))
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(friend.displayName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 13.sp)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("(@${friend.username})", fontSize = 10.sp, color = TextSecondary)
                                    }
                                    Text(
                                        text = if (friend.isOnline) "🟢 ऑनलाइन" else "⚪ ऑफलाइन",
                                        fontSize = 10.sp,
                                        color = if (friend.isOnline) IndiaGreen else TextSecondary
                                    )
                                }
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { selectedFriendForProfile = friend },
                                    colors = ButtonDefaults.buttonColors(containerColor = DarkSurface),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                    modifier = Modifier.height(28.dp)
                                ) {
                                    Text(if (isHindi) "प्रोफाइल" else "Profile", fontSize = 10.sp, color = TextPrimary)
                                }

                                if (friend.currentPartyId == null) {
                                    Button(
                                        onClick = {
                                            friendsList = friendsList.map {
                                                if (it.playerId == friend.playerId) it.copy(
                                                    currentPartyId = state.party.id,
                                                    currentPartyName = state.party.name,
                                                    currentPartyRole = "प्रदेश अध्यक्ष (बिहार)"
                                                ) else it
                                            }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                        modifier = Modifier.height(28.dp)
                                    ) {
                                        Text(if (isHindi) "पार्टी आमंत्रण" else "Invite", fontSize = 10.sp, color = Color.Black, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            2 -> {
                // TAB 2: In-Game Party Chat & Announcements
                items(chatMessages) { msg ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = if (msg.isAnnouncement) Color(0xFF1E1B4B) else DarkSurface),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("${msg.senderName} (${msg.senderRole})", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = SaffronPrimary)
                                Text(msg.timestamp, fontSize = 10.sp, color = TextSecondary)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(msg.messageText, fontSize = 13.sp, color = TextPrimary)
                        }
                    }
                }

                item {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = chatInputText,
                            onValueChange = { chatInputText = it },
                            placeholder = { Text(if (isHindi) "रणनीतिक संदेश लिखें..." else "Type strategy message...") },
                            modifier = Modifier.weight(1f)
                        )
                        Button(
                            onClick = {
                                if (chatInputText.isNotBlank()) {
                                    chatMessages = chatMessages + PartyChatMessage(
                                        messageId = "msg_${System.currentTimeMillis()}",
                                        senderPlayerId = "p_lead",
                                        senderName = state.player.name,
                                        senderRole = "राष्ट्रीय अध्यक्ष",
                                        messageText = chatInputText,
                                        timestamp = "अभी (Now)",
                                        isAnnouncement = true
                                    )
                                    chatInputText = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                            modifier = Modifier.height(54.dp)
                        ) {
                            Icon(Icons.Default.Send, contentDescription = null, tint = Color.Black)
                        }
                    }
                }
            }

            3 -> {
                // TAB 3: Contribution Leaderboard
                item {
                    Text(
                        text = if (isHindi) "पार्टी योगदान लीडरबोर्ड (Contribution Ranks)" else "Party Contribution Leaderboard",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccent
                    )
                }

                items(leaderboardRecords) { rec ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    color = when (rec.rankPosition) {
                                        1 -> GoldAccent
                                        2 -> Color(0xFFCBD5E1)
                                        3 -> Color(0xFFB45309)
                                        else -> DarkSurface
                                    },
                                    shape = CircleShape,
                                    modifier = Modifier.size(26.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text("#${rec.rankPosition}", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Black)
                                    }
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(rec.playerName, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 13.sp)
                                    Text(rec.roleTitle, fontSize = 10.sp, color = TextSecondary)
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text("${rec.totalPoints} pts", fontWeight = FontWeight.Bold, color = SaffronPrimary, fontSize = 14.sp)
                                Text("अभियान: ${rec.campaignContribution} | मीडिया: ${rec.mediaContribution}", fontSize = 9.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            }
        }
    }

    // Friend Profile Dialog
    if (selectedFriendForProfile != null) {
        val fr = selectedFriendForProfile!!
        AlertDialog(
            onDismissRequest = { selectedFriendForProfile = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AccountCircle, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(fr.displayName, fontWeight = FontWeight.Bold, color = TextPrimary)
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Player ID: ${fr.playerId} | @${fr.username}", fontSize = 11.sp, color = TextSecondary)
                    Text("पार्टी: ${fr.currentPartyName ?: "स्वतंत्र प्रत्याशी"}", fontSize = 12.sp, color = GoldAccent, fontWeight = FontWeight.Bold)
                    Divider(color = DarkBorder, modifier = Modifier.padding(vertical = 4.dp))
                    Text("नेतृत्व क्षमता: ${fr.leadership}/100", fontSize = 11.sp, color = TextPrimary)
                    Text("संवाद कौशल: ${fr.communication}/100", fontSize = 11.sp, color = TextPrimary)
                    Text("राजनीतिक रणनीति: ${fr.strategy}/100", fontSize = 11.sp, color = TextPrimary)
                    Text("मीडिया प्रबंधन: ${fr.mediaHandling}/100", fontSize = 11.sp, color = TextPrimary)
                    Text("कुल चुनावी जीत: ${fr.totalCampaignsWon} विजयी अभियान", fontSize = 11.sp, color = IndiaGreen, fontWeight = FontWeight.Bold)
                }
            },
            confirmButton = {
                TextButton(onClick = { selectedFriendForProfile = null }) {
                    Text(if (isHindi) "बंद करें" else "Close", color = SaffronPrimary)
                }
            }
        )
    }

    // Delegate Task Dialog
    if (showDelegateDialog && delegateTargetFriend != null) {
        val target = delegateTargetFriend!!
        AlertDialog(
            onDismissRequest = { showDelegateDialog = false },
            title = { Text("मित्र को चुनावी दायित्व सौंपें", fontWeight = FontWeight.Bold, color = SaffronPrimary) },
            text = {
                Column {
                    Text("प्रभारी: ${target.displayName}", fontWeight = FontWeight.Bold, color = TextPrimary)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("दायित्व: बिहार राज्य में सघन जनसंपर्क व बूथ प्रबंधन", fontSize = 12.sp, color = TextSecondary)
                    Text("लक्ष्य: राज्य में जनविश्वास 65% तक ले जाना", fontSize = 12.sp, color = IndiaGreen)
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        chatMessages = chatMessages + PartyChatMessage(
                            messageId = "msg_${System.currentTimeMillis()}",
                            senderPlayerId = "p_lead",
                            senderName = state.player.name,
                            senderRole = "राष्ट्रीय अध्यक्ष",
                            messageText = "🎯 ${target.displayName} को बिहार राज्य अभियान का प्रभार सौंपा गया।",
                            timestamp = "अभी (Now)",
                            isAnnouncement = true
                        )
                        showDelegateDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary)
                ) {
                    Text("आदेश जारी करें (Dispatch)", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDelegateDialog = false }) {
                    Text("रद्द करें", color = TextSecondary)
                }
            }
        )
    }
}
