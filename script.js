/* ========================================================= */
/* ===== LGT PEMESAN FINAL SCRIPT – LINK TAMU + TEKS ====== */
/* ========================================================= */

const sheetURL = "https://script.google.com/macros/s/AKfycbxN4xsOjnYwO0TTTWJ_HLv9JIlrdKAou7bbJaoWLIP4I-PDy3v5Jh4dzq-LlWoGy52_/exec";

const urlParams = new URLSearchParams(window.location.search);
const proyek = urlParams.get('proyek');

const namaInput = document.getElementById('namaTamu');
const generateBtn = document.getElementById('generateBtn');
const linkContainer = document.getElementById('link-container');
const generatedLink = document.getElementById('generatedLink');
const shareBtn = document.getElementById('shareBtn');
const copyBtn = document.getElementById('copyBtn');
const invitationTextEl = document.getElementById('invitationText'); // elemen textarea/div untuk teks undangan

async function getProjectUrl(proyekId) {
  try {
    const res = await fetch(`${sheetURL}?action=get`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    const project = data.find(p => Number(p.id) === Number(proyekId));
    return project ? project.url : null;
  } catch (err) {
    console.error("❌ Gagal mengambil data proyek:", err);
    return null;
  }
}

generateBtn.addEventListener('click', async () => {
  const nama = namaInput.value.trim();
  if (!nama) {
    alert("Silakan masukkan nama Anda");
    return;
  }

  const projectUrl = await getProjectUrl(proyek);
  if (!projectUrl) {
    alert("❌ URL undangan proyek tidak ditemukan. Periksa nomor proyek.");
    return;
  }

  const linkTamu = `${projectUrl}?to=${encodeURIComponent(nama)}`;
  generatedLink.value = linkTamu;
  linkContainer.style.display = 'block';

  // Teks undangan lengkap dengan link otomatis
  const invitationText = `Assalamualaikum warahmatullahi wabarakatuh

Dengan penuh rasa syukur, kami mengundang anda untuk menghadiri pernikahan kami.
Yang akan diselenggarakan pada:

Hari/Tanggal: [Hari], [Tanggal]

Waktu: [Waktu Mulai] - [Waktu Selesai]

Lokasi: [Tempat/Platform Online]

Untuk informasi lebih lanjut, silahkan akses tautan berikut:
${linkTamu}

Kehadiran anda adalah suatu kehormatan dan kebahagiaan bagi kami.

Waalaikumussalam warahmatullahi wabarakatuh

[Nama Mempelai/Nama mempelai]`;

  invitationTextEl.textContent = invitationText;
});

// Tombol salin link
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    alert("✅ Link berhasil disalin!");
  } catch (err) {
    console.error(err);
    alert("❌ Gagal menyalin link.");
  }
});

// Tombol bagikan link + teks undangan
shareBtn.addEventListener('click', async () => {
  const textToShare = invitationTextEl.textContent;
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Undangan Pernikahan",
        text: textToShare,
        url: generatedLink.value
      });
    } catch (err) {
      console.warn("Batal membagikan:", err);
    }
  } else {
    alert("Web Share API tidak didukung di perangkat ini.");
  }
});
