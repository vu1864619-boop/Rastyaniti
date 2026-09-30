package com.rashtraniti.game.engine

import com.rashtraniti.game.data.model.*
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

object ElectionEngine {
    data class ElectionResult(
        val totalTurnoutPercent: Double,
        val playerVotes: Long,
        val opponentVotes: Long,
        val otherVotes: Long,
        val playerVotePercent: Double,
        val opponentVotePercent: Double,
        val otherVotePercent: Double,
        val isWon: Boolean,
        val marginVotes: Long
    )

    fun simulateConstituencyElection(
        constituency: Constituency,
        player: PlayerProfile,
        party: PoliticalParty,
        campaignEffortLevel: Double // 1.0 to 2.0
    ): ElectionResult {
        // Factors: Public Trust (30%), Party Popularity (25%), Candidate Leadership (15%), Manifesto fit (15%), Campaign (15%)
        val trustFactor = player.publicTrust * 0.30
        val popularityFactor = party.overallPopularity * 0.25
        val leadershipFactor = (player.leadership * 0.5 + player.communication * 0.5) * 0.15
        val campaignFactor = (party.electionReadiness * 0.5 + campaignEffortLevel * 25.0) * 0.15
        val baseScore = trustFactor + popularityFactor + leadershipFactor + campaignFactor
        
        // Random fluctuation (anti-deterministic, +/- 4%)
        val swing = (Random.nextDouble() * 8.0) - 4.0
        val finalPlayerShare = max(10.0, min(85.0, baseScore + swing))
        
        val remainingShare = 100.0 - finalPlayerShare
        val opponentShare = remainingShare * (0.65 + Random.nextDouble() * 0.20)
        val otherShare = max(2.0, 100.0 - finalPlayerShare - opponentShare)
        
        val turnout = 62.0 + Random.nextDouble() * 12.0 // 62% - 74%
        val polledVotes = (constituency.totalVoters * (turnout / 100.0)).toLong()
        
        val pVotes = (polledVotes * (finalPlayerShare / 100.0)).toLong()
        val oVotes = (polledVotes * (opponentShare / 100.0)).toLong()
        val othVotes = polledVotes - pVotes - oVotes
        
        val won = pVotes > oVotes
        val margin = kotlin.math.abs(pVotes - oVotes)

        return ElectionResult(
            totalTurnoutPercent = turnout,
            playerVotes = pVotes,
            opponentVotes = oVotes,
            otherVotes = max(0L, othVotes),
            playerVotePercent = finalPlayerShare,
            opponentVotePercent = opponentShare,
            otherVotePercent = otherShare,
            isWon = won,
            marginVotes = margin
        )
    }
}

object CrisisEngine {
    fun getSampleCrises(): List<CrisisEvent> = listOf(
        CrisisEvent(
            id = "crisis_flood_01",
            titleHi = "पूर्वी क्षेत्र में भीषण बाढ़ का प्रकोप",
            titleEn = "Massive Floods in Eastern River Basin",
            category = "DISASTER",
            descriptionHi = "लगातार भारी मानसूनी वर्षा से 12 जिलों में बाढ़ का संकट उत्पन्न हो गया है। 20 लाख नागरिक प्रभावित हैं और संचार मार्ग बाधित हैं।",
            descriptionEn = "Continuous torrential monsoon rains have triggered severe floods across 12 districts, displacing 2 million citizens and disrupting connectivity.",
            affectedRegion = "बिहार / असम जलप्रवाह क्षेत्र",
            severityLevel = 4,
            choices = listOf(
                CrisisChoice(
                    choiceId = "choice_ndrf_airlift",
                    textHi = "तुरंत आपदा राहत कोष से ₹5,000 करोड़ जारी करें और सेना व राहत दल को तैनात करें",
                    textEn = "Immediately release ₹5,000 Cr disaster relief fund & mobilize rescue airlifts",
                    costMoneyCrore = 5000,
                    timeCostDays = 2,
                    riskPercent = 10,
                    immediateEffectHi = "नागरिकों की जान बची, विपक्ष भी त्वरित राहत की प्रशंसा करने पर विवश हुआ।",
                    immediateEffectEn = "Lives saved swiftly, opposition acknowledges swift disaster response.",
                    publicTrustDelta = 8.5,
                    approvalDelta = 6.0,
                    budgetImpactCrore = -5000
                ),
                CrisisChoice(
                    choiceId = "choice_standard_aid",
                    textHi = "जिला प्रशासन को ₹1,200 करोड़ का बुनियादी राहत पैकेज भेजें",
                    textEn = "Dispatch standard ₹1,200 Cr relief package to district authorities",
                    costMoneyCrore = 1200,
                    timeCostDays = 5,
                    riskPercent = 35,
                    immediateEffectHi = "राहत कार्य धीमा रहा, स्थानीय मीडिया में व्यवस्था पर प्रश्न उठे।",
                    immediateEffectEn = "Aid rollout faced logistical delays, localized media scrutiny arose.",
                    publicTrustDelta = -2.0,
                    approvalDelta = -1.5,
                    budgetImpactCrore = -1200
                ),
                CrisisChoice(
                    choiceId = "choice_survey_first",
                    textHi = "नुकसान का आकलन करने के लिए केंद्रीय सर्वेक्षण समिति गठित करें",
                    textEn = "Form a central survey committee to assess damage before releasing funds",
                    costMoneyCrore = 200,
                    timeCostDays = 14,
                    riskPercent = 65,
                    immediateEffectHi = "देरी के कारण जनता में रोष, विपक्षी दलों ने संसद में भारी विरोध किया।",
                    immediateEffectEn = "Public outrage over delays, opposition staged massive protests in parliament.",
                    publicTrustDelta = -12.0,
                    approvalDelta = -9.0,
                    budgetImpactCrore = -200
                )
            )
        ),
        CrisisEvent(
            id = "crisis_media_trial_01",
            titleHi = "टीवी समाचार पर घोषणापत्र की नीतियों पर तीखी बहस",
            titleEn = "Prime Time Media Debate on Manifesto Feasibility",
            category = "MEDIA_TRIAL",
            descriptionHi = "एक प्रमुख समाचार चैनल के एंकर ने आपकी मुख्य स्वास्थ्य और शिक्षा नीति के वित्तीय स्रोतों पर प्रश्न उठाते हुए प्राइम टाइम डिबेट आयोजित की है।",
            descriptionEn = "A major news network questions the fiscal viability of your flagship healthcare & education policy during prime-time coverage.",
            affectedRegion = "राष्ट्रीय मीडिया (National Media)",
            severityLevel = 2,
            choices = listOf(
                CrisisChoice(
                    choiceId = "choice_live_press",
                    textHi = "स्वयं लाइव प्रेस वार्ता कर विस्तृत आर्थिक श्वेतपत्र पेश करें",
                    textEn = "Hold a live press conference and present a detailed fiscal whitepaper",
                    costMoneyCrore = 0,
                    timeCostDays = 1,
                    riskPercent = 15,
                    immediateEffectHi = "तथ्यों के आधार पर जनता का विश्वास बढ़ा और आर्थिक साख मजबूत हुई।",
                    immediateEffectEn = "Data-backed transparency enhanced credibility across educated and urban voters.",
                    publicTrustDelta = 5.0,
                    approvalDelta = 4.0,
                    budgetImpactCrore = 0
                ),
                CrisisChoice(
                    choiceId = "choice_spokesperson",
                    textHi = "पार्टी के वरिष्ठ मुख्य प्रवक्ता को टीवी पैनल में डिबेट के लिए भेजें",
                    textEn = "Deploy senior party economic spokespersons to counter on the panel",
                    costMoneyCrore = 0,
                    timeCostDays = 1,
                    riskPercent = 25,
                    immediateEffectHi = "संतुलित बहस रही, पार्टी का पक्ष मजबूती से रखा गया।",
                    immediateEffectEn = "Balanced debate outcome, core points successfully defended.",
                    publicTrustDelta = 2.0,
                    approvalDelta = 1.5,
                    budgetImpactCrore = 0
                ),
                CrisisChoice(
                    choiceId = "choice_ignore_media",
                    textHi = "बहस पर कोई आधिकारिक प्रतिक्रिया न दें और ज़मीनी रैलियों पर ध्यान केंद्रित रखें",
                    textEn = "Ignore the studio drama and focus entirely on ground grassroots rallies",
                    costMoneyCrore = 0,
                    timeCostDays = 1,
                    riskPercent = 40,
                    immediateEffectHi = "शहरी मतदाताओं में कुछ संशय बना रहा, लेकिन ग्रामीण आधार अप्रभावित रहा।",
                    immediateEffectEn = "Urban voters showed slight skepticism, grassroots support remained intact.",
                    publicTrustDelta = -1.0,
                    approvalDelta = -1.0,
                    budgetImpactCrore = 0
                )
            )
        ),
        CrisisEvent(
            id = "crisis_global_oil_01",
            titleHi = "वैश्विक बाजार में कच्चे तेल की कीमतों में अचानक उछाल",
            titleEn = "Global Energy Supply Shock & Price Surge",
            category = "ECONOMY",
            descriptionHi = "अंतरराष्ट्रीय बाजार में कच्चे तेल की कीमतें 25% बढ़ गई हैं जिससे देश में मुद्रास्फीति और परिवहन लागत बढ़ने का खतरा है।",
            descriptionEn = "International crude oil spikes by 25%, threatening domestic inflation, logistics costs and foreign reserves.",
            affectedRegion = "समस्त भारत (National Economy)",
            severityLevel = 3,
            choices = listOf(
                CrisisChoice(
                    choiceId = "choice_excise_cut",
                    textHi = "पेट्रोल-डीजल पर उत्पाद शुल्क में ₹5 की कटौती करें और ग्रीन ऊर्जा सब्सिडी बढ़ाएं",
                    textEn = "Cut fuel excise duty by ₹5 and accelerate renewable energy incentives",
                    costMoneyCrore = 35000,
                    timeCostDays = 1,
                    riskPercent = 15,
                    immediateEffectHi = "महंगाई नियंत्रित रही, आम नागरिक व व्यापारी वर्ग में बड़ी राहत।",
                    immediateEffectEn = "Inflation contained, huge relief among common commuters and business sector.",
                    publicTrustDelta = 7.0,
                    approvalDelta = 5.5,
                    budgetImpactCrore = -35000
                ),
                CrisisChoice(
                    choiceId = "choice_strategic_reserves",
                    textHi = "राष्ट्रीय सामरिक तेल भंडार (Strategic Reserves) जारी कर बाजार संतुलित करें",
                    textEn = "Release national strategic crude reserves to absorb market shocks",
                    costMoneyCrore = 10000,
                    timeCostDays = 3,
                    riskPercent = 20,
                    immediateEffectHi = "बिना अधिक वित्तीय बोझ के कीमतों में स्थिरता आई।",
                    immediateEffectEn = "Price volatility moderated without massive fiscal strain on treasury.",
                    publicTrustDelta = 4.0,
                    approvalDelta = 3.5,
                    budgetImpactCrore = -10000
                ),
                CrisisChoice(
                    choiceId = "choice_pass_to_market",
                    textHi = "बाजार की दरों के अनुसार मूल्य वृद्धि को लागू होने दें",
                    textEn = "Allow dynamic market pass-through to protect government treasury",
                    costMoneyCrore = 0,
                    timeCostDays = 1,
                    riskPercent = 60,
                    immediateEffectHi = "महंगाई बढ़ने से जनता में रोष और विपक्षी दलों का देशव्यापी प्रदर्शन।",
                    immediateEffectEn = "Retail inflation spike sparked consumer protests and opposition rallies.",
                    publicTrustDelta = -8.0,
                    approvalDelta = -7.5,
                    budgetImpactCrore = 0
                )
            )
        )
    )
}

object QuizRepository {
    fun getQuestions(): List<QuizQuestion> = listOf(
        QuizQuestion(
            id = "quiz_const_01",
            category = "CONSTITUTION",
            questionHi = "भारतीय संविधान का कौन सा अनुच्छेद भारत के चुनाव आयोग (Election Commission) से संबंधित है?",
            questionEn = "Which Article of the Constitution of India deals with the Election Commission of India?",
            optionsHi = listOf("अनुच्छेद 324", "अनुच्छेद 356", "अनुच्छेद 280", "अनुच्छेद 370"),
            optionsEn = listOf("Article 324", "Article 356", "Article 280", "Article 370"),
            correctIndex = 0,
            explanationHi = "संविधान के अनुच्छेद 324 में स्वतंत्र एवं निष्पक्ष चुनाव कराने हेतु चुनाव आयोग के अधीक्षण, निदेशन और नियंत्रण का प्रावधान है।",
            explanationEn = "Article 324 vests the superintendence, direction, and control of elections in the Election Commission.",
            statBoostField = "politicalKnowledge"
        ),
        QuizQuestion(
            id = "quiz_parl_02",
            category = "PARLIAMENT",
            questionHi = "लोकसभा में 'धन विधेयक' (Money Bill) पेश करने के लिए किसकी पूर्वानुमति आवश्यक होती है?",
            questionEn = "Whose prior recommendation is mandatory to introduce a Money Bill in Lok Sabha?",
            optionsHi = listOf("भारत के राष्ट्रपति", "प्रधानमंत्री", "लोकसभा अध्यक्ष", "वित्त मंत्री"),
            optionsEn = listOf("President of India", "Prime Minister", "Lok Sabha Speaker", "Finance Minister"),
            correctIndex = 0,
            explanationHi = "अनुच्छेद 117(1) के अनुसार, धन विधेयक केवल राष्ट्रपति की पूर्व संस्तुति से ही लोकसभा में प्रस्तुत किया जा सकता है।",
            explanationEn = "Under Article 117(1), a Money Bill can be introduced only on the recommendation of the President.",
            statBoostField = "administration"
        ),
        QuizQuestion(
            id = "quiz_econ_03",
            category = "ECONOMY",
            questionHi = "राजकोषीय घाटे (Fiscal Deficit) का वास्तविक अर्थ क्या है?",
            questionEn = "What does Fiscal Deficit accurately represent in the national budget?",
            optionsHi = listOf(
                "सरकार के कुल व्यय और कुल प्राप्तियों (उधार छोड़कर) का अंतर",
                "केवल आयात और निर्यात का अंतर",
                "बैंकों द्वारा दिया गया कुल ऋण",
                "विदेशी मुद्रा भंडार में कमी"
            ),
            optionsEn = listOf(
                "Excess of total government expenditure over total receipts excluding borrowings",
                "Difference between imports and exports only",
                "Total loans disbursed by commercial banks",
                "Depletion of foreign exchange reserves"
            ),
            optionsEn = listOf(
                "Excess of total government expenditure over total receipts excluding borrowings",
                "Difference between imports and exports only",
                "Total loans disbursed by commercial banks",
                "Depletion of foreign exchange reserves"
            ),
            correctIndex = 0,
            explanationHi = "राजकोषीय घाटा सरकार की कुल उधारी आवश्यकताओं को दर्शाता है (Total Expenditure - Total Non-Debt Receipts)।",
            explanationEn = "Fiscal Deficit indicates the total borrowing requirements of the government in a financial year.",
            statBoostField = "financeSkill"
        ),
        QuizQuestion(
            id = "quiz_civics_04",
            category = "CIVICS",
            questionHi = "आदर्श चुनाव आचार संहिता (Model Code of Conduct) किस क्षण से लागू होती है?",
            questionEn = "From which moment does the Model Code of Conduct (MCC) come into operational effect?",
            optionsHi = listOf(
                "चुनाव आयोग द्वारा चुनाव कार्यक्रम की घोषणा के तुरंत बाद",
                "नामांकन दाखिल करने के अंतिम दिन से",
                "मतदान के ठीक 48 घंटे पहले",
                "सरकार के कार्यकाल के समाप्त होने पर"
            ),
            optionsEn = listOf(
                "Immediately upon announcement of election schedule by the Election Commission",
                "From the last date of filing nominations",
                "Exactly 48 hours before polling begins",
                "Upon formal expiration of the government assembly term"
            ),
            correctIndex = 0,
            explanationHi = "चुनाव कार्यक्रम घोषित होते ही पूरे देश/राज्य में आचार संहिता लागू हो जाती है जिससे निष्पक्ष चुनाव सुनिश्चित हो सकें।",
            explanationEn = "The MCC comes into force immediately when the Election Commission announces the election schedule.",
            statBoostField = "strategy"
        ),
        QuizQuestion(
            id = "quiz_lead_05",
            category = "ADMINISTRATION",
            questionHi = "कैबिनेट सचिवालय (Cabinet Secretariat) किसके प्रत्यक्ष नियंत्रण व प्रभार के अधीन कार्य करता है?",
            questionEn = "Under whose direct executive charge does the Cabinet Secretariat function?",
            optionsHi = listOf("भारत के प्रधानमंत्री", "गृह मंत्री", "राष्ट्रपति", "संसदीय कार्य मंत्री"),
            optionsEn = listOf("Prime Minister of India", "Home Minister", "President", "Minister of Parliamentary Affairs"),
            correctIndex = 0,
            explanationHi = "कैबिनेट सचिवालय सीधे प्रधानमंत्री के अधीन होता है और इसका प्रशासनिक प्रमुख कैबिनेट सचिव (Cabinet Secretary) होता है।",
            explanationEn = "The Cabinet Secretariat is under the direct charge of the Prime Minister, headed by the Cabinet Secretary.",
            statBoostField = "leadership"
        )
    )
}
