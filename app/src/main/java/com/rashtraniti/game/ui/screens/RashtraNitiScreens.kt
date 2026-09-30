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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.*
import com.rashtraniti.game.engine.CrisisEngine
import com.rashtraniti.game.engine.QuizRepository
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUIState
import com.rashtraniti.game.viewmodel.RashtraNitiViewModel

import com.rashtraniti.game.ui.components.BackgroundMode
import com.rashtraniti.game.ui.components.DynamicGameBackground

@Composable
fun RashtraNitiMainApp(viewModel: RashtraNitiViewModel) {
    val state by viewModel.uiState.collectAsState()

    val currentBgMode = when (state.currentScreen) {
        "MAIN_HOME" -> BackgroundMode.HOME
        "MAP" -> BackgroundMode.MAP
        "CAMPAIGN" -> BackgroundMode.CAMPAIGN
        "PARLIAMENT" -> BackgroundMode.PRIME_MINISTER
        "PM_DASHBOARD" -> BackgroundMode.PRIME_MINISTER
        "ELECTION_DAY" -> BackgroundMode.ELECTION
        "CRISIS" -> when (state.activeCrisis?.category) {
            "DISASTER" -> BackgroundMode.CRISIS_FLOOD
            "ECONOMY" -> BackgroundMode.CRISIS_ECONOMY
            "MEDIA_TRIAL" -> BackgroundMode.MEDIA
            else -> BackgroundMode.CRISIS_POLITICAL
        }
        else -> BackgroundMode.HOME
    }

    DynamicGameBackground(mode = currentBgMode) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top App Bar with Resources (Shown after opening screen)
            if (state.currentScreen != "CINEMATIC" && state.currentScreen != "PLAYER_CREATE" && state.currentScreen != "PARTY_CREATE") {
                TopResourceStatusBar(state = state, onLangToggle = { viewModel.setLanguage(!state.isHindi) })
            }

            // Screen Content
            Box(modifier = Modifier.weight(1f)) {
                when (state.currentScreen) {
                    "CINEMATIC" -> OpeningCinematicView(
                        isHindi = state.isHindi,
                        onStart = { viewModel.navigateTo("PLAYER_CREATE") },
                        onToggleLang = { viewModel.setLanguage(!state.isHindi) }
                    )
                    "PLAYER_CREATE" -> PlayerCreationView(
                        isHindi = state.isHindi,
                        onComplete = { name, age, stateName, dist, const ->
                            viewModel.updatePlayerProfile(name, age, stateName, dist, const)
                        }
                    )
                    "PARTY_CREATE" -> PartyCreationView(
                        isHindi = state.isHindi,
                        onComplete = { name, shortName, slogan, color, prio ->
                            viewModel.updatePartyDetails(name, shortName, slogan, color, prio)
                        }
                    )
                    "MAIN_HOME" -> MainHomeDashboardView(
                        state = state,
                        onNavigate = { viewModel.navigateTo(it) },
                        onConductElection = { viewModel.conductElection() },
                        onTriggerCrisisSample = { viewModel.triggerCrisis(CrisisEngine.getSampleCrises().first()) }
                    )
                    "MAP" -> InteractiveConstituencyMapView(
                        state = state,
                        onZoomChange = { viewModel.setMapZoom(it) }
                    )
                    "CAMPAIGN" -> CampaignManagementView(
                        state = state,
                        onExecuteCampaign = { viewModel.executeCampaign(it) }
                    )
                    "PARLIAMENT" -> ParliamentView(
                        state = state,
                        onPassBill = { viewModel.passBillInParliament(it) }
                    )
                    "PM_DASHBOARD" -> PrimeMinisterDashboardView(
                        state = state,
                        onUpdateBudget = { ministry, percent -> viewModel.updateBudgetSlider(ministry, percent) }
                    )
                    "QUIZ" -> QuizView(
                        state = state,
                        onAnswer = { qIdx, optIdx -> viewModel.answerQuiz(qIdx, optIdx) }
                    )
                    "CRISIS" -> state.activeCrisis?.let { crisis ->
                        CrisisAlertView(
                            crisis = crisis,
                            isHindi = state.isHindi,
                            onSelectChoice = { choice -> viewModel.resolveCrisis(choice) }
                        )
                    }
                    "ELECTION_DAY" -> state.lastElectionResult?.let { result ->
                        ElectionResultsView(
                            state = state,
                            result = result,
                            onContinue = { viewModel.navigateTo("MAIN_HOME") }
                        )
                    }
                    else -> MainHomeDashboardView(
                        state = state,
                        onNavigate = { viewModel.navigateTo(it) },
                        onConductElection = { viewModel.conductElection() },
                        onTriggerCrisisSample = { viewModel.triggerCrisis(CrisisEngine.getSampleCrises().first()) }
                    )
                }
            }

            // Bottom Navigation Bar (Shown on gameplay screens)
            if (state.currentScreen != "CINEMATIC" && state.currentScreen != "PLAYER_CREATE" && state.currentScreen != "PARTY_CREATE" && state.currentScreen != "CRISIS" && state.currentScreen != "ELECTION_DAY") {
                BottomNavBar(
                    currentScreen = state.currentScreen,
                    isPM = state.player.level.levelIndex >= 10,
                    isHindi = state.isHindi,
                    onSelect = { viewModel.navigateTo(it) }
                )
            }
        }
    }
}

@Composable
fun TopResourceStatusBar(state: GameUIState, onLangToggle: () -> Unit) {
    Surface(
        color = DeepNavy,
        tonalElevation = 4.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = state.player.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = SaffronPrimary
                )
                Text(
                    text = if (state.isHindi) state.player.level.titleHi else state.player.level.titleEn,
                    fontSize = 11.sp,
                    color = TextSecondary
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                // Funds
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AccountBalanceWallet, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("₹${state.party.partyFunds / 1000}k", fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                }

                // Trust
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Favorite, contentDescription = null, tint = AccentRed, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("${state.player.publicTrust.toInt()}%", fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.SemiBold)
                }

                // Lang Toggle
                Button(
                    onClick = onLangToggle,
                    colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Text(if (state.isHindi) "EN" else "हिन्दी", fontSize = 11.sp, color = SaffronPrimary)
                }
            }
        }
    }
}

@Composable
fun OpeningCinematicView(
    isHindi: Boolean,
    onStart: () -> Unit,
    onToggleLang: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0F172A),
                        Color(0xFF1E1B4B),
                        Color(0xFF090D16)
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(24.dp)
        ) {
            // Emblem / Flag Icon
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.sweepGradient(
                            colors = listOf(SaffronPrimary, Color.White, IndiaGreen, SaffronPrimary)
                        )
                    )
                    .padding(4.dp)
                    .clip(CircleShape)
                    .background(DeepNavy),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.AccountBalance,
                    contentDescription = null,
                    tint = SaffronPrimary,
                    modifier = Modifier.size(48.dp)
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = if (isHindi) "राष्ट्रनीति" else "RashtraNiti",
                fontSize = 36.sp,
                fontWeight = FontWeight.ExtraBold,
                color = SaffronPrimary,
                letterSpacing = 2.sp
            )

            Text(
                text = if (isHindi) "“एक आम आदमी से प्रधानमंत्री तक”" else "“From Common Citizen to Prime Minister”",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = GoldAccent,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground.copy(alpha = 0.85f)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (isHindi) "यह देश आपका है।\nअब फैसला आपका है।" else "This nation is yours.\nNow the choice is yours.",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = if (isHindi) "क्या एक आम नागरिक देश का प्रधानमंत्री बन सकता है?" else "Can a common citizen become the Prime Minister of Bharat?",
                        fontSize = 14.sp,
                        color = TextSecondary,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            Button(
                onClick = onStart,
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Text(
                    text = if (isHindi) "यात्रा शुरू करें" else "Start Your Journey",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = onToggleLang) {
                Text(
                    text = if (isHindi) "Switch to English" else "हिन्दी में बदलें",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            }
        }
    }
}

@Composable
fun PlayerCreationView(
    isHindi: Boolean,
    onComplete: (String, Int, String, String, String) -> Unit
) {
    var name by remember { mutableStateOf("आलोक शर्मा") }
    var age by remember { mutableStateOf("32") }
    var stateName by remember { mutableStateOf("उत्तर प्रदेश") }
    var district by remember { mutableStateOf("वाराणसी") }
    var constituency by remember { mutableStateOf("वाराणसी उत्तर") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        item {
            Text(
                text = if (isHindi) "चरित्र निर्माण (Player Creation)" else "Player Profile Creation",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = SaffronPrimary
            )
            Text(
                text = if (isHindi) "अपनी राजनीतिक पहचान व गृह क्षेत्र चुनें" else "Set up your political identity & home constituency",
                fontSize = 13.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(24.dp))

            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text(if (isHindi) "प्रत्याशी का नाम" else "Candidate Name") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = age,
                onValueChange = { age = it },
                label = { Text(if (isHindi) "आयु (वर्ष)" else "Age (Years)") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = stateName,
                onValueChange = { stateName = it },
                label = { Text(if (isHindi) "राज्य" else "State") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = district,
                onValueChange = { district = it },
                label = { Text(if (isHindi) "गृह जनपद / जिला" else "Home District") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = constituency,
                onValueChange = { constituency = it },
                label = { Text(if (isHindi) "निर्वाचन क्षेत्र (Constituency)" else "Constituency") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                onClick = {
                    onComplete(name, age.toIntOrNull() ?: 32, stateName, district, constituency)
                },
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text(
                    text = if (isHindi) "अगला: पार्टी का गठन करें" else "Next: Create Political Party",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
        }
    }
}

@Composable
fun PartyCreationView(
    isHindi: Boolean,
    onComplete: (String, String, String, String, String) -> Unit
) {
    var partyName by remember { mutableStateOf("जन स्वाभिमान पार्टी") }
    var shortName by remember { mutableStateOf("JSP") }
    var slogan by remember { mutableStateOf("न्याय, विकास और राष्ट्र निर्माण") }
    var selectedPriority by remember { mutableStateOf("शिक्षा एवं रोजगार (Education & Employment)") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        item {
            Text(
                text = if (isHindi) "राजनीतिक पार्टी गठन" else "Form Political Party",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = SaffronPrimary
            )
            Text(
                text = if (isHindi) "अपनी काल्पनिक पार्टी का नाम, प्रतीक व सिद्धांत तय करें" else "Define your fictional party brand, symbol & manifesto",
                fontSize = 13.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(20.dp))

            OutlinedTextField(
                value = partyName,
                onValueChange = { partyName = it },
                label = { Text(if (isHindi) "पार्टी का पूरा नाम" else "Full Party Name") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = shortName,
                onValueChange = { shortName = it },
                label = { Text(if (isHindi) "संक्षिप्त नाम (Short Code)" else "Party Acronym") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = slogan,
                onValueChange = { slogan = it },
                label = { Text(if (isHindi) "पार्टी का मुख्य नारा (Slogan)" else "Party Slogan") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                onClick = {
                    onComplete(partyName, shortName, slogan, "#FF9933", selectedPriority)
                },
                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text(
                    text = if (isHindi) "पंजीकरण संपन्न करें व खेलें" else "Register Party & Enter Bharat",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
        }
    }
}

@Composable
fun MainHomeDashboardView(
    state: GameUIState,
    onNavigate: (String) -> Unit,
    onConductElection: () -> Unit,
    onTriggerCrisisSample: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Objective Banner
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (state.isHindi) "वर्तमान उद्देश्य" else "Current Objective",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = SaffronPrimary
                        )
                        Surface(
                            color = AccentRed.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = if (state.isHindi) "चुनाव: ${state.electionDaysRemaining} दिन शेष" else "Election: ${state.electionDaysRemaining} Days Left",
                                fontSize = 11.sp,
                                color = AccentRed,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = if (state.isHindi) state.electionObjectiveHi else state.electionObjectiveEn,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = onConductElection,
                        colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.HowToVote, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (state.isHindi) "मतदान दिवस शुरू करें (Conduct Polling)" else "Conduct Election Polling",
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // Stats Grid
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard(
                    title = if (state.isHindi) "पार्टी लोकप्रियता" else "Party Popularity",
                    value = "${state.party.overallPopularity.toInt()}%",
                    icon = Icons.Default.TrendingUp,
                    tint = SaffronPrimary,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = if (state.isHindi) "जनता का विश्वास" else "Public Trust",
                    value = "${state.player.publicTrust.toInt()}%",
                    icon = Icons.Default.Favorite,
                    tint = AccentRed,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Quick Actions Grid
        item {
            Text(
                text = if (state.isHindi) "रणनीतिक कार्य" else "Strategic Actions",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }

        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    ActionTile(
                        title = if (state.isHindi) "जनसंपर्क व प्रचार" else "Campaign & Rallies",
                        icon = Icons.Default.Campaign,
                        tint = SaffronPrimary,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("CAMPAIGN") }
                    )
                    ActionTile(
                        title = if (state.isHindi) "भारत नक्शा" else "India Map",
                        icon = Icons.Default.Map,
                        tint = IndiaGreen,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("MAP") }
                    )
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    ActionTile(
                        title = if (state.isHindi) "राजनीतिक क्विज़" else "Civics & Law Quiz",
                        icon = Icons.Default.School,
                        tint = GoldAccent,
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("QUIZ") }
                    )
                    ActionTile(
                        title = if (state.isHindi) "संसद व विधेयक" else "Parliament Floor",
                        icon = Icons.Default.AccountBalance,
                        tint = Color(0xFF60A5FA),
                        modifier = Modifier.weight(1f),
                        onClick = { onNavigate("PARLIAMENT") }
                    )
                }

                if (state.player.level.levelIndex >= 9) {
                    ActionTile(
                        title = if (state.isHindi) "प्रधानमंत्री कार्यालय एवं राष्ट्रीय बजट" else "PM Dashboard & National Budget",
                        icon = Icons.Default.PieChart,
                        tint = GoldAccent,
                        modifier = Modifier.fillMaxWidth(),
                        onClick = { onNavigate("PM_DASHBOARD") }
                    )
                }

                Button(
                    onClick = onTriggerCrisisSample,
                    colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                    border = BorderStroke(1.dp, AccentRed.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = AccentRed)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (state.isHindi) "अचानक राष्ट्रीय संकट का सामना करें" else "Trigger Sudden Crisis Event",
                        color = AccentRed,
                        fontSize = 13.sp
                    )
                }
            }
        }

        // Live News & Alerts
        item {
            Text(
                text = if (state.isHindi) "ताज़ा राजनीतिक समाचार व सूचनाएं" else "Live News & Notifications",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                state.recentNotifications.forEach { note ->
                    Surface(
                        color = DarkSurface,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Notifications, contentDescription = null, tint = GoldAccent, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = note, fontSize = 12.sp, color = TextPrimary)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(title: String, value: String, icon: ImageVector, tint: Color, modifier: Modifier = Modifier) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, fontSize = 12.sp, color = TextSecondary)
                Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
        }
    }
}

@Composable
fun ActionTile(title: String, icon: ImageVector, tint: Color, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier.clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(tint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
        }
    }
}

@Composable
fun InteractiveConstituencyMapView(state: GameUIState, onZoomChange: (Int) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = if (state.isHindi) "भारत राजनीतिक मानचित्र" else "Bharat Political Map",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = SaffronPrimary
                )
                Text(
                    text = when (state.zoomMapLevel) {
                        1 -> if (state.isHindi) "स्तर 1: संपूर्ण भारत (National)" else "Level 1: All India Map"
                        2 -> if (state.isHindi) "स्तर 2: गृह राज्य (${state.player.state})" else "Level 2: State Map (${state.player.state})"
                        3 -> if (state.isHindi) "स्तर 3: गृह जनपद (${state.player.district})" else "Level 3: District Map (${state.player.district})"
                        else -> if (state.isHindi) "स्तर 4: निर्वाचन क्षेत्र (${state.player.constituency})" else "Level 4: Constituency Map (${state.player.constituency})"
                    },
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Button(
                    onClick = { onZoomChange(state.zoomMapLevel - 1) },
                    enabled = state.zoomMapLevel > 1,
                    colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Text("-")
                }
                Button(
                    onClick = { onZoomChange(state.zoomMapLevel + 1) },
                    enabled = state.zoomMapLevel < 4,
                    colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Text("+")
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Map Canvas Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(260.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(DeepNavy)
                .border(1.dp, CardBackground, RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                // Background grid
                val gridSpacing = 40f
                for (x in 0 until size.width.toInt() step gridSpacing.toInt()) {
                    drawLine(Color(0xFF1E293B), start = androidx.compose.ui.geometry.Offset(x.toFloat(), 0f), end = androidx.compose.ui.geometry.Offset(x.toFloat(), size.height), strokeWidth = 1f)
                }
                for (y in 0 until size.height.toInt() step gridSpacing.toInt()) {
                    drawLine(Color(0xFF1E293B), start = androidx.compose.ui.geometry.Offset(0f, y.toFloat()), end = androidx.compose.ui.geometry.Offset(size.width, y.toFloat()), strokeWidth = 1f)
                }

                // Simulated India geographic shape centroid
                drawCircle(
                    color = SaffronPrimary.copy(alpha = 0.3f),
                    radius = 90f * state.zoomMapLevel,
                    center = center
                )
                drawCircle(
                    color = IndiaGreen,
                    radius = 12f,
                    center = center
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Place, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(32.dp))
                Text(
                    text = "${state.player.constituency} (${state.player.state})",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Text(
                    text = if (state.isHindi) "पार्टी समर्थन: ${state.party.overallPopularity.toInt()}%" else "Support: ${state.party.overallPopularity.toInt()}%",
                    color = GoldAccent,
                    fontSize = 12.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = if (state.isHindi) "निर्वाचन क्षेत्र सूची व जनसांख्यिकी" else "Constituencies & Demographic Ratio",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(state.constituencies) { c ->
                Surface(
                    color = CardBackground,
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(c.name, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                            Text("${c.district}, ${c.state} • ${c.totalVoters / 1000}k मतदाता", color = TextSecondary, fontSize = 11.sp)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${c.playerSupport.toInt()}% समर्थन",
                                color = if (c.playerSupport >= 45.0) IndiaGreen else GoldAccent,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                            Text(if (c.isUnlocked) "सक्रिय" else "प्रगति पर", color = TextSecondary, fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CampaignManagementView(state: GameUIState, onExecuteCampaign: (CampaignType) -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = if (state.isHindi) "प्रचार एवं जनसंवाद रणनीतियां" else "Campaign & Public Outreach Options",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = SaffronPrimary
            )
            Text(
                text = if (state.isHindi) "प्रत्येक अभियान से पार्टी साख, ऊर्जा व कोष पर प्रभाव पड़ता है" else "Each campaign action consumes resources to build voter base",
                fontSize = 12.sp,
                color = TextSecondary
            )
        }

        items(CampaignType.values()) { type ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
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
                            text = if (state.isHindi) type.titleHi else type.titleEn,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "₹${type.baseCost / 1000}k | -${type.energyCost}⚡",
                            fontSize = 12.sp,
                            color = GoldAccent,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("जनविश्वास: +${type.trustBoost}%", fontSize = 11.sp, color = IndiaGreen)
                        Text("लोकप्रियता: +${type.popularityBoost}%", fontSize = 11.sp, color = SaffronPrimary)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = { onExecuteCampaign(type) },
                        enabled = state.party.partyFunds >= type.baseCost && state.player.energy >= type.energyCost,
                        colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = if (state.isHindi) "आयोजित करें" else "Launch Campaign",
                            color = Color.Black,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ParliamentView(state: GameUIState, onPassBill: (ParliamentBill) -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = if (state.isHindi) "संसद भवन (लोकसभा सत्र)" else "Parliament House (Lok Sabha Session)",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = SaffronPrimary
            )
            Text(
                text = if (state.isHindi) "विधेयक पारित करें, नीतियों पर मतदान कराएं" else "Pass reforms, debate national bills and secure majority",
                fontSize = 12.sp,
                color = TextSecondary
            )
        }

        items(state.parliamentaryBills) { bill ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
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
                            text = if (state.isHindi) bill.titleHi else bill.titleEn,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary,
                            modifier = Modifier.weight(1f)
                        )
                        Surface(
                            color = if (bill.isPassed) IndiaGreen.copy(alpha = 0.2f) else GoldAccent.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = if (bill.isPassed) (if (state.isHindi) "पारित" else "PASSED") else (if (state.isHindi) "लंबित" else "PENDING"),
                                color = if (bill.isPassed) IndiaGreen else GoldAccent,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = if (state.isHindi) bill.summaryHi else bill.summaryEn,
                        fontSize = 12.sp,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    if (!bill.isPassed) {
                        Button(
                            onClick = { onPassBill(bill) },
                            colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color.White)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (state.isHindi) "विधेयक पर मतदान कराएं (Ayes: 318)" else "Put to Vote (Ayes: 318)",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    } else {
                        Text(
                            text = "मतदान परिणाम: पक्ष में ${bill.ayesVotes} | विपक्ष में ${bill.noesVotes}",
                            fontSize = 11.sp,
                            color = IndiaGreen
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun PrimeMinisterDashboardView(state: GameUIState, onUpdateBudget: (MinistryType, Double) -> Unit) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                text = if (state.isHindi) "प्रधानमंत्री डैशबोर्ड (राष्ट्र प्रबंधन)" else "Prime Minister Dashboard",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = SaffronPrimary
            )
            Text(
                text = if (state.isHindi) "राष्ट्रीय अर्थव्यवस्था व 11 मंत्रालयों का बजट प्रबंधन" else "National macro-economy & 11 ministerial budget allocations",
                fontSize = 12.sp,
                color = TextSecondary
            )
        }

        // Macro Indicators
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard(
                    title = "GDP Growth",
                    value = "${String.format("%.1f", state.economy.gdpGrowthRate)}%",
                    icon = Icons.Default.TrendingUp,
                    tint = IndiaGreen,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Inflation",
                    value = "${String.format("%.1f", state.economy.inflationRate)}%",
                    icon = Icons.Default.ShowChart,
                    tint = AccentRed,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatCard(
                    title = if (state.isHindi) "सरकार अनुमोदन" else "Approval Rating",
                    value = "${state.economy.governmentApprovalRate.toInt()}%",
                    icon = Icons.Default.ThumbUp,
                    tint = SaffronPrimary,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = if (state.isHindi) "नागरिक संतुष्टि" else "Public Happiness",
                    value = "${state.economy.publicSatisfactionRate.toInt()}%",
                    icon = Icons.Default.Mood,
                    tint = GoldAccent,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Text(
                text = if (state.isHindi) "केंद्रीय बजट आवंटन (11 मंत्रालय)" else "Union Budget Allocation (11 Ministries)",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }

        items(MinistryType.values()) { minType ->
            val percent = state.ministryAllocations[minType] ?: 10.0
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (state.isHindi) minType.nameHi else minType.nameEn,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = TextPrimary
                        )
                        Text(
                            text = "${percent.toInt()}%",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = SaffronPrimary
                        )
                    }

                    Slider(
                        value = percent.toFloat(),
                        onValueChange = { onUpdateBudget(minType, it.toDouble()) },
                        valueRange = 2f..30f,
                        colors = SliderDefaults.colors(
                            thumbColor = SaffronPrimary,
                            activeTrackColor = SaffronPrimary,
                            inactiveTrackColor = DarkSurface
                        )
                    )
                }
            }
        }
    }
}

@Composable
fun QuizView(state: GameUIState, onAnswer: (Int, Int) -> Unit) {
    val questions = QuizRepository.getQuestions()
    val q = questions.getOrNull(state.currentQuizIndex) ?: questions.first()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (state.isHindi) "राजनीतिक व संवैधानिक क्विज़" else "Constitutional & Civics Quiz",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = SaffronPrimary
                )
                Surface(
                    color = GoldAccent.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        text = "अंक: ${state.quizScore}",
                        color = GoldAccent,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "श्रेणी: ${q.category}",
                        fontSize = 11.sp,
                        color = SaffronPrimary,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (state.isHindi) q.questionHi else q.questionEn,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextPrimary,
                        lineHeight = 22.sp
                    )
                }
            }
        }

        val options = if (state.isHindi) q.optionsHi else q.optionsEn
        items(options.indices.toList()) { index ->
            Button(
                onClick = { onAnswer(state.currentQuizIndex, index) },
                colors = ButtonDefaults.buttonColors(containerColor = DarkSurface),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CardBackground, RoundedCornerShape(10.dp))
            ) {
                Text(
                    text = "${index + 1}. ${options[index]}",
                    color = TextPrimary,
                    fontSize = 13.sp,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                )
            }
        }
    }
}

@Composable
fun CrisisAlertView(
    crisis: CrisisEvent,
    isHindi: Boolean,
    onSelectChoice: (CrisisChoice) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF450A0A)),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = AccentRed, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isHindi) "आपातकालीन राष्ट्रीय संकट चेतावनी" else "Emergency National Crisis Alert",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = AccentRed
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isHindi) crisis.titleHi else crisis.titleEn,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = if (isHindi) crisis.descriptionHi else crisis.descriptionEn,
                        fontSize = 13.sp,
                        color = TextSecondary,
                        lineHeight = 18.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "प्रभावित क्षेत्र: ${crisis.affectedRegion}",
                        fontSize = 12.sp,
                        color = GoldAccent
                    )
                }
            }
        }

        item {
            Text(
                text = if (isHindi) "कार्यकारी निर्णय विकल्प (Choose Course of Action)" else "Executive Response Choices",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }

        items(crisis.choices) { choice ->
            Card(
                colors = CardDefaults.cardColors(containerColor = CardBackground),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onSelectChoice(choice) }
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (isHindi) choice.textHi else choice.textEn,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        if (choice.costMoneyCrore > 0) {
                            Text("लागत: ₹${choice.costMoneyCrore} करोड़", fontSize = 11.sp, color = AccentRed)
                        }
                        Text("जोखिम: ${choice.riskPercent}%", fontSize = 11.sp, color = GoldAccent)
                        Text("जनविश्वास: ${if (choice.publicTrustDelta >= 0) "+" else ""}${choice.publicTrustDelta}%", fontSize = 11.sp, color = IndiaGreen)
                    }
                }
            }
        }
    }
}

@Composable
fun ElectionResultsView(
    state: GameUIState,
    result: com.rashtraniti.game.engine.ElectionEngine.ElectionResult,
    onContinue: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBackground),
        contentAlignment = Alignment.Center
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    if (result.isWon) Icons.Default.EmojiEvents else Icons.Default.SentimentDissatisfied,
                    contentDescription = null,
                    tint = if (result.isWon) GoldAccent else AccentRed,
                    modifier = Modifier.size(56.dp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = if (result.isWon) (if (state.isHindi) "शानदार चुनावी विजय!" else "HISTORIC VICTORY!") else (if (state.isHindi) "चुनावी परिणाम" else "ELECTION RESULT"),
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (result.isWon) IndiaGreen else AccentRed
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "${state.player.constituency} निर्वाचन क्षेत्र",
                    fontSize = 15.sp,
                    color = TextPrimary,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(state.party.shortName, color = SaffronPrimary, fontWeight = FontWeight.Bold)
                    Text("${result.playerVotePercent.toInt()}% (${result.playerVotes} मत)", color = TextPrimary)
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("विपक्ष (Opposition)", color = TextSecondary)
                    Text("${result.opponentVotePercent.toInt()}% (${result.opponentVotes} मत)", color = TextPrimary)
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = onContinue,
                    colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = if (state.isHindi) "आगे बढ़ें" else "Proceed",
                        color = Color.Black,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
fun BottomNavBar(
    currentScreen: String,
    isPM: Boolean,
    isHindi: Boolean,
    onSelect: (String) -> Unit
) {
    NavigationBar(
        containerColor = DeepNavy,
        tonalElevation = 8.dp
    ) {
        NavigationBarItem(
            selected = currentScreen == "MAIN_HOME",
            onClick = { onSelect("MAIN_HOME") },
            icon = { Icon(Icons.Default.Home, contentDescription = null) },
            label = { Text(if (isHindi) "होम" else "Home", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = currentScreen == "MAP",
            onClick = { onSelect("MAP") },
            icon = { Icon(Icons.Default.Map, contentDescription = null) },
            label = { Text(if (isHindi) "नक्शा" else "Map", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = currentScreen == "CAMPAIGN",
            onClick = { onSelect("CAMPAIGN") },
            icon = { Icon(Icons.Default.Campaign, contentDescription = null) },
            label = { Text(if (isHindi) "प्रचार" else "Campaign", fontSize = 10.sp) }
        )
        NavigationBarItem(
            selected = currentScreen == "PARLIAMENT",
            onClick = { onSelect("PARLIAMENT") },
            icon = { Icon(Icons.Default.AccountBalance, contentDescription = null) },
            label = { Text(if (isHindi) "संसद" else "Parliament", fontSize = 10.sp) }
        )
        if (isPM) {
            NavigationBarItem(
                selected = currentScreen == "PM_DASHBOARD",
                onClick = { onSelect("PM_DASHBOARD") },
                icon = { Icon(Icons.Default.PieChart, contentDescription = null) },
                label = { Text(if (isHindi) "पीएम कक्ष" else "PM Mode", fontSize = 10.sp) }
            )
        }
        NavigationBarItem(
            selected = currentScreen == "QUIZ",
            onClick = { onSelect("QUIZ") },
            icon = { Icon(Icons.Default.School, contentDescription = null) },
            label = { Text(if (isHindi) "क्विज़" else "Quiz", fontSize = 10.sp) }
        )
    }
}
