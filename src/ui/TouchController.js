// Virtual Touch Joystick and Action Buttons for Mobile Android
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
      joystickX: 0,
      joystickY: 0,
      cameraYaw: 0,
      jump: false
    };

    this.touchData = {
      joystickTouchId: null,
      joystickCenter: { x: 0, y: 0 },
      cameraTouchId: null,
      lastCamX: 0,
      lastCamY: 0
    };

    this.setupDOM();
    this.bindKeyboard();
    this.bindTouch();
  }

  setupDOM() {
    // Check if controls container already exists
    let container = document.getElementById('mobile-controls-layer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'mobile-controls-layer';
      container.innerHTML = `
        <!-- Virtual Joystick Area -->
        <div id="v-joystick-zone">
          <div id="v-joystick-base">
            <div id="v-joystick-thumb"></div>
          </div>
        </div>

        <!-- Action Buttons Area -->
        <div id="action-buttons-zone">
          <button id="btn-talk" class="game-action-btn" title="बात करें">
            <i class="fa-solid fa-comments"></i>
            <span>बात करें</span>
          </button>
          <button id="btn-interact" class="game-action-btn" title="कार्यवाही / निरीक्षण">
            <i class="fa-solid fa-hand-holding-hand"></i>
            <span>कार्रवाई</span>
          </button>
          <button id="btn-jump" class="game-action-btn" title="कूदें">
            <i class="fa-solid fa-person-running"></i>
            <span>कूदें</span>
          </button>
        </div>
      `;
      document.body.appendChild(container);
    }

    this.joystickBase = document.getElementById('v-joystick-base');
    this.joystickThumb = document.getElementById('v-joystick-thumb');

    // Attach button events
    const btnTalk = document.getElementById('btn-talk');
    const btnInteract = document.getElementById('btn-interact');
    const btnJump = document.getElementById('btn-jump');

    if (btnTalk) {
      btnTalk.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.onTalk) this.onTalk();
      });
    }

    if (btnInteract) {
      btnInteract.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.onInteract) this.onInteract();
      });
    }

    if (btnJump) {
      btnJump.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.input.jump = true;
        setTimeout(() => { this.input.jump = false; }, 150);
        if (this.onJump) this.onJump();
      });
    }
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': this.input.moveForward = true; break;
        case 's': case 'arrowdown': this.input.moveBackward = true; break;
        case 'a': case 'arrowleft': this.input.moveLeft = true; break;
        case 'd': case 'arrowright': this.input.moveRight = true; break;
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
        case ' ': this.input.jump = false; break;
      }
    });
  }

  bindTouch() {
    const zone = document.getElementById('v-joystick-zone');
    if (!zone) return;

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (this.touchData.joystickTouchId === null) {
          this.touchData.joystickTouchId = touch.identifier;
          const rect = zone.getBoundingClientRect();
          this.touchData.joystickCenter = {
            x: touch.clientX,
            y: touch.clientY
          };
          this.joystickBase.style.display = 'block';
          this.joystickBase.style.left = `${touch.clientX - 60}px`;
          this.joystickBase.style.top = `${touch.clientY - 60}px`;
          this.joystickThumb.style.transform = `translate(0px, 0px)`;
          break;
        }
      }
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === this.touchData.joystickTouchId) {
          const dx = touch.clientX - this.touchData.joystickCenter.x;
          const dy = touch.clientY - this.touchData.joystickCenter.y;
          const dist = Math.hypot(dx, dy);
          const maxRadius = 45;

          const clampedDist = Math.min(dist, maxRadius);
          const angle = Math.atan2(dy, dx);

          const thumbX = Math.cos(angle) * clampedDist;
          const thumbY = Math.sin(angle) * clampedDist;

          this.joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

          // Normalize to [-1, 1]
          this.input.joystickX = thumbX / maxRadius;
          this.input.joystickY = thumbY / maxRadius;
          break;
        }
      }
    }, { passive: false });

    const endJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchData.joystickTouchId) {
          this.touchData.joystickTouchId = null;
          this.input.joystickX = 0;
          this.input.joystickY = 0;
          this.joystickThumb.style.transform = `translate(0px, 0px)`;
          this.joystickBase.style.display = 'none';
          break;
        }
      }
    };

    zone.addEventListener('touchend', endJoystick);
    zone.addEventListener('touchcancel', endJoystick);

    // Camera drag rotation on right half of canvas
    this.canvas.addEventListener('touchstart', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.clientX > window.innerWidth * 0.4 && this.touchData.cameraTouchId === null) {
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
          this.touchData.lastCamX = touch.clientX;
          this.touchData.lastCamY = touch.clientY;
          this.input.cameraYaw -= deltaX * 0.007;
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
  }
}
