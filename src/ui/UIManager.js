// Mobile UI, Character Creator, HUD, Modal Menus, and Dialogue Overlays
import { gameState, BACKGROUNDS, RANKS } from '../systems/GameState.js';
import { missionSystem } from '../systems/MissionSystem.js';
import { PoliticalCampaignSystem, CAMPAIGN_ACTIONS } from '../systems/PoliticalSystem.js';
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
      <!-- Top Status Bar -->
      <div class="hud-top-bar">
        <div class="hud-player-badge" id="hud-badge-btn">
          <div class="hud-avatar-circle" id="hud-avatar-icon">🇮🇳</div>
          <div class="hud-player-meta">
            <span class="hud-name" id="hud-player-name">${gameState.player.name}</span>
            <span class="hud-rank" id="hud-player-rank">${gameState.getCurrentRank().hi}</span>
          </div>
        </div>

        <div class="hud-stats-group">
          <div class="stat-pill money-pill">
            <i class="fa-solid fa-indian-rupee-sign"></i>
            <span id="hud-money">${gameState.player.money.toLocaleString('en-IN')}</span>
          </div>
          <div class="stat-pill rep-pill">
            <i class="fa-solid fa-star"></i>
            <span id="hud-rep">${gameState.player.reputation}</span>
          </div>
          <div class="stat-pill time-pill">
            <i class="fa-solid fa-clock"></i>
            <span id="hud-time">दिन ${gameState.time.day} • ${gameState.time.phase}</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons Top Right -->
      <div class="hud-quick-nav">
        <button id="nav-btn-missions" class="hud-nav-btn" title="मिशन">
          <i class="fa-solid fa-list-check"></i>
          <span>मिशन</span>
        </button>
        <button id="nav-btn-campaign" class="hud-nav-btn" title="चुनाव एवं प्रचार">
          <i class="fa-solid fa-bullhorn"></i>
          <span>प्रचार</span>
        </button>
        <button id="nav-btn-gov" class="hud-nav-btn" title="शासन / नगर निगम">
          <i class="fa-solid fa-landmark"></i>
          <span>शासन</span>
        </button>
        <button id="nav-btn-creator" class="hud-nav-btn" title="चरित्र सम्पादन">
          <i class="fa-solid fa-user-pen"></i>
          <span>चरित्र</span>
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
          <span id="dialogue-speaker-name" class="speaker-name">नागरिक</span>
          <span id="dialogue-speaker-role" class="speaker-role">दुकानदार</span>
        </div>
        <div id="dialogue-content" class="dialogue-content">बातचीत...</div>
        <div class="dialogue-actions" id="dialogue-actions">
          <button id="dialogue-next-btn" class="dialogue-btn primary-btn">आगे बढ़ें</button>
          <button id="dialogue-close-btn" class="dialogue-btn secondary-btn">समाप्त करें</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.hudElement);
    this.bindHUDEvents();
  }

  bindHUDEvents() {
    document.getElementById('nav-btn-missions').onclick = () => this.openModal('MISSIONS');
    document.getElementById('nav-btn-campaign').onclick = () => this.openModal('CAMPAIGN');
    document.getElementById('nav-btn-gov').onclick = () => this.openModal('GOVERNANCE');
    document.getElementById('nav-btn-creator').onclick = () => this.openCharacterCreator();
    document.getElementById('hud-badge-btn').onclick = () => this.openModal('PROFILE');

    document.getElementById('dialogue-close-btn').onclick = () => {
      this.closeDialogue();
    };
  }

  updateHUD() {
    document.getElementById('hud-player-name').innerText = gameState.player.name;
    document.getElementById('hud-player-rank').innerText = gameState.getCurrentRank().hi;
    document.getElementById('hud-money').innerText = gameState.player.money.toLocaleString('en-IN');
    document.getElementById('hud-rep').innerText = gameState.player.reputation;
    document.getElementById('hud-time').innerText = `दिन ${gameState.time.day} • ${gameState.time.phase}`;
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
    const nextBtn = document.getElementById('dialogue-next-btn');

    nameEl.innerText = npc.name;
    roleEl.innerText = npc.role;
    contentEl.innerText = npc.dialogues[npc.dialogueIndex % npc.dialogues.length];

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

    if (type === 'MISSIONS') {
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

        <div class="modal-section-title mt-3">प्रचार गतिविधियां (Campaign Activities)</div>
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
              <button class="action-btn run-campaign-btn" data-id="${a.id}">आयोजन करें</button>
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
            <h4>निवास:</h4>
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
          <label>पारिवारिक व आर्थिक पृष्ठभूमि (Starting Background):</label>
          <select id="cc-background" class="form-select">
            ${BACKGROUNDS.map(b => `
              <option value="${b.id}" ${b.id === gameState.player.background ? 'selected' : ''}>
                ${b.nameHi} - ₹${b.money.toLocaleString('en-IN')}
              </option>
            `).join('')}
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

        <button type="submit" class="action-btn save-char-btn">सुरक्षित करें व खेल में लागू करें</button>
      </form>
    `;

    document.getElementById('char-creator-form').onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('cc-name').value.trim() || 'विक्रम शर्मा';
      const age = parseInt(document.getElementById('cc-age').value) || 25;
      const bgId = document.getElementById('cc-background').value;
      const shirt = document.getElementById('cc-shirt').value;
      const sash = document.getElementById('cc-sash').value;
      const skin = document.getElementById('cc-skin').value;

      gameState.player.name = name;
      gameState.player.age = age;
      gameState.player.background = bgId;
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
      alert(`बधाई! आपका नागरिक चरित्र "${name}" सफलतापूर्वक तैयार हो गया है!`);
    };
  }

  closeModal() {
    this.modalOverlay.classList.add('hidden');
  }
}
