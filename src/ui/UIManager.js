// Upgraded Mobile UI with Life Simulation Jobs, In-World Rallies, Governance Office, and Hindi HUD
import { gameState, BACKGROUNDS, RANKS } from '../systems/GameState.js';
import { missionSystem } from '../systems/MissionSystem.js';
import { PoliticalCampaignSystem, CAMPAIGN_ACTIONS } from '../systems/PoliticalSystem.js';
import { LifeSimulationSystem, LIFE_JOBS, DIRECT_CITIZEN_AIDS } from '../systems/LifeSimulationSystem.js';
import { sound } from '../systems/SoundFX.js';

export class UIManager {
  constructor(gameApp) {
    this.gameApp = gameApp;
    this.container = document.getElementById('ui-overlay-container');
    this.activeModal = null;
    this.initHUD();
    this.initModals();
  }

  initHUD() {
    this.hudElement = document.createElement('div');
    this.hudElement.id = 'game-hud';
    this.hudElement.innerHTML = `
      <!-- Top Status Bar: Essential Gameplay Info Only -->
      <div class="hud-top-bar">
        <div class="hud-player-badge" id="hud-badge-btn" title="प्रोफ़ाइल देखें">
          <div class="hud-avatar-circle" id="hud-avatar-icon">🇮🇳</div>
          <div class="hud-player-meta">
            <span class="hud-name" id="hud-player-name">${gameState.player.name}</span>
            <span class="hud-rank" id="hud-player-rank">${gameState.getCurrentRank().hi}</span>
          </div>
        </div>

        <div class="hud-stats-group">
          <!-- 1. Money -->
          <div class="stat-pill money-pill" title="धन / Campaign Funds">
            <i class="fa-solid fa-indian-rupee-sign"></i>
            <span id="hud-money">${gameState.player.money.toLocaleString('en-IN')}</span>
          </div>
          <!-- 2. Public Support -->
          <div class="stat-pill support-pill" title="जनसमर्थन / Public Support">
            <i class="fa-solid fa-users text-saffron"></i>
            <span id="hud-support">${gameState.election.playerSupport || 30}%</span>
          </div>
          <!-- 3. Reputation -->
          <div class="stat-pill rep-pill" title="प्रतिष्ठा / Reputation">
            <i class="fa-solid fa-star text-gold"></i>
            <span id="hud-rep">${gameState.player.reputation}</span>
          </div>
          <!-- Menu Toggle Button -->
          <button id="hud-menu-toggle" class="stat-pill menu-pill" title="मेन्यू खोलें">
            <i class="fa-solid fa-bars"></i>
            <span>मेन्यू</span>
          </button>
        </div>
      </div>

      <!-- Current Mission / Next Goal Banner -->
      <div class="hud-goal-banner" id="hud-goal-banner">
        <i class="fa-solid fa-compass text-gold"></i>
        <span id="hud-goal-text">लक्ष्य: नागरिकों से बात करें, आजीविका कमाएं और जनसमर्थन बढ़ाएं।</span>
      </div>

      <!-- Quick Action Buttons Top Right (Drawer) -->
      <div class="hud-quick-nav hidden" id="hud-quick-nav-drawer">
        <button id="nav-btn-missions" class="hud-nav-btn" title="नागरिक मिशन">
          <i class="fa-solid fa-list-check"></i>
          <span>सक्रिय मिशन</span>
        </button>
        <button id="nav-btn-life" class="hud-nav-btn" title="दैनिक जीवन व आजीविका">
          <i class="fa-solid fa-briefcase"></i>
          <span>आजीविका व सहायता</span>
        </button>
        <button id="nav-btn-campaign" class="hud-nav-btn" title="चुनाव एवं प्रचार">
          <i class="fa-solid fa-bullhorn"></i>
          <span>चुनावी अभियान</span>
        </button>
        <button id="nav-btn-gov" class="hud-nav-btn" title="शासन / नगर निगम">
          <i class="fa-solid fa-landmark"></i>
          <span>शासन व बजट</span>
        </button>
        <button id="nav-btn-creator" class="hud-nav-btn" title="चरित्र सम्पादन">
          <i class="fa-solid fa-user-pen"></i>
          <span>पहनावा व रूप</span>
        </button>
      </div>

      <!-- Interaction Toast / Prompt -->
      <div id="interaction-prompt" class="interaction-prompt hidden">
        <i class="fa-solid fa-location-dot"></i>
        <span id="prompt-text">पास जाएं</span>
      </div>

      <!-- Dialogue Box -->
      <div id="dialogue-box" class="dialogue-box hidden">
        <div class="dialogue-header">
          <div>
            <span id="dialogue-speaker-name" class="speaker-name">नागरिक</span>
            <span id="dialogue-speaker-role" class="speaker-role">दुकानदार</span>
          </div>
          <button id="dialogue-close-btn" class="dialogue-close-x">&times;</button>
        </div>
        <div id="dialogue-content" class="dialogue-content">बातचीत...</div>
        <div id="dialogue-need-box" class="dialogue-need-box">
          <i class="fa-solid fa-circle-exclamation text-saffron"></i>
          <span id="dialogue-need-text">समस्या...</span>
        </div>
        <div class="dialogue-actions" id="dialogue-actions">
          <button id="dialogue-mission-btn" class="dialogue-btn mission-action-btn hidden">
            <i class="fa-solid fa-clipboard-list"></i> मिशन शुरू करें
          </button>
          <button id="dialogue-help-btn" class="dialogue-btn highlight-btn">
            <i class="fa-solid fa-hand-holding-heart"></i> सहायता (+प्रतिष्ठा)
          </button>
          <button id="dialogue-next-btn" class="dialogue-btn primary-btn">अगली बात</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.hudElement);
    this.bindHUDEvents();
  }

  bindHUDEvents() {
    const drawer = document.getElementById('hud-quick-nav-drawer');
    const menuToggle = document.getElementById('hud-menu-toggle');

    if (menuToggle && drawer) {
      menuToggle.onclick = () => {
        sound.playClick();
        drawer.classList.toggle('hidden');
      };
    }

    const wireNav = (btnId, modalId) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.onclick = () => {
          if (drawer) drawer.classList.add('hidden');
          this.openModal(modalId);
        };
      }
    };

    wireNav('nav-btn-life', 'LIFE');
    wireNav('nav-btn-missions', 'MISSIONS');
    wireNav('nav-btn-campaign', 'CAMPAIGN');
    wireNav('nav-btn-gov', 'GOVERNANCE');

    const btnCreator = document.getElementById('nav-btn-creator');
    if (btnCreator) {
      btnCreator.onclick = () => {
        if (drawer) drawer.classList.add('hidden');
        this.openCharacterCreator();
      };
    }

    const badgeBtn = document.getElementById('hud-badge-btn');
    if (badgeBtn) badgeBtn.onclick = () => this.openModal('PROFILE');

    const closeBtn = document.getElementById('dialogue-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.closeDialogue();
    }
  }

  updateHUD() {
    document.getElementById('hud-player-name').innerText = gameState.player.name;
    document.getElementById('hud-player-rank').innerText = gameState.getCurrentRank().hi;
    document.getElementById('hud-money').innerText = gameState.player.money.toLocaleString('en-IN');
    document.getElementById('hud-support').innerText = `${gameState.election.playerSupport || 30}%`;
    document.getElementById('hud-rep').innerText = gameState.player.reputation;

    const goalEl = document.getElementById('hud-goal-text');
    const rankIdx = gameState.player.rankIndex;
    if (rankIdx === 0) {
      goalEl.innerText = 'लक्ष्य: आम नागरिक के रूप में लोगों की समस्याएं सुनें और 120 प्रतिष्ठा हासिल करें।';
    } else if (rankIdx === 1) {
      goalEl.innerText = 'लक्ष्य: समाजसेवी बनकर विकास कार्य कराएं और किसी राजनीतिक दल से जुड़ें।';
    } else if (rankIdx === 2) {
      goalEl.innerText = 'लक्ष्य: पार्टी कार्यकर्ता के रूप में जनसंपर्क करें और स्थानीय प्रत्याशी बनें।';
    } else if (rankIdx === 3) {
      goalEl.innerText = 'लक्ष्य: स्थानीय प्रत्याशी के रूप में प्रचार रैली निकालें और पार्षद चुनाव जीतें।';
    } else if (rankIdx === 4) {
      goalEl.innerText = 'लक्ष्य: वार्ड पार्षद के रूप में नगर निगम बजट से सड़कें और नाली बनवाएं।';
    } else if (rankIdx === 5) {
      goalEl.innerText = 'लक्ष्य: विधायक (MLA) के रूप में जिला योजना और राज्य कोष से बड़े प्रोजेक्ट लाएं।';
    } else if (rankIdx === 6) {
      goalEl.innerText = 'लक्ष्य: सांसद (MP) बनकर राष्ट्रीय संसद में जनमुद्दे उठाएं और राष्ट्रीय पहचान बनाएं।';
    } else if (rankIdx === 7) {
      goalEl.innerText = 'लक्ष्य: राष्ट्रीय नेतृत्व / मुख्यमंत्री के रूप में पूरे राज्य का नेतृत्व करें।';
    } else {
      goalEl.innerText = 'सर्वोच्च पद: भारत के प्रधानमंत्री! राष्ट्रीय कैबिनेट, बजट और लोक कल्याण का संचालन करें।';
    }
  }

  showInteractionPrompt(text) {
    const prompt = document.getElementById('interaction-prompt');
    const textSpan = document.getElementById('prompt-text');
    if (prompt && textSpan) {
      textSpan.innerText = text;
      prompt.classList.remove('hidden');
    }
  }

  hideInteractionPrompt() {
    const prompt = document.getElementById('interaction-prompt');
    if (prompt) {
      prompt.classList.add('hidden');
    }
  }

  showDialogue(npc) {
    const box = document.getElementById('dialogue-box');
    const nameEl = document.getElementById('dialogue-speaker-name');
    const roleEl = document.getElementById('dialogue-speaker-role');
    const contentEl = document.getElementById('dialogue-content');
    const needTextEl = document.getElementById('dialogue-need-text');
    const helpBtn = document.getElementById('dialogue-help-btn');
    const missionBtn = document.getElementById('dialogue-mission-btn');
    const nextBtn = document.getElementById('dialogue-next-btn');

    nameEl.innerText = npc.name;
    roleEl.innerText = npc.role;
    contentEl.innerText = npc.dialogues[npc.dialogueIndex % npc.dialogues.length];

    if (needTextEl) {
      needTextEl.innerText = npc.needText || 'स्थानीय विकास व सहयोग की आवश्यकता।';
    }

    // Check if this NPC has an associated mission
    if (missionBtn) {
      if (npc.missionId) {
        const matchingMission = missionSystem.missions.find(m => m.id === npc.missionId);
        if (matchingMission && !matchingMission.isCompleted) {
          missionBtn.classList.remove('hidden');
          missionBtn.innerHTML = `<i class="fa-solid fa-list-check"></i> ${matchingMission.titleHi.substring(0, 16)}...`;
          missionBtn.onclick = () => {
            sound.playClick();
            this.closeDialogue();
            this.openModal('MISSIONS');
          };
        } else {
          missionBtn.classList.add('hidden');
        }
      } else {
        missionBtn.classList.add('hidden');
      }
    }

    if (helpBtn) {
      helpBtn.onclick = () => {
        sound.playFanfare();
        // Citizen Aid Gameplay: +15 Reputation, +2% Public Support, small tip
        gameState.addReputation(15);
        gameState.addPublicSupport(2);
        this.updateHUD();
        alert(`आपने ${npc.name} की समस्या सुनी और सहायता की!\n\n+15 प्रतिष्ठा (Reputation)\n+2% जनसमर्थन (Public Support)`);
        this.closeDialogue();
      };
    }

    nextBtn.onclick = () => {
      npc.dialogueIndex++;
      sound.playClick();
      contentEl.innerText = npc.dialogues[npc.dialogueIndex % npc.dialogues.length];
    };

    box.classList.remove('hidden');
    sound.playInteract();
  }

  closeDialogue() {
    const box = document.getElementById('dialogue-box');
    if (box) box.classList.add('hidden');
  }

  initModals() {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = 'modal-overlay';
    this.modalOverlay.className = 'modal-backdrop hidden';
    this.modalOverlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-head">
          <h2 id="modal-title">शीर्षक</h2>
          <button id="modal-close-x" class="modal-close-btn">&times;</button>
        </div>
        <div id="modal-body" class="modal-scrollable-body"></div>
      </div>
    `;
    document.body.appendChild(this.modalOverlay);

    document.getElementById('modal-close-x').onclick = () => this.closeModal();
  }

  openModal(type) {
    sound.playClick();
    this.modalOverlay.classList.remove('hidden');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');

    if (type === 'LIFE') {
      titleEl.innerText = '💼 दैनिक आजीविका एवं जन-कल्याण (Daily Life & Earnings)';
      bodyEl.innerHTML = `
        <div class="modal-section-title">दैनिक रोजगार व आजीविका कार्य</div>
        <div class="jobs-list">
          ${LIFE_JOBS.map(j => `
            <div class="job-card">
              <div class="job-header">
                <span class="job-title">${j.titleHi}</span>
                <span class="income-badge">+₹${j.income}</span>
              </div>
              <p class="job-desc">${j.desc}</p>
              <div class="job-meta">
                <span>ऊर्जा खपत: ${j.energyCost}⚡</span>
                <span>समय: ${j.timeMinutes / 60} घंटे</span>
                ${j.repGain ? `<span class="text-green">+${j.repGain} प्रतिष्ठा</span>` : ''}
              </div>
              <button class="action-btn execute-job-btn" data-id="${j.id}">कार्य करें (Work)</button>
            </div>
          `).join('')}
        </div>

        <div class="modal-section-title mt-4">सीधी नागरिक सहायता (Direct Citizen Aid)</div>
        <div class="aid-list">
          ${DIRECT_CITIZEN_AIDS.map(a => `
            <div class="aid-card">
              <div class="aid-header">
                <span class="aid-title">${a.titleHi}</span>
                <span class="cost-badge">₹${a.cost}</span>
              </div>
              <p class="aid-desc">${a.desc}</p>
              <div class="aid-meta">
                <span>प्रतिष्ठा: +${a.repGain}</span>
                <span>जनता विश्वास: +${a.trustBoost}%</span>
              </div>
              <button class="action-btn execute-aid-btn" data-id="${a.id}">सहायता प्रदान करें (Help)</button>
            </div>
          `).join('')}
        </div>
      `;

      bodyEl.querySelectorAll('.execute-job-btn').forEach(btn => {
        btn.onclick = () => {
          const jid = btn.getAttribute('data-id');
          const res = LifeSimulationSystem.performJob(jid);
          alert(res.msg);
          this.updateHUD();
          this.openModal('LIFE');
        };
      });

      bodyEl.querySelectorAll('.execute-aid-btn').forEach(btn => {
        btn.onclick = () => {
          const aidId = btn.getAttribute('data-id');
          const res = LifeSimulationSystem.provideDirectAid(aidId);
          alert(res.msg);
          this.updateHUD();
          this.openModal('LIFE');
        };
      });
    } else if (type === 'MISSIONS') {
      titleEl.innerText = '📋 समुदाय व वार्ड मिशन (Community Missions)';
      const active = missionSystem.getActiveMissions();
      const completed = missionSystem.getCompletedMissions();

      bodyEl.innerHTML = `
        <div class="modal-section-title">सक्रिय नागरिक कार्य (${active.length})</div>
        <div class="mission-list">
          ${active.map(m => `
            <div class="mission-card">
              <div class="mission-card-header">
                <span class="mission-title">${m.titleHi}</span>
                <span class="mission-tag tag-${m.category.toLowerCase()}">${m.category}</span>
              </div>
              <p class="mission-desc">${m.descHi}</p>
              <div class="mission-rewards">
                <span><i class="fa-solid fa-coins text-gold"></i> खर्च: ₹${m.cost}</span>
                <span><i class="fa-solid fa-trophy text-saffron"></i> पुरस्कार: +₹${m.rewardMoney}</span>
                <span><i class="fa-solid fa-star text-blue"></i> प्रतिष्ठा: +${m.rewardRep}</span>
              </div>
              <button class="action-btn execute-mission-btn" data-id="${m.id}">
                कार्य पूर्ण करें (Submit)
              </button>
            </div>
          `).join('')}
        </div>

        ${completed.length > 0 ? `
          <div class="modal-section-title mt-4">पूर्ण किए गए कार्य (${completed.length})</div>
          <div class="completed-list">
            ${completed.map(m => `
              <div class="mission-card completed-card">
                <div class="mission-card-header">
                  <span class="mission-title">✓ ${m.titleHi}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;

      bodyEl.querySelectorAll('.execute-mission-btn').forEach(btn => {
        btn.onclick = () => {
          const mid = btn.getAttribute('data-id');
          const res = missionSystem.completeMission(mid);
          alert(res.msg);
          this.updateHUD();
          this.openModal('MISSIONS');
        };
      });
    } else if (type === 'CAMPAIGN') {
      titleEl.innerText = '🗳️ चुनावी रणनीति व प्रचार (Elections & Campaign)';
      bodyEl.innerHTML = `
        <div class="election-dashboard-card">
          <div class="election-header">
            <div>
              <h3>वार्ड 12 पार्षद चुनाव</h3>
              <p class="text-muted">जनसमर्थन एवं मतदाता रुझान</p>
            </div>
            <div class="support-badge">${gameState.election.playerSupport}% समर्थन</div>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${gameState.election.playerSupport}%"></div>
          </div>
          <div class="opponents-summary">
            ${gameState.election.opponents.map(o => `
              <div class="opp-row">
                <span>${o.name} (${o.party})</span>
                <span>${o.support}%</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="modal-section-title mt-3">प्रचार गतिविधियां (3D World में दिखाई देंगी)</div>
        <div class="campaign-actions-grid">
          ${CAMPAIGN_ACTIONS.map(a => `
            <div class="campaign-action-card">
              <h4>${a.nameHi}</h4>
              <p class="text-sm">${a.desc}</p>
              <div class="action-meta">
                <span>लागत: ₹${a.cost}</span>
                <span>ऊर्जा: ${a.energyCost}⚡</span>
                <span class="text-green">+${a.supportBoost}% समर्थन</span>
              </div>
              <button class="action-btn run-campaign-btn" data-id="${a.id}">आयोजन करें (Start)</button>
            </div>
          `).join('')}
        </div>

        <div class="contest-election-banner mt-4">
          <h3>मतदान दिवस (Election Day)</h3>
          <p>अगर आपकी तैयारी पूरी है, तो ईवीएम मतदान प्रक्रिया व मतगणना शुरू करें!</p>
          <button id="btn-run-election" class="action-btn contest-btn">🗳️ चुनाव लड़ें व मतगणना देखें</button>
        </div>
      `;

      bodyEl.querySelectorAll('.run-campaign-btn').forEach(btn => {
        btn.onclick = () => {
          const cid = btn.getAttribute('data-id');
          const res = PoliticalCampaignSystem.runCampaignAction(cid);
          if (cid === 'chowk_rally') {
            this.gameApp.events.spawnRallyCrowd(gameState.election.playerSupport);
          }
          alert(res.msg);
          this.updateHUD();
          this.openModal('CAMPAIGN');
        };
      });

      document.getElementById('btn-run-election').onclick = () => {
        const res = PoliticalCampaignSystem.contestElection();
        alert(res.msg);
        this.updateHUD();
        this.openModal('CAMPAIGN');
      };
    } else if (type === 'GOVERNANCE') {
      titleEl.innerText = '🏛️ नगर प्रशासन व विकास बोर्ड (Governance Dashboard)';
      // Trigger visible 3D governance meeting in world
      this.gameApp.events.spawnGovernanceMeetingScene();

      bodyEl.innerHTML = `
        <div class="budget-card">
          <div class="budget-title">नगर विकास बजट (Municipal Fund)</div>
          <div class="budget-amt">₹${gameState.governance.budget.toLocaleString('en-IN')}</div>
          <div class="stat-grid mt-2">
            <div>सफाई दर: ${gameState.worldStats.cleanliness}%</div>
            <div>सड़कें: ${gameState.worldStats.roadsQuality}%</div>
            <div>शिक्षा व स्वास्थ्य: ${gameState.worldStats.educationHealth}%</div>
            <div>जनता संतुष्टि: ${gameState.worldStats.publicSatisfaction}%</div>
          </div>
        </div>

        <div class="modal-section-title mt-3">लंबित जन-शिकायतें एवं विकास कार्य</div>
        <div class="complaints-list">
          ${gameState.governance.pendingComplaints.map(c => `
            <div class="complaint-card">
              <div class="complaint-head">
                <span class="complaint-title">${c.title}</span>
                <span class="complaint-cost">₹${c.cost.toLocaleString('en-IN')}</span>
              </div>
              <div class="complaint-impact">जनता संतुष्टि प्रभाव: +${c.satisfactionImpact}%</div>
              ${c.status === 'APPROVED' ? `
                <div class="approved-badge">✓ स्वीकृत एवं प्रगति पर</div>
              ` : `
                <button class="action-btn approve-btn" data-id="${c.id}">स्वीकृत करें (Approve)</button>
              `}
            </div>
          `).join('')}
        </div>
      `;

      bodyEl.querySelectorAll('.approve-btn').forEach(btn => {
        btn.onclick = () => {
          const cid = btn.getAttribute('data-id');
          const res = PoliticalCampaignSystem.approveComplaint(cid);
          alert(res.msg);
          this.updateHUD();
          this.openModal('GOVERNANCE');
        };
      });
    } else if (type === 'PROFILE') {
      titleEl.innerText = '🇮🇳 राजनीतिक जीवन व प्रोफाइल (Political Profile)';
      bodyEl.innerHTML = `
        <div class="profile-card">
          <h3>${gameState.player.name} (${gameState.player.age} वर्ष)</h3>
          <div class="profile-rank-badge">${gameState.getCurrentRank().hi}</div>
          <p class="profile-perk">विशेषाधिकार: ${gameState.getCurrentRank().perk}</p>
          <div class="skills-box mt-3">
            <h4>कौशल एवं क्षमताएं (Skills):</h4>
            <p>भाषण कला (Public Speaking): ${gameState.player.skills.publicSpeaking}/100</p>
            <p>प्रशासनिक समझ (Administration): ${gameState.player.skills.administration}/100</p>
            <p>रणनीति व संवाद (Negotiation): ${gameState.player.skills.negotiation}/100</p>
          </div>
          <div class="home-info mt-3">
            <h4>निवास व क्षेत्र:</h4>
            <p>${gameState.player.currentDistrict}</p>
          </div>
        </div>
      `;
    }
  }

  openCharacterCreator() {
    sound.playClick();
    this.modalOverlay.classList.remove('hidden');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');

    titleEl.innerText = '👤 नागरिक चरित्र निर्माण (Character Creator)';
    bodyEl.innerHTML = `
      <form id="char-creator-form" class="creator-form">
        <div class="form-group">
          <label>नाम (Player Name):</label>
          <input type="text" id="cc-name" class="form-input" value="${gameState.player.name}" required>
        </div>

        <div class="form-group">
          <label>आयु (Age):</label>
          <input type="number" id="cc-age" class="form-input" value="${gameState.player.age}" min="18" max="75">
        </div>

        <div class="form-group">
          <label>प्रारंभिक पृष्ठभूमि (Starting Background):</label>
          <select id="cc-background" class="form-select">
            ${BACKGROUNDS.map(b => `
              <option value="${b.id}" ${b.id === gameState.player.background ? 'selected' : ''}>
                ${b.nameHi} - ₹${b.money.toLocaleString('en-IN')}
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>हेयरस्टाइल / टोपी (Hairstyle / Cap):</label>
          <select id="cc-hair-style" class="form-select">
            <option value="modern" ${gameState.player.hairStyle === 'modern' ? 'selected' : ''}>आधुनिक बाल (Modern Hair)</option>
            <option value="traditional" ${gameState.player.hairStyle === 'traditional' ? 'selected' : ''}>पारंपरिक बाल (Traditional)</option>
            <option value="cap" ${gameState.player.hairStyle === 'cap' ? 'selected' : ''}>गांधी टोपी (Gandhi Topi)</option>
          </select>
        </div>

        <div class="form-group">
          <label>कुर्ता / पोशाक रंग (Kurta Color):</label>
          <div class="color-options">
            <input type="color" id="cc-shirt" value="${gameState.player.shirtColor}">
          </div>
        </div>

        <div class="form-group">
          <label>गमछा / पटका रंग (Stole Color):</label>
          <div class="color-options">
            <input type="color" id="cc-sash" value="${gameState.player.sashColor}">
          </div>
        </div>

        <div class="form-group">
          <label>त्वचा का रंग (Skin Tone):</label>
          <div class="color-options">
            <input type="color" id="cc-skin" value="${gameState.player.skinColor}">
          </div>
        </div>

        <button type="submit" class="action-btn save-char-btn">सुरक्षित करें व 3D में लागू करें</button>
      </form>
    `;

    document.getElementById('char-creator-form').onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('cc-name').value.trim() || 'विक्रम शर्मा';
      const age = parseInt(document.getElementById('cc-age').value) || 25;
      const bgId = document.getElementById('cc-background').value;
      const hairStyle = document.getElementById('cc-hair-style').value;
      const shirt = document.getElementById('cc-shirt').value;
      const sash = document.getElementById('cc-sash').value;
      const skin = document.getElementById('cc-skin').value;

      gameState.player.name = name;
      gameState.player.age = age;
      gameState.player.background = bgId;
      gameState.player.hairStyle = hairStyle;
      gameState.player.shirtColor = shirt;
      gameState.player.sashColor = sash;
      gameState.player.skinColor = skin;

      const selectedBg = BACKGROUNDS.find(b => b.id === bgId);
      if (selectedBg) {
        gameState.player.skills = { ...selectedBg.skills };
      }

      gameState.save();
      this.gameApp.player.rebuild(gameState.player);
      this.updateHUD();
      sound.playMissionComplete();
      this.closeModal();
      alert(`बधाई! आपका नागरिक चरित्र "${name}" सफलतापूर्वक 3D दुनिया में अपडेट हो गया है!`);
    };
  }

  closeModal() {
    this.modalOverlay.classList.add('hidden');
  }
}
