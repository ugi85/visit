# Undangan Digital: RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026
**PT Anugrah Amartha Global**

Aplikasi web undangan digital mobile-first single-page web app dengan tampilan frame smartphone di tengah layar (pada desktop view) dan responsif penuh pada perangkat mobile. Dirancang khusus untuk memadukan agenda outdoor adventure dan rapat kerja strategis perusahaan.

---

## 🎨 Identitas Visual & Palet Warna
- **Warna Utama:** Hijau Tua / Forest Green (`#0B6623`) & Hijau Cerah / Lime Green (`#32CD32`)
- **Warna Aksen:** Magenta / Hot Pink (`#E6007E`)
- **Latar Belakang:** Putih bersih (`#FFFFFF`) berpadu gradasi langit biru muda lembut (`#E0F4FF`), siluet pegunungan hijau berlapis, pohon pinus, serta pendaki mengibarkan bendera **AAG** di puncak bukit.
- **Elemen Dekoratif:** Pita garis lengkung dinamis hijau-magenta di sudut layar.
- **Branding & Tagline:** Logo AAG dengan panah akselerasi ke atas dan tagline *"STEP UP TO THE NEXT LEVEL"*.

---

## 📱 Fitur Utama & Struktur Navigasi

### 1. Viewport & Tata Letak
- **Desktop:** Tampilan frame smartphone di tengah layar beresolusi tinggi dengan bingkai elegan, dynamic notch bar, bayangan realistis, dan latar belakang kontur topografi lembut.
- **Mobile:** Otomatis menyesuaikan 100% layar sentuh dengan responsivitas penuh.

### 2. Floating Action Buttons (Kanan Bawah)
1. **Tombol Menu Cepat (Grid/Bars):** Modal overlay untuk navigasi instan ke halaman manapun.
2. **Tombol QR Code E-Ticket:** Membuka kartu tiket digital resmi peserta dengan nama dinamis, kode tiket unik, QR Code, dan tombol salin/bagikan link.
3. **Tombol Musik Latar:** Pemutar audio latar instrumental bertema semangat/petualangan (menggunakan Web Audio API sintetis bersemangat yang bekerja 100% luring/tanpa ketergantungan file eksternal) dengan animasi visualizer bar & rotasi vinyl.

### 3. Bottom Navigation Bar (5 Tab Utama)
1. **Opening (Sampul):**
   - Header logo AAG & ribbon dekoratif.
   - Judul dinamis bergaya sporty brush italic dengan gradasi hijau-magenta.
   - Sapaan nama tamu personalisasi dinamis dari parameter URL `?to=Nama+Tamu`.
   - Tombol **"Buka Undangan"** yang memicu animasi confetti, memulai pemutaran musik, dan berpindah ke tab Acara.
   - Ilustrasi siluet pegunungan Cisadon dan pendaki mengibarkan bendera AAG di puncak.
2. **Acara (Detail Kegiatan):**
   - Hitung mundur (**Countdown Timer**) otomatis menuju Jumat, 11 Desember 2026 pukul 05.00 WIB.
   - Kartu Agenda 1: **AAG TREKKING CHALLENGE 2026** (05.00 - 10.30 WIB di Cisadon Trail Run Sentul).
   - Kartu Agenda 2: **PLENO RAKER AAG 2026: STEP UP** (11.45 - 13.30 WIB di Cisadon Eco Hall).
   - Tombol **"Simpan ke Google Calendar"** & **"Download iCal (.ics)"**.
3. **Maps (Peta & Navigasi):**
   - Embed Google Maps interaktif lokasi Bukit Cisadon - Sentul, Babakan Madang, Bogor.
   - Tombol langsung **"Google Maps"** dan **"Buka Waze"**.
   - Karakteristik rute (jarak 7.5 km, elevasi +350 m).
   - **Checklist Perlengkapan Interaktif:** Daftar perlengkapan wajib & rekomendasi yang dapat diceklis langsung.
   - Kontak Darurat / PIC WhatsApp Panitia.
4. **Rundown (Susunan Acara):**
   - Timeline vertikal interaktif dengan aksen forest green & magenta.
   - Filter tab: "Semua", "Outdoor (Pagi)", dan "Pleno (Siang)".
   - Struktur data array JSON di `js/app.js` yang rapi dan mudah diubah.
5. **RSVP (Konfirmasi Kehadiran):**
   - Formulir konfirmasi: Nama Lengkap (otomatis terisi jika ada `?to=`), Divisi/Departemen, Status Hadir/Tidak, Ukuran Kaos Jersey (S-3XL), Catatan Khusus, dan Pesan Semangat.
   - Simpan data secara instan di `localStorage` peramban.
   - Pesan & ucapan real-time dari rekan kerja dan pimpinan AAG.

---

## 🚀 Cara Menjalankan & Membuka

### 1. Langsung Membuka File di Browser
Cukup klik dua kali berkas `index.html` pada browser Chrome, Edge, Safari, atau Firefox:
```text
file:///C:/Users/bakekok/Desktop/undangan%20digital/raker/index.html
```

### 2. Menggunakan Parameter URL untuk Nama Tamu
Tambahkan parameter `?to=Nama+Peserta` pada akhir tautan:
- Contoh 1: `index.html?to=Bambang+Hermawan`
- Contoh 2: `index.html?to=Dewi+Kusumawardhani`
- Contoh 3: `index.html?to=Tim+Operasional+%26+Project`

### 3. Menjalankan Melalui Local Web Server (Opsional)
```bash
# Menggunakan Python
python -m http.server 8080

# Lalu buka di browser:
http://localhost:8080/?to=Nama+Tamu
```

---

## 📁 Struktur Berkas Proyek

```text
raker/
├── index.html               # Halaman utama aplikasi mobile-first
├── README.md                # Dokumentasi lengkap
├── css/
│   └── style.css            # Styling custom, frame ponsel, animasi, tipografi sporty
├── js/
│   ├── app.js               # Logika navigasi tab, countdown, QR ticket, calendar, RSVP
│   └── audio-synth.js       # Audio engine instrumental adventure Web Audio API
└── assets/
    ├── aag-logo.svg         # Logo resmi AAG & tagline "Step Up to the Next Level"
    ├── mountain-hero.svg    # Ilustrasi pegunungan hijau, pinus & pendaki berbendera AAG
    └── ribbon-decor.svg     # Elemen dekoratif pita dinamis hijau & magenta
```
