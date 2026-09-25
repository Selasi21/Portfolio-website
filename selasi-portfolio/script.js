// ===== DATA =====
  const expertiseChips = [
    'Procurement',
    'Data Operations',
    'Strategic Planning',
    'Leadership',
    'Quality Assurance',
    'Data Analysis'
  ];

  const botResponses = {
    'Procurement': {
      msg: 'I manage end-to-end procurement — from supplier negotiation and contract review to inventory tracking and cost optimization. At Ghana School of Law, I reduced procurement costs by 9% through strategic consolidation.',
      typed: 'Procurement'
    },
    'Data Operations': {
      msg: 'At Datamaker, I built a multi-tier review system (labeler → reviewer → QA) that cut rework by 50%. I also trained new labelers and optimized dataset preprocessing with data engineers.',
      typed: 'Data Operations'
    },
    'Strategic Planning': {
      msg: 'I approach planning with a focus on measurable outcomes. At Ghana Tourism Authority, I analyzed profit-boosting strategies that brought in an additional 3% profit by pursuing defaulting companies.',
      typed: 'Strategic Planning'
    },
    'Leadership': {
      msg: 'From SRC Executive to peer mentorship founder, I lead by creating systems that help others succeed. I established a structured feedback system and peer-led study groups that boosted class performance.',
      typed: 'Leadership'
    },
    'Quality Assurance': {
      msg: 'Quality is built into my process. I track key metrics, implement review tiers, and create feedback loops that catch errors early — reducing rework and ensuring high-quality outputs.',
      typed: 'Quality Assurance'
    },
    'Data Analysis': {
      msg: 'I consolidate complex data into actionable insights. At Ghana Tourism Authority, I built a single Excel macro that pulled historical data, factored projected variance, and separated output for accurate analysis.',
      typed: 'Data Analysis'
    }
  };

  // ===== PROJECT DETAILS =====
  const projectDetails = {
    'Ghana School of Law': {
      title: 'Ghana School of Law',
      sub: 'Procurement Officer (National Service) · Oct 2024 – Oct 2025',
      body: 'Identified cost-saving opportunities by analyzing spending patterns and negotiating favorable terms with suppliers. Prepared detailed reports for management, assisted in drafting and monitoring supplier contracts, maintained an up-to-date contract database, implemented an efficient inventory tracking system, and reduced procurement costs by 9% through strategic consolidation.',
      tags: ['Procurement', 'Contract Management', 'Inventory Tracking', 'Cost Reduction']
    },
    'Datamaker': {
      title: 'Datamaker',
      sub: 'Data Labelling Specialist · Jan 2023 – Sep 2024',
      body: 'Established a multi-tier review system (labeler → reviewer → QA) to minimize labelling errors. Reduced rework by 50% through proactive error detection and feedback loops. Conducted training sessions for new labelers, collaborated with data engineers to optimize dataset preprocessing, tracked key metrics, and provided actionable insights to management.',
      tags: ['Data Labeling', 'Quality Assurance', 'Process Optimization', 'Team Training']
    },
    'Ghana Tourism Authority': {
      title: 'Ghana Tourism Authority',
      sub: 'Intern · Nov 2022 – Dec 2022',
      body: 'Assisted in analyzing profit-boosting strategies with the Regional Director and investigated companies that had defaulted on annual fees. Analysis brought in an additional 3% profit. Consolidated Excel functions into a single macro for accurate data analysis. Assisted in restructuring office equipment and resources, boosting office morale and work proficiency.',
      tags: ['Data Analysis', 'Excel Macros', 'Strategic Planning', 'Research']
    },
    'University of Ghana': {
      title: 'African Union Hall · University of Ghana',
      sub: 'Planning and Projects Committee Member',
      body: 'Contributed to successful planning and execution of events for the benefit of the entire hall populace. Regularly held meetings with Hall Administration to discuss and address student concerns including academic policies, extracurricular activities, and campus safety.',
      tags: ['Committee Work', 'Student Advocacy', 'Event Planning', 'Administration']
    },
    'SRC Executive': {
      title: 'SRC Executive · Achimota Senior High School',
      sub: '2019 – 2020 Academic Year',
      body: 'Coordinated various events such as sports tournaments, talent shows, and cultural festivals alongside successful fundraising activities. Established a peer mentorship program where gifted students were paired with first-year students to provide academic support, guidance, and a smoother transition into high school. This led to improved academic performance and a stronger sense of community.',
      tags: ['Leadership', 'Event Coordination', 'Mentorship', 'Fundraising']
    }
  };

  // ===== DOM REFS =====
  const chatWindow = document.getElementById('chatWindow');
  const chipsContainer = document.getElementById('expertiseChips');
  const promptTyped = document.getElementById('promptTyped');
  const dock = document.getElementById('dock');

  // ===== DOCK AUTO-HIDE ON SCROLL =====
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 120) {
      dock.classList.add('dock--hidden');
    } else {
      dock.classList.remove('dock--hidden');
    }
    lastScrollY = currentY;
  }, { passive: true });

  // ===== LIVE CLOCK (Accra, Ghana — GMT) =====
  const footerClockEl = document.getElementById('footerClock');
  const footerYearEl = document.getElementById('footerYear');
  const bbClockEl = document.getElementById('bbClock');
  const bbYearEl = document.getElementById('bbYear');
  function updateFooterClock() {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Accra' }));
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    if (footerClockEl) footerClockEl.textContent = `${hh}:${mm}:${ss}`;
    if (footerYearEl) footerYearEl.textContent = now.getFullYear();
    if (bbClockEl) bbClockEl.textContent = `${hh}:${mm}:${ss}`;
    if (bbYearEl) bbYearEl.textContent = now.getFullYear();
  }
  updateFooterClock();
  setInterval(updateFooterClock, 1000);
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalBody = document.getElementById('modalBody');
  const modalTags = document.getElementById('modalTags');

  // ===== BUILD CHIPS =====
  // Each chip is a toggle: click once to show its message, click again
  // (while active) to remove it. Selecting a different chip swaps out
  // whichever one was previously shown.
  const activeChipEntries = new Map();

  function removeChipMessages(label) {
    const entry = activeChipEntries.get(label);
    if (!entry) return;
    clearTimeout(entry.timeoutId);
    if (entry.userMsgEl) entry.userMsgEl.remove();
    if (entry.botMsgEl) entry.botMsgEl.remove();
    activeChipEntries.delete(label);
  }

  expertiseChips.forEach(label => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = label;
    chip.dataset.label = label;
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');

      if (isActive) {
        // Click off: hide its message and deactivate.
        chip.classList.remove('active');
        removeChipMessages(label);
        promptTyped.style.opacity = '0';
        return;
      }

      // Swap out whichever chip was previously active.
      document.querySelectorAll('.chip.active').forEach(other => {
        other.classList.remove('active');
        removeChipMessages(other.dataset.label);
      });

      chip.classList.add('active');

      const data = botResponses[label];
      if (data) {
        promptTyped.textContent = data.typed;
        promptTyped.style.opacity = '1';
      }

      const userMsgEl = addMessage(label, 'user');
      const entry = { userMsgEl, botMsgEl: null, timeoutId: null };
      activeChipEntries.set(label, entry);

      entry.timeoutId = setTimeout(() => {
        entry.botMsgEl = data
          ? addMessage(data.msg, 'bot')
          : addMessage('Thanks! I\'ll tell you more about that soon.', 'bot');
      }, 400);
    });
    chipsContainer.appendChild(chip);
  });

  // ===== MESSAGE HELPER =====
  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `msg msg--${type}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msg;
  }

  // ===== INTRO MESSAGES =====
  function runIntro() {
    const introMessages = [
      { text: 'Hi, I\'m Selasi 👋', type: 'bot' },
      { text: 'I\'m a procurement officer and operations specialist based in Tema, Accra.', type: 'bot' },
      { text: 'Pick an expertise below to see how I think about it — or scroll down to explore my experience.', type: 'bot' }
    ];

    introMessages.forEach((msg, i) => {
      setTimeout(() => {
        addMessage(msg.text, msg.type);
      }, i * 500 + 300);
    });
  }

  // ===== DOCK PANEL TOGGLE =====
  function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    const allPanels = document.querySelectorAll('.dock-panel');
    // Includes both the floating dock buttons and the mobile bottom-bar buttons.
    const allDockItems = document.querySelectorAll('.dock-item[data-panel], .bb-nav-item[data-panel]');

    // Close other panels
    allPanels.forEach(p => {
      if (p.id !== panelId) p.classList.remove('open');
    });

    // Toggle this panel
    const isOpen = panel.classList.contains('open');
    allPanels.forEach(p => p.classList.remove('open'));

    if (!isOpen) {
      panel.classList.add('open');
      allDockItems.forEach(item => item.classList.remove('active'));
      const panelKey = panelId.replace('panel', '').toLowerCase();
      document.querySelectorAll(`.dock-item[data-panel="${panelKey}"], .bb-nav-item[data-panel="${panelKey}"]`)
        .forEach(btn => btn.classList.add('active'));
    } else {
      allDockItems.forEach(item => item.classList.remove('active'));
    }
  }

  // ===== DOCK EVENT LISTENERS =====
  document.getElementById('dockWork').addEventListener('click', () => togglePanel('panelWork'));
  document.getElementById('dockAbout').addEventListener('click', () => togglePanel('panelAbout'));
  document.getElementById('dockContact').addEventListener('click', () => togglePanel('panelContact'));

  // ===== MOBILE BOTTOM-BAR NAV EVENT LISTENERS =====
  // Same panels as the dock, triggered from the mobile bottom bar instead.
  document.getElementById('bbNavWork').addEventListener('click', () => togglePanel('panelWork'));
  document.getElementById('bbNavAbout').addEventListener('click', () => togglePanel('panelAbout'));
  document.getElementById('bbNavContact').addEventListener('click', () => togglePanel('panelContact'));

  // ===== CLOSE PANELS =====
  document.querySelectorAll('.panel-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const panelId = btn.dataset.close;
      document.getElementById(panelId).classList.remove('open');
      document.querySelectorAll('.dock-item[data-panel]').forEach(item => item.classList.remove('active'));
    });
  });

  // ===== PROJECT MODAL =====
  function openProjectModal(projectName) {
    const details = projectDetails[projectName];
    if (!details) return;

    modalTitle.textContent = details.title;
    modalSub.textContent = details.sub;
    modalBody.textContent = details.body;

    modalTags.innerHTML = '';
    details.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ===== PROJECT ROW CLICKS =====
  document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = row.dataset.project;
      if (projectName) openProjectModal(projectName);
    });
  });

  // ===== DOCK PANEL PROJECT ITEM CLICKS =====
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => {
      const projectName = item.dataset.project;
      if (projectName) {
        openProjectModal(projectName);
        // Close the panel
        document.querySelectorAll('.dock-panel').forEach(p => p.classList.remove('open'));
        document.querySelectorAll('.dock-item[data-panel]').forEach(i => i.classList.remove('active'));
      }
    });
  });

  // ===== CLOSE PANELS ON OUTSIDE CLICK =====
  document.addEventListener('click', (e) => {
    const isDock = e.target.closest('.dock');
    const isPanel = e.target.closest('.dock-panel');
    const isBottomBar = e.target.closest('.bottom-bar');
    if (!isDock && !isPanel && !isBottomBar) {
      document.querySelectorAll('.dock-panel').forEach(p => p.classList.remove('open'));
      document.querySelectorAll('.dock-item[data-panel], .bb-nav-item[data-panel]').forEach(i => i.classList.remove('active'));
    }
  });

  // ===== REVEAL ON SCROLL =====
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
  }

  // ===== DARK MODE TOGGLE =====
  function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
  }

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    runIntro();
    initReveal();
    initThemeToggle();
  });
