/**
 * RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026
 * PT Anugrah Amartha Global - Digital Invitation Core Logic
 */

// =========================================================================
// GOOGLE SHEETS INTEGRATION CONFIG
// Masukkan URL Deployment Google Apps Script Anda di sini.
// Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
// (Jika dibiarkan kosong, RSVP otomatis tersimpan di LocalStorage browser)
// =========================================================================
const GOOGLE_SHEETS_CONFIG = {
  WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbx4rTVnssSn9SQsf40Z8fb_pnKiz1Lkm8EYnq8RAG-tGiSyy4XlPULh3LBPsn4-DcpC8w/exec', // Tempelkan Web App URL dari Google Apps Script di sini
  FETCH_ONLINE_GREETINGS: true
};

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. URL Parameter Handling (?to=Nama+Peserta)
  // -------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const rawGuestName = urlParams.get('to');
  const defaultGuestName = "Peserta Raker & Trekking AAG";
  const guestName = rawGuestName ? decodeURIComponent(rawGuestName.replace(/\+/g, ' ')).trim() : defaultGuestName;

  // Populate guest name into DOM elements
  const guestNameEl = document.getElementById('guest-name-display');
  const rsvpNameInput = document.getElementById('rsvp-name');
  const ticketGuestEl = document.getElementById('ticket-guest-name');

  if (guestNameEl) guestNameEl.textContent = guestName;
  if (rsvpNameInput && rawGuestName) rsvpNameInput.value = guestName;
  if (ticketGuestEl) ticketGuestEl.textContent = guestName;

  // Generate unique Ticket ID based on name or random hash
  const ticketCodeEl = document.getElementById('ticket-code-display');
  if (ticketCodeEl) {
    const hash = Math.abs(hashCode(guestName)) % 9000 + 1000;
    ticketCodeEl.textContent = `AAG-2026-TRK-${hash}`;
  }

  // -------------------------------------------------------------
  // 2. Tab Navigation System
  // -------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const tabPages = document.querySelectorAll('.tab-page');
  const appScrollContainer = document.querySelector('.app-content-scroll');

  function switchTab(tabId) {
    tabPages.forEach(page => {
      if (page.id === `tab-${tabId}`) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Reset scroll position smoothly to top of mobile frame
    if (appScrollContainer) {
      appScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // If RSVP tab, render and check for online updates
    if (tabId === 'rsvp') {
      renderGreetingsList();
      fetchOnlineGreetings();
      fetchOnlineGreetings();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // "Buka Undangan" CTA Button Handler
  const btnBukaUndangan = document.getElementById('btn-buka-undangan');
  if (btnBukaUndangan) {
    btnBukaUndangan.addEventListener('click', () => {
      // Confetti burst
      fireConfetti();

      // Start Background Music
      if (window.AdventureAudio) {
        window.AdventureAudio.start();
        updateMusicButtonUI(true);
      }

      // Switch to Acara tab smoothly
      setTimeout(() => {
        switchTab('acara');
      }, 400);
    });
  }

  // -------------------------------------------------------------
  // 3. Floating Action Buttons (FAB) & Modals
  // -------------------------------------------------------------
  const fabMusic = document.getElementById('fab-music');
  const fabQr = document.getElementById('fab-qr');
  const fabMenu = document.getElementById('fab-menu');

  const qrModal = document.getElementById('qr-modal');
  const menuModal = document.getElementById('menu-modal');
  const closeQrModalBtn = document.getElementById('close-qr-modal');
  const closeMenuModalBtn = document.getElementById('close-menu-modal');

  // Music Toggle
  if (fabMusic) {
    fabMusic.addEventListener('click', () => {
      if (window.AdventureAudio) {
        const isPlaying = window.AdventureAudio.toggle();
        updateMusicButtonUI(isPlaying);
      }
    });
  }

  function updateMusicButtonUI(isPlaying) {
    if (!fabMusic) return;
    const musicIcon = fabMusic.querySelector('.music-icon');
    const soundWave = fabMusic.querySelector('.sound-bars');
    if (isPlaying) {
      fabMusic.classList.add('is-playing');
      fabMusic.setAttribute('title', 'Matikan Musik Latar');
      if (musicIcon) musicIcon.style.display = 'none';
      if (soundWave) soundWave.style.display = 'flex';
    } else {
      fabMusic.classList.remove('is-playing');
      fabMusic.setAttribute('title', 'Putar Musik Latar');
      if (musicIcon) musicIcon.style.display = 'block';
      if (soundWave) soundWave.style.display = 'none';
    }
  }

  // QR Modal
  const btnCloseTicketSecondary = document.getElementById('btn-close-ticket-secondary');
  const btnShareTicket = document.getElementById('btn-share-ticket');

  if (fabQr && qrModal) {
    fabQr.addEventListener('click', () => {
      generateQRCode();
      qrModal.classList.add('active');
    });
  }
  if (closeQrModalBtn && qrModal) {
    closeQrModalBtn.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });
  }
  if (btnCloseTicketSecondary && qrModal) {
    btnCloseTicketSecondary.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });
  }
  if (btnShareTicket) {
    btnShareTicket.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const shareText = `Undangan Resmi RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026 - PT Anugrah Amartha Global untuk ${guestName}`;
      if (navigator.share) {
        navigator.share({
          title: "Undangan Raker AAG 2026",
          text: shareText,
          url: shareUrl
        }).catch(() => { });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          const originalText = btnShareTicket.innerHTML;
          btnShareTicket.innerHTML = `<i class="fa-solid fa-check mr-1"></i>Link Tersalin!`;
          setTimeout(() => {
            btnShareTicket.innerHTML = originalText;
          }, 2000);
        });
      }
    });
  }

  // Quick Menu Modal
  if (fabMenu && menuModal) {
    fabMenu.addEventListener('click', () => {
      menuModal.classList.add('active');
    });
  }
  if (closeMenuModalBtn && menuModal) {
    closeMenuModalBtn.addEventListener('click', () => {
      menuModal.classList.remove('active');
    });
  }

  // Quick Jump buttons inside Menu Modal
  document.querySelectorAll('.menu-jump-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-target-tab');
      if (targetTab) {
        switchTab(targetTab);
        menuModal.classList.remove('active');
      }
    });
  });

  // Close modals on clicking backdrop
  [qrModal, menuModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  // -------------------------------------------------------------
  // 4. Countdown Timer: 11 Desember 2026 05:00 WIB
  // -------------------------------------------------------------
  // 11 Dec 2026 05:00:00 GMT+0700
  const eventTargetDate = new Date('2026-12-11T05:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventTargetDate - now;

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');
    const secondsEl = document.getElementById('count-seconds');

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      const statusText = document.getElementById('countdown-status-text');
      if (statusText) statusText.textContent = "Acara Sedang / Telah Berlangsung!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------
  // 5. Calendar Links & iCal Download
  // -------------------------------------------------------------
  const btnGoogleCal = document.getElementById('btn-google-calendar');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      // 11 Dec 2026 05:00 WIB to 13:30 WIB (UTC: 20261210T220000Z to 20261211T063000Z)
      const title = encodeURIComponent("RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026");
      const details = encodeURIComponent(
        "Undangan Resmi PT Anugrah Amartha Global:\n" +
        "1. AAG Trekking Challenge 2026 (Sentul - Cisadon)\n" +
        "2. Pleno Raker AAG 2026 'Step Up to the Next Level'\n" +
        "Waktu: 05.00 - 13.30 WIB\n" +
        "Titik Kumpul: Basecamp Cisadon Sentul, Bogor."
      );
      const location = encodeURIComponent("Cisadon Trail Run, Sentul, Babakan Madang, Kabupaten Bogor, Jawa Barat");
      const dates = "20261210T220000Z/20261211T063000Z";
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, '_blank');
    });
  }

  const btnIcal = document.getElementById('btn-download-ical');
  if (btnIcal) {
    btnIcal.addEventListener('click', downloadIcsFile);
  }

  function downloadIcsFile() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PT Anugrah Amartha Global//Raker 2026//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:raker-aag-2026-trekking@amartha-global.com",
      "DTSTAMP:20261124T000000Z",
      "DTSTART:20261210T220000Z",
      "DTEND:20261211T063000Z",
      "SUMMARY:RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026",
      "DESCRIPTION:Undangan Resmi Rapat Kerja & Outdoor Trekking PT Anugrah Amartha Global - Step Up to the Next Level",
      "LOCATION:Cisadon Trail Run - Sentul, Babakan Madang, Bogor",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Raker_AAG_2026_Trekking.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // -------------------------------------------------------------
  // 6. Rundown Timeline Data & Rendering
  // -------------------------------------------------------------
  const rundownList = [
    {
      id: 1,
      time: "05.00 – 05.45",
      title: "Registrasi Ulang & Race Pack Distribution",
      category: "pagi",
      location: "Titik Kumpul Sentul Basecamp",
      desc: "Check-in tiket QR code, pembagian jersey resmi AAG 2026, wristband peserta, snack pagi & race pack trekking.",
      icon: "fa-id-badge",
      highlight: false
    },
    {
      id: 2,
      time: "05.45 – 06.15",
      title: "Safety Briefing, Doa & Sesi Pemanasan",
      category: "pagi",
      location: "Main Stage Basecamp",
      desc: "Pengarahan rute dari Marshal Sentul, pengecekan kesiapan fisik, doa bersama, dan dynamic stretching dipandu instruktur.",
      icon: "fa-person-running",
      highlight: false
    },
    {
      id: 3,
      time: "06.15 – 06.30",
      title: "Opening Ceremony & Flag-Off Trekking",
      category: "pagi",
      location: "Start Gate Cisadon Trail",
      desc: "Pelepasan resmi 'AAG Trekking Challenge 2026' oleh jajaran Direksi PT Anugrah Amartha Global.",
      icon: "fa-flag-checkered",
      highlight: true
    },
    {
      id: 4,
      time: "06.30 – 09.30",
      title: "Trekking Adventure: Sentul to Puncak Cisadon",
      category: "pagi",
      location: "Rute Cisadon Trail (7.5 KM)",
      desc: "Menyusuri jalur perbukitan hijau, hutan pinus, water station checkpoint, games kekompakan regu, dan team synergy challenge.",
      icon: "fa-mountain-sun",
      highlight: false
    },
    {
      id: 5,
      time: "09.30 – 10.30",
      title: "Summit Victory: Pengibaran Bendera & Medali",
      category: "pagi",
      location: "Puncak Bukit Cisadon",
      desc: "Seremoni pengibaran bendera AAG di puncak bukit, pembagian Finisher Medal 2026, dan sesi foto bersama per divisi.",
      icon: "fa-medal",
      highlight: true
    },
    {
      id: 6,
      time: "10.30 – 11.45",
      title: "Perjalanan Menuju Basecamp & Refresh",
      category: "pagi",
      location: "Trail Descent & Basecamp",
      desc: "Perjalanan turun kembali ke basecamp, istirahat, rehidrasi kelapa muda segar, mandi & ganti pakaian raker.",
      icon: "fa-shower",
      highlight: false
    },
    {
      id: 7,
      time: "11.45 – 12.45",
      title: "Sesi Pleno Raker AAG 2026: Next Level",
      category: "siang",
      location: "Cisadon Eco Hall Sentul",
      desc: "Presentasi pencapaian 2025, peluncuran strategi corporate 'Step Up to the Next Level 2026-2027', serta arahan Manajemen.",
      icon: "fa-chart-line",
      highlight: true
    },
    {
      id: 8,
      time: "12.45 – 13.30",
      title: "Santap Siang Bersama, Doorprize & Penutupan",
      category: "siang",
      location: "Dining Pavilion",
      desc: "Makan siang kuliner khas Sunda Sentul, pembagian doorprize trekking challenge, apresiasi tim terbaik, dan penutupan acara.",
      icon: "fa-gift",
      highlight: false
    }
  ];

  // Render Rundown Timeline
  const rundownContainer = document.getElementById('rundown-timeline-container');
  const filterBtns = document.querySelectorAll('.rundown-filter-btn');

  function renderRundown(filter = 'all') {
    if (!rundownContainer) return;
    rundownContainer.innerHTML = '';

    const filtered = rundownList.filter(item => {
      if (filter === 'all') return true;
      return item.category === filter;
    });

    filtered.forEach((item, index) => {
      const node = document.createElement('div');
      node.className = `timeline-node ${item.highlight ? 'highlight-node' : ''}`;
      node.innerHTML = `
        <div class="timeline-bullet">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="bg-white p-3.5 rounded-2xl border ${item.highlight ? 'border-[#E6007E] shadow-sm bg-gradient-to-r from-pink-50/40 to-white' : 'border-slate-200'}">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="inline-block px-2.5 py-0.5 text-[10px] font-black rounded-full ${item.highlight ? 'bg-[#E6007E] text-white' : 'bg-emerald-100 text-[#0B6623]'}">
              <i class="fa-regular fa-clock mr-1"></i>${item.time} WIB
            </span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ${item.category === 'pagi' ? 'Outdoor' : 'Pleno'}
            </span>
          </div>
          <h4 class="font-sport font-bold text-sm text-slate-800 leading-snug mb-1">
            ${item.title}
          </h4>
          <p class="text-xs text-slate-500 leading-relaxed mb-1.5">
            ${item.desc}
          </p>
          <div class="flex items-center text-[10.5px] font-semibold text-slate-600">
            <i class="fa-solid fa-location-dot mr-1.5 text-emerald-600"></i>
            <span>${item.location}</span>
          </div>
        </div>
      `;
      rundownContainer.appendChild(node);
    });
  }

  renderRundown('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-[#0B6623]', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-600');
      });
      btn.classList.add('active', 'bg-[#0B6623]', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-600');
      const filter = btn.getAttribute('data-filter');
      renderRundown(filter);
    });
  });

  // -------------------------------------------------------------
  // 7. Interactive Equipment Checklist
  // -------------------------------------------------------------
  document.querySelectorAll('.equipment-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const checkIcon = item.querySelector('.eq-check-icon');
      if (item.classList.contains('checked')) {
        checkIcon.classList.remove('fa-circle', 'text-slate-300');
        checkIcon.classList.add('fa-circle-check', 'text-emerald-600');
      } else {
        checkIcon.classList.remove('fa-circle-check', 'text-emerald-600');
        checkIcon.classList.add('fa-circle', 'text-slate-300');
      }
    });
  });

  // -------------------------------------------------------------
  // 8. RSVP Form & Real-time Greetings Board
  // -------------------------------------------------------------
  const rsvpForm = document.getElementById('rsvp-form');
  const greetingsContainer = document.getElementById('greetings-feed-container');

  // Default initial greetings for PT Anugrah Amartha Global
  const defaultGreetings = [
    {
      name: "Bambang Sudiro (Direktur Utama)",
      dept: "Direksi",
      status: "hadir",
      time: "2 jam yang lalu",
      message: "Mari rapatkan barisan dan kobarkan semangat kebersamaan. Siap menaklukkan Puncak Cisadon dan melangkah ke level yang lebih tinggi bersama seluruh keluarga besar AAG!"
    },
    {
      name: "Rizky Firmansyah",
      dept: "IT & Digital Solutions",
      status: "hadir",
      time: "4 jam yang lalu",
      message: "Jersey dan sepatu trail sudah siap! Gaspol sampai puncak, sukseskan Raker AAG 2026. Step Up to the Next Level! 🔥"
    },
    {
      name: "Dewi Anggraini",
      dept: "Finance & Accounting",
      status: "hadir",
      time: "Kemarin",
      message: "Sudah tidak sabar seru-seruan bareng tim. Semoga Raker 2026 menghasilkan rencana strategis yang gemilang untuk kemajuan AAG."
    },
    {
      name: "Hendrik Wijaya",
      dept: "Operasional & Project",
      status: "hadir",
      time: "Kemarin",
      message: "Tim Project siap tempur dan siap mengibarkan bendera AAG di Bukit Cisadon! Semangat soliditas tanpa batas."
    }
  ];

  function getStoredGreetings() {
    try {
      const stored = localStorage.getItem('aag_raker_rsvp_list');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
    return defaultGreetings;
  }

  function saveGreetings(list, newEntry = null) {
    try {
      localStorage.setItem('aag_raker_rsvp_list', JSON.stringify(list));
    } catch (e) {
      console.warn("Storage save error", e);
    }

    // Sinkronisasi otomatis ke Google Sheets jika URL telah dikonfigurasi
    if (GOOGLE_SHEETS_CONFIG.WEBAPP_URL && newEntry) {
      fetch(GOOGLE_SHEETS_CONFIG.WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newEntry)
      }).then(() => {
        console.log("Data RSVP berhasil terkirim ke Google Sheets");
      }).catch(err => {
        console.warn("Gagal mengirim ke Google Sheets:", err);
      });
    }
  }

  function fetchOnlineGreetings() {
    if (!GOOGLE_SHEETS_CONFIG.WEBAPP_URL) return;
    fetch(GOOGLE_SHEETS_CONFIG.WEBAPP_URL)
      .then(res => res.json())
      .then(result => {
        if (result && result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
          try {
            localStorage.setItem('aag_raker_rsvp_list', JSON.stringify(result.data));
            renderGreetingsList();
            fetchOnlineGreetings();
          } catch (e) { }
        }
      })
      .catch(err => console.warn("Koneksi Google Sheets:", err));
  }

  function renderGreetingsList() {
    if (!greetingsContainer) return;
    const list = getStoredGreetings();
    greetingsContainer.innerHTML = '';

    const countBadge = document.getElementById('greetings-total-count');
    if (countBadge) countBadge.textContent = `${list.length} Peserta`;

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = "bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 transition hover:border-emerald-200";

      const isHadir = item.status === 'hadir';
      const initials = item.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

      card.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0B6623] to-[#32CD32] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              ${initials}
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-800 leading-tight">${item.name}</h5>
              <span class="text-[10px] text-slate-400 font-medium">${item.dept} • ${item.time}</span>
            </div>
          </div>
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isHadir ? 'bg-emerald-100 text-[#0B6623]' : 'bg-rose-100 text-rose-600'}">
            ${isHadir ? '<i class="fa-solid fa-check mr-1"></i>Hadir' : '<i class="fa-solid fa-xmark mr-1"></i>Izin'}
          </span>
        </div>
        <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic leading-relaxed">
          "${item.message}"
        </p>
      `;
      greetingsContainer.appendChild(card);
    });
  }

  renderGreetingsList();
  fetchOnlineGreetings();

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const dept = document.getElementById('rsvp-dept').value;
      const status = document.querySelector('input[name="attendance"]:checked')?.value || 'hadir';
      const shirtSize = document.getElementById('rsvp-shirt').value;
      const notes = document.getElementById('rsvp-notes').value.trim();
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name || !dept || !message) {
        alert("Mohon lengkapi Nama, Divisi, dan Pesan Semangat Anda.");
        return;
      }

      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i>Menyimpan...`;

      setTimeout(() => {
        const newEntry = {
          name: name,
          dept: dept,
          status: status,
          shirtSize: shirtSize,
          notes: notes,
          message: message,
          time: "Baru saja"
        };

        const currentList = getStoredGreetings();
        currentList.unshift(newEntry);
        saveGreetings(currentList, newEntry);
        renderGreetingsList();
        fetchOnlineGreetings();

        // Celebration
        fireConfetti();

        // Success Feedback
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check mr-2"></i>Konfirmasi Terkirim!`;
        submitBtn.classList.remove('btn-magenta-action');
        submitBtn.classList.add('bg-emerald-600', 'text-white');

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.classList.add('btn-magenta-action');
          submitBtn.classList.remove('bg-emerald-600', 'text-white');
          document.getElementById('rsvp-message').value = '';
        }, 3000);

        // Smooth scroll to greetings container
        greetingsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  }

  // -------------------------------------------------------------
  // 9. QR Code E-Ticket Generator
  // -------------------------------------------------------------
  let qrGenerated = false;
  function generateQRCode() {
    if (qrGenerated) return;
    const qrTargetEl = document.getElementById('qrcode-box');
    if (!qrTargetEl) return;

    qrTargetEl.innerHTML = '';
    const ticketId = document.getElementById('ticket-code-display')?.textContent || 'AAG-2026-TRK-1001';
    const qrData = `EVENT:RAKER-AAG-2026|PASS:${ticketId}|GUEST:${guestName}|VENUE:CISADON-SENTUL`;

    if (window.QRCode) {
      new QRCode(qrTargetEl, {
        text: qrData,
        width: 160,
        height: 160,
        colorDark: "#0B6623",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.H
      });
      qrGenerated = true;
    } else {
      // Fallback SVG QR code simulation if external CDN is blocked
      qrTargetEl.innerHTML = createFallbackQRSvg();
      qrGenerated = true;
    }
  }

  function createFallbackQRSvg() {
    return `
      <svg viewBox="0 0 160 160" width="160" height="160" fill="none" class="mx-auto rounded-lg shadow-sm border border-slate-200">
        <rect width="160" height="160" fill="#FFFFFF"/>
        <!-- Corner Position Squares -->
        <rect x="15" y="15" width="40" height="40" fill="#0B6623"/>
        <rect x="23" y="23" width="24" height="24" fill="#FFFFFF"/>
        <rect x="29" y="29" width="12" height="12" fill="#E6007E"/>

        <rect x="105" y="15" width="40" height="40" fill="#0B6623"/>
        <rect x="113" y="23" width="24" height="24" fill="#FFFFFF"/>
        <rect x="119" y="29" width="12" height="12" fill="#E6007E"/>

        <rect x="15" y="105" width="40" height="40" fill="#0B6623"/>
        <rect x="23" y="113" width="24" height="24" fill="#FFFFFF"/>
        <rect x="29" y="119" width="12" height="12" fill="#E6007E"/>

        <!-- Matrix Simulation Dots -->
        <g fill="#0B6623">
          <rect x="65" y="20" width="8" height="8"/><rect x="85" y="20" width="8" height="8"/>
          <rect x="75" y="30" width="8" height="8"/><rect x="65" y="40" width="8" height="8"/>
          <rect x="85" y="40" width="8" height="8"/>
          
          <rect x="20" y="65" width="8" height="8"/><rect x="35" y="65" width="8" height="8"/>
          <rect x="50" y="65" width="8" height="8"/><rect x="65" y="65" width="8" height="8"/>
          <rect x="80" y="65" width="8" height="8"/><rect x="95" y="65" width="8" height="8"/>
          <rect x="110" y="65" width="8" height="8"/><rect x="130" y="65" width="8" height="8"/>

          <rect x="20" y="80" width="8" height="8"/><rect x="40" y="80" width="8" height="8"/>
          <rect x="60" y="80" width="8" height="8"/><rect x="75" y="80" width="8" height="8"/>
          <rect x="90" y="80" width="8" height="8"/><rect x="115" y="80" width="8" height="8"/>
          <rect x="135" y="80" width="8" height="8"/>

          <rect x="65" y="95" width="8" height="8"/><rect x="85" y="95" width="8" height="8"/>
          <rect x="105" y="95" width="8" height="8"/><rect x="125" y="95" width="8" height="8"/>

          <rect x="65" y="115" width="8" height="8"/><rect x="85" y="115" width="8" height="8"/>
          <rect x="115" y="115" width="8" height="8"/><rect x="135" y="115" width="8" height="8"/>
          <rect x="75" y="130" width="8" height="8"/><rect x="105" y="130" width="8" height="8"/>
          <rect x="125" y="130" width="8" height="8"/>
        </g>
        <!-- Center AAG Logo Dot -->
        <circle cx="80" cy="80" r="14" fill="#FFFFFF" stroke="#E6007E" stroke-width="2"/>
        <text x="80" y="84" font-family="'Outfit', sans-serif" font-size="8" font-weight="900" text-anchor="middle" fill="#E6007E">AAG</text>
      </svg>
    `;
  }

  // -------------------------------------------------------------
  // 10. Confetti Animation Utility
  // -------------------------------------------------------------
  function fireConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0B6623', '#32CD32', '#E6007E', '#FF3399', '#FEF08A']
      });
    }
  }

  // -------------------------------------------------------------
  // 11. Helper String Hash Code
  // -------------------------------------------------------------
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
});
