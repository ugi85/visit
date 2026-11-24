/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: DATABASE RSVP & SPREADSHEET RAKER AAG 2026
 * PT ANUGRAH AMARTHA GLOBAL
 * =========================================================================
 * 
 * CARA MENGGUNAKAN:
 * 1. Buat Google Spreadsheet baru di https://sheets.new
 * 2. Beri nama spreadsheet: "RSVP & Database Peserta Raker AAG 2026"
 * 3. Buka menu: Extensions (Ekstensi) > Apps Script
 * 4. Hapus semua kode default di Apps Script, lalu tempel (paste) seluruh kode ini.
 * 5. Jalankan fungsi 'setupSheet()' sekali saja (klik tombol 'Run' / 'Jalankan')
 *    untuk membuat judul kolom otomatis.
 * 6. Klik tombol 'Deploy' (Terapkan) di kanan atas > 'New deployment' (Penerapan baru)
 * 7. Pilih tipe: 'Web app'
 *    - Description: "RSVP API Raker AAG 2026"
 *    - Execute as: "Me" (Email Google Anda)
 *    - Who has access: "Anyone" (Siapa saja, termasuk pengguna anonim)
 * 8. Klik 'Deploy', lalu Salin "Web app URL" (akhiran /exec)
 * 9. Tempelkan URL tersebut ke berkas js/app.js pada baris:
 *    GOOGLE_SHEETS_CONFIG.WEBAPP_URL = 'PASTE_URL_DISINI';
 * =========================================================================
 */

// Nama Sheet untuk menyimpan data RSVP
const SHEET_RSVP_NAME = "RSVP_RESPONSES";
const SHEET_PESERTA_NAME = "DAFTAR_PESERTA_UNDANGAN";

/**
 * Setup otomatis sheet dan header kolom
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Sheet RSVP
  let rsvpSheet = ss.getSheetByName(SHEET_RSVP_NAME);
  if (!rsvpSheet) {
    rsvpSheet = ss.insertSheet(SHEET_RSVP_NAME);
  }
  
  const headers = [
    "Timestamp",
    "Nama Lengkap",
    "Divisi / Departemen",
    "Status Kehadiran",
    "Ukuran Jersey",
    "Catatan / Alergi",
    "Pesan Semangat Raker 2026"
  ];
  
  rsvpSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  rsvpSheet.getRange(1, 1, 1, headers.length)
    .setBackground("#0B6623")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  rsvpSheet.setFrozenRows(1);
  
  // 2. Setup Sheet Generator Daftar Peserta & Link Undangan
  let pesertaSheet = ss.getSheetByName(SHEET_PESERTA_NAME);
  if (!pesertaSheet) {
    pesertaSheet = ss.insertSheet(SHEET_PESERTA_NAME);
  }
  
  const pesertaHeaders = [
    "No",
    "Nama Peserta",
    "Divisi / Jabatan",
    "No WhatsApp",
    "Link Undangan Personal",
    "Link Kirim WhatsApp Otomatis"
  ];
  
  pesertaSheet.getRange(1, 1, 1, pesertaHeaders.length).setValues([pesertaHeaders]);
  pesertaSheet.getRange(1, 1, 1, pesertaHeaders.length)
    .setBackground("#E6007E")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  pesertaSheet.setFrozenRows(1);

  // Contoh data template peserta
  const sampleData = [
    [1, "Bambang Sudiro", "Direksi", "6281234567890", '=HYPERLINK("https://domain-anda.com/?to=" & ENCODEURL(B2), "Buka Undangan")', '="https://api.whatsapp.com/send?phone=" & D2 & "&text=" & ENCODEURL("Yth. Bapak/Ibu " & B2 & ", Anda resmi diundang ke RAKER AAG 2026 & AAG TREKKING CHALLENGE. Buka e-invitation Anda di sini: https://domain-anda.com/?to=" & ENCODEURL(B2))'],
    [2, "Rizky Firmansyah", "IT & Digital", "6281298765432", '=HYPERLINK("https://domain-anda.com/?to=" & ENCODEURL(B3), "Buka Undangan")', '="https://api.whatsapp.com/send?phone=" & D3 & "&text=" & ENCODEURL("Yth. Bapak/Ibu " & B3 & ", Anda resmi diundang ke RAKER AAG 2026 & AAG TREKKING CHALLENGE. Buka e-invitation Anda di sini: https://domain-anda.com/?to=" & ENCODEURL(B3))'],
    [3, "Dewi Anggraini", "Finance & Accounting", "6281311223344", '=HYPERLINK("https://domain-anda.com/?to=" & ENCODEURL(B4), "Buka Undangan")', '="https://api.whatsapp.com/send?phone=" & D4 & "&text=" & ENCODEURL("Yth. Bapak/Ibu " & B4 & ", Anda resmi diundang ke RAKER AAG 2026 & AAG TREKKING CHALLENGE. Buka e-invitation Anda di sini: https://domain-anda.com/?to=" & ENCODEURL(B4))']
  ];
  
  pesertaSheet.getRange(2, 1, sampleData.length, pesertaHeaders.length).setValues(sampleData);
  
  Logger.log("Setup Berhasil! Sheet siap digunakan.");
}

/**
 * Handle HTTP POST (Menerima input RSVP dari Web Undangan)
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_RSVP_NAME);
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName(SHEET_RSVP_NAME);
    }
    
    // Parse data dari request body
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    const timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    const name = data.name || "-";
    const dept = data.dept || "-";
    const status = data.status === "hadir" ? "Hadir" : "Tidak Hadir";
    const shirtSize = data.shirtSize || "-";
    const notes = data.notes || "-";
    const message = data.message || "-";
    
    // Tambahkan baris baru ke sheet
    sheet.appendRow([
      timestamp,
      name,
      dept,
      status,
      shirtSize,
      notes,
      message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data RSVP berhasil disimpan ke Google Sheets",
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle HTTP GET (Menampilkan daftar ucapan peserta ke Web Undangan)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_RSVP_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    const rows = sheet.getDataRange().getValues();
    const greetings = [];
    
    // Mulai dari baris 2 (melewati baris header)
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (r[1]) { // jika nama ada
        greetings.push({
          time: r[0] ? formatTimeAgo(new Date(r[0])) : "Terkonfirmasi",
          name: r[1],
          dept: r[2],
          status: r[3] === "Hadir" ? "hadir" : "tidak",
          shirtSize: r[4],
          notes: r[5],
          message: r[6]
        });
      }
    }
    
    // Urutkan dari yang paling baru
    greetings.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: greetings.length,
      data: greetings
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      data: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Format timestamp menjadi time ago sederhana
 */
function formatTimeAgo(date) {
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + " menit yang lalu";
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return diffHour + " jam yang lalu";
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Kemarin";
  return diffDay + " hari yang lalu";
}
