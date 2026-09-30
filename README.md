# 🇮🇳 राष्ट्रनीति (RashtraNiti)
> **“एक आम आदमी से प्रधानमंत्री तक”** *(From Common Citizen to Prime Minister)*

An Indian Political Strategy, Election Simulation, Government Management, Nation Simulator, and Civic Quiz Game built with **Kotlin, Jetpack Compose, Coroutines, StateFlow, Room Database, and Clean MVVM Architecture**.

---

## 🏛️ Features & Systems Overview

1. **The Journey of Ascent**:
   - `COMMON MAN` → `PARTY FOUNDER` → `LOCAL CANDIDATE` → `ELECTED REPRESENTATIVE` → `STATE POLITICIAN` → `NATIONAL LEADER` → `MP` → `PRIME MINISTER` → `NATION BUILDER` → `NEXT MANDATE`.
2. **Interactive 2D/2.5D Map Progression**:
   - 4-Tier Zoom: National India Map → State Map → District Map → Constituency Map.
   - Real-time voter demographic ratios (Rural vs Urban vs Youth).
3. **Fictional Political Party System**:
   - Custom party name, acronym, symbol, flag color, core ideology, and manifesto priorities.
   - Dynamic tracking of party popularity, party funds, volunteers, and worker offices.
4. **Election Commission & Model Code of Conduct**:
   - Fair-play election rules, campaign spending caps, EVM vote counting sequence, turnout simulations.
5. **Campaign & Media Center**:
   - 10 Campaign Activities: Rallies, Door-to-Door, Townhalls, Live TV Debates, Digital Ads, Manifesto Launch.
   - Dynamic consumption of funds, energy, and worker mobilization.
6. **Sudden Crisis & Disaster Engine**:
   - Natural disasters (Floods, Cyclones, Earthquakes, Droughts) and Media Trials with immediate and long-term consequences.
7. **Prime Minister Mode & National Budget**:
   - Macro indicators: GDP growth, Inflation rate, Unemployment, National Debt, Government Approval.
   - Interactive budget balancing across **11 Union Ministries** (Finance, Home, Education, Health, Agri, Infra, Defence, Tech, Environment, Transport, Social Welfare).
8. **Parliament / Lok Sabha Simulation**:
   - Introduce bills, manage floor debates, conduct live voting divisions (Ayes vs Noes).
9. **Political & Constitutional Quiz**:
   - Rich trivia question bank on the Constitution, Parliament, Economics, and Civics that directly boost in-game stats.
10. **Bilingual Localization**:
    - Complete support for **Hindi (हिन्दी)** and **English**.

---

## 📂 Project Structure

```
scratch/rashtraniti/
├── build.gradle.kts
├── settings.gradle.kts
├── app/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/rashtraniti/game/
│           │   ├── MainActivity.kt
│           │   ├── RashtraNitiApp.kt
│           │   ├── data/
│           │   │   ├── model/GameModels.kt
│           │   │   ├── database/AppDatabase.kt
│           │   │   └── dao/GameDaos.kt
│           │   ├── engine/GameEngines.kt
│           │   ├── viewmodel/RashtraNitiViewModel.kt
│           │   └── ui/
│           │       ├── theme/Theme.kt
│           │       └── screens/RashtraNitiScreens.kt
│           └── res/
│               ├── values/strings.xml
│               ├── values-hi/strings.xml
│               └── values/themes.xml
└── playable_demo/
    └── index.html (Fully functional standalone playable simulation with real-time audio)
```

---

## 🚀 How to Run

### 1. Open and Compile in Android Studio
1. Launch **Android Studio (Hedgehog / Iguana / Jellyfish or newer)**.
2. Select **Open** and choose the directory:
   `C:\Users\Krishna Chandra\.gemini\antigravity\scratch\rashtraniti`
3. Sync Gradle and press **Run** (Shift + F10) on an Android Emulator or connected physical device.

### 2. Immediate Playable Mobile Simulation
- Open `playable_demo/index.html` in any web browser to test and play all mechanics, sound effects, campaign actions, quizzes, disaster choices, and PM budget management immediately!
