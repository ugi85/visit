# Undangan Digital: RAKER AAG 2026 & AAG TREKKING CHALLENGE 2026
**PT Anugrah Amartha Global**

Aplikasi web undangan digital mobile-first single-page web app dengan tampilan frame smartphone di tengah layar (pada desktop view) dan responsif penuh pada perangkat mobile. Dirancang khusus untuk memadukan agenda outdoor adventure dan rapat kerja strategis perusahaan.

---

## 📊 Integrasi Database Google Sheets & Pembuat Link Undangan Massal

### 1. Kemana data RSVP tersimpan saat ini?
- **Default (Offline / Tanpa Server):** Data konfirmasi RSVP dan pesan ucapan langsung tersimpan di **LocalStorage** peramban perangkat masing-masing pengguna.
- **Dengan Google Spreadsheet (Sangat Direkomendasikan):** Setiap kali peserta menekan tombol *"Kirim Konfirmasi Kehadiran"*, datanya akan **langsung terkirim secara terpusat ke Google Spreadsheet** milik panitia secara *real-time*.

### 2. Keuntungan Menggunakan Google Spreadsheet:
1. **Rekapitulasi Otomatis:** Panitia dapat langsung melihat jumlah peserta yang pasti hadir, ukuran kaos jersey (untuk pemesanan ke vendor), dan catatan khusus/alergi makanan.
2. **Papan Ucapan Online Real-Time:** Pesan dan semangat dari semua karyawan dari berbagai cabang/divisi dapat saling terbaca di web undangan secara terpusat.
3. **Membuat Link Undangan Massal Otomatis:** Panitia dapat mendaftar semua nama karyawan di Google Sheets dan membuat link personalisasi undangan + link WhatsApp blast hanya dengan satu rumus.

---

## 🛠️ Langkah Cepat Menghubungkan ke Google Sheets (2 Menit)

Berkas skrip siap pakai telah disediakan di: [`google-sheets-script.js`](google-sheets-script.js).

1. Buat spreadsheet baru di Google Drive: [sheets.new](https://sheets.new)
2. Beri nama file, misalnya: **"Database RSVP Raker AAG 2026"**.
3. Di menu atas, buka: **Extensions (Ekstensi)** > **Apps Script**.
4. Hapus isi file kode bawaan (`Code.gs`), lalu **salin (copy) dan tempel (paste)** seluruh isi berkas [`google-sheets-script.js`](google-sheets-script.js).
5. Pada menu dropdown fungsi di bagian atas editor, pilih fungsi **`setupSheet`**, lalu klik tombol **Run (Jalankan)**. Berikan izin akses Google sekali saja. Sheet akan otomatis membuat kolom dan sheet daftar nama peserta.
6. Klik tombol biru **Deploy (Terapkan)** di pojok kanan atas > pilih **New deployment (Penerapan baru)**.
   - Klik ikon gerigi (Select type) > pilih **Web app**.
   - **Description:** `RSVP Raker AAG 2026`
   - **Execute as:** `Me (email Anda)`
   - **Who has access:** `Anyone (Siapa saja, termasuk anonim)` *(Penting agar form dapat mengirim data)*
7. Klik **Deploy**, lalu salin **Web app URL** yang berakhiran `/exec`.
8. Buka berkas [`js/app.js`](js/app.js), cari baris konfigurasi di bagian paling atas:
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
     WEBAPP_URL: 'TEMPELKAN_URL_WEB_APP_DI_SINI',
     FETCH_ONLINE_GREETINGS: true
   };
   ```
   Tempelkan URL Web App Anda di antara tanda petik. **Selesai!** Sekarang semua RSVP akan langsung masuk ke Google Sheets.

---

## 📋 Rumus Otomatis Pembuat Link Personalisasi Tamu di Google Sheets

Pada sheet tab kedua bernama **`DAFTAR_PESERTA_UNDANGAN`**, Anda dapat mendaftarkan nama-nama karyawan:

| Kolom A (No) | Kolom B (Nama Peserta) | Kolom C (Divisi) | Kolom D (No WhatsApp) | Kolom E (Link Undangan) | Kolom F (Link WhatsApp Blast) |
|---|---|---|---|---|---|
| 1 | Bambang Sudiro | Direksi | 6281234567890 | *(Rumus Link)* | *(Rumus Kirim WA)* |
| 2 | Rizky Firmansyah | IT & Digital | 6281298765432 | *(Rumus Link)* | *(Rumus Kirim WA)* |

### Rumus Kolom E (Link Undangan Personal):
*(Ganti `https://undangan-raker-aag.com/` dengan link domain hosting web Anda)*
```excel
=HYPERLINK("https://undangan-raker-aag.com/?to=" & ENCODEURL(B2), "Buka Undangan")
```

### Rumus Kolom F (Tombol Kirim WhatsApp Otomatis dengan Pesan Siap Kirim):
```excel
="https://api.whatsapp.com/send?phone=" & D2 & "&text=" & ENCODEURL("Yth. Bapak/Ibu " & B2 & ", Anda resmi diundang ke RAKER AAG 2026 & AAG TREKKING CHALLENGE milik PT Anugrah Amartha Global. Silakan buka e-invitation Anda melalui tautan berikut: https://undangan-raker-aag.com/?to=" & ENCODEURL(B2))
```

Panitia cukup mengklik tautan di Kolom F untuk langsung membuka WhatsApp dan mengirim undangan personal dengan nama masing-masing peserta dalam 1 kali klik.

---

## 🎨 Identitas Visual & Palet Warna
- **Warna Utama:** Hijau Tua / Forest Green (`#0B6623`) & Hijau Cerah / Lime Green (`#32CD32`)
- **Warna Aksen:** Magenta / Hot Pink (`#E6007E`)
- **Latar Belakang:** Putih bersih (`#FFFFFF`) berpadu gradasi langit biru muda lembut (`#E0F4FF`), siluet pegunungan hijau berlapis, pohon pinus, serta pendaki mengibarkan bendera **AAG** di puncak bukit.
- **Elemen Dekoratif:** Pita garis lengkung dinamis hijau-magenta.
- **Branding & Tagline:** Logo AAG dengan panah akselerasi ke atas dan tagline *"STEP UP TO THE NEXT LEVEL"*.

---

## 📱 Fitur Lengkap Aplikasi

1. **Mobile-View Frame:** Tampilan simulasi smartphone di desktop dan responsif penuh pada ponsel.
2. **Floating Action Buttons (Kanan Bawah):** Menu Navigasi Cepat, E-Ticket QR Code Pass, dan Pemutar Musik Latar Instrumental Semangat.
3. **5 Tab Menu Navigasi:**
   - **Opening:** Logo AAG, sapaan dinamis `?to=Nama+Tamu`, tombol CTA *"Buka Undangan"* dengan efek confetti & autoplay audio.
   - **Acara:** Countdown timer otomatis ke 11 Desember 2026 pukul 05.00 WIB, kartu detail Trekking Challenge & Pleno Raker, tombol *"Simpan ke Google Calendar"* & *"Download iCal (.ics)"*.
   - **Maps:** Peta lokasi Bukit Cisadon Sentul, rute Google Maps & Waze, checklist interaktif perlengkapan trekking, dan kontak PIC WhatsApp.
   - **Rundown:** Timeline vertikal modern terstruktur JSON dengan filter waktu (Outdoor vs Pleno).
   - **RSVP:** Form konfirmasi kehadiran lengkap & papan ucapan real-time.

---

## 📁 Struktur Berkas Proyek

```text
raker/
├── index.html               # Halaman utama aplikasi mobile-first
├── README.md                # Panduan lengkap sistem & database
├── google-sheets-script.js  # Script backend Google Apps Script untuk Google Sheets
├── css/
│   └── style.css            # Styling custom, frame ponsel, animasi, tipografi sporty
├── js/
│   ├── app.js               # Logika navigasi tab, countdown, QR ticket, calendar, RSVP, sync Google Sheets
│   └── audio-synth.js       # Audio engine instrumental adventure Web Audio API
└── assets/
    ├── aag-logo.svg         # Logo resmi AAG & tagline "Step Up to the Next Level"
    ├── mountain-hero.svg    # Ilustrasi pegunungan hijau, pinus & pendaki berbendera AAG
    └── ribbon-decor.svg     # Elemen dekoratif pita dinamis hijau & magenta
```
