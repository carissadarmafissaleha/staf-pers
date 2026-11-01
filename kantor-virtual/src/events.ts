// Random office events that trigger periodically

export interface RandomOfficeEvent {
  id: string
  name: string
  slackAnnouncement: string
  duration: number // ms
  type: 'all-move' | 'single-agent' | 'visual-only' | 'slack-only'
  targetPosition?: { x: number; y: number }
  agentMessages?: string[]
  managerMessage?: string
  sound?: 'alarm' | 'celebration' | 'doorOpen' | 'error' | 'powerDown' | 'notification' | 'coffee'
}

export const RANDOM_EVENTS: RandomOfficeEvent[] = [
  {
    id: 'fire-drill',
    name: 'Simulasi Tanggap Darurat',
    slackAnnouncement: '🚨 SIMULASI STAF PERS! Semua personel kumpul di titik aman!',
    duration: 6000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: 'Pemeriksaan Kesiapan Staf! Amankan arsip dan berkas dinas!',
    agentMessages: ['amankan berkas Surat Bentuk B!', 'berkas dosir sudah dikunci di lemari!', 'bawa register surat keluar!', 'siap laksanakan perintah!'],
    sound: 'alarm',
  },
  {
    id: 'pizza',
    name: 'Makan Siang Staf',
    slackAnnouncement: '🍕 Jam istirahat makan tiba! Personel staf silakan makan siang bareng!',
    duration: 5000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: 'Istirahat sejenak di ruang makan staf!',
    agentMessages: ['siap, isi tenaga dulu!', 'waktunya rehat setelah ketik naskah dinas', 'mantap, lanjut dinas lebih fokus nanti', 'ambil jatah makanan siang!'],
    sound: 'celebration',
  },
  {
    id: 'standup',
    name: 'Briefing Pagi Spers',
    slackAnnouncement: '📢 @here Pengarahan Pagi Staf Personalia (Spers) dimulai',
    duration: 7000,
    type: 'all-move',
    targetPosition: { x: 411, y: 417 },
    managerMessage: 'Pengarahan! Administrasi surat mana yang siap diajukan?',
    agentMessages: ['sedang memproses Surat B SIJ Keluar Kotama', 'data nominatif Sisfopers sudah sinkron', 'menyiapkan berkas izin nikah Pratu Lalaun', 'pemeriksaan tanggal cuti 23 hari kerja sudah selesai', 'draf surat dinas siap diajukan ke Danyonif'],
    sound: 'notification',
  },
  {
    id: 'deploy',
    name: 'Pengesahan Surat Dinas',
    slackAnnouncement: '🚀 MENGESAHKAN TULISAN DINAS BENTUK B...',
    duration: 5000,
    type: 'slack-only',
    managerMessage: 'Pengesahan dan penomoran agenda dinas...',
    agentMessages: ['pastikan format Jukminu TNI terjaga utuh', 'cek nomor registrasi dan tembusan', 'arsip surat tersimpan rapi', 'berkas dinas siap cetak', 'cek stempel dan tanda tangan'],
    sound: 'notification',
  },
  {
    id: 'deploy-success',
    name: 'Pengesahan Berhasil',
    slackAnnouncement: '✅ Pengesahan tulisan dinas sukses! Seluruh naskah beres 🎉',
    duration: 3000,
    type: 'slack-only',
    managerMessage: 'Naskah dinas selesai tepat waktu, kerja bagus!',
    agentMessages: ['surat siap dikirim ke Kotama!', 'arsip dosir sudah diperbarui', 'kerja sama tim staf pers mantap', 'lanjut tugas berikutnya!'],
    sound: 'celebration',
  },
  {
    id: 'deploy-fail',
    name: 'Pengesahan Ditolak',
    slackAnnouncement: '💥 PENGESAHAN DITOLAK — ADA KESALAHAN FORMAT/NRP',
    duration: 4000,
    type: 'slack-only',
    managerMessage: 'PERIKSA ULANG! Siapa yang salah input data?',
    agentMessages: ['cek lagi NRP di nominatif Sisfopers', 'waduh, ada salah hitung hari cuti', 'perbaiki format margin dan kop surat', 'segera revisi konsep surat dinas'],
    sound: 'error',
  },
  {
    id: 'power-flicker',
    name: 'Listrik Berkedip',
    slackAnnouncement: '⚡ Listrik kantor berkedip — Simpan naskah dan dokumen Anda!',
    duration: 3000,
    type: 'visual-only',
    agentMessages: ['tekan Ctrl+S cepat!', 'untung sudah disimpan drafnya', 'cek UPS komputer operator', 'jangan sampai naskah hilang'],
    sound: 'powerDown',
  },
  {
    id: 'birthday',
    name: 'Ulang Tahun Prajurit',
    slackAnnouncement: '🎂 Selamat Ulang Tahun untuk rekan prajurit staf! Ada konsumsi di ruang rehat!',
    duration: 4000,
    type: 'all-move',
    targetPosition: { x: 287, y: 129 },
    managerMessage: 'Selamat ulang tahun, semoga berkah dan sukses selalu!',
    agentMessages: ['selamat ulang tahun, rekan!', 'panjang umur dan sukses dinas!', '🎉🎉🎉', 'terima kasih komandan'],
    sound: 'celebration',
  },
  {
    id: 'who-broke-build',
    name: 'Kesalahan Naskah',
    slackAnnouncement: '🔴 Dokumen dinas ada kesalahan format! Siapa yang salah ketik?',
    duration: 5000,
    type: 'slack-only',
    managerMessage: 'Semua teliti kembali, jangan sampai ada surat salah tembusan.',
    agentMessages: ['cek riwayat pengeditan berkas', 'saya cek daftar nominatif dulu', 'bukan di meja saya, format sudah pas', 'sedang ditelusuri bamin dosir'],
    sound: 'error',
  },
  {
    id: 'friday',
    name: 'Jumat Berkah',
    slackAnnouncement: '🎉 Hari Jumat! Bereskan rekap administrasi mingguan staf pers!',
    duration: 3000,
    type: 'slack-only',
    managerMessage: 'Pastikan seluruh laporan mingguan Spers rampung sebelum apel sore.',
    agentMessages: ['laporan rekap cuti sudah beres', 'arsip minggu ini sudah rapi', 'persiapan apel sore tepat waktu', 'semangat dinas akhir pekan!'],
    sound: 'celebration',
  },
  {
    id: 'printer-jam',
    name: 'Printer Macet',
    slackAnnouncement: '🖨️ Mesin printer macet (kertas tersangkut / paper jam)!',
    duration: 4000,
    type: 'single-agent',
    targetPosition: { x: 424, y: 132 },
    agentMessages: ['waduh, kertas Surat Bentuk B tersangkut di roller', 'tolong buka baki kertas dan bersihkan perlahan', 'siapa tadi yang cetak tanpa cek isi kertas?', 'jangan dipaksa ditarik, nanti sobek...'],
    sound: 'error',
  },
  {
    id: 'slack-down',
    name: 'Jaringan Gangguan',
    slackAnnouncement: '💀 Jaringan lokal kantor sempat gangguan sejenak...',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['koordinasi langsung lewat meja sebelah', 'cek kabel LAN dan router kantor', 'jaringan kembali normal, lanjut dinas'],
    sound: 'notification',
  },
]

// Percakapan Santai Personel Staf Pers di Kantor
export const DRAMA_CONVERSATIONS = [
  {
    trigger: 'coffee-meet',
    messages: [
      { sender: 0, text: 'sudah cek pengajuan cuti yang baru masuk?' },
      { sender: 1, text: 'yang cuti 23 hari ke Kendal? iya...' },
      { sender: 0, text: 'pengikutnya lengkap istri dan anak ya' },
      { sender: 1, text: 'sudah sinkron di Sisfopers 👍' },
    ],
  },
  {
    trigger: 'who-pushed',
    messages: [
      { sender: 0, text: 'siapa yang tadi ubah nomor agenda surat keluar?' },
      { sender: 1, text: 'bukan saya' },
      { sender: 0, text: 'buku register mencatat paraf operator minpers' },
      { sender: 1, text: 'siap, tadi disesuaikan urutan tanggal...' },
    ],
  },
  {
    trigger: 'tabs-vs-spaces',
    messages: [
      { sender: 0, text: 'pakai font Arial 12pt atau Bookman Old Style?' },
      { sender: 1, text: 'Surat Bentuk B wajib Arial 12pt sesuai Jukminu TNI' },
      { sender: 0, text: 'siap, laksanakan ketentuan dinas!' },
    ],
  },
  {
    trigger: 'meeting',
    messages: [
      { sender: 0, text: 'briefing tadi cukup lewat disposisi tertulis sebenarnya' },
      { sender: 1, text: 'biar seluruh bamin dan tamudi satu pemahaman' },
    ],
  },
  {
    trigger: 'framework',
    messages: [
      { sender: 0, text: 'semua arsip dosir lebih rapi kalau digital penuh' },
      { sender: 1, text: 'arsip fisik bermaterai tetap wajib disimpan di lemari' },
      { sender: 0, text: 'benar juga, demi tertib administrasi' },
    ],
  },
  {
    trigger: 'legacy',
    messages: [
      { sender: 0, text: 'menemukan berkas izin jalan tahun 2021 di laci' },
      { sender: 1, text: 'catatan disposisinya apa?' },
      { sender: 0, text: '"arsipkan di dosir kompi"' },
      { sender: 1, text: 'masukkan ke ordner arsip inaktif sekarang' },
      { sender: 0, text: 'siap, segera dirapikan' },
    ],
  },
  {
    trigger: 'ai',
    messages: [
      { sender: 0, text: 'asisten AI mengetik Surat Bentuk B cepat sekali' },
      { sender: 1, text: 'format Jukminu TNI dan 9 parameter langsung pas' },
      { sender: 0, text: 'pekerjaan staf pers jadi jauh lebih efisien' },
    ],
  },
  {
    trigger: 'standup-excuse',
    messages: [
      { sender: 0, text: 'kemarin sore dinas apa saja di ruang pers?' },
      { sender: 1, text: 'verifikasi berkas izin nikah Pratu Lalaun' },
      { sender: 0, text: 'sudah lengkap semua persyaratannya?' },
      { sender: 1, text: 'tinggal menunggu tanda tangan pengesahan' },
    ],
  },
]

// Slack reactions that randomly appear on messages
export const SLACK_REACTIONS = ['👍', '🔥', '💀', '😂', '🚀', '❤️', '👀', '💯', '🎉', '😅', '🤔', '⚡']

// Office / Ruang Staf Pers Events
export const OFFICE_EVENTS: RandomOfficeEvent[] = [
  {
    id: 'fire-alarm-stress-relief',
    name: 'Simulasi Tanggap Darurat',
    slackAnnouncement: '🔥 SIMULASI TANGGAP DARURAT RUANG STAF!',
    duration: 6000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: 'Amankan berkas rahasia dan segera keluar!',
    agentMessages: ['amankan dosir!', 'bawa buku agenda keluar!', 'segera evakuasi!', 'cek alat pemadam api!'],
    sound: 'alarm',
  },
  {
    id: 'cpr-training',
    name: 'Pelatihan P3K',
    slackAnnouncement: '🫀 Pelatihan pertolongan pertama (P3K) personel staf',
    duration: 5000,
    type: 'slack-only',
    managerMessage: 'Ikuti ketukan irama kompresi dada yang benar',
    agentMessages: ['latihan pernapasan buatan', 'pastikan nadi teraba', 'catat prosedur evakuasi medis'],
    sound: 'notification',
  },
  {
    id: 'golden-ticket',
    name: 'Penghargaan Staf',
    slackAnnouncement: '🎫 Penyerahan piagam prajurit teladan staf pers!',
    duration: 4000,
    type: 'slack-only',
    managerMessage: 'Penghargaan atas dedikasi ketertiban naskah dinas.',
    agentMessages: ['selamat untuk operator terbaik!', 'kerja keras membuahkan hasil', 'tingkatkan terus kinerja staf'],
    sound: 'celebration',
  },
  {
    id: 'jim-prank',
    name: 'Stempel Berpindah',
    slackAnnouncement: '🥤 Ada yang memindahkan stempel dinas ke meja sebelah',
    duration: 3500,
    type: 'slack-only',
    managerMessage: 'Kembalikan stempel dinas ke tempat asalnya!',
    agentMessages: ['siapa yang pinjam stempel?', 'kembalikan ke bamin pers', 'jangan bercanda saat jam dinas'],
    sound: 'notification',
  },
  {
    id: 'parkour',
    name: 'Pembinaan Fisik',
    slackAnnouncement: '🏃 Latihan pembinaan fisik personel staf pers!',
    duration: 4000,
    type: 'visual-only',
    managerMessage: 'Jaga fisik agar tetap prima saat bertugas!',
    agentMessages: ['siap laksanakan pembinaan fisik!', 'lari keliling pangkalan', 'badan bugar pikiran segar'],
    sound: 'celebration',
  },
  {
    id: 'schrute-bucks',
    name: 'Evaluasi Tatib',
    slackAnnouncement: '💵 Evaluasi kedisiplinan dan poin ketertiban staf',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['catat poin ketertiban', 'pertahankan disiplin militer', 'laksanakan dinas tepat waktu'],
    sound: 'notification',
  },
  {
    id: 'kevins-chili',
    name: 'Kopi Tumpah',
    slackAnnouncement: '🫘 Kopi staf tumpah di dekat meja berkas!',
    duration: 4000,
    type: 'slack-only',
    managerMessage: 'Cepat ambil lap, jangan sampai mengenai kertas dinas!',
    agentMessages: ['waduh, bersihkan sekarang!', 'untung berkas sudah disingkirkan', 'lap lantainya sampai kering'],
    sound: 'error',
  },
  {
    id: 'printer-jam-dm',
    name: 'Printer Macet Parah',
    slackAnnouncement: '🖨️ Mesin printer kantor macet dan mengeluarkan asap!',
    duration: 4000,
    type: 'single-agent',
    targetPosition: { x: 424, y: 132 },
    managerMessage: 'Cabut kabel power printer sekarang!',
    agentMessages: ['printer terlalu panas karena cetak berlembar-lembar', 'matikan saklar listriknya!', 'panggil bamin yang urus logistik kantor', 'kertasnya tersangkut di drum pemanas'],
    sound: 'error',
  },
  {
    id: 'dundies',
    name: 'Piagam Satuan',
    slackAnnouncement: '🏆 Apel malam dan pemberian penghargaan staf terbaik',
    duration: 4000,
    type: 'slack-only',
    managerMessage: 'Terima kasih atas dedikasi seluruh personel staf pers!',
    agentMessages: ['penghargaan ketertiban administrasi', 'bangga menjadi staf Yonif 735', 'pertahankan prestasi satuan'],
    sound: 'celebration',
  },
  {
    id: 'pretzel-day',
    name: 'Snack Sore',
    slackAnnouncement: '🥨 Pembagian makanan ringan sore di ruang staf pers!',
    duration: 5000,
    type: 'all-move',
    targetPosition: { x: 287, y: 129 },
    managerMessage: 'Silakan dinikmati bersama seluruh rekan staf.',
    agentMessages: ['terima kasih komandan!', 'rehat sore yang mantap', 'isi energi sebelum dinas malam'],
    sound: 'celebration',
  },
  {
    id: 'bears-beets',
    name: 'Kuis Jukminu',
    slackAnnouncement: '📋 Kuis pemahaman naskah dinas dan Jukminu TNI',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['Surat Bentuk B ditandatangani Danyonif!', 'rahasia militer wajib dijaga', 'siap menjawab pertanyaan komandan'],
    sound: 'notification',
  },
]

// Incident-mode events (Siaga Darurat Staf Pers)
export const INCIDENT_EVENTS: RandomOfficeEvent[] = [
  {
    id: 'fire-drill',
    name: 'Rapat Darurat',
    slackAnnouncement: '🚨 Seluruh personel staf pers segera kumpul di ruang perwira!',
    duration: 6000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: 'Pemeriksaan mendesak, siapa yang memegang naskah dinas terkait?',
    agentMessages: ['segera merapat ke ruang perwira', 'berkas sudah saya siapkan', 'siap menerima petunjuk komandan'],
    sound: 'alarm',
  },
  {
    id: 'pizza',
    name: 'Ransum Lembur',
    slackAnnouncement: '🍕 Makanan logistik dinas malam tiba untuk personel piket',
    duration: 5000,
    type: 'all-move',
    targetPosition: { x: 114, y: 105 },
    managerMessage: 'Makan bergantian, tetap ada yang standby di meja naskah',
    agentMessages: ['siap, makan cepat lalu lanjut ketik', 'terima kasih ransum malamnya'],
    sound: 'celebration',
  },
  {
    id: 'standup',
    name: 'Pembaruan Situasi',
    slackAnnouncement: '📢 @here Pembaruan situasi: periksa data dan kendala administrasi',
    duration: 7000,
    type: 'all-move',
    targetPosition: { x: 411, y: 417 },
    managerMessage: 'Laporkan status tiap permohonan surat dinas',
    agentMessages: ['permohonan SIJ dalam proses ketik', 'data nominatif sudah klir', 'tidak ada kendala naskah dinas'],
    sound: 'notification',
  },
  {
    id: 'deploy',
    name: 'Revisi Naskah',
    slackAnnouncement: '🚀 MEMPROSES REVISI DAN PEMBETULAN NASKAH DINAS...',
    duration: 5000,
    type: 'slack-only',
    managerMessage: 'Tunggu hasil cetak ulang naskah dinas',
    agentMessages: ['sedang mencetak ulang', 'memeriksa baris demi baris', 'semoga kali ini disetujui'],
    sound: 'notification',
  },
  {
    id: 'deploy-success',
    name: 'Pengesahan Tuntas',
    slackAnnouncement: '✅ Revisi naskah selesai — seluruh berkas telah disahkan',
    duration: 3000,
    type: 'slack-only',
    managerMessage: 'Kerja cepat dan tepat, status kembali normal',
    agentMessages: ['naskah dinas aman dan siap kirim', 'terima kasih atas koreksinya', 'arsip sudah di-update'],
    sound: 'celebration',
  },
  {
    id: 'deploy-fail',
    name: 'Revisi Gagal',
    slackAnnouncement: '💥 Revisi naskah masih terdapat kesalahan — periksa ulang!',
    duration: 4000,
    type: 'slack-only',
    managerMessage: 'Bongkar konsepnya, sesuaikan dengan arahan!',
    agentMessages: ['siap perbaiki lagi', 'cek ketentuan Jukminu terbaru', 'segera saya betulkan'],
    sound: 'error',
  },
  {
    id: 'power-flicker',
    name: 'Genset Kantor',
    slackAnnouncement: '⚡ Genset kantor menyala otomatis saat listrik PLN mati',
    duration: 3000,
    type: 'visual-only',
    agentMessages: ['daya listrik sudah stabil lagi', 'komputer operator tetap aman'],
    sound: 'powerDown',
  },
  {
    id: 'birthday',
    name: 'Oper Piket',
    slackAnnouncement: '🕑 Pergantian giliran piket staf pers dimulai',
    duration: 4000,
    type: 'all-move',
    targetPosition: { x: 287, y: 129 },
    managerMessage: 'Lakukan serah terima buku register dan berkas dengan teliti',
    agentMessages: ['buku register diserahterimakan lengkap', 'situasi ruang pers aman terkendali'],
    sound: 'notification',
  },
  {
    id: 'who-broke-build',
    name: 'Audit Kesalahan',
    slackAnnouncement: '🔴 Penelusuran kesalahan naskah dinas oleh Bamin Pers',
    duration: 5000,
    type: 'slack-only',
    managerMessage: 'Cari tahu di mana letak ketidakcocokan datanya.',
    agentMessages: ['sedang mencocokkan dengan nominatif', 'kesalahan format sudah ditemukan', 'segera kami luruskan'],
    sound: 'error',
  },
  {
    id: 'friday',
    name: 'Batas Waktu Naskah',
    slackAnnouncement: '📅 Pengingat: selesaikan seluruh konsep surat dinas sebelum batas waktu',
    duration: 3000,
    type: 'slack-only',
    managerMessage: 'Jangan tunda pekerjaan administrasi sampai hari berikutnya',
    agentMessages: ['siap komandan, kami selesaikan hari ini', 'semua berkas diproses tuntas'],
    sound: 'notification',
  },
  {
    id: 'printer-jam',
    name: 'Printer Macet Kertas',
    slackAnnouncement: '🖨️ Kertas printer macet saat mencetak berkas dinas',
    duration: 4000,
    type: 'single-agent',
    targetPosition: { x: 424, y: 132 },
    managerMessage: 'Buka tutup printer dan tarik kertas yang tersangkut',
    agentMessages: ['kertas macet di bagian penarik baki', 'buka penutup printer dan tarik perlahan', 'jangan sampai ada serpihan kertas tersisa di dalam'],
    sound: 'error',
  },
  {
    id: 'slack-down',
    name: 'Sistem Terputus',
    slackAnnouncement: '💀 Sistem monitoring kantor sempat offline sejenak',
    duration: 3000,
    type: 'slack-only',
    agentMessages: ['sistem sudah online kembali', 'data administrasi tersimpan utuh'],
    sound: 'notification',
  },
]

import { getTheme } from './theme'
import { getVariant } from './incident'

export function pickEvent(): RandomOfficeEvent {
  const isOffice = getTheme() === 'office'

  // Incident mode: the deploy chain runs hotter (0.35 vs 0.15) and every
  // event reads as part of the outage. Same ids, so movement targets resolve.
  if (getVariant() === 'incident') {
    if (Math.random() < 0.35) {
      return Math.random() < 0.7
        ? INCIDENT_EVENTS.find(e => e.id === 'deploy-success')!
        : INCIDENT_EVENTS.find(e => e.id === 'deploy-fail')!
    }
    const pool = INCIDENT_EVENTS.filter(e => e.id !== 'deploy-success' && e.id !== 'deploy-fail')
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Deploy events chain together (kept for both themes)
  if (Math.random() < 0.15) {
    return Math.random() < 0.7
      ? RANDOM_EVENTS.find(e => e.id === 'deploy-success')!
      : RANDOM_EVENTS.find(e => e.id === 'deploy-fail')!
  }

  if (isOffice) {
    // 70% Office-themed, 30% default — keeps things varied
    const useOffice = Math.random() < 0.7
    const pool = useOffice
      ? OFFICE_EVENTS
      : RANDOM_EVENTS.filter(e => e.id !== 'deploy-success' && e.id !== 'deploy-fail')
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const pool = RANDOM_EVENTS.filter(e => e.id !== 'deploy-success' && e.id !== 'deploy-fail')
  return pool[Math.floor(Math.random() * pool.length)]
}
