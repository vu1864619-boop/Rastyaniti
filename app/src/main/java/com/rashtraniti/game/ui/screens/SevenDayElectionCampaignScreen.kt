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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rashtraniti.game.data.model.*
import com.rashtraniti.game.engine.ElectionCampaignEngine
import com.rashtraniti.game.ui.theme.*
import com.rashtraniti.game.viewmodel.GameUIState

@Composable
fun SevenDayElectionCampaignScreen(
    state: GameUIState,
    isHindi: Boolean,
    onCompleteElection: (ComprehensiveElectionScorecard) -> Unit,
    onBackToHome: () -> Unit
) {
    var campaignState by remember { mutableStateOf(SevenDayCampaignState()) }
    var countingRound by remember { mutableStateOf(1) }
    var scorecard by remember { mutableStateOf<ComprehensiveElectionScorecard?>(null) }
    var selectedDebateOption by remember { mutableStateOf<Int?>(null) }

    val opponent = state.oppositionParties.first()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Top 7-Day Phase Header
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
                                text = "${campaignState.constituencyName} • 7-दिवसीय चुनावी महासंग्राम",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = SaffronPrimary
                            )
                            Text(
                                text = "कुल मतदाता: ${campaignState.totalPopulation / 1000}k | प्रतिद्वंद्वी: ${opponent.name}",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }

                        Surface(
                            color = if (campaignState.currentDay == 7) IndiaGreen else DeepNavy,
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, SaffronPrimary)
                        ) {
                            Text(
                                text = "दिन ${campaignState.currentDay}/7",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (campaignState.currentDay == 7) Color.White else SaffronPrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // 7-Day Step Indicator Bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        for (d in 1..7) {
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(
                                        when {
                                            d < campaignState.currentDay -> IndiaGreen
                                            d == campaignState.currentDay -> SaffronPrimary
                                            else -> DarkSurface
                                        }
                                    )
                            )
                        }
                    }
                }
            }
        }

        // Content Switching by Day
        when (campaignState.currentDay) {
            1 -> {
                // Day 1: Strategy Selection
                item {
                    Text(
                        text = if (isHindi) "दिन 1: मुख्य चुनावी रणनीति का चयन" else "Day 1: Campaign Strategy Selection",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = if (isHindi) "अपनी प्राथमिक नीति चुनें जो विभिन्न मतदाता वर्गों को आकर्षित करेगी" else "Choose your primary ideological & governance campaign pillar",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }

                items(Day1Strategy.values()) { strat ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                campaignState = campaignState.copy(
                                    selectedStrategy = strat,
                                    publicTrustScore = campaignState.publicTrustScore + strat.trustBoost,
                                    playerSupportPercent = campaignState.playerSupportPercent + 3.5,
                                    currentDay = 2
                                )
                            }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(if (isHindi) strat.titleHi else strat.titleEn, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                Icon(Icons.Default.ArrowForward, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(16.dp))
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                                Text("युवा: +${strat.youthBoost.toInt()}%", fontSize = 11.sp, color = GoldAccent)
                                Text("ग्रामीण: +${strat.ruralBoost.toInt()}%", fontSize = 11.sp, color = IndiaGreen)
                                Text("शहरी: +${strat.urbanBoost.toInt()}%", fontSize = 11.sp, color = Color(0xFF60A5FA))
                            }
                        }
                    }
                }
            }

            2 -> {
                // Day 2: Ground Campaign
                item {
                    Text(
                        text = if (isHindi) "दिन 2: ज़मीनी जनसंपर्क एवं रैलियां" else "Day 2: Ground Campaign & Mobilization",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = if (isHindi) "कार्यकर्ताओं और कोष का उपयोग कर ज़मीनी बढ़त बनाएं" else "Deploy volunteers and allocate campaign funds across booths",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }

                items(Day2GroundAction.values()) { action ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                campaignState = campaignState.copy(
                                    selectedGroundAction = action,
                                    campaignBudgetSpent = campaignState.campaignBudgetSpent + action.costMoney,
                                    groundStrengthScore = campaignState.groundStrengthScore + action.visibilityDelta * 5.0,
                                    publicTrustScore = campaignState.publicTrustScore + action.trustDelta,
                                    currentDay = 3
                                )
                            }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(if (isHindi) action.titleHi else action.titleEn, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                Text("₹${action.costMoney / 1000}k", fontWeight = FontWeight.Bold, color = GoldAccent, fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text("जनविश्वास: +${action.trustDelta}%", fontSize = 11.sp, color = IndiaGreen)
                                Text("दृश्यता (Visibility): +${action.visibilityDelta}%", fontSize = 11.sp, color = SaffronPrimary)
                            }
                        }
                    }
                }
            }

            3 -> {
                // Day 3: Media Day
                item {
                    Text(
                        text = if (isHindi) "दिन 3: मीडिया व डिजिटल प्रचार रणनीति" else "Day 3: Media & Digital Strategy",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }

                items(Day3MediaAction.values()) { mediaAction ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                val oppReaction = ElectionCampaignEngine.calculateOppositionReaction(campaignState)
                                campaignState = campaignState.copy(
                                    selectedMediaAction = mediaAction,
                                    campaignBudgetSpent = campaignState.campaignBudgetSpent + mediaAction.costMoney,
                                    mediaReputationScore = campaignState.mediaReputationScore + mediaAction.mediaRepDelta * 4.0,
                                    opponentCounterActionHi = oppReaction.first,
                                    opponentCounterActionEn = oppReaction.second,
                                    currentDay = 4
                                )
                            }
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(if (isHindi) mediaAction.titleHi else mediaAction.titleEn, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                Text("₹${mediaAction.costMoney / 1000}k", fontWeight = FontWeight.Bold, color = GoldAccent, fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("पहुंच प्रभाव (Reach): ${mediaAction.reachScore}/10 | मीडिया साख: +${mediaAction.mediaRepDelta}%", fontSize = 11.sp, color = Color(0xFF60A5FA))
                        }
                    }
                }
            }

            4 -> {
                // Day 4: Opposition Counter-Campaign
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1B4B)),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Shield, contentDescription = null, tint = SaffronPrimary, modifier = Modifier.size(22.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isHindi) "दिन 4: विपक्षी दल की रणनीतिक प्रतिक्रिया" else "Day 4: Opposition Counter-Move",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SaffronPrimary
                                )
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = if (isHindi) campaignState.opponentCounterActionHi else campaignState.opponentCounterActionEn,
                                fontSize = 13.sp,
                                color = TextPrimary,
                                lineHeight = 19.sp
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = {
                                    campaignState = campaignState.copy(currentDay = 5)
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(if (isHindi) "रणनीतिक मुकाबला करें (Proceed)" else "Counter & Proceed to Day 5", color = Color.Black, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            5 -> {
                // Day 5: Sudden Crisis / Surprise Event
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF450A0A)),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = AccentRed, modifier = Modifier.size(22.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isHindi) "दिन 5: अचानक स्थानीय संकट (Surprise Event)" else "Day 5: Surprise Local Crisis",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = AccentRed
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "विधानसभा क्षेत्र के 3 प्रमुख वार्डों में भारी जलभराव व विद्युत आपूर्ति ठप हो गई है। नागरिक संकट में हैं।",
                                fontSize = 13.sp,
                                color = TextPrimary
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = {
                                    campaignState = campaignState.copy(
                                        publicTrustScore = campaignState.publicTrustScore + 10.0,
                                        campaignBudgetSpent = campaignState.campaignBudgetSpent + 20000,
                                        currentDay = 6
                                    )
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("तुरंत पार्टी कार्यकर्ताओं व ₹20k राहत कोष को सेवा में लगाएं (विश्वास +10%)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Button(
                                onClick = {
                                    campaignState = campaignState.copy(
                                        publicTrustScore = campaignState.publicTrustScore - 4.0,
                                        currentDay = 6
                                    )
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                                border = BorderStroke(1.dp, TextSecondary),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("प्रशासन पर दबाव बनाएं और चुनावी रैलियों पर ध्यान रखें", fontSize = 12.sp, color = TextPrimary)
                            }
                        }
                    }
                }
            }

            6 -> {
                // Day 6: Final Interactive Debate
                val questions = ElectionCampaignEngine.getDebateQuestions()
                val currentQ = questions.first()

                item {
                    Text(
                        text = if (isHindi) "दिन 6: निर्णायक चुनावी डिबेट (Candidate vs Opponent)" else "Day 6: Prime Time Electoral Debate",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccent
                    )
                }

                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("मुद्दा: ${currentQ.topicHi}", fontSize = 12.sp, color = SaffronPrimary, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(currentQ.questionHi, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextPrimary)
                        }
                    }
                }

                items(currentQ.optionsHi.indices.toList()) { idx ->
                    Button(
                        onClick = {
                            selectedDebateOption = idx
                            val isCorrect = idx == currentQ.correctIndex
                            campaignState = campaignState.copy(
                                debateScore = if (isCorrect) 9 else 5,
                                debateCompleted = true,
                                currentDay = 7
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DarkSurface),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "${idx + 1}. ${currentQ.optionsHi[idx]}",
                            color = TextPrimary,
                            fontSize = 12.sp,
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                        )
                    }
                }
            }

            7 -> {
                // Day 7: Voting & 4-Round Vote Counting Sequence
                if (scorecard == null) {
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DeepNavy),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(20.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(Icons.Default.HowToVote, contentDescription = null, tint = IndiaGreen, modifier = Modifier.size(54.dp))
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = if (isHindi) "मतदान दिवस एवं मतगणना (Counting)" else "Polling Day & Live Vote Count",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary
                                )
                                Text(
                                    text = "EVM मशीनों से मतों की गणना शुरू करें",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(16.dp))

                                Button(
                                    onClick = {
                                        scorecard = ElectionCampaignEngine.computeElectionScorecard(
                                            campState = campaignState,
                                            player = state.player,
                                            party = state.party,
                                            opponentParty = opponent
                                        )
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = IndiaGreen),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("EVM मतों की गिनती शुरू करें (Start Count)", fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }
                    }
                } else {
                    val card = scorecard!!

                    // 4-Round Count Progress & Final Reveal
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = CardBackground),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(18.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Icon(
                                    if (card.isPlayerWinner) Icons.Default.EmojiEvents else Icons.Default.Gavel,
                                    contentDescription = null,
                                    tint = if (card.isPlayerWinner) GoldAccent else SaffronPrimary,
                                    modifier = Modifier.size(50.dp)
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = if (card.isPlayerWinner) "शानदार ऐतिहासिक विजय!" else "चुनावी परिणाम — राजनीतिक यात्रा जारी",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (card.isPlayerWinner) IndiaGreen else GoldAccent
                                )

                                Text(
                                    text = if (card.isPlayerWinner) "आप ${card.marginVotes} मतों से विजयी हुए!" else "विपक्ष ${card.marginVotes} मतों से आगे रहा।",
                                    fontSize = 13.sp,
                                    color = TextPrimary
                                )

                                Spacer(modifier = Modifier.height(14.dp))

                                // Vote share table
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("${state.party.shortName} (आप)", fontWeight = FontWeight.Bold, color = SaffronPrimary)
                                    Text("${String.format("%.1f", card.playerVotePercent)}% (${card.playerVotes} मत)", fontWeight = FontWeight.Bold, color = TextPrimary)
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("${opponent.shortName} (विपक्ष)", color = TextSecondary)
                                    Text("${String.format("%.1f", card.opponentVotePercent)}% (${card.opponentVotes} मत)", color = TextPrimary)
                                }
                            }
                        }
                    }

                    // In-depth Evaluation Scorecard
                    item {
                        Text(
                            text = if (isHindi) "चुनावी प्रदर्शन विश्लेषण (Election Analysis)" else "In-Depth Election Evaluation",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }

                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurface),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text("रणनीतिक प्रभाव: ${card.strategyScore}/100", fontSize = 12.sp, color = GoldAccent)
                                Text("जनविश्वास: ${card.publicTrustScore}/100", fontSize = 12.sp, color = IndiaGreen)
                                Text("मीडिया प्रदर्शन: ${card.mediaPerformanceScore}/100", fontSize = 12.sp, color = Color(0xFF60A5FA))
                                Text("ज़मीनी जनसंपर्क: ${card.groundCampaignScore}/100", fontSize = 12.sp, color = SaffronPrimary)
                                Text("डिबेट अंक: ${card.debateScore}/100", fontSize = 12.sp, color = TextPrimary)
                                Text("प्रतिद्वंद्वी की ताकत: ${card.opponentChallengeScore}/100", fontSize = 12.sp, color = AccentRed)

                                Divider(color = CardBackground, modifier = Modifier.padding(vertical = 4.dp))

                                Text(
                                    text = "निष्कर्ष: ${card.primaryReasonHi}",
                                    fontSize = 12.sp,
                                    color = TextPrimary,
                                    lineHeight = 17.sp
                                )
                            }
                        }
                    }

                    item {
                        Button(
                            onClick = {
                                onCompleteElection(card)
                                onBackToHome()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = if (card.isPlayerWinner) "सरकार गठन / आगे बढ़ें" else "पार्टी पुनर्गठन व आगामी चुनाव की तैयारी",
                                color = Color.Black,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}
