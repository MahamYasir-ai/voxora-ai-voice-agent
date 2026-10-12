/**
 * Voxora AI - Interactive Client Engine
 * Controls Voice Calling, Two-Way Text Chat, OmniDimension Widget, and Real Services
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initWaveformVisualizer();
  initDemoTabs();
  initVoiceCallEngine();
  initChatEngine();
  initPromptChips();
  initOmniWidgetIntegration();
  initBusinessServicesForm();
});

/* ==========================================================================
   1. NAVIGATION & GLOBAL CALL BUTTONS
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinksList.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (
        navLinksList.classList.contains('is-open') &&
        !navLinksList.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        navLinksList.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for standard links
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          if (navLinksList) navLinksList.classList.remove('is-open');
        }
      }
    });
  });

  // Global "Talk to Voxora" buttons (Header, Hero)
  const allCallTriggers = document.querySelectorAll('.btn-start-call-nav, #hero-call-btn');
  allCallTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const demoSection = document.getElementById('live-demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Switch to voice tab and launch voice call
      const voiceTab = document.getElementById('tab-voice');
      if (voiceTab) voiceTab.click();

      setTimeout(() => {
        const startTrigger = document.getElementById('start-call-trigger');
        if (startTrigger) startTrigger.click();
      }, 500);

      if (navLinksList) navLinksList.classList.remove('is-open');
    });
  });
}

/* ==========================================================================
   2. DEMO TABS CONTROLLER (Voice Call / Text Chat / Omni Widget)
   ========================================================================== */
function initDemoTabs() {
  const tabs = document.querySelectorAll('.demo-tab');
  const panels = document.querySelectorAll('.demo-tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = targetPanelId === 'panel-chat' ? 'block' : 'block';
      }
    });
  });

  // Shortcut from voice idle screen: "Prefer to Type? Open Chat"
  const switchToChatBtn = document.getElementById('switch-to-chat-btn');
  if (switchToChatBtn) {
    switchToChatBtn.addEventListener('click', () => {
      const chatTab = document.getElementById('tab-chat');
      if (chatTab) chatTab.click();
    });
  }
}

/* ==========================================================================
   3. VELOURA STUDIO CONVERSATIONAL INTELLIGENCE (Exact Agent Rules)
   ========================================================================== */
function getVoxoraResponse(userText) {
  const text = (userText || '').toLowerCase().trim();

  // 1. Services
  if (text.includes('service') || text.includes('offer') || text.includes('treatment') || text.includes('what do you do')) {
    return "We offer haircuts, hairstyling, hair coloring, facials, manicures, pedicures, and bridal makeup at Veloura Studio.";
  }

  // 2. Operating Hours / Sundays
  if (text.includes('sunday')) {
    return "We're closed on Sundays. Our hours are Monday to Saturday, 10:00 AM to 8:00 PM.";
  }
  if (text.includes('hour') || text.includes('time') || text.includes('open') || text.includes('close') || text.includes('timing')) {
    return "Our opening hours are Monday to Saturday, 10:00 AM to 8:00 PM. We are closed on Sundays.";
  }

  // 3. Location / Address in Karachi
  if (text.includes('location') || text.includes('where') || text.includes('address') || text.includes('karachi') || text.includes('directions')) {
    return "We are based in Karachi, Pakistan. I don't have a street address on file right now. Would you like our team to call you back with directions?";
  }

  // 4. Pricing / Cost / Discounts
  if (text.includes('price') || text.includes('cost') || text.includes('rate') || text.includes('how much') || text.includes('discount') || text.includes('fee')) {
    return "I don't have exact pricing or discount information available on this line. However, I can take your name and number, and our team will call you right back with full pricing details.";
  }

  // 5. Booking / Appointments
  if (text.includes('book') || text.includes('appointment') || text.includes('haircut tomorrow') || text.includes('reserve') || text.includes('slot')) {
    return "I can certainly take your appointment request! Which service are you interested in, and what is your preferred date and time? Please also share your contact number for a confirmation callback.";
  }

  // 6. Contact Number / Callback details provided
  if (/\d{4,}/.test(text) || text.includes('03') || text.includes('+92')) {
    return "Thank you! I have recorded your contact number and requested details. Our salon front desk will call you back shortly to confirm staff availability and finalize your appointment.";
  }

  // 7. Haircut / Facial / Makeup specific inquiries
  if (text.includes('haircut') || text.includes('hair color') || text.includes('facial') || text.includes('makeup') || text.includes('bridal') || text.includes('manicure') || text.includes('pedicure')) {
    return "Yes, we specialize in that service at Veloura Studio! Would you like to request an appointment date and time, or have our specialist call you back with more details?";
  }

  // 8. Staff / Stylist inquiries
  if (text.includes('stylist') || text.includes('staff') || text.includes('who') || text.includes('specialist')) {
    return "Our appointments are handled by our senior certified stylists. I can take your request and have our front desk confirm specific staff availability with you.";
  }

  // 9. Goodbyes
  if (text.includes('bye') || text.includes('thank') || text.includes('done') || text.includes('exit')) {
    return "Thank you for calling Veloura Studio. Have a great day! Goodbye.";
  }

  // 10. Default Conversational Fallback
  return "Thank you for reaching out to Veloura Studio in Karachi. I can assist you with our services, opening hours (Mon-Sat 10 AM-8 PM), or taking an appointment request for a confirmation callback. How can I help?";
}

/* ==========================================================================
   4. VOICE CALL ENGINE (Interactive Microphone & In-Browser Voice)
   ========================================================================== */
function initVoiceCallEngine() {
  const idleState = document.getElementById('voice-idle-state');
  const activeState = document.getElementById('voice-active-state');
  const startBtn = document.getElementById('start-call-trigger');
  const endBtn = document.getElementById('end-call-btn');
  const muteBtn = document.getElementById('mute-mic-btn');
  const timerLabel = document.getElementById('call-timer');
  const captionText = document.getElementById('live-caption-text');
  const muteLabel = document.getElementById('mute-label');

  let callTimerInterval = null;
  let callSeconds = 0;
  let isMuted = false;
  let recognition = null;
  let isCallActive = false;

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick natural sounding female voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female')));
      if (naturalVoice) utterance.voice = naturalVoice;

      window.speechSynthesis.speak(utterance);
    }
  }

  function startRecognition() {
    if (!SpeechRecognition || isMuted) return;

    try {
      if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.trim();
            if (transcript.length > 0 && isCallActive) {
              if (captionText) captionText.textContent = `You: "${transcript}"`;

              // Generate Voxora Response
              setTimeout(() => {
                if (!isCallActive) return;
                const reply = getVoxoraResponse(transcript);
                if (captionText) captionText.textContent = `Voxora: "${reply}"`;
                speakText(reply);
              }, 400);
            }
          }
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition status:', e.error);
        };

        recognition.onend = () => {
          if (isCallActive && !isMuted) {
            try { recognition.start(); } catch (_) {}
          }
        };
      }

      recognition.start();
    } catch (err) {
      console.warn('Mic recognition notice:', err);
    }
  }

  function startCall() {
    isCallActive = true;
    idleState.style.display = 'none';
    activeState.style.display = 'flex';

    // Start Timer
    callSeconds = 0;
    if (timerLabel) timerLabel.textContent = '00:00';
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
      const secs = String(callSeconds % 60).padStart(2, '0');
      if (timerLabel) timerLabel.textContent = `${mins}:${secs}`;
    }, 1000);

    // Initial Greeting
    const welcome = "Hello, thank you for calling Veloura Studio. How can I assist you today?";
    if (captionText) captionText.textContent = `Voxora: "${welcome}"`;
    speakText(welcome);

    // Start Listening
    startRecognition();

    // Also trigger OmniDimension widget if loaded
    triggerOmniDimensionWidget();
  }

  function endCall() {
    isCallActive = false;
    clearInterval(callTimerInterval);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (recognition) {
      try { recognition.stop(); } catch (_) {}
    }

    activeState.style.display = 'none';
    idleState.style.display = 'flex';
  }

  if (startBtn) startBtn.addEventListener('click', startCall);
  if (endBtn) endBtn.addEventListener('click', endCall);

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (isMuted) {
        if (muteLabel) muteLabel.textContent = 'Unmute Mic';
        if (recognition) try { recognition.stop(); } catch (_) {}
      } else {
        if (muteLabel) muteLabel.textContent = 'Mute Mic';
        startRecognition();
      }
    });
  }

  // Pre-load voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}

/* ==========================================================================
   5. TWO-WAY TEXT CHAT ENGINE
   ========================================================================== */
function initChatEngine() {
  const form = document.getElementById('chat-input-form');
  const input = document.getElementById('chat-user-input');
  const thread = document.getElementById('chat-messages');

  if (!form || !input || !thread) return;

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg msg-${sender === 'user' ? 'user' : 'agent'}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.textContent = sender === 'user' ? 'You' : 'V';

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'msg-body';

    const authorSpan = document.createElement('span');
    authorSpan.className = 'msg-author';
    authorSpan.textContent = sender === 'user' ? 'Caller' : 'Voxora (Receptionist)';

    const p = document.createElement('p');
    p.textContent = text;

    bodyDiv.appendChild(authorSpan);
    bodyDiv.appendChild(p);
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bodyDiv);

    thread.appendChild(msgDiv);
    thread.scrollTop = thread.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    appendMessage('user', query);
    input.value = '';

    setTimeout(() => {
      const response = getVoxoraResponse(query);
      appendMessage('agent', response);
    }, 350);
  });
}

/* ==========================================================================
   6. QUICK PROMPT CHIPS HELPER
   ========================================================================== */
function initPromptChips() {
  const chips = document.querySelectorAll('.prompt-chip');
  const chatInput = document.getElementById('chat-user-input');
  const chatForm = document.getElementById('chat-input-form');
  const toast = document.getElementById('copy-toast');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt') || chip.innerText.trim();

      // Check which tab is currently active
      const activeTab = document.querySelector('.demo-tab.active');
      const isChatTab = activeTab && activeTab.id === 'tab-chat';

      if (isChatTab && chatInput && chatForm) {
        chatInput.value = promptText;
        chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
      } else {
        // If on voice tab or idle, execute in voice call or switch to chat
        const liveCaption = document.getElementById('live-caption-text');
        const activeCallState = document.getElementById('voice-active-state');

        if (activeCallState && activeCallState.style.display !== 'none') {
          if (liveCaption) liveCaption.textContent = `You: "${promptText}"`;
          setTimeout(() => {
            const reply = getVoxoraResponse(promptText);
            if (liveCaption) liveCaption.textContent = `Voxora: "${reply}"`;
            if ('speechSynthesis' in window) {
              const utter = new SpeechSynthesisUtterance(reply);
              window.speechSynthesis.speak(utter);
            }
          }, 350);
        } else {
          // Switch to chat and ask
          const chatTab = document.getElementById('tab-chat');
          if (chatTab) chatTab.click();
          setTimeout(() => {
            if (chatInput && chatForm) {
              chatInput.value = promptText;
              chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }
          }, 200);
        }
      }

      if (toast) {
        toast.textContent = `Query sent to Voxora: "${promptText}"`;
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 3000);
      }
    });
  });
}

/* ==========================================================================
   7. OMNIDIMENSION OFFICIAL WIDGET TRIGGER & CLOSE CONTROLLER
   ========================================================================== */
function triggerOmniDimensionWidget() {
  // Restore any hidden widget elements
  const widgetElements = document.querySelectorAll('iframe[src*="omnidim"], div[id*="omnidim"], div[class*="omnidim"]');
  widgetElements.forEach((el) => {
    if (el.style.display === 'none') {
      el.style.display = '';
    }
  });

  const launcher = document.querySelector('[id*="omnidim"] button, [class*="omnidim"] button, iframe[src*="omnidim"]');
  if (launcher && typeof launcher.click === 'function') {
    try { launcher.click(); } catch (_) {}
  }

  // Check and display close button shortly after opening
  setTimeout(positionFloatingCloseButton, 300);
  setTimeout(positionFloatingCloseButton, 900);
}

function positionFloatingCloseButton() {
  const closeBtn = document.getElementById('omnidim-floating-close-btn');
  if (!closeBtn) return;

  const chatPanel = document.querySelector('iframe[src*="omnidim"], div[id*="omnidimension"][style*="position: fixed"], div[class*="omnidim"][style*="position: fixed"], .omnidim-chat-window');
  
  if (chatPanel) {
    const rect = chatPanel.getBoundingClientRect();
    // Only show close button if the panel is open/expanded (height & width > 120px)
    if (rect.height > 120 && rect.width > 120 && chatPanel.style.display !== 'none') {
      closeBtn.classList.add('is-active');
      const topPos = Math.max(86, rect.top - 12);
      const rightPos = Math.max(16, window.innerWidth - rect.right + 4);
      closeBtn.style.top = `${topPos}px`;
      closeBtn.style.right = `${rightPos}px`;
      return;
    }
  }

  closeBtn.classList.remove('is-active');
}

function initOmniWidgetIntegration() {
  const triggerBtn = document.getElementById('trigger-widget-btn');
  const closeBtn = document.getElementById('omnidim-floating-close-btn');

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      triggerOmniDimensionWidget();
      const toast = document.getElementById('copy-toast');
      if (toast) {
        toast.textContent = 'OmniDimension voice assistant opened. Click ✕ anytime to close.';
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 4000);
      }
    });
  }

  // Dedicated Close Button Handler
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // Find all widget panels or iframes and hide them
      const widgetPanels = document.querySelectorAll('iframe[src*="omnidim"], div[id*="omnidim"][style*="position: fixed"], div[class*="omnidim"][style*="position: fixed"], .omnidim-chat-window');
      
      widgetPanels.forEach((panel) => {
        panel.style.display = 'none';
      });

      // Try triggering internal close or launcher if available
      const internalCloseOrToggle = document.querySelector('[id*="omnidim"] button[aria-label*="close" i], [class*="omnidim"] button[aria-label*="close" i]');
      if (internalCloseOrToggle && typeof internalCloseOrToggle.click === 'function') {
        try { internalCloseOrToggle.click(); } catch (_) {}
      }

      closeBtn.classList.remove('is-active');

      const toast = document.getElementById('copy-toast');
      if (toast) {
        toast.textContent = 'Voxora chat closed. Click the corner voice icon or Talk to Voxora to reopen.';
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 3500);
      }
    });
  }

  // Dynamic observer to keep chat panel within viewport bounds and track open state
  const observer = new MutationObserver(() => {
    positionFloatingCloseButton();
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  window.addEventListener('resize', positionFloatingCloseButton);
  setInterval(positionFloatingCloseButton, 1200);
}

/* ==========================================================================
   8. REAL BUSINESS SERVICES ONBOARDING FORM
   ========================================================================== */
function initBusinessServicesForm() {
  const form = document.getElementById('business-inquiry-form');
  const successBox = document.getElementById('form-success-box');

  if (form && successBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const business = document.getElementById('contact-business').value;

      form.style.display = 'none';
      successBox.style.display = 'block';

      const toast = document.getElementById('copy-toast');
      if (toast) {
        toast.textContent = `Inquiry received for ${business}. Our team will contact you shortly!`;
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 4500);
      }
    });
  }
}

/* ==========================================================================
   9. WAVEFORM ANIMATION VISUALIZER TOGGLE
   ========================================================================== */
function initWaveformVisualizer() {
  const container = document.getElementById('visualizer-bars');
  const toggleBtn = document.getElementById('toggle-wave-animation');
  const statusLabel = document.getElementById('wave-status-label');

  if (!container || !toggleBtn) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.classList.add('is-paused');
    if (statusLabel) statusLabel.textContent = 'Reduced Motion Active';
    toggleBtn.textContent = 'Resume Visualizer';
    return;
  }

  let isPlaying = true;
  toggleBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      container.classList.remove('is-paused');
      toggleBtn.textContent = 'Pause Animation';
      if (statusLabel) statusLabel.textContent = 'Ambient Pulse Active';
    } else {
      container.classList.add('is-paused');
      toggleBtn.textContent = 'Resume Animation';
      if (statusLabel) statusLabel.textContent = 'Animation Paused';
    }
  });
}
