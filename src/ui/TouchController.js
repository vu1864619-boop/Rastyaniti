// Virtual Touch Joystick and Action Buttons for Mobile Android & Desktop
export class TouchController {
  constructor(canvasElement, onInteract, onJump, onTalk) {
    this.canvas = canvasElement;
    this.onInteract = onInteract;
    this.onJump = onJump;
    this.onTalk = onTalk;

    this.input = {
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      isRunning: false,
      joystickX: 0,
      joystickY: 0,
      cameraYaw: 0,
      cameraPitch: 0.25, // Default pleasant third-person angle (~14 degrees)
      jump: false
    };

    this.touchData = {
      joystickTouchId: null,
      isMouseJoystickActive: false,
      joystickCenter: { x: 0, y: 0 },
      cameraTouchId: null,
      lastCamX: 0,
      lastCamY: 0
    };

    this.maxRadius = 45;

    this.setupDOM();
    this.bindKeyboard();
    this.bindJoystickEvents();
    this.bindCameraEvents();
  }

  setupDOM() {
    let container = document.getElementById('mobile-controls-layer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mobile-controls-layer';
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <!-- Virtual Joystick Area - Bottom Left -->
      <div id="v-joystick-zone" role="region" aria-label="Movement Controls">
        <div id="v-joystick-base">
          <div class="joystick-guide-ring"></div>
          <div class="joystick-arrows">
            <span class="j-arrow up"><i class="fa-solid fa-chevron-up"></i></span>
            <span class="j-arrow down"><i class="fa-solid fa-chevron-down"></i></span>
            <span class="j-arrow left"><i class="fa-solid fa-chevron-left"></i></span>
            <span class="j-arrow right"><i class="fa-solid fa-chevron-right"></i></span>
          </div>
          <div id="v-joystick-thumb">
            <i class="fa-solid fa-person-walking"></i>
          </div>
          <div class="joystick-label">चलें / MOVE</div>
        </div>
      </div>

      <!-- Hint for camera look -->
      <div id="touch-camera-hint">
        <i class="fa-solid fa-arrows-up-down-left-right"></i> स्वाइप करके देखें / Drag to Look
      </div>

      <!-- Action Buttons Area - Bottom Right -->
      <div id="action-buttons-zone" role="region" aria-label="Actions">
        <button id="btn-run" class="game-action-btn" title="दौड़ें / Run (Toggle)">
          <i class="fa-solid fa-person-running"></i>
          <span>दौड़ें</span>
        </button>
        <button id="btn-jump" class="game-action-btn" title="कूदें / Jump">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>
          <span>कूदें</span>
        </button>
        <button id="btn-talk" class="game-action-btn" title="बात करें / Talk">
          <i class="fa-solid fa-comments"></i>
          <span>बात करें</span>
        </button>
        <button id="btn-interact" class="game-action-btn" title="कार्रवाई / Interact">
          <i class="fa-solid fa-hand"></i>
          <span>कार्रवाई</span>
        </button>
      </div>
    `;

    this.joystickZone = document.getElementById('v-joystick-zone');
    this.joystickBase = document.getElementById('v-joystick-base');
    this.joystickThumb = document.getElementById('v-joystick-thumb');

    // Attach button events
    const btnTalk = document.getElementById('btn-talk');
    const btnInteract = document.getElementById('btn-interact');
    const btnJump = document.getElementById('btn-jump');
    const btnRun = document.getElementById('btn-run');

    if (btnTalk) {
      const triggerTalk = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.onTalk) this.onTalk();
      };
      btnTalk.addEventListener('pointerdown', triggerTalk);
    }

    if (btnInteract) {
      const triggerInteract = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.onInteract) this.onInteract();
      };
      btnInteract.addEventListener('pointerdown', triggerInteract);
    }

    if (btnJump) {
      const triggerJump = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.input.jump = true;
        setTimeout(() => { this.input.jump = false; }, 200);
        if (this.onJump) this.onJump();
      };
      btnJump.addEventListener('pointerdown', triggerJump);
    }

    if (btnRun) {
      const toggleRun = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.input.isRunning = !this.input.isRunning;
        btnRun.classList.toggle('active', this.input.isRunning);
      };
      btnRun.addEventListener('pointerdown', toggleRun);
    }
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': this.input.moveForward = true; break;
        case 's': case 'arrowdown': this.input.moveBackward = true; break;
        case 'a': case 'arrowleft': this.input.moveLeft = true; break;
        case 'd': case 'arrowright': this.input.moveRight = true; break;
        case 'shift': this.input.isRunning = true; break;
        case ' ':
          this.input.jump = true;
          if (this.onJump) this.onJump();
          break;
        case 'e':
          if (this.onInteract) this.onInteract();
          break;
        case 't':
          if (this.onTalk) this.onTalk();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': this.input.moveForward = false; break;
        case 's': case 'arrowdown': this.input.moveBackward = false; break;
        case 'a': case 'arrowleft': this.input.moveLeft = false; break;
        case 'd': case 'arrowright': this.input.moveRight = false; break;
        case 'shift': this.input.isRunning = false; break;
        case ' ': this.input.jump = false; break;
      }
    });
  }

  calculateJoystickCenter() {
    const rect = this.joystickBase.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  updateJoystickVisual(clientX, clientY) {
    const dx = clientX - this.touchData.joystickCenter.x;
    const dy = clientY - this.touchData.joystickCenter.y;
    const dist = Math.hypot(dx, dy);

    const clampedDist = Math.min(dist, this.maxRadius);
    const angle = Math.atan2(dy, dx);

    const thumbX = Math.cos(angle) * clampedDist;
    const thumbY = Math.sin(angle) * clampedDist;

    this.joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

    // Calculate deadzone and normalized -1 to +1 inputs
    const deadzone = 0.08;
    const normalizedMag = clampedDist / this.maxRadius;

    if (normalizedMag > deadzone) {
      this.input.joystickX = (thumbX / this.maxRadius);
      this.input.joystickY = (thumbY / this.maxRadius);
    } else {
      this.input.joystickX = 0;
      this.input.joystickY = 0;
    }
  }

  resetJoystick() {
    this.touchData.joystickTouchId = null;
    this.touchData.isMouseJoystickActive = false;
    this.input.joystickX = 0;
    this.input.joystickY = 0;
    this.joystickThumb.style.transform = `translate(0px, 0px)`;
    this.joystickBase.classList.remove('joystick-active');
  }

  bindJoystickEvents() {
    if (!this.joystickZone) return;

    // 1. Touch Events for Mobile
    this.joystickZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (this.touchData.joystickTouchId === null) {
          this.touchData.joystickTouchId = touch.identifier;
          this.touchData.joystickCenter = this.calculateJoystickCenter();
          this.joystickBase.classList.add('joystick-active');
          this.updateJoystickVisual(touch.clientX, touch.clientY);
          break;
        }
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.touchData.joystickTouchId === null) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === this.touchData.joystickTouchId) {
          this.updateJoystickVisual(touch.clientX, touch.clientY);
          break;
        }
      }
    }, { passive: false });

    const handleTouchEnd = (e) => {
      if (this.touchData.joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchData.joystickTouchId) {
          this.resetJoystick();
          break;
        }
      }
    };

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // 2. Mouse Drag Events for Desktop / Laptop browser testing
    this.joystickZone.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      this.touchData.isMouseJoystickActive = true;
      this.touchData.joystickCenter = this.calculateJoystickCenter();
      this.joystickBase.classList.add('joystick-active');
      this.updateJoystickVisual(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.touchData.isMouseJoystickActive) return;
      this.updateJoystickVisual(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (this.touchData.isMouseJoystickActive) {
        this.resetJoystick();
      }
    });
  }

  isPointInUI(clientX, clientY) {
    // 1. Bottom-Left Joystick safe zone
    if (clientX <= 190 && clientY >= window.innerHeight - 190) return true;

    // 2. Bottom-Right Action Buttons safe zone
    if (clientX >= window.innerWidth - 170 && clientY >= window.innerHeight - 180) return true;

    // 3. Top HUD bar safe zone
    if (clientY <= 70) return true;

    // 4. Quick nav drawer if open
    const drawer = document.getElementById('hud-quick-nav-drawer');
    if (drawer && !drawer.classList.contains('hidden')) {
      const rect = drawer.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return true;
      }
    }

    // 5. Open dialog or modal
    const dialogue = document.getElementById('dialogue-box');
    if (dialogue && !dialogue.classList.contains('hidden')) {
      const rect = dialogue.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return true;
      }
    }

    const modal = document.getElementById('modal-overlay');
    if (modal && !modal.classList.contains('hidden')) {
      return true;
    }

    return false;
  }

  bindCameraEvents() {
    // Pitch limit: exactly +/-60 degrees (-1.05 to +1.05 radians)
    // Prevents upside down flips while allowing full, comfortable up/down tilt
    const minPitch = -1.05; // -60 degrees looking upward toward player
    const maxPitch = 1.05;  // +60 degrees overhead perspective
    const yawSensitivity = 0.0055;
    const pitchSensitivity = 0.0045;

    // 1. Mobile Touch Look
    this.canvas.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (!this.isPointInUI(touch.clientX, touch.clientY) && this.touchData.cameraTouchId === null) {
          this.touchData.cameraTouchId = touch.identifier;
          this.touchData.lastCamX = touch.clientX;
          this.touchData.lastCamY = touch.clientY;
          break;
        }
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === this.touchData.cameraTouchId) {
          const deltaX = touch.clientX - this.touchData.lastCamX;
          const deltaY = touch.clientY - this.touchData.lastCamY;
          this.touchData.lastCamX = touch.clientX;
          this.touchData.lastCamY = touch.clientY;

          // Drag left => rotate camera left; Drag right => rotate camera right
          this.input.cameraYaw += deltaX * yawSensitivity;

          // Drag up => camera tilts down; Drag down => camera tilts up
          this.input.cameraPitch += deltaY * pitchSensitivity;
          this.input.cameraPitch = Math.max(minPitch, Math.min(maxPitch, this.input.cameraPitch));
          break;
        }
      }
    }, { passive: false });

    const endCamera = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchData.cameraTouchId) {
          this.touchData.cameraTouchId = null;
          break;
        }
      }
    };

    this.canvas.addEventListener('touchend', endCamera);
    this.canvas.addEventListener('touchcancel', endCamera);

    // 2. Desktop Mouse Drag Look
    let isMouseLooking = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.isPointInUI(e.clientX, e.clientY)) {
        isMouseLooking = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseLooking) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      // Drag left => rotate camera left; Drag right => rotate camera right
      this.input.cameraYaw += deltaX * yawSensitivity;

      // Drag up/down controls pitch
      this.input.cameraPitch += deltaY * pitchSensitivity;
      this.input.cameraPitch = Math.max(minPitch, Math.min(maxPitch, this.input.cameraPitch));
    });

    window.addEventListener('mouseup', () => {
      isMouseLooking = false;
    });
  }
}
