import React, { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
  onSaved?: () => void;
  embedded?: boolean;
}

interface AgentOption {
  role: string;
  defaultName: string;
  defaultSprite: string;
  defaultColor: string;
  label: string;
  agentId: string;
  desc: string;
}

// 6 Personel Staf Personalia Yonif 735/Nawasena di Kantor Virtual
const AGENTS_LIST: AgentOption[] = [
  {
    role: 'boss',
    defaultName: 'Danyonif 735/Nws',
    defaultSprite: 'Me-1',
    defaultColor: '#f97316',
    label: '🎖️ Danyonif (Komandan)',
    agentId: 'boss',
    desc: 'Komandan Batalyon Yonif 735/Nawasena & Pengambil Keputusan',
  },
  {
    role: 'pasi-pers',
    defaultName: 'PASI PERS',
    defaultSprite: 'Claude-1',
    defaultColor: '#10b981',
    label: '⭐ Pasi Pers (Perwira Seksi)',
    agentId: 'pasi-pers',
    desc: 'Perwira Seksi Personalia (Pemeriksa Naskah & Otorisasi)',
  },
  {
    role: 'assistant',
    defaultName: 'Bamin Minpers',
    defaultSprite: 'Frontend-dev-1',
    defaultColor: '#8b5cf6',
    label: '📋 Bamin Pers (Asisten)',
    agentId: 'assistant-claude',
    desc: 'Bintara Administrasi Personel & Pendamping Staf',
  },
  {
    role: 'sertu-ricat',
    defaultName: 'SERTU RICAT',
    defaultSprite: 'employee-2',
    defaultColor: '#2563eb',
    label: '📑 Sertu Ricat (SURAT B)',
    agentId: 'sertu-ricat',
    desc: 'Operator Pemrosesan Surat Bentuk B & Pelayanan Personel',
  },
  {
    role: 'pratu-yacob',
    defaultName: 'PRATU YACOB',
    defaultSprite: 'employee-1',
    defaultColor: '#059669',
    label: '🗂️ Pratu Yacob (SIJ)',
    agentId: 'pratu-yacob',
    desc: 'Taopr Data Sisfopers & Penerbit Surat Izin Jalan (SIJ)',
  },
  {
    role: 'pratu-lalaun',
    defaultName: 'PRATU LALAUN',
    defaultSprite: 'employee-3',
    defaultColor: '#ec4899',
    label: '💍 Pratu Lalaun (Izin Nikah)',
    agentId: 'pratu-lalaun',
    desc: 'Tamudi Kima & Pengurusan Berkas Permohonan Izin Nikah',
  },
];

interface SpriteOption {
  id: string;
  label: string;
  gender: 'female' | 'male';
  desc: string;
  category: 'original' | 'office';
}

const OFFICE_SPRITES = new Set([
  'andy-bernard', 'angela-martin', 'bob-vance', 'carol-stills',
  'creed-bratton', 'darryl-philbin', 'david-wallace', 'dwight-schrute',
  'erin-hannon', 'gabe-lewis', 'holly-flax', 'jan-levinson',
  'jim-halpert', 'karen-filippelli', 'kelly-kapoor', 'kevin-malone',
  'meredith-palmer', 'michael-scott', 'nellie-bertram', 'oscar-martinez',
  'pam-beesly', 'phyllis-vance', 'robert-california', 'roy-anderson',
  'ryan-howard', 'stanley-hudson', 'toby-flenderson',
]);

export const getSpritePreviewUrl = (id: string): string => {
  if (OFFICE_SPRITES.has(id)) {
    return `/sprites/office/characters/${id}-front-left.png`;
  }
  return `/sprites/characters/${id}-front-left.png`;
};

// 37 Koleksi Lengkap Sprite Karakter Staf Personalia & Administrasi
const DEV_SPRITES: SpriteOption[] = [
  // --- 10 Sprite Pixel Original ---
  { id: 'Me-1', label: 'Komandan Batalyon', gender: 'male', desc: 'Pimpinan & pengambil keputusan', category: 'original' },
  { id: 'Claude-1', label: 'Perwira Seksi Personalia', gender: 'male', desc: 'Pasi Pers pengawas administrasi dinas', category: 'original' },
  { id: 'Frontend-dev-1', label: 'Kowad Bamin Staf', gender: 'female', desc: 'Bamin administrasi naskah putri', category: 'original' },
  { id: 'employee-1', label: 'Bintara Urusan Minpers', gender: 'male', desc: 'Bamin urusan personel & cuti', category: 'original' },
  { id: 'employee-2', label: 'Operator Komputer Minpers', gender: 'female', desc: 'Operator pemrosesan berkas dinas', category: 'original' },
  { id: 'employee-3', label: 'Tamtama Pengadministrasi', gender: 'female', desc: 'Pengelola arsip & berkas permohonan', category: 'original' },
  { id: 'dev-1', label: 'Taopr Database Sisfopers', gender: 'male', desc: 'Operator pangkalan data prajurit', category: 'original' },
  { id: 'dev-2', label: 'Operator Naskah Dinas', gender: 'male', desc: 'Juru ketik Surat Bentuk B', category: 'original' },
  { id: 'explore-1', label: 'Caraka / Kurir Pers', gender: 'male', desc: 'Pengantar disposisi surat dinas', category: 'original' },
  { id: 'security-audit-1', label: 'Provost / Pengaman Rahasia', gender: 'male', desc: 'Penjaga kerahasiaan dosir militer', category: 'original' },

  // --- 16 Sprite Office Pria ---
  { id: 'michael-scott', label: 'Danstaf / Pamen Senior', gender: 'male', desc: 'Kepala kantor & koordinator staf', category: 'office' },
  { id: 'jim-halpert', label: 'Ba Urusan Personel (Baurpers)', gender: 'male', desc: 'Bintara pelaksana minpers', category: 'office' },
  { id: 'dwight-schrute', label: 'Bintara Disiplin & Tatib (Provost)', gender: 'male', desc: 'Penegak disiplin staf kantor', category: 'office' },
  { id: 'ryan-howard', label: 'Tamtama Operator IT Kompi', gender: 'male', desc: 'Operator sistem informasi muda', category: 'office' },
  { id: 'andy-bernard', label: 'Perwira Urusan Penerangan', gender: 'male', desc: 'Paur pen & hubungan staf', category: 'office' },
  { id: 'stanley-hudson', label: 'Bintara Senior Pembukuan', gender: 'male', desc: 'Juru catat senior hak prajurit', category: 'office' },
  { id: 'kevin-malone', label: 'Tamtama Juru Bayar / Keuangan', gender: 'male', desc: 'Pengurus administrasi gaji & kupon', category: 'office' },
  { id: 'oscar-martinez', label: 'Bamin Audit & Verifikasi Data', gender: 'male', desc: 'Pemeriksa kecocokan data dosir', category: 'office' },
  { id: 'roy-anderson', label: 'Tamtama Angkutan & Logistik', gender: 'male', desc: 'Pengemudi dinas & pengangkut arsip', category: 'office' },
  { id: 'toby-flenderson', label: 'Petugas Pembina Mental & Rohani', gender: 'male', desc: 'Penyelenggara pembinaan moril', category: 'office' },
  { id: 'creed-bratton', label: 'Bamin Arsip Kuno & Rahasia', gender: 'male', desc: 'Pemegang arsip riwayat dinas lama', category: 'office' },
  { id: 'darryl-philbin', label: 'Bintara Gudang Perlengkapan', gender: 'male', desc: 'Penanggung jawab materiel dinas', category: 'office' },
  { id: 'bob-vance', label: 'Perwira Penghubung (Liason)', gender: 'male', desc: 'Penghubung satuan samping', category: 'office' },
  { id: 'david-wallace', label: 'Inspektur Komando Atas', gender: 'male', desc: 'Perwira pemeriksa supervisi', category: 'office' },
  { id: 'gabe-lewis', label: 'Perwira Koordinasi Wilayah', gender: 'male', desc: 'Staf koordinator administrasi luar', category: 'office' },
  { id: 'robert-california', label: 'Penasihat Khusus Komandan', gender: 'male', desc: 'Pembina strategi organisasi batalyon', category: 'office' },

  // --- 11 Sprite Office Wanita / Kowad ---
  { id: 'pam-beesly', label: 'Kowad Pelayanan & Resepsionis', gender: 'female', desc: 'Penerima berkas naskah & tamu staf', category: 'office' },
  { id: 'angela-martin', label: 'Kowad Bamin Akurasi & Disiplin', gender: 'female', desc: 'Pemeriksa ketelitian format naskah', category: 'office' },
  { id: 'kelly-kapoor', label: 'Kowad Staf Komunikasi & Notulen', gender: 'female', desc: 'Pencatat risalah rapat staf pers', category: 'office' },
  { id: 'karen-filippelli', label: 'Kowad Pengawas Wilayah Kompi', gender: 'female', desc: 'Pengawas administrasi kompi luar', category: 'office' },
  { id: 'holly-flax', label: 'Kowad Perwira Konseling Personel', gender: 'female', desc: 'Konselor hak prajurit & persit', category: 'office' },
  { id: 'erin-hannon', label: 'Kowad Caraka Pelayanan Cepat', gender: 'female', desc: 'Pembawa naskah surat mendesak', category: 'office' },
  { id: 'jan-levinson', label: 'Perwira Pengawas Wanita (Senior)', gender: 'female', desc: 'Pengawas standar mutu naskah dinas', category: 'office' },
  { id: 'phyllis-vance', label: 'Bamin Hubungan Keluarga Militer', gender: 'female', desc: 'Pengurus persit & kesejahteraan prajurit', category: 'office' },
  { id: 'meredith-palmer', label: 'Staf Pengadaan Logistik ATK', gender: 'female', desc: 'Pengelola logistik ATK & inventaris', category: 'office' },
  { id: 'carol-stills', label: 'Penasihat Hukum Militer (Kakum)', gender: 'female', desc: 'Konsultan syarat berkas nikah', category: 'office' },
  { id: 'nellie-bertram', label: 'Staf Urusan Prosedur Khusus', gender: 'female', desc: 'Evaluator alur birokrasi naskah', category: 'office' },
];

export const CharacterSettingsModal: React.FC<Props> = ({ onClose, onSaved, embedded = false }) => {
  const [selectedRole, setSelectedRole] = useState<string>('boss');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Custom states per role
  const [names, setNames] = useState<Record<string, string>>({});
  const [sprites, setSprites] = useState<Record<string, string>>({});
  const [colors, setColors] = useState<Record<string, string>>({});
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSprites = JSON.parse(localStorage.getItem('nara-char-sprites') || '{}');
      const savedNames = JSON.parse(localStorage.getItem('nara-char-names') || '{}');
      const savedColors = JSON.parse(localStorage.getItem('nara-char-colors') || '{}');

      const initSprites: Record<string, string> = {};
      const initNames: Record<string, string> = {};
      const initColors: Record<string, string> = {};

      for (const a of AGENTS_LIST) {
        initSprites[a.role] = savedSprites[a.role] || savedSprites[a.agentId] || a.defaultSprite;
        initNames[a.role] = savedNames[a.role] || savedNames[a.agentId] || a.defaultName;
        initColors[a.role] = savedColors[a.role] || savedColors[a.agentId] || a.defaultColor;
      }

      setSprites(initSprites);
      setNames(initNames);
      setColors(initColors);
    } catch {}
  }, []);

  const activeAgent = AGENTS_LIST.find((a) => a.role === selectedRole) || AGENTS_LIST[0];
  const activeSpriteId = sprites[selectedRole] || activeAgent.defaultSprite;
  const previewImgSrc = getSpritePreviewUrl(activeSpriteId);

  const handleSelectSprite = (spriteId: string) => {
    setSprites((prev) => ({ ...prev, [selectedRole]: spriteId }));
  };

  const handleSave = async () => {
    setStatusMsg('Menyimpan pengaturan personel staf...');
    try {
      const finalSprites: Record<string, string> = { ...sprites };
      const finalNames: Record<string, string> = { ...names };
      const finalColors: Record<string, string> = { ...colors };

      // Multi-key mapping for 100% reliable matching across Character.tsx, SlackChat, and officeReducer
      if (sprites['boss']) {
        finalSprites['boss'] = sprites['boss'];
        finalSprites['boss-danyonif 735/nws'] = sprites['boss'];
        finalSprites['boss-caca'] = sprites['boss'];
        finalSprites['boss-boss'] = sprites['boss'];
        finalSprites['danyon'] = sprites['boss'];
      }
      if (sprites['pasi-pers']) {
        finalSprites['pasi-pers'] = sprites['pasi-pers'];
        finalSprites['Perwira Seksi Personalia'] = sprites['pasi-pers'];
        finalSprites['pasi'] = sprites['pasi-pers'];
      }
      if (sprites['assistant']) {
        finalSprites['assistant'] = sprites['assistant'];
        finalSprites['assistant-claude'] = sprites['assistant'];
        finalSprites['Bamin Minpers'] = sprites['assistant'];
        finalSprites['asisten'] = sprites['assistant'];
      }
      if (sprites['sertu-ricat']) {
        finalSprites['sertu-ricat'] = sprites['sertu-ricat'];
        finalSprites['operator'] = sprites['sertu-ricat'];
        finalSprites['Operator SURAT B'] = sprites['sertu-ricat'];
      }
      if (sprites['pratu-yacob']) {
        finalSprites['pratu-yacob'] = sprites['pratu-yacob'];
        finalSprites['sisfopers'] = sprites['pratu-yacob'];
        finalSprites['Taopr Data Sisfopers'] = sprites['pratu-yacob'];
      }
      if (sprites['pratu-lalaun']) {
        finalSprites['pratu-lalaun'] = sprites['pratu-lalaun'];
        finalSprites['applicant'] = sprites['pratu-lalaun'];
        finalSprites['Tamudi Kima'] = sprites['pratu-lalaun'];
      }

      if (names['boss']) {
        finalNames['boss'] = names['boss'];
        finalNames['boss-danyonif 735/nws'] = names['boss'];
      }
      if (names['pasi-pers']) {
        finalNames['pasi-pers'] = names['pasi-pers'];
        finalNames['Perwira Seksi Personalia'] = names['pasi-pers'];
      }
      if (names['assistant']) {
        finalNames['assistant'] = names['assistant'];
        finalNames['assistant-claude'] = names['assistant'];
      }
      if (names['sertu-ricat']) {
        finalNames['sertu-ricat'] = names['sertu-ricat'];
        finalNames['Operator SURAT B'] = names['sertu-ricat'];
      }
      if (names['pratu-yacob']) {
        finalNames['pratu-yacob'] = names['pratu-yacob'];
        finalNames['Taopr Data Sisfopers'] = names['pratu-yacob'];
      }
      if (names['pratu-lalaun']) {
        finalNames['pratu-lalaun'] = names['pratu-lalaun'];
        finalNames['Tamudi Kima'] = names['pratu-lalaun'];
      }

      if (colors['boss']) {
        finalColors['boss-danyonif 735/nws'] = colors['boss'];
      }
      if (colors['pasi-pers']) {
        finalColors['Perwira Seksi Personalia'] = colors['pasi-pers'];
      }
      if (colors['assistant']) {
        finalColors['assistant-claude'] = colors['assistant'];
      }
      if (colors['sertu-ricat']) {
        finalColors['Operator SURAT B'] = colors['sertu-ricat'];
      }
      if (colors['pratu-yacob']) {
        finalColors['Taopr Data Sisfopers'] = colors['pratu-yacob'];
      }
      if (colors['pratu-lalaun']) {
        finalColors['Tamudi Kima'] = colors['pratu-lalaun'];
      }

      localStorage.setItem('nara-char-sprites', JSON.stringify(finalSprites));
      localStorage.setItem('nara-char-names', JSON.stringify(finalNames));
      localStorage.setItem('nara-char-colors', JSON.stringify(finalColors));

      await fetch('/api/theme/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprites: finalSprites, names: finalNames, colors: finalColors }),
      }).catch(() => {});

      setStatusMsg('✨ Pengaturan 6 personel staf pers berhasil disimpan!');
      onSaved?.();
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 700);
    } catch {
      setStatusMsg('Tersimpan di lokal!');
      setTimeout(() => onClose(), 800);
    }
  };

  const filteredSprites = DEV_SPRITES.filter((s) => {
    if (genderFilter === 'female' && s.gender !== 'female') return false;
    if (genderFilter === 'male' && s.gender !== 'male') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.label.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const innerContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        height: '100%',
        overflow: 'hidden',
        color: '#f8fafc',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Top 6 Horizontal Agent Selector Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '8px 10px',
          backgroundColor: '#12101e',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          flexShrink: 0,
        }}
      >
        {AGENTS_LIST.map((agent, idx) => {
          const isSelected = selectedRole === agent.role;
          return (
            <button
              key={agent.role}
              type="button"
              onClick={() => setSelectedRole(agent.role)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isSelected ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : '#1c192e',
                border: isSelected ? '1px solid #4ade80' : '1px solid #2e2946',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ opacity: 0.8, fontSize: '10px' }}>#{idx + 1}</span>
              <span>{agent.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Content Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: '#090812',
        }}
      >
        {/* Active Agent Banner: Preview + Name Input + Color */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: '#141222',
            borderRadius: '10px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              backgroundColor: '#0d0b16',
              border: '1px solid #2a253e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={previewImgSrc}
              alt={activeAgent.defaultName}
              style={{
                height: '46px',
                width: 'auto',
                imageRendering: 'pixelated',
                filter: `drop-shadow(0 0 1px ${colors[selectedRole] ?? activeAgent.defaultColor})`,
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                Nama Karakter Staf:
              </span>
              <span style={{ fontSize: '9px', color: '#86efac' }}>
                {activeAgent.desc}
              </span>
            </div>
            <input
              type="text"
              value={names[selectedRole] ?? activeAgent.defaultName}
              onChange={(e) => setNames({ ...names, [selectedRole]: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 10px',
                backgroundColor: '#0c0a14',
                border: '1px solid #3b3558',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '9px', color: '#94a3b8' }}>Aura</span>
            <input
              type="color"
              value={colors[selectedRole] ?? activeAgent.defaultColor}
              onChange={(e) => setColors({ ...colors, [selectedRole]: e.target.value })}
              style={{
                width: '32px',
                height: '30px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'transparent',
              }}
              title="Pilih warna aura karakter"
            />
          </div>
        </div>

        {/* Filter Controls: Gender Filter + Search Input */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>
              PILIH SPRITE ({filteredSprites.length} OPSI)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Cari karakter / peran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#161327',
                border: '1px solid #2e2946',
                color: '#fff',
                fontSize: '10px',
                fontFamily: 'inherit',
                outline: 'none',
                width: '140px',
              }}
            />
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setGenderFilter('all')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: genderFilter === 'all' ? '#16a34a' : '#1e1b2e',
                  border: 'none',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Semua (37)
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('female')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: genderFilter === 'female' ? '#16a34a' : '#1e1b2e',
                  border: 'none',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                👩 Kowad / Putri (14)
              </button>
              <button
                type="button"
                onClick={() => setGenderFilter('male')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: genderFilter === 'male' ? '#16a34a' : '#1e1b2e',
                  border: 'none',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                👨 Prajurit / Pria (23)
              </button>
            </div>
          </div>
        </div>

        {/* Sprite Cards Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
            gap: '8px',
          }}
        >
          {filteredSprites.map((sprite) => {
            const isSelected = activeSpriteId === sprite.id;
            return (
              <div
                key={sprite.id}
                onClick={() => handleSelectSprite(sprite.id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.15)' : '#141222',
                  border: isSelected ? '2px solid #22c55e' : '1px solid #28243d',
                  borderRadius: '8px',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <img
                  src={getSpritePreviewUrl(sprite.id)}
                  alt={sprite.label}
                  style={{
                    height: '52px',
                    width: 'auto',
                    imageRendering: 'pixelated',
                    marginBottom: '6px',
                    filter: isSelected ? 'drop-shadow(0 0 4px #22c55e)' : 'none',
                  }}
                />
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                >
                  {sprite.label}
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: '#94a3b8',
                    textAlign: 'center',
                    marginTop: '2px',
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {sprite.desc}
                </div>
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: '#22c55e',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '14px',
                      height: '14px',
                      fontSize: '9px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: '#100e1b',
          borderTop: '1px solid rgba(34, 197, 94, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          gap: '10px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: statusMsg ? '#4ade80' : '#94a3b8',
            flex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {statusMsg || 'Pilih karakter untuk 6 personel staf pers lalu klik Simpan.'}
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '7px 18px',
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(22, 163, 74, 0.45)',
          }}
        >
          💾 Simpan 6 Karakter Staf
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 12, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        fontFamily: "'JetBrains Mono', monospace",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(96vw, 780px)',
          maxHeight: '94dvh',
          backgroundColor: '#0e0d16',
          borderRadius: '16px',
          border: '1px solid rgba(46, 125, 50, 0.45)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(46, 125, 50, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            backgroundColor: '#161426',
            borderBottom: '1px solid rgba(46, 125, 50, 0.35)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '18px' }}>🪖</span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  color: '#e2e8f0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                PENGATURAN 6 PERSONEL STAF PERS YONIF 735/NAWASENA
              </div>
              <div style={{ fontSize: '9px', color: '#86efac', whiteSpace: 'nowrap' }}>
                Atur nama, aura, dan tampilan sprite 6 prajurit staf • 37 pilihan gaya karakter
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              fontSize: '15px',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {innerContent}
      </div>
    </div>
  );
};
