<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kanta Seni - Misi Eksplorasi & Jejak Bintang</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-sky-50">
  <div id="root"></div>

  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useMemo, useRef } = React;

    // Penjana komponen ikon Lucide secara dinamik supaya semua ikon berfungsi dalam HTML standalone
    const createLucideComponent = (iconName) => {
      return function LucideIcon({ className = "", style = {}, ...props }) {
        const spanRef = useRef(null);
        useEffect(() => {
          if (spanRef.current && window.lucide && window.lucide.icons) {
            const pascalToKebab = iconName
              .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
              .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
              .toLowerCase();
            const iconDef = window.lucide.icons[iconName] || window.lucide.icons[pascalToKebab];
            if (iconDef && typeof window.lucide.createElement === "function") {
              spanRef.current.innerHTML = "";
              const svg = window.lucide.createElement(iconDef);
              if (className) svg.setAttribute("class", className);
              Object.entries(style || {}).forEach(([k, v]) => {
                svg.style[k] = v;
              });
              spanRef.current.appendChild(svg);
            }
          }
        }, [className, JSON.stringify(style)]);
        return <span ref={spanRef} className="inline-flex items-center justify-center shrink-0" {...props} />;
      };
    };

    const Compass = createLucideComponent("Compass");
    const Star = createLucideComponent("Star");
    const ImageIcon = createLucideComponent("Image");
    const MessageCircle = createLucideComponent("MessageCircle");
    const Plus = createLucideComponent("Plus");
    const User = createLucideComponent("User");
    const Send = createLucideComponent("Send");
    const X = createLucideComponent("X");
    const Filter = createLucideComponent("Filter");
    const AlertTriangle = createLucideComponent("AlertTriangle");
    const ZoomIn = createLucideComponent("ZoomIn");
    const ZoomOut = createLucideComponent("ZoomOut");
    const RotateCcw = createLucideComponent("RotateCcw");
    const Award = createLucideComponent("Award");
    const CheckCircle2 = createLucideComponent("CheckCircle2");
    const Lock = createLucideComponent("Lock");
    const Crown = createLucideComponent("Crown");
    const BarChart3 = createLucideComponent("BarChart3");
    const Sparkles = createLucideComponent("Sparkles");
    const Shield = createLucideComponent("Shield");
    const Printer = createLucideComponent("Printer");
    const Trash2 = createLucideComponent("Trash2");
    const UserPlus = createLucideComponent("UserPlus");
    const Settings = createLucideComponent("Settings");
    const LogOut = createLucideComponent("LogOut");
    const KeyRound = createLucideComponent("KeyRound");
    const Users = createLucideComponent("Users");
    const Palette = createLucideComponent("Palette");
    const Eye = createLucideComponent("Eye");
    const EyeOff = createLucideComponent("EyeOff");
    const Brush = createLucideComponent("Brush");
    const PenTool = createLucideComponent("PenTool");
    const Shapes = createLucideComponent("Shapes");
    const Frame = createLucideComponent("Frame");
    const HelpCircle = createLucideComponent("HelpCircle");
    const RefreshCw = createLucideComponent("RefreshCw");
    const ChevronRight = createLucideComponent("ChevronRight");
    const Link2 = createLucideComponent("Link2");
    const Upload = createLucideComponent("Upload");
    const Pencil = createLucideComponent("Pencil");
    const Calendar = createLucideComponent("Calendar");
    const Move = createLucideComponent("Move");
    const Volume2 = createLucideComponent("Volume2");
    const VolumeX = createLucideComponent("VolumeX");
    const DoorOpen = createLucideComponent("DoorOpen");
    const MoreHorizontal = createLucideComponent("MoreHorizontal");
    const CloudCheck = createLucideComponent("CloudCheck");
    const Loader2 = createLucideComponent("Loader2");

// --- URL Google Apps Script Anda ---
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyFr90-D1q5IcmIi-tI60BCSZ1gk7nySgSXPN44WBcoDVp0RK2BBhvWaLoLe5k1p_Z1/exec";

// --- SISTEM KESAN BUNYI INTERAKTIF (WEB AUDIO API) ---
class SoundFX {
  private static ctx: AudioContext | null = null;
  public static enabled = true;

  private static getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private static playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    delay = 0,
    gainVal = 0.12
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  static click() {
    this.playTone(620, 0.07, "sine", 0, 0.08);
  }

  static star() {
    this.playTone(587.33, 0.16, "triangle", 0, 0.14);
    this.playTone(880, 0.22, "triangle", 0.08, 0.14);
    this.playTone(1174.66, 0.3, "sine", 0.16, 0.12);
  }

  static success() {
    this.playTone(523.25, 0.15, "sine", 0, 0.13);
    this.playTone(659.25, 0.15, "sine", 0.09, 0.13);
    this.playTone(783.99, 0.28, "sine", 0.18, 0.15);
  }

  static comment() {
    this.playTone(440, 0.1, "sine", 0, 0.1);
    this.playTone(660, 0.18, "sine", 0.07, 0.12);
  }

  static welcome() {
    this.playTone(523.25, 0.18, "triangle", 0, 0.13);
    this.playTone(659.25, 0.18, "triangle", 0.11, 0.13);
    this.playTone(783.99, 0.18, "triangle", 0.22, 0.13);
    this.playTone(1046.5, 0.42, "sine", 0.33, 0.15);
  }

  static isAudioRunning(): boolean {
    return Boolean(this.ctx && this.ctx.state === "running");
  }

  static alert() {
    this.playTone(330, 0.16, "sawtooth", 0, 0.08);
    this.playTone(261.63, 0.22, "sawtooth", 0.12, 0.08);
  }

  static exitPrompt() {
    this.playTone(493.88, 0.18, "sine", 0, 0.12);
    this.playTone(392.0, 0.28, "sine", 0.14, 0.12);
  }
}

// --- Senarai Bulan Rasmi ---
const MONTH_OPTIONS = [
  { value: "Semua", label: "Semua Bulan" },
  { value: "1", label: "Januari" },
  { value: "2", label: "Februari" },
  { value: "3", label: "Mac" },
  { value: "4", label: "April" },
  { value: "5", label: "Mei" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Julai" },
  { value: "8", label: "Ogos" },
  { value: "9", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Disember" },
];

// --- Helper: Semak Status VIP (Guru atau PIBG) ---
const isVipCategory = (className?: string): boolean => {
  if (!className) return false;
  const clean = className.trim().toLowerCase();
  return clean === "guru" || clean === "pibg";
};

// --- Palet Warna Avatar Pelbagai ---
const AVATAR_COLOR_PALETTE = [
  "from-rose-500 to-pink-600 text-white",
  "from-emerald-500 to-teal-600 text-white",
  "from-violet-600 to-indigo-700 text-white",
  "from-amber-500 to-orange-600 text-white",
  "from-cyan-500 to-blue-600 text-white",
  "from-fuchsia-500 to-purple-600 text-white",
  "from-lime-600 to-green-700 text-white",
  "from-sky-500 to-indigo-600 text-white",
];

const getAvatarColorClass = (name: string, isVip: boolean): string => {
  if (isVip) {
    return "from-amber-300 via-yellow-400 to-amber-600 text-slate-950 ring-2 ring-yellow-300";
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTE.length;
  return AVATAR_COLOR_PALETTE[index];
};

// --- Helper: Tukar pautan Google Drive biasa kepada pautan paparan gambar terus ---
const formatDirectImageUrl = (rawUrl: string): string => {
  const url = rawUrl.trim();
  if (!url) return "";

  const driveFileMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}=s1600`;
  }

  const driveIdMatch = url.match(
    /drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/
  );
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=s1600`;
  }

  return url;
};

// --- BANK SOALAN APRESIASI PSV (TAHAP 1 & TAHAP 2) ---
interface AppreciationQuestion {
  id: string;
  category: "Unsur Seni" | "Hal Benda" | "Mesej Karya";
  question: string;
  options: string[];
}

const APPRECIATION_QUESTIONS_TAHAP_1: AppreciationQuestion[] = [
  {
    id: "t1-1",
    category: "Unsur Seni",
    question: "Apakah warna yang paling menonjol dalam karya ini?",
    options: [
      "Warna cerah dan ceria (kuning, merah, oren)",
      "Warna sejuk dan tenang (biru, hijau, ungu)",
      "Campuran pelbagai warna pelangi",
      "Warna gelap dan kontra (hitam, kelabu, coklat)",
    ],
  },
  {
    id: "t1-2",
    category: "Unsur Seni",
    question:
      "Apakah jenis garisan yang paling banyak digunakan dalam lukisan ini?",
    options: [
      "Garisan melengkung dan beralun yang lembut",
      "Garisan lurus dan menegak yang kemas",
      "Garisan zig-zag dan berputar yang rancak",
      "Garisan putus-putus dan tebal",
    ],
  },
  {
    id: "t1-3",
    category: "Hal Benda",
    question: "Apakah Hal Benda (objek utama) yang dilukis dalam karya ini?",
    options: [
      "Alam semula jadi (tumbuhan, haiwan atau pemandangan)",
      "Objek buatan manusia (bangunan, kenderaan atau alatan)",
      "Figura manusia atau watak imaginasi",
      "Corak geometri dan bentuk kreatif",
    ],
  },
  {
    id: "t1-4",
    category: "Mesej Karya",
    question:
      "Apakah perasaan atau mesej yang kamu rasa apabila melihat karya ini?",
    options: [
      "Rasa gembira, ceria dan bersemangat",
      "Rasa tenang, damai dan selesa",
      "Rasa kagum dengan kreativiti dan imaginasi pelukis",
      "Mesej menyayangi alam sekitar dan hidupan",
    ],
  },
  {
    id: "t1-5",
    category: "Unsur Seni",
    question: "Bagaimanakah rupa dan bentuk objek dalam karya ini kelihatan?",
    options: [
      "Rupa organik (bebas seperti alam semula jadi)",
      "Rupa geometri (bulat, segi tiga, segi empat)",
      "Gabungan rupa organik dan geometri yang seimbang",
      "Bentuk kelihatan timbul dan menarik",
    ],
  },
];

const APPRECIATION_QUESTIONS_TAHAP_2: AppreciationQuestion[] = [
  {
    id: "t2-1",
    category: "Unsur Seni",
    question: "Bagaimanakah penggunaan unsur warna dan kontra dalam karya ini?",
    options: [
      "Penggunaan warna panas dan sejuk mewujudkan kontra yang menarik tumpuan",
      "Tona warna yang harmoni menjadikan karya kelihatan lembut dan bersatu",
      "Gabungan warna penggenap menghidupkan suasana visual karya",
      "Pengolahan warna gelap dan cerah berjaya menampakkan kesan pencahayaan",
    ],
  },
  {
    id: "t2-2",
    category: "Unsur Seni",
    question: "Apakah kesan unsur jalinan dan ruang yang dapat diperhatikan?",
    options: [
      "Jalinan tampak jelas dan mewujudkan ilusi ruang hadapan serta belakang",
      "Susunan objek dari besar ke kecil menampakkan perspektif ruang yang baik",
      "Olahan jalinan pada permukaan objek menambah perincian yang realistik",
      "Penggunaan ruang lapang dan padat seimbang serta tidak serabut",
    ],
  },
  {
    id: "t2-3",
    category: "Hal Benda",
    question:
      "Bagaimanakah pemilihan Hal Benda (Subject Matter) menyokong tema karya?",
    options: [
      "Hal benda alam semula jadi diolah secara kreatif untuk menyampaikan tema",
      "Hal benda objek buatan manusia disusun sebagai titik fokus utama",
      "Gabungan figura dan latar belakang menceritakan situasi dengan jelas",
      "Hal benda berunsur imaginasi / fantasi menunjukkan pemikiran luar kotak",
    ],
  },
  {
    id: "t2-4",
    category: "Mesej Karya",
    question:
      "Apakah nilai atau mesej tersirat yang ingin disampaikan oleh pengkarya?",
    options: [
      "Kesedaran memelihara keindahan alam sekitar dan kelestarian hidup",
      "Semangat perpaduan, kasih sayang dan keharmonian masyarakat",
      "Kebebasan berkarya, inovasi dan keberanian meneroka idea baharu",
      "Penghargaan terhadap budaya, warisan dan identiti tempatan",
    ],
  },
  {
    id: "t2-5",
    category: "Unsur Seni",
    question:
      "Apakah kekuatan utama gubahan garisan dan bentuk dalam karya ini?",
    options: [
      "Pelbagai jenis garisan berjaya menghasilkan kesan pergerakan dan irama",
      "Olahan bentuk ilusi 3D kelihatan mantap dengan kesan bayang yang kemas",
      "Rupa positif dan negatif diimbangi dengan sangat teliti",
      "Ketelitian garisan luar (outline) menegaskan identiti setiap objek",
    ],
  },
];

const getStageFromClass = (className?: string): "tahap1" | "tahap2" => {
  if (!className) return "tahap2";
  if (["Tahun 1", "Tahun 2", "Tahun 3"].includes(className)) {
    return "tahap1";
  }
  return "tahap2";
};

const pickThreeRandomQuestions = (
  stage: "tahap1" | "tahap2"
): AppreciationQuestion[] => {
  const pool =
    stage === "tahap1"
      ? APPRECIATION_QUESTIONS_TAHAP_1
      : APPRECIATION_QUESTIONS_TAHAP_2;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const picked: AppreciationQuestion[] = [];
  const usedCategories = new Set<string>();

  for (const q of shuffled) {
    if (!usedCategories.has(q.category) && picked.length < 3) {
      picked.push(q);
      usedCategories.add(q.category);
    }
  }

  for (const q of shuffled) {
    if (picked.length >= 3) break;
    if (!picked.some((item) => item.id === q.id)) {
      picked.push(q);
    }
  }

  return picked;
};

// --- Helper: Format Masa Komen (Gaya Facebook) ---
const formatTimeAgo = (timestamp: number) => {
  if (!timestamp) return "";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1)
    return new Date(timestamp).toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  interval = Math.floor(seconds / 86400);
  if (interval === 1) return "Semalam";
  if (interval > 1)
    return new Date(timestamp).toLocaleDateString("ms-MY", {
      day: "numeric",
      month: "short",
    });

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " jam lalu";

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minit lalu";

  return "Baru sahaja";
};

// --- Helper: Dapatkan Tahun daripada Timestamp ---
const getArtworkYear = (createdAt: any) => {
  if (!createdAt) return new Date().getFullYear().toString();
  const dateObj = new Date(Number(createdAt) || createdAt);
  return isNaN(dateObj.getFullYear())
    ? new Date().getFullYear().toString()
    : dateObj.getFullYear().toString();
};

// --- Helper: Dapatkan Bulan (1-12) daripada Timestamp ---
const getArtworkMonth = (createdAt: any): string => {
  if (!createdAt) return (new Date().getMonth() + 1).toString();
  const dateObj = new Date(Number(createdAt) || createdAt);
  return isNaN(dateObj.getMonth())
    ? (new Date().getMonth() + 1).toString()
    : (dateObj.getMonth() + 1).toString();
};

const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );

interface StarGiverItem {
  key: string;
  name: string;
  initial: string;
  isVip: boolean;
  roleLabel?: string;
}

// --- Helper: Ekstrak Senarai Nama & Status VIP Pemberi Bintang ---
const parseStarGivers = (
  likes: string[],
  comments: any[] = [],
  vipRegistry: Record<string, string> = {}
): StarGiverItem[] => {
  if (!Array.isArray(likes)) return [];
  return likes.map((likeKey, idx) => {
    if (typeof likeKey === "string" && likeKey.startsWith("passport-")) {
      const rawName = likeKey.replace("passport-", "").trim();
      const norm = rawName.toLowerCase().replace(/\s+/g, " ");

      const matchedComment = Array.isArray(comments)
        ? comments.find(
            (c) =>
              c.authorName &&
              c.authorName.trim().toLowerCase().replace(/\s+/g, " ") === norm
          )
        : null;

      const displayName = matchedComment
        ? matchedComment.authorName.trim()
        : toTitleCase(rawName);
      const initial = (displayName.charAt(0) || "P").toUpperCase();

      const detectedClass =
        matchedComment?.authorClass || vipRegistry[norm] || "";
      const isVip =
        Boolean(matchedComment?.isVip) || isVipCategory(detectedClass);

      return {
        key: likeKey,
        name: displayName,
        initial,
        isVip,
        roleLabel: isVip ? detectedClass || "VIP" : undefined,
      };
    }
    return {
      key: `${likeKey}-${idx}`,
      name: "Penjelajah Seni",
      initial: "P",
      isVip: false,
    };
  });
};

function App() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("laman-utama");

  // --- Status Segerak Awan (Cloud Sync Status) ---
  const [syncState, setSyncState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const pendingWritesRef = useRef(0);
  const hasPlayedStartupWelcomeRef = useRef(false);

  // --- Kawalan Bunyi (Sound Effects) ---
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("kantaseni_sound_enabled");
    return saved !== "false";
  });

  useEffect(() => {
    SoundFX.enabled = soundEnabled;
    localStorage.setItem("kantaseni_sound_enabled", String(soundEnabled));
  }, [soundEnabled]);

  // --- BUNYI SAMBUTAN LAMAN UTAMA SELEPAS SKRIN LOADING SELESAI ---
  useEffect(() => {
    if (loading || hasPlayedStartupWelcomeRef.current) return;

    const unlockAndPlayWelcome = () => {
      if (hasPlayedStartupWelcomeRef.current) return;
      hasPlayedStartupWelcomeRef.current = true;
      SoundFX.welcome();
      window.removeEventListener("pointerdown", unlockAndPlayWelcome);
      window.removeEventListener("keydown", unlockAndPlayWelcome);
      window.removeEventListener("touchstart", unlockAndPlayWelcome);
    };

    const initTimer = setTimeout(() => {
      SoundFX.welcome();
      if (SoundFX.isAudioRunning()) {
        hasPlayedStartupWelcomeRef.current = true;
      } else {
        window.addEventListener("pointerdown", unlockAndPlayWelcome);
        window.addEventListener("keydown", unlockAndPlayWelcome);
        window.addEventListener("touchstart", unlockAndPlayWelcome);
      }
    }, 180);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener("pointerdown", unlockAndPlayWelcome);
      window.removeEventListener("keydown", unlockAndPlayWelcome);
      window.removeEventListener("touchstart", unlockAndPlayWelcome);
    };
  }, [loading]);

  // --- Modal Pengesahan Keluar Tersuai ---
  const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);

  // Hanya beri amaran pelayar JIKA ada proses penghantaran data ke Google Sheets belum selesai
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingWritesRef.current > 0) {
        e.preventDefault();
        e.returnValue =
          "Data sedang dihantar ke pangkalan data. Sila tunggu beberapa saat.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // --- State Pengesahan Padam Karya (Hanya untuk Admin & Guru) ---
  const [artworkToDelete, setArtworkToDelete] = useState<any>(null);

  // --- State Pop-up & Zoom Karya ---
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  // --- State Pop-up Senarai Pemberi Bintang (Gaya Facebook) ---
  const [starListModalData, setStarListModalData] = useState<{
    title: string;
    givers: StarGiverItem[];
  } | null>(null);

  // --- State Penapis (Filter) Galeri ---
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedMonth, setSelectedMonth] = useState("Semua");
  const [selectedClass, setSelectedClass] = useState("Semua");

  // --- State Penapis Graf Pengkritik ---
  const [criticMetricFilter, setCriticMetricFilter] = useState<
    "semua" | "komen" | "bintang"
  >("semua");

  // --- STATE ADMIN & GURU (MENTOR) ---
  const [isStaffLoginModalOpen, setIsStaffLoginModalOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<{
    username: string;
    password: string;
  }>(() => {
    try {
      const saved = localStorage.getItem("kantaseni_admin_creds");
      return saved
        ? JSON.parse(saved)
        : { username: "admin", password: "kantaseni2026" };
    } catch {
      return { username: "admin", password: "kantaseni2026" };
    }
  });

  const [teachersList, setTeachersList] = useState<
    Array<{
      id: string;
      fullName: string;
      username: string;
      password: string;
      classAssigned: string;
    }>
  >(() => {
    try {
      const saved = localStorage.getItem("kantaseni_teachers_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loggedInStaff, setLoggedInStaff] = useState<{
    role: "admin" | "guru";
    name: string;
    username: string;
  } | null>(() => {
    try {
      const saved = sessionStorage.getItem("kantaseni_staff_session");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "kantaseni_admin_creds",
      JSON.stringify(adminCredentials)
    );
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem(
      "kantaseni_teachers_list",
      JSON.stringify(teachersList)
    );
  }, [teachersList]);

  useEffect(() => {
    if (loggedInStaff) {
      sessionStorage.setItem(
        "kantaseni_staff_session",
        JSON.stringify(loggedInStaff)
      );
    } else {
      sessionStorage.removeItem("kantaseni_staff_session");
    }
  }, [loggedInStaff]);

  // --- State Notifikasi Auto-Tutup 5 Saat ---
  const [noticeObj, setNoticeObj] = useState<{
    id: number;
    message: string;
  } | null>(null);

  const showTimedNotice = (message: string) => {
    setNoticeObj({ id: Date.now(), message });
  };

  useEffect(() => {
    if (!noticeObj) return;
    const timer = setTimeout(() => {
      setNoticeObj(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [noticeObj]);

  // --- Rekod Kategori/VIP Setiap Pengguna Berdaftar ---
  const [criticCategoryRegistry, setCriticCategoryRegistry] = useState<
    Record<string, string>
  >(() => {
    try {
      const saved = localStorage.getItem("kantaseni_critic_categories");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "kantaseni_critic_categories",
      JSON.stringify(criticCategoryRegistry)
    );
  }, [criticCategoryRegistry]);

  // --- State Pasport Pengkritik & Aliran Auto-Kembali ke Karya ---
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [pendingActionArtworkId, setPendingActionArtworkId] = useState<
    string | null
  >(null);

  // --- KAWALAN BUTANG BACK (TELEFON / TABLET / LAPTOP) DENGAN AMARAN KELUAR ---
  const uiStateRef = useRef({
    activeTab,
    selectedArtwork,
    isAddModalOpen,
    editingArtwork,
    isPassportModalOpen,
    isStaffLoginModalOpen,
    artworkToDelete,
    starListModalData,
    isExitConfirmModalOpen,
  });

  useEffect(() => {
    uiStateRef.current = {
      activeTab,
      selectedArtwork,
      isAddModalOpen,
      editingArtwork,
      isPassportModalOpen,
      isStaffLoginModalOpen,
      artworkToDelete,
      starListModalData,
      isExitConfirmModalOpen,
    };
  }, [
    activeTab,
    selectedArtwork,
    isAddModalOpen,
    editingArtwork,
    isPassportModalOpen,
    isStaffLoginModalOpen,
    artworkToDelete,
    starListModalData,
    isExitConfirmModalOpen,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Pasang penanda sejarah (history state) supaya butang Back dapat dipintas
    window.history.pushState(
      { kantaSeniGuard: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      const state = uiStateRef.current;

      // Kekalkan sentinel sejarah supaya pengguna tidak terus terkeluar dari aplikasi
      window.history.pushState(
        { kantaSeniGuard: true },
        "",
        window.location.href
      );

      // 1. Jika ada modal sedang terbuka, tutup modal dahulu dengan kemas
      if (state.isExitConfirmModalOpen) {
        SoundFX.click();
        setIsExitConfirmModalOpen(false);
        return;
      }
      if (state.starListModalData) {
        SoundFX.click();
        setStarListModalData(null);
        return;
      }
      if (state.artworkToDelete) {
        SoundFX.click();
        setArtworkToDelete(null);
        return;
      }
      if (state.editingArtwork) {
        SoundFX.click();
        setEditingArtwork(null);
        return;
      }
      if (state.isAddModalOpen) {
        SoundFX.click();
        setIsAddModalOpen(false);
        return;
      }
      if (state.isPassportModalOpen) {
        SoundFX.click();
        setIsPassportModalOpen(false);
        setPendingActionArtworkId(null);
        return;
      }
      if (state.isStaffLoginModalOpen) {
        SoundFX.click();
        setIsStaffLoginModalOpen(false);
        return;
      }
      if (state.selectedArtwork) {
        SoundFX.click();
        setSelectedArtwork(null);
        return;
      }

      // 2. Jika sedang berada di tab Galeri / Sudut Apresiasi / Admin, kembali ke Laman Utama
      if (state.activeTab !== "laman-utama") {
        SoundFX.click();
        setActiveTab("laman-utama");
        return;
      }

      // 3. Jika sudah di Laman Utama dan tiada modal terbuka, paparkan amaran pengesahan keluar!
      SoundFX.exitPrompt();
      setIsExitConfirmModalOpen(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const [activePassport, setActivePassport] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("kantaseni_active_passport");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.usedCount >= 3) {
        localStorage.removeItem("kantaseni_active_passport");
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [passportSessionsCount, setPassportSessionsCount] = useState<
    Record<string, number>
  >(() => {
    try {
      const saved = localStorage.getItem("kantaseni_passport_sessions");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [visitorId] = useState(() => {
    let id = localStorage.getItem("kantaseni_visitor_id");
    if (!id) {
      id = "pelawat-" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("kantaseni_visitor_id", id);
    }
    return id;
  });

  useEffect(() => {
    if (activePassport && activePassport.usedCount < 3) {
      localStorage.setItem(
        "kantaseni_active_passport",
        JSON.stringify(activePassport)
      );
    } else {
      localStorage.removeItem("kantaseni_active_passport");
    }
  }, [activePassport]);

  useEffect(() => {
    localStorage.setItem(
      "kantaseni_passport_sessions",
      JSON.stringify(passportSessionsCount)
    );
  }, [passportSessionsCount]);

  // --- Tarik Data Karya & Data Staf dari Google Sheets ---
  useEffect(() => {
    fetch(SCRIPT_URL)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ralat memuat turun data karya:", error);
        setLoading(false);
      });

    fetch(`${SCRIPT_URL}?type=staff`)
      .then((res) => res.json())
      .then((staffData) => {
        if (staffData && Array.isArray(staffData.teachers)) {
          setTeachersList(staffData.teachers);
        }
        if (
          staffData &&
          staffData.adminCreds &&
          staffData.adminCreds.username
        ) {
          setAdminCredentials(staffData.adminCreds);
        }
      })
      .catch((error) => {
        console.error("Ralat memuat turun data guru:", error);
      });
  }, []);

  // --- Penghantaran Data ke Google Sheets dengan Penjejak Status Segerak ---
  const sendToSheet = async (action: string, payload: any) => {
    pendingWritesRef.current += 1;
    setSyncState("saving");
    try {
      await fetch(`${SCRIPT_URL}?action=${action}`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });
    } catch (err) {
      console.error("Ralat menghantar data:", err);
    } finally {
      pendingWritesRef.current = Math.max(0, pendingWritesRef.current - 1);
      if (pendingWritesRef.current === 0) {
        setSyncState("saved");
        setTimeout(() => {
          setSyncState((prev) => (prev === "saved" ? "idle" : prev));
        }, 3000);
      }
    }
  };

  const normalizeName = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, " ");

  // --- SEMAKAN REKOD GLOBAL NAMA ---
  const getGlobalHistoryByName = (fullName: string) => {
    const norm = normalizeName(fullName);
    if (!norm) {
      return {
        starredArtworkIds: [] as string[],
        commentedArtworkIds: [] as string[],
        totalSessionsCompleted: 0,
      };
    }

    const targetUserKey = `passport-${norm}`;
    const starredSet = new Set<string>();
    const commentedSet = new Set<string>();

    artworks.forEach((art) => {
      if (Array.isArray(art.likes) && art.likes.includes(targetUserKey)) {
        starredSet.add(art.id);
      }
      if (
        Array.isArray(art.comments) &&
        art.comments.some(
          (c: any) => c.authorName && normalizeName(c.authorName) === norm
        )
      ) {
        commentedSet.add(art.id);
      }
    });

    const recordedSessions = passportSessionsCount[norm] || 0;
    const inferredSessions = Math.floor(
      Math.max(starredSet.size, commentedSet.size) / 3
    );

    return {
      starredArtworkIds: Array.from(starredSet),
      commentedArtworkIds: Array.from(commentedSet),
      totalSessionsCompleted: Math.max(recordedSessions, inferredSessions),
    };
  };

  // --- SENARAI LENGKAP PENGKRITIK (UNTUK GRAF & CETAKAN ADMIN/GURU) ---
  const allRegisteredCritics = useMemo(() => {
    const criticMap: Record<
      string,
      {
        normName: string;
        displayName: string;
        className: string;
        isVip: boolean;
        commentsCount: number;
        likesCount: number;
        artworksReviewed: Set<string>;
        yearsActive: Set<string>;
      }
    > = {};

    artworks.forEach((art) => {
      const artYear = getArtworkYear(art.createdAt);

      if (Array.isArray(art.comments)) {
        art.comments.forEach((c: any) => {
          if (!c.authorName || c.authorName === "Penjelajah Misteri") return;
          const norm = normalizeName(c.authorName);
          const commentYear = c.timestamp
            ? getArtworkYear(c.timestamp)
            : artYear;
          const detectedClass =
            c.authorClass || criticCategoryRegistry[norm] || "-";
          if (!criticMap[norm]) {
            criticMap[norm] = {
              normName: norm,
              displayName: c.authorName.trim(),
              className: detectedClass,
              isVip: Boolean(c.isVip) || isVipCategory(detectedClass),
              commentsCount: 0,
              likesCount: 0,
              artworksReviewed: new Set(),
              yearsActive: new Set(),
            };
          }
          criticMap[norm].commentsCount += 1;
          criticMap[norm].yearsActive.add(commentYear);
          if (c.authorClass && criticMap[norm].className === "-") {
            criticMap[norm].className = c.authorClass;
            criticMap[norm].isVip =
              Boolean(c.isVip) || isVipCategory(c.authorClass);
          }
          criticMap[norm].artworksReviewed.add(art.id);
        });
      }

      if (Array.isArray(art.likes)) {
        art.likes.forEach((likeKey: string) => {
          if (typeof likeKey === "string" && likeKey.startsWith("passport-")) {
            const norm = normalizeName(likeKey.replace("passport-", ""));
            if (!norm) return;
            const detectedClass = criticCategoryRegistry[norm] || "-";
            if (!criticMap[norm]) {
              criticMap[norm] = {
                normName: norm,
                displayName: toTitleCase(norm),
                className: detectedClass,
                isVip: isVipCategory(detectedClass),
                commentsCount: 0,
                likesCount: 0,
                artworksReviewed: new Set(),
                yearsActive: new Set(),
              };
            }
            criticMap[norm].likesCount += 1;
            criticMap[norm].yearsActive.add(artYear);
            criticMap[norm].artworksReviewed.add(art.id);
          }
        });
      }
    });

    return Object.values(criticMap).map((item) => ({
      ...item,
      yearsList: Array.from(item.yearsActive),
      uniqueArtworksCount: item.artworksReviewed.size,
      totalPoints: item.commentsCount + item.likesCount,
    }));
  }, [artworks, criticCategoryRegistry]);

  // --- PENGIRAAN DATA GRAF PENGKRITIK AKTIF ---
  const activeCriticsLeaderboard = useMemo(() => {
    return allRegisteredCritics
      .map((item) => {
        const score =
          criticMetricFilter === "komen"
            ? item.commentsCount
            : criticMetricFilter === "bintang"
            ? item.likesCount
            : item.totalPoints;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.commentsCount - a.commentsCount;
      })
      .slice(0, 6);
  }, [allRegisteredCritics, criticMetricFilter]);

  const maxCriticScore =
    activeCriticsLeaderboard.length > 0 ? activeCriticsLeaderboard[0].score : 1;

  // --- PENDAFTARAN PASPORT (TERMASUK TEMA VIP UNTUK GURU & PIBG) ---
  const handleRegisterPassport = (formData: {
    fullName: string;
    className: string;
    email: string;
  }) => {
    const cleanName = formData.fullName.trim();
    const norm = normalizeName(cleanName);
    const { totalSessionsCompleted } = getGlobalHistoryByName(cleanName);
    const vipStatus = isVipCategory(formData.className);

    const sessionNumber = totalSessionsCompleted + 1;
    const isRenewal = totalSessionsCompleted > 0;

    setCriticCategoryRegistry((prev) => ({
      ...prev,
      [norm]: formData.className,
    }));

    const newPassport = {
      sessionId: `${norm}-${Date.now()}`,
      sessionNumber,
      fullName: cleanName,
      className: formData.className,
      isVip: vipStatus,
      email: formData.email.trim(),
      usedCount: 0,
      maxAllowed: 3,
      sessionInteractedArtworkIds: [] as string[],
      sessionCommentedArtworkIds: [] as string[],
      issuedAt: Date.now(),
    };

    setActivePassport(newPassport);
    setIsPassportModalOpen(false);
    SoundFX.success();

    const vipTag = vipStatus
      ? ` [VIP ${formData.className.toUpperCase()}]`
      : "";

    if (pendingActionArtworkId) {
      const targetArt = artworks.find((a) => a.id === pendingActionArtworkId);
      if (targetArt) {
        setSelectedArtwork(targetArt);
        showTimedNotice(
          `Pasport${vipTag} #${sessionNumber} aktif untuk ${cleanName}! Teruskan memberi bintang atau komen pada karya "${targetArt.title}".`
        );
      } else {
        showTimedNotice(
          isRenewal
            ? `Pasport Baharu${vipTag} (#${sessionNumber}) diaktifkan untuk ${cleanName}! Kuota baharu 3/3 karya sedia digunakan.`
            : `Pasport${vipTag} berjaya dijana untuk ${cleanName}!`
        );
      }
      setPendingActionArtworkId(null);
    } else {
      showTimedNotice(
        isRenewal
          ? `Pasport Baharu${vipTag} (#${sessionNumber}) diaktifkan untuk ${cleanName}! Kuota baharu 3/3 karya sedia digunakan.`
          : `Pasport${vipTag} berjaya dijana untuk ${cleanName}!`
      );
    }

    return {
      success: true,
      isRenewal,
      isVip: vipStatus,
      sessionNumber,
      remainingQuota: 3,
    };
  };

  // --- PENGGUNAAN KUOTA PASPORT SEMASA (3 KARYA SETIAP PASPORT; AUTO-TUTUP BILA HABIS) ---
  const recordPassportUsageForArtwork = (
    artworkId: string,
    actionType: "star" | "comment"
  ): boolean => {
    if (!activePassport) {
      SoundFX.alert();
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Sila daftar Pasport Pengkritik terlebih dahulu sebelum memberi bintang atau komen."
      );
      setIsPassportModalOpen(true);
      return false;
    }

    const sessionInteracted = new Set<string>(
      activePassport.sessionInteractedArtworkIds || []
    );
    const sessionCommented = new Set<string>(
      activePassport.sessionCommentedArtworkIds || []
    );

    if (actionType === "comment" && sessionCommented.has(artworkId)) {
      SoundFX.alert();
      showTimedNotice(
        "Anda sudah mengulas karya ini dalam pasport semasa (had 1 komen setiap karya bagi satu pasport). Daftar pasport baharu untuk ulasan seterusnya."
      );
      return false;
    }

    if (!sessionInteracted.has(artworkId) && sessionInteracted.size >= 3) {
      SoundFX.alert();
      setActivePassport(null);
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Kuota 3 karya bagi pasport semasa anda telah tamat! Sila daftar pasport baharu untuk meneruskan apresiasi."
      );
      setIsPassportModalOpen(true);
      return false;
    }

    sessionInteracted.add(artworkId);
    if (actionType === "comment") {
      sessionCommented.add(artworkId);
    }

    const updatedUsedCount = sessionInteracted.size;
    const norm = normalizeName(activePassport.fullName);

    if (updatedUsedCount >= 3) {
      setPassportSessionsCount((prev) => ({
        ...prev,
        [norm]: (prev[norm] || 0) + 1,
      }));
      setActivePassport(null);
      showTimedNotice(
        "Kuota 3/3 karya bagi pasport ini telah selesai! Daftar pasport baharu bila-bila masa untuk meneruskan apresiasi."
      );
    } else {
      setActivePassport({
        ...activePassport,
        usedCount: updatedUsedCount,
        sessionInteractedArtworkIds: Array.from(sessionInteracted),
        sessionCommentedArtworkIds: Array.from(sessionCommented),
      });
    }

    return true;
  };

  // --- Actions: Tambah & Edit Karya ---
  const handleAddArtwork = (newArtwork: any) => {
    const createdArt = {
      id: Date.now().toString(),
      ...newArtwork,
      createdAt: Date.now(),
      likes: [],
      comments: [],
    };
    setArtworks((prev) => [createdArt, ...prev]);
    setIsAddModalOpen(false);
    SoundFX.success();
    sendToSheet("add", createdArt);
    showTimedNotice(
      `Karya "${createdArt.title}" oleh ${createdArt.studentName} berjaya dipamerkan!`
    );
  };

  const handleEditArtwork = (updatedData: {
    title: string;
    studentName: string;
    className: string;
    imageUrl: string;
  }) => {
    if (!editingArtwork || !loggedInStaff) return;

    const cleanImageUrl = updatedData.imageUrl.trim();
    const updatedArt = {
      ...editingArtwork,
      title: updatedData.title.trim(),
      studentName: updatedData.studentName.trim(),
      className: updatedData.className,
      imageUrl: cleanImageUrl,
      updatedAt: Date.now(),
    };

    setArtworks((prev) =>
      prev.map((art) =>
        String(art.id) === String(updatedArt.id) ? updatedArt : art
      )
    );

    if (
      selectedArtwork &&
      String(selectedArtwork.id) === String(updatedArt.id)
    ) {
      setSelectedArtwork(updatedArt);
    }

    sendToSheet("edit", {
      id: String(updatedArt.id).trim(),
      title: updatedArt.title,
      studentName: updatedArt.studentName,
      className: updatedArt.className,
      imageUrl: updatedArt.imageUrl,
    });

    setEditingArtwork(null);
    SoundFX.success();
    showTimedNotice(
      `Maklumat & gambar karya "${updatedArt.title}" berjaya dikemas kini ke pangkalan data!`
    );
  };

  // --- FUNGSI BINTANG (1 NAMA = 1 BINTANG SAHAJA PADA KARYA SAMA) ---
  const toggleLike = (artworkId: string, currentLikes: string[]) => {
    if (!activePassport) {
      SoundFX.alert();
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Sila daftar Pasport Pengkritik terlebih dahulu sebelum memberi bintang."
      );
      setIsPassportModalOpen(true);
      return;
    }

    const norm = normalizeName(activePassport.fullName);
    const userKey = `passport-${norm}`;
    const hasAlreadyStarredThisArtwork = currentLikes.includes(userKey);

    if (hasAlreadyStarredThisArtwork) {
      SoundFX.alert();
      showTimedNotice(
        `Anda (${activePassport.fullName}) telah memberikan bintang pada karya ini. Setiap nama hanya boleh memberi 1 bintang bagi karya yang sama.`
      );
      return;
    }

    if (activePassport.className) {
      setCriticCategoryRegistry((prev) => ({
        ...prev,
        [norm]: activePassport.className,
      }));
    }

    const allowed = recordPassportUsageForArtwork(artworkId, "star");
    if (!allowed) return;

    SoundFX.star();
    const newLikes = [...currentLikes, userKey];

    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updated = { ...art, likes: newLikes };
          sendToSheet("update", updated);
          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updated);
          }
          return updated;
        }
        return art;
      })
    );
  };

  // --- FUNGSI KOMEN ---
  const addComment = (
    artworkId: string,
    commentText: string,
    currentComments: any[],
    quizAnswers?: Array<{ category: string; question: string; answer: string }>
  ) => {
    const cleanFreeText = commentText.trim();
    const hasQuizAnswers = Array.isArray(quizAnswers) && quizAnswers.length > 0;
    if (!cleanFreeText && !hasQuizAnswers) return;

    if (!activePassport) {
      SoundFX.alert();
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Sila daftar Pasport Pengkritik terlebih dahulu sebelum menghantar komen."
      );
      setIsPassportModalOpen(true);
      return;
    }

    const norm = normalizeName(activePassport.fullName);
    const vipStatus =
      Boolean(activePassport.isVip) || isVipCategory(activePassport.className);

    if (activePassport.className) {
      setCriticCategoryRegistry((prev) => ({
        ...prev,
        [norm]: activePassport.className,
      }));
    }

    const allowed = recordPassportUsageForArtwork(artworkId, "comment");
    if (!allowed) return;

    SoundFX.comment();

    const quizFormatted = hasQuizAnswers
      ? quizAnswers
          .map(
            (item, i) =>
              `S${i + 1} [${item.category}]: ${item.question}\nJawapan: ${
                item.answer
              }`
          )
          .join("\n\n")
      : "";

    const formattedText = hasQuizAnswers
      ? cleanFreeText
        ? `${quizFormatted}\n\nUlasan Tambahan: ${cleanFreeText}`
        : quizFormatted
      : cleanFreeText;

    const newComment = {
      id: Date.now().toString(),
      userId: visitorId,
      authorName: activePassport.fullName,
      authorClass: activePassport.className,
      isVip: vipStatus,
      passportSession: activePassport.sessionNumber || 1,
      text: formattedText,
      timestamp: Date.now(),
    };

    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updated = {
            ...art,
            comments: [...currentComments, newComment],
          };
          sendToSheet("update", updated);
          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updated);
          }
          return updated;
        }
        return art;
      })
    );
  };

  // --- FUNGSI MODERASI ADMIN & GURU: PADAM KOMEN + PENALTI BINTANG AUTOMATIK ---
  const handleDeleteCommentWithPenalty = (
    artworkId: string,
    commentObj: any
  ) => {
    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updatedComments = (art.comments || []).filter(
            (c: any) => c.id !== commentObj.id
          );
          let updatedLikes = [...(art.likes || [])];
          let starPenalized = false;

          if (commentObj.authorName) {
            const targetPassportKey = `passport-${normalizeName(
              commentObj.authorName
            )}`;
            if (updatedLikes.includes(targetPassportKey)) {
              updatedLikes = updatedLikes.filter(
                (k) => k !== targetPassportKey
              );
              starPenalized = true;
            }
          }
          if (
            !starPenalized &&
            commentObj.userId &&
            updatedLikes.includes(commentObj.userId)
          ) {
            updatedLikes = updatedLikes.filter((k) => k !== commentObj.userId);
            starPenalized = true;
          }

          const updated = {
            ...art,
            comments: updatedComments,
            likes: updatedLikes,
          };
          sendToSheet("update", updated);
          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updated);
          }

          SoundFX.alert();
          showTimedNotice(
            starPenalized
              ? `Komen oleh "${commentObj.authorName}" telah dipadam dan 1 Bintang telah ditolak sebagai penalti.`
              : `Komen oleh "${commentObj.authorName}" telah dipadam.`
          );

          return updated;
        }
        return art;
      })
    );
  };

  // --- FUNGSI MODERASI ADMIN & GURU: PADAM BINTANG SECARA MANUAL ---
  const handleRemoveSingleStar = (
    artworkId: string,
    starKeyToRemove: string
  ) => {
    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updatedLikes = (art.likes || []).filter(
            (k: string) => k !== starKeyToRemove
          );
          const updated = { ...art, likes: updatedLikes };
          sendToSheet("update", updated);
          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updated);
          }
          SoundFX.alert();
          showTimedNotice("1 Bintang telah berjaya dipadam daripada karya.");
          return updated;
        }
        return art;
      })
    );
  };

  const confirmDeleteArtwork = () => {
    if (!artworkToDelete || !loggedInStaff) return;
    const targetId = String(artworkToDelete.id).trim();
    const deletedTitle = artworkToDelete.title;
    setArtworks((prev) =>
      prev.filter((art) => String(art.id).trim() !== targetId)
    );
    sendToSheet("delete", { id: targetId });
    if (selectedArtwork && String(selectedArtwork.id).trim() === targetId) {
      setSelectedArtwork(null);
    }
    setArtworkToDelete(null);
    SoundFX.alert();
    showTimedNotice(`Karya "${deletedTitle}" telah berjaya dipadam.`);
  };

  // --- FUNGSI LOG MASUK STAFF ---
  const handleStaffLogin = async (
    usernameInput: string,
    passwordInput: string
  ) => {
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    let latestTeachers = teachersList;
    let latestAdmin = adminCredentials;

    try {
      const res = await fetch(`${SCRIPT_URL}?type=staff`);
      const staffData = await res.json();
      if (staffData && Array.isArray(staffData.teachers)) {
        latestTeachers = staffData.teachers;
        setTeachersList(staffData.teachers);
      }
      if (staffData && staffData.adminCreds && staffData.adminCreds.username) {
        latestAdmin = staffData.adminCreds;
        setAdminCredentials(staffData.adminCreds);
      }
    } catch (err) {
      console.error("Ralat semak akaun guru dari awan:", err);
    }

    if (
      cleanUser === latestAdmin.username &&
      cleanPass === latestAdmin.password
    ) {
      setLoggedInStaff({
        role: "admin",
        name: "Pentadbir Utama (Admin)",
        username: latestAdmin.username,
      });
      setIsStaffLoginModalOpen(false);
      setActiveTab("panel-admin");
      SoundFX.success();
      return { success: true };
    }

    const matchedTeacher = latestTeachers.find(
      (t) =>
        t.username.toLowerCase() === cleanUser.toLowerCase() &&
        t.password === cleanPass
    );
    if (matchedTeacher) {
      setLoggedInStaff({
        role: "guru",
        name: matchedTeacher.fullName,
        username: matchedTeacher.username,
      });
      setIsStaffLoginModalOpen(false);
      setActiveTab("panel-admin");
      SoundFX.success();
      return { success: true };
    }

    SoundFX.alert();
    return {
      success: false,
      message: "Nama pengguna (Username) atau kata laluan salah!",
    };
  };

  const handleStaffLogout = () => {
    SoundFX.exitPrompt();
    setLoggedInStaff(null);
    setArtworkToDelete(null);
    setEditingArtwork(null);
    if (activeTab === "panel-admin") {
      setActiveTab("laman-utama");
    }
    showTimedNotice("Anda telah log keluar daripada Panel Kawalan.");
  };

  const currentYear = new Date().getFullYear().toString();
  const availableYears = Array.from(
    new Set([
      currentYear,
      ...artworks.map((art) => getArtworkYear(art.createdAt)),
    ])
  ).sort((a, b) => Number(b) - Number(a));

  const classOptions = [
    "Semua",
    "Tahun 1",
    "Tahun 2",
    "Tahun 3",
    "Tahun 4",
    "Tahun 5",
    "Tahun 6",
  ];

  // --- PENAPISAN KARYA MENGIKUT TAHUN, BULAN & KELAS ---
  const filteredArtworks = artworks.filter((art) => {
    const artYear = getArtworkYear(art.createdAt);
    const artMonth = getArtworkMonth(art.createdAt);
    const matchYear = selectedYear === "Semua" || artYear === selectedYear;
    const matchMonth = selectedMonth === "Semua" || artMonth === selectedMonth;
    const matchClass =
      selectedClass === "Semua" || art.className === selectedClass;
    return matchYear && matchMonth && matchClass;
  });

  const selectedMonthLabel =
    MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label || "";

  const activeUserKey = activePassport
    ? `passport-${normalizeName(activePassport.fullName)}`
    : visitorId;

  const isCurrentPassportVip = Boolean(
    activePassport &&
      (activePassport.isVip || isVipCategory(activePassport.className))
  );

  // --- PENGIRAAN TOP 3 ARTIS BULANAN ---
  const top3Artworks = [...artworks]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3)
    .filter((art) => art.likes && art.likes.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-ping"></div>
            <Compass className="text-blue-600 w-16 h-16 animate-spin relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 animate-pulse">
            Sedang Memuatkan Kanta Seni...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 overflow-x-hidden relative flex flex-col">
      {/* Gaya Animasi & Gaya Cetakan Rasmi */}
      <style>{`
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(6deg); }
                }
                @keyframes floatReverse {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(8px) rotate(-6deg); }
                }
                @keyframes brushStroke {
                    0%, 100% { transform: translate(0px, 0px) rotate(-8deg) scale(1); }
                    50% { transform: translate(8px, -10px) rotate(10deg) scale(1.06); }
                }
                @keyframes popInUp {
                    0% { opacity: 0; transform: translateY(24px) scale(0.96); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes modalEnter {
                    0% { opacity: 0; transform: scale(0.9) translateY(12px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes crownWobble {
                    0%, 100% { transform: rotate(-4deg) scale(1); }
                    50% { transform: rotate(4deg) scale(1.08); }
                }
                @keyframes starPop {
                    0% { transform: scale(1); }
                    40% { transform: scale(1.45) rotate(18deg); }
                    75% { transform: scale(0.9) rotate(-8deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes shrinkBar5s {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
                .animate-float-slow { animation: floatSlow 4.5s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 5.2s ease-in-out infinite; }
                .animate-brush-stroke { animation: brushStroke 4.8s ease-in-out infinite; }
                .animate-pop-up { animation: popInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .animate-modal-enter { animation: modalEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .animate-crown { animation: crownWobble 3s ease-in-out infinite; }
                .animate-star-pop { animation: starPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .animate-shrink-5s { animation: shrinkBar5s 5s linear forwards; }

                @media screen {
                    .hide-on-screen {
                        display: none !important;
                    }
                }

                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                    /* Matikan semua animasi & transform yang mengganggu aliran (flow) pembahagian muka surat */
                    * {
                        animation: none !important;
                        transform: none !important;
                        transition: none !important;
                    }

                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    /* Reset semua "parent layout" kepada blok biasa (static) supaya browser boleh paginasi jadual ke bawah */
                    html, body, #root, main, section, .min-h-screen, .flex-1 {
                        height: auto !important;
                        min-height: 0 !important;
                        overflow: visible !important;
                        position: static !important;
                        display: block !important;
                    }

                    /* Bebaskan kawasan cetakan daripada sebarang had overflow */
                    .overflow-x-auto, .overflow-hidden, .overflow-y-auto {
                        overflow: visible !important;
                        overflow-x: visible !important;
                        overflow-y: visible !important;
                    }

                    /* Kawasan jadual/slip - TIDAK BOLEH menggunakan 'position: absolute', ini punca ia tersekat pada 1 muka surat */
                    #printable-lists-area {
                        position: static !important;
                        width: 100% !important;
                        display: block !important;
                        background: white !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    /* Set Format Jadual PDF */
                    table {
                        width: 100% !important;
                        table-layout: auto !important;
                        border-collapse: collapse !important;
                        page-break-inside: auto !important;
                    }
                    tr {
                        page-break-inside: avoid !important;
                        page-break-after: auto !important;
                    }
                    thead {
                        display: table-header-group !important;
                    }
                    tfoot {
                        display: table-footer-group !important;
                    }
                    td, th {
                        word-break: break-word !important;
                        white-space: normal !important;
                    }
                }
`}</style>

      {/* --- HEADER --- */}
      <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-40 border-b-4 border-yellow-400 transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => {
                SoundFX.click();
                setActiveTab("laman-utama");
              }}
            >
              <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-sm transform -rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <Compass className="text-yellow-300 w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                  KANTA SENI
                </h1>
                <span className="text-xs md:text-sm font-semibold text-blue-600 uppercase tracking-wider block">
                  Misi Eksplorasi & Jejak Bintang
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-2.5">
              {/* PENUNJUK STATUS SEGERAK PANGKALAN DATA (CLOUD SYNC) */}
              {syncState === "saving" && (
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-bold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Menyimpan...</span>
                </div>
              )}
              {syncState === "saved" && (
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                  <CloudCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tersimpan</span>
                </div>
              )}

              {/* BUTANG TOGGLE BUNYI (SOUND FX) */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) {
                    SoundFX.enabled = true;
                    SoundFX.click();
                  }
                }}
                className={`p-2 rounded-full border-2 transition-all active:scale-90 ${
                  soundEnabled
                    ? "bg-sky-50 border-blue-200 text-blue-700 hover:bg-sky-100"
                    : "bg-slate-100 border-slate-200 text-slate-400"
                }`}
                title={
                  soundEnabled
                    ? "Kesan Bunyi: Aktif (Klik untuk senyapkan)"
                    : "Kesan Bunyi: Senyap (Klik untuk aktifkan)"
                }
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* STATUS PASPORT (HANYA PAPAR JIKA MASIH AKTIF & BELUM HABIS) */}
              {activePassport && activePassport.usedCount < 3 ? (
                <div
                  onClick={() => {
                    SoundFX.click();
                    setActiveTab("sudut-apresiasi");
                  }}
                  className={`hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs ${
                    isCurrentPassportVip
                      ? "bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-2 border-yellow-400 text-yellow-300"
                      : "bg-green-50 border-2 border-green-400 text-green-900 hover:bg-green-100"
                  }`}
                  title="Klik untuk lihat status Pasport"
                >
                  {isCurrentPassportVip ? (
                    <Crown className="w-4 h-4 mr-1.5 text-yellow-400 fill-current animate-pulse" />
                  ) : (
                    <Award className="w-4 h-4 mr-1.5 text-green-600 animate-pulse" />
                  )}
                  <span className="truncate max-w-[100px]">
                    {activePassport.fullName}
                  </span>
                  {isCurrentPassportVip && (
                    <span className="ml-1 bg-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      VIP
                    </span>
                  )}
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full font-black ${
                      isCurrentPassportVip
                        ? "bg-amber-500/30 text-yellow-200 border border-yellow-400/50"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {3 - activePassport.usedCount}/3
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    SoundFX.click();
                    setIsPassportModalOpen(true);
                  }}
                  className="hidden sm:flex items-center bg-amber-50 border-2 border-amber-300 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all"
                >
                  <Award className="w-4 h-4 mr-1 text-amber-600" />
                  Daftar Pasport
                </button>
              )}

              <nav className="hidden md:flex space-x-1.5">
                {["Laman Utama", "Galeri Seni", "Sudut Apresiasi"].map(
                  (item) => {
                    const tabKey = item.toLowerCase().replace(" ", "-");
                    const isActive =
                      activeTab === tabKey ||
                      (tabKey === "galeri-seni" && activeTab === "galeri") ||
                      (tabKey === "laman-utama" && activeTab === "laman-utama");

                    return (
                      <button
                        key={item}
                        onClick={() => {
                          SoundFX.click();
                          setActiveTab(
                            tabKey === "galeri-seni" ? "galeri" : tabKey
                          );
                        }}
                        className={`px-3.5 py-2 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 ${
                          isActive
                            ? "bg-yellow-400 text-blue-900 shadow-md transform scale-105"
                            : "text-slate-600 hover:bg-sky-100 hover:text-blue-700"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  }
                )}
              </nav>

              {/* BUTANG LOG MASUK / PANEL ADMIN & GURU */}
              {loggedInStaff ? (
                <button
                  onClick={() => {
                    SoundFX.click();
                    setActiveTab("panel-admin");
                  }}
                  className={`flex items-center px-3.5 py-2 rounded-full text-xs font-black transition-all shadow-sm border-2 ${
                    activeTab === "panel-admin"
                      ? "bg-blue-900 text-yellow-300 border-yellow-400 scale-105"
                      : "bg-blue-800 text-white border-blue-900 hover:bg-blue-900"
                  }`}
                  title="Buka Panel Kawalan"
                >
                  <Shield className="w-4 h-4 mr-1.5 text-yellow-400" />
                  <span>
                    {loggedInStaff.role === "admin" ? "Admin" : "Guru"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    SoundFX.click();
                    setIsStaffLoginModalOpen(true);
                  }}
                  className="flex items-center bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                  title="Log Masuk Admin atau Guru Mentor"
                >
                  <Shield className="w-4 h-4 mr-1.5 text-yellow-400" />
                  <span>Admin / Guru</span>
                </button>
              )}

              {/* BUTANG KELUAR APLIKASI DENGAN PENGESAHAN */}
              <button
                onClick={() => {
                  SoundFX.exitPrompt();
                  setIsExitConfirmModalOpen(true);
                }}
                className="flex items-center bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-full text-xs font-extrabold transition-all active:scale-95"
                title="Keluar daripada Kanta Seni"
              >
                <DoorOpen className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFIKASI SISTEM (AUTO-TUTUP TEPAT 5 SAAT) */}
      {noticeObj && (
        <div
          key={noticeObj.id}
          className="fixed top-20 right-[5%] z-[9999] max-w-sm w-[90vw] animate-pop-up no-print"
        >
          <div className="bg-blue-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border-2 border-yellow-400 overflow-hidden">
            <div className="px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center text-sm font-bold">
                <Award className="w-5 h-5 mr-2.5 text-yellow-400 shrink-0 animate-bounce" />
                <span>{noticeObj.message}</span>
              </div>
              <button
                onClick={() => {
                  SoundFX.click();
                  setNoticeObj(null);
                }}
                className="text-blue-200 hover:text-white transition-colors p-1"
                title="Tutup notifikasi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-1 bg-blue-900 w-full">
              <div className="h-full bg-yellow-400 animate-shrink-5s"></div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 pb-12 flex flex-col">
        {/* LAMAN UTAMA */}
        {activeTab === "laman-utama" && (
          <div
            key="tab-laman-utama"
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-10"
          >
            {/* HERO SECTION */}
            <section className="relative bg-gradient-to-br from-blue-700 via-blue-700 to-blue-800 text-white overflow-hidden py-16 md:py-20 rounded-3xl shadow-xl border-b-8 border-yellow-400 animate-pop-up">
              <Palette className="absolute top-7 left-7 md:top-10 md:left-12 text-yellow-300 w-12 h-12 md:w-16 md:h-16 opacity-75 animate-float-slow pointer-events-none" />
              <Brush className="absolute top-10 right-8 md:top-14 md:right-14 text-amber-300 w-11 h-11 md:w-14 md:h-14 opacity-70 animate-brush-stroke pointer-events-none" />
              <PenTool className="hidden sm:block absolute top-1/2 left-8 -translate-y-1/2 text-sky-200 w-10 h-10 opacity-45 animate-float-reverse pointer-events-none" />
              <Shapes
                className="absolute bottom-8 left-12 md:bottom-10 md:left-24 text-yellow-200 w-11 h-11 md:w-14 md:h-14 opacity-50 animate-float-reverse pointer-events-none"
                style={{ animationDelay: "0.8s" }}
              />
              <Frame
                className="absolute bottom-8 right-10 md:bottom-12 md:right-20 text-yellow-300 w-12 h-12 md:w-16 md:h-16 opacity-60 animate-float-slow pointer-events-none"
                style={{ animationDelay: "1.3s" }}
              />
              <Sparkles className="hidden sm:block absolute top-1/2 right-10 -translate-y-1/2 text-yellow-200 w-9 h-9 opacity-60 animate-pulse pointer-events-none" />

              <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 font-extrabold px-6 py-2 rounded-full mb-6 transform -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-lg border-2 border-white text-sm md:text-base">
                  <Palette className="w-4 h-4 text-blue-900" />
                  PAMERAN KARYA SENI VISUAL SECARA MAYA
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg leading-tight">
                  Selamat Datang ke <br className="hidden md:block" /> Galeri
                  Kanta Seni!
                </h2>
                <p className="text-lg md:text-xl font-medium mb-10 text-blue-100 max-w-2xl mx-auto">
                  Sertai misi eksplorasi kami! Lihat karya seni hebat
                  rakan-rakan, kumpul bintang, dan tinggalkan jejak apresiasi
                  anda di sini.
                </p>
                <button
                  onClick={() => {
                    SoundFX.success();
                    setActiveTab("galeri");
                  }}
                  className="group bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black text-xl py-4 px-10 rounded-full shadow-[0_8px_0_rgb(180,83,9)] hover:shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-1 active:translate-y-2 transition-all duration-200 border-4 border-white flex items-center justify-center mx-auto"
                >
                  JOM MULAKAN EKSPLORASI!
                </button>
              </div>
            </section>

            {/* ARTIS BULANAN SECTION */}
            <section
              className="bg-white rounded-3xl p-6 md:p-10 border-4 border-yellow-400 shadow-xl relative overflow-hidden mb-8 animate-pop-up"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="absolute top-0 right-0 bg-yellow-100 w-40 h-40 transform translate-x-20 -translate-y-20 rotate-45 rounded-3xl"></div>
              <div className="absolute bottom-0 left-0 bg-blue-50 w-32 h-32 transform -translate-x-16 translate-y-16 rotate-45 rounded-full"></div>

              <div className="text-center mb-10 relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-blue-900 flex items-center justify-center mb-3">
                  <Crown className="mr-3 text-yellow-500 w-10 h-10 animate-crown" />
                  Carta Artis Bulanan
                  <Crown className="ml-3 text-yellow-500 w-10 h-10 animate-crown" />
                </h3>
                <p className="text-slate-600 font-medium text-lg">
                  Top 3 Karya Paling Banyak Menerima Bintang Apresiasi!
                </p>
              </div>

              {top3Artworks.length === 0 ? (
                <div className="text-center bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-300 relative z-10">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-float-slow" />
                  <h4 className="text-lg font-bold text-slate-700">
                    Belum Ada Juara
                  </h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Jadilah yang pertama menghantar karya dan kumpul bintang
                    untuk tersenarai di sini!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 relative z-10 px-4 md:mt-12">
                  {top3Artworks[1] && (
                    <div
                      onClick={() => {
                        SoundFX.click();
                        setSelectedArtwork(top3Artworks[1]);
                      }}
                      className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-3 animate-pop-up"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 rounded-3xl p-1 w-full shadow-lg border-2 border-slate-300">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-300 border-4 border-white shadow-md flex items-center justify-center font-black text-slate-800 text-xl z-20">
                          #2
                        </div>
                        <div className="bg-white rounded-[1.4rem] p-4 flex flex-col items-center text-center h-full">
                          <img
                            src={top3Artworks[1].imageUrl}
                            alt={top3Artworks[1].title}
                            className="w-32 h-32 object-cover rounded-xl shadow-inner mb-4 border-2 border-slate-100 transition-transform duration-300 hover:scale-105"
                          />
                          <h4 className="font-bold text-slate-800 line-clamp-1">
                            {top3Artworks[1].title}
                          </h4>
                          <p className="text-sm font-semibold text-blue-600">
                            {top3Artworks[1].studentName}
                          </p>
                          <p className="text-xs text-slate-500 mb-3">
                            {top3Artworks[1].className}
                          </p>
                          <div className="mt-auto bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-slate-300">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            {top3Artworks[1].likes.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {top3Artworks[0] && (
                    <div
                      onClick={() => {
                        SoundFX.click();
                        setSelectedArtwork(top3Artworks[0]);
                      }}
                      className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-3 z-20 md:-translate-y-6 animate-pop-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <div className="relative bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-3xl p-1.5 w-full shadow-2xl border-2 border-yellow-200">
                        <div
                          className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-yellow-400 border-4 border-white shadow-lg flex items-center justify-center font-black text-blue-900 text-2xl z-20 animate-bounce"
                          style={{ animationDuration: "2.5s" }}
                        >
                          #1
                        </div>
                        <div className="bg-white rounded-[1.3rem] p-5 flex flex-col items-center text-center h-full relative overflow-hidden">
                          <Crown className="absolute top-2 right-2 text-yellow-100 w-24 h-24 -z-10" />
                          <img
                            src={top3Artworks[0].imageUrl}
                            alt={top3Artworks[0].title}
                            className="w-40 h-40 object-cover rounded-xl shadow-md mb-4 border-2 border-yellow-200 transition-transform duration-300 hover:scale-105"
                          />
                          <h4 className="text-lg font-black text-blue-900 line-clamp-1">
                            {top3Artworks[0].title}
                          </h4>
                          <p className="text-sm font-bold text-blue-600">
                            {top3Artworks[0].studentName}
                          </p>
                          <p className="text-xs text-slate-500 mb-4">
                            {top3Artworks[0].className}
                          </p>
                          <div className="mt-auto bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full font-black flex items-center gap-2 border border-yellow-300 shadow-sm">
                            <Star
                              className="w-5 h-5 fill-current text-yellow-500 animate-spin"
                              style={{ animationDuration: "8s" }}
                            />
                            {top3Artworks[0].likes.length} Bintang
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {top3Artworks[2] && (
                    <div
                      onClick={() => {
                        SoundFX.click();
                        setSelectedArtwork(top3Artworks[2]);
                      }}
                      className="order-3 w-full md:w-1/3 flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-3 animate-pop-up"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <div className="relative bg-gradient-to-b from-orange-200 to-orange-300 rounded-3xl p-1 w-full shadow-lg border-2 border-orange-200">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-300 border-4 border-white shadow-md flex items-center justify-center font-black text-orange-900 text-xl z-20">
                          #3
                        </div>
                        <div className="bg-white rounded-[1.4rem] p-4 flex flex-col items-center text-center h-full">
                          <img
                            src={top3Artworks[2].imageUrl}
                            alt={top3Artworks[2].title}
                            className="w-32 h-32 object-cover rounded-xl shadow-inner mb-4 border-2 border-orange-100 transition-transform duration-300 hover:scale-105"
                          />
                          <h4 className="font-bold text-slate-800 line-clamp-1">
                            {top3Artworks[2].title}
                          </h4>
                          <p className="text-sm font-semibold text-blue-600">
                            {top3Artworks[2].studentName}
                          </p>
                          <p className="text-xs text-slate-500 mb-3">
                            {top3Artworks[2].className}
                          </p>
                          <div className="mt-auto bg-orange-50 text-orange-800 px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 border border-orange-200">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            {top3Artworks[2].likes.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* GALLERY SECTION */}
        {activeTab === "galeri" && (
          <section
            key="tab-galeri"
            className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 animate-pop-up"
            id="galeri-section"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 border-b-2 border-blue-200 pb-4 gap-4">
              <div>
                <h3 className="text-3xl font-black text-blue-900 flex items-center">
                  <ImageIcon className="mr-3 text-blue-500 w-8 h-8" />
                  Jelajah Galeri Maya
                </h3>
                <p className="text-slate-500 font-medium mt-1">
                  Klik pada gambar karya untuk besarkan, zoom dan gerakkan ke
                  setiap sudut.
                </p>
              </div>
              <div className="self-start md:self-auto text-sm font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                {filteredArtworks.length} Karya Dipaparkan
              </div>
            </div>

            {/* --- BAR PENAPIS (FILTER): TAHUN, BULAN & KELAS --- */}
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border-2 border-blue-100 mb-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center text-blue-900 font-bold text-sm shrink-0">
                      <Filter className="w-4 h-4 mr-1.5 text-blue-600" />
                      Sesi / Tahun:
                    </div>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        SoundFX.click();
                        setSelectedYear(e.target.value);
                      }}
                      className="bg-sky-50 border-2 border-blue-200 text-blue-900 font-bold text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
                    >
                      <option value="Semua">Semua Tahun</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          Tahun {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center text-blue-900 font-bold text-sm shrink-0">
                      <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
                      Bulan:
                    </div>
                    <select
                      value={selectedMonth}
                      onChange={(e) => {
                        SoundFX.click();
                        setSelectedMonth(e.target.value);
                      }}
                      className="bg-sky-50 border-2 border-blue-200 text-blue-900 font-bold text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
                    >
                      {MONTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(selectedYear !== "Semua" ||
                  selectedMonth !== "Semua" ||
                  selectedClass !== "Semua") && (
                  <button
                    onClick={() => {
                      SoundFX.click();
                      setSelectedYear("Semua");
                      setSelectedMonth("Semua");
                      setSelectedClass("Semua");
                    }}
                    className="text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Set Semula Tapisan
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
                <span className="text-blue-900 font-bold text-sm mr-1">
                  Kelas:
                </span>
                {classOptions.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => {
                      SoundFX.click();
                      setSelectedClass(cls);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all active:scale-95 ${
                      selectedClass === cls
                        ? "bg-blue-600 text-white shadow-sm scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* --- PAPARAN KARYA --- */}
            {artworks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-4 border-dashed border-blue-200 shadow-sm animate-pop-up">
                <h4 className="text-2xl font-bold text-blue-800 mb-2">
                  Galeri masih kosong!
                </h4>
                <p className="text-slate-500 mb-6">
                  Jadilah penjelajah pertama yang mempamerkan karya seni anda.
                </p>
                <button
                  onClick={() => {
                    SoundFX.click();
                    setIsAddModalOpen(true);
                  }}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md transition-all"
                >
                  Tambah Karya Pertama
                </button>
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 shadow-sm animate-pop-up">
                <h4 className="text-xl font-bold text-slate-700 mb-2">
                  Tiada karya ditemui untuk pilihan ini
                </h4>
                <p className="text-slate-500 mb-6 text-sm">
                  Tiada rekod karya bagi{" "}
                  {selectedClass !== "Semua" ? selectedClass : "semua kelas"} (
                  {selectedMonth !== "Semua"
                    ? `Bulan ${selectedMonthLabel}`
                    : "semua bulan"}
                  ,{" "}
                  {selectedYear !== "Semua"
                    ? `Tahun ${selectedYear}`
                    : "semua tahun"}
                  ).
                </p>
                <button
                  onClick={() => {
                    SoundFX.click();
                    setSelectedYear("Semua");
                    setSelectedMonth("Semua");
                    setSelectedClass("Semua");
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2.5 px-6 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Tunjuk Semua Karya
                </button>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {filteredArtworks.map((artwork, idx) => (
                  <ArtworkCard
                    key={`${artwork.id}-${artwork.updatedAt || ""}`}
                    index={idx}
                    artwork={artwork}
                    artworkYear={getArtworkYear(artwork.createdAt)}
                    activeUserKey={activeUserKey}
                    activePassport={activePassport}
                    vipRegistry={criticCategoryRegistry}
                    isStaffLoggedIn={!!loggedInStaff}
                    onLike={() => toggleLike(artwork.id, artwork.likes || [])}
                    onOpenStarList={(givers: StarGiverItem[]) => {
                      SoundFX.click();
                      setStarListModalData({
                        title: artwork.title,
                        givers,
                      });
                    }}
                    onComment={(text: string, quizAnswers?: any) =>
                      addComment(
                        artwork.id,
                        text,
                        artwork.comments || [],
                        quizAnswers
                      )
                    }
                    onDeleteComment={(commentObj: any) =>
                      handleDeleteCommentWithPenalty(artwork.id, commentObj)
                    }
                    onRequestEdit={() => {
                      SoundFX.click();
                      setEditingArtwork(artwork);
                    }}
                    onRequestDelete={() => {
                      SoundFX.alert();
                      setArtworkToDelete(artwork);
                    }}
                    onOpenPreview={() => {
                      SoundFX.click();
                      setSelectedArtwork(artwork);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SUDUT APRESIASI SECTION */}
        {activeTab === "sudut-apresiasi" && (
          <section
            key="tab-apresiasi"
            className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 space-y-8 animate-pop-up"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-400 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 bg-yellow-400 w-32 h-32 transform translate-x-16 -translate-y-16 rotate-45"></div>

              <h3 className="text-3xl font-black text-blue-900 mb-4 relative z-10">
                Pasport Pengkritik Cilik
              </h3>
              <p className="text-lg text-slate-600 font-medium mb-8 relative z-10">
                Misi anda: Dapatkan pasport pengkritik, terokai galeri, cari
                karya kegemaran (3 karya bagi setiap pasport), berikan 'Bintang'
                dan tinggalkan komen positif! Jika habis, anda boleh daftar
                pasport baharu semula.
              </p>

              {/* KAD PASPORT AKTIF (TEMA BIASA ATAU TEMA VIP GURU/PIBG) */}
              {activePassport && activePassport.usedCount < 3 && (
                <div
                  className={`max-w-lg mx-auto mb-8 p-6 sm:p-7 rounded-3xl shadow-xl text-left relative z-10 overflow-hidden animate-pop-up ${
                    isCurrentPassportVip
                      ? "bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900 text-yellow-100 border-4 border-yellow-400"
                      : "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-2 border-yellow-400"
                  }`}
                >
                  {isCurrentPassportVip && (
                    <>
                      <Crown className="absolute -bottom-3 -right-3 w-28 h-28 text-yellow-400/15 rotate-12 pointer-events-none" />
                      <Sparkles className="absolute top-3 right-3 w-5 h-5 text-yellow-400 animate-pulse pointer-events-none" />
                    </>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-white/15 relative z-10">
                    {isCurrentPassportVip ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-slate-950 px-3.5 py-1.5 rounded-full shadow-sm">
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        PASPORT VIP • {activePassport.className.toUpperCase()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-extrabold uppercase tracking-wider bg-yellow-400 text-blue-900 px-3.5 py-1 rounded-full shadow-sm">
                        PASPORT #{activePassport.sessionNumber || 1} AKTIF
                      </span>
                    )}

                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isCurrentPassportVip
                          ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/40"
                          : "bg-blue-950/50 text-blue-100 border border-blue-400/30"
                      }`}
                    >
                      Baki Kuota: {3 - activePassport.usedCount} / 3 Karya
                    </span>
                  </div>

                  <div className="space-y-2.5 relative z-10">
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
                          isCurrentPassportVip ? "text-amber-300/80" : "text-blue-200"
                        }`}
                      >
                        Pemegang Pasport
                      </span>
                      <h4
                        className={`text-xl sm:text-2xl font-black leading-snug tracking-tight ${
                          isCurrentPassportVip ? "text-yellow-300" : "text-white"
                        }`}
                      >
                        {activePassport.fullName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          isCurrentPassportVip
                            ? "bg-amber-900/60 text-amber-100 border border-amber-500/30"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {activePassport.className}
                      </span>
                      {activePassport.email && (
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-lg break-all ${
                            isCurrentPassportVip
                              ? "bg-slate-900/70 text-amber-200 border border-amber-500/20"
                              : "bg-blue-950/40 text-blue-100"
                          }`}
                        >
                          {activePassport.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-10 mb-5">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider border border-blue-200">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Proses Misi Apresiasi Karya (3 Langkah Mudah)
                </div>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1.5">
                  Ikuti turutan proses di bawah semasa menilai karya seni rakan
                  anda di galeri:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div
                  className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 transition-transform duration-300 hover:-translate-y-2 animate-pop-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-sm">
                    1
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2">
                    Lihat & Perhati
                  </h4>
                  <p className="text-sm text-slate-600">
                    Amati warna, bentuk dan mesej karya rakan.
                  </p>
                </div>
                <div
                  className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 transition-transform duration-300 hover:-translate-y-2 animate-pop-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="bg-yellow-400 text-blue-900 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-sm">
                    2
                  </div>
                  <h4 className="font-bold text-yellow-800 mb-2">
                    Beri Bintang
                  </h4>
                  <p className="text-sm text-slate-600">
                    Tekan ikon bintang pada karya yang anda suka.
                  </p>
                </div>
                <div
                  className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 transition-transform duration-300 hover:-translate-y-2 animate-pop-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-sm">
                    3
                  </div>
                  <h4 className="font-bold text-green-800 mb-2">Tulis Komen</h4>
                  <p className="text-sm text-slate-600">
                    Berikan pujian atau jawab 3 soalan apresiasi seni.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <button
                  onClick={() => {
                    SoundFX.click();
                    setActiveTab("galeri");
                  }}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center"
                >
                  Kembali ke Galeri <Compass className="ml-2 w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    SoundFX.click();
                    setIsPassportModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black py-3.5 px-8 rounded-full shadow-[0_5px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-0.5 active:translate-y-1 transition-all border-2 border-blue-900 inline-flex items-center justify-center"
                >
                  <Award className="mr-2 w-5 h-5" />
                  Dapatkan Passport Saya!
                </button>
              </div>
            </div>

            {/* --- GRAF PENGKRITIK AKTIF --- */}
            <div
              className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-blue-200 relative overflow-hidden animate-pop-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    siaran langsung data pengkritik cilik
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-blue-900 flex items-center">
                    <BarChart3 className="mr-2.5 text-blue-600 w-8 h-8" />
                    Graf Pengkritik Aktif
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Penghargaan khas buat pengkritik paling aktif memberi
                    bintang dan ulasan!
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto">
                  {[
                    { id: "semua", label: "Semua" },
                    { id: "komen", label: "Komen" },
                    { id: "bintang", label: "Bintang" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        SoundFX.click();
                        setCriticMetricFilter(tab.id as any);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        criticMetricFilter === tab.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-blue-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeCriticsLeaderboard.length === 0 ? (
                <div className="text-center bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-float-slow" />
                  <h4 className="text-lg font-bold text-slate-700">
                    Belum Ada Rekod Pengkritik
                  </h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Daftar Pasport dan mula memberi bintang atau komen di galeri
                    untuk muncul dalam graf ini!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCriticsLeaderboard.map((critic, index) => {
                    const barPercent = Math.max(
                      12,
                      Math.round((critic.score / maxCriticScore) * 100)
                    );

                    const barStyle =
                      index === 0
                        ? "from-yellow-400 to-amber-500 border-yellow-600"
                        : index === 1
                        ? "from-slate-300 to-slate-400 border-slate-500"
                        : index === 2
                        ? "from-orange-300 to-orange-400 border-orange-500"
                        : "from-blue-400 to-blue-600 border-blue-700";

                    const badgeBg =
                      index === 0
                        ? "bg-yellow-400 text-blue-900 border-yellow-500"
                        : index === 1
                        ? "bg-slate-200 text-slate-800 border-slate-300"
                        : index === 2
                        ? "bg-orange-200 text-orange-900 border-orange-300"
                        : "bg-blue-100 text-blue-800 border-blue-200";

                    return (
                      <div
                        key={critic.normName}
                        className="bg-slate-50/80 hover:bg-sky-50/70 p-4 rounded-2xl border border-slate-200/80 transition-all animate-pop-up"
                        style={{ animationDelay: `${index * 0.08}s` }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${badgeBg}`}
                            >
                              #{index + 1}
                            </span>
                            <div>
                              <div className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1.5 flex-wrap">
                                <span>{critic.displayName}</span>
                                {critic.isVip && <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1">VIP</span>}
                                {index === 0 && (
                                  <Crown className="w-4 h-4 text-yellow-500 fill-current animate-crown" />
                                )}
                              </div>
                              {critic.className && critic.className !== "-" && (
                                <span className="text-xs font-semibold text-blue-600">
                                  {critic.className}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-blue-700 px-2.5 py-1 rounded-full shadow-2xs">
                              <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                              {critic.commentsCount} Komen
                            </span>
                            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-amber-700 px-2.5 py-1 rounded-full shadow-2xs">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                              {critic.likesCount} Bintang
                            </span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-200/80 h-5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div
                            style={{ width: `${barPercent}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${barStyle} transition-all duration-700 ease-out flex items-center justify-end pr-2.5`}
                          >
                            <span className="text-[11px] font-black text-white drop-shadow">
                              {critic.score}{" "}
                              {criticMetricFilter === "komen"
                                ? "Komen"
                                : criticMetricFilter === "bintang"
                                ? "Bintang"
                                : "Mata"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- PANEL KAWALAN ADMIN & GURU (MENTOR) --- */}
        {activeTab === "panel-admin" && loggedInStaff && (
          <StaffDashboardPanel
            loggedInStaff={loggedInStaff}
            artworks={artworks}
            allRegisteredCritics={allRegisteredCritics}
            availableYears={availableYears}
            adminCredentials={adminCredentials}
            setAdminCredentials={setAdminCredentials}
            teachersList={teachersList}
            setTeachersList={setTeachersList}
            sendToSheet={sendToSheet}
            onDeleteCommentWithPenalty={handleDeleteCommentWithPenalty}
            onRemoveSingleStar={handleRemoveSingleStar}
            onLogout={handleStaffLogout}
            onShowNotice={(msg: string) => showTimedNotice(msg)}
          />
        )}
      </main>

      {/* --- FOOTER HAK CIPTA E&J STUDIO --- */}
      <footer className="bg-white border-t-4 border-yellow-400 text-slate-600 py-5 px-4 pb-24 md:pb-5 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Kanta Seni - Misi Eksplorasi & Jejak Bintang</span>
          </div>
          <div className="text-center sm:text-right font-semibold text-slate-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-black text-blue-800">E&J Studio</span>.
            Hak Cipta Terpelihara.
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - HANYA PAPAR DI TAB GALERI */}
      {activeTab === "galeri" && (
        <div className="fixed bottom-20 md:bottom-10 right-6 md:right-10 z-40 animate-pop-up no-print">
          <button
            onClick={() => {
              SoundFX.click();
              setIsAddModalOpen(true);
            }}
            className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 p-4 md:p-5 rounded-full shadow-[0_8px_0_rgb(30,58,138)] hover:shadow-[0_4px_0_rgb(30,58,138)] hover:translate-y-1 active:translate-y-2 transition-all duration-200 flex items-center justify-center border-4 border-blue-900 group"
            title="Tambah Karya Baru"
          >
            <Plus className="w-8 h-8 font-bold group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] no-print">
        {["Laman Utama", "Galeri", "Sudut Apresiasi"].map((item) => {
          const tabKey = item.toLowerCase().replace(" ", "-");
          const isActive =
            activeTab === tabKey ||
            (tabKey === "galeri" && activeTab === "galeri-seni") ||
            (tabKey === "laman-utama" && activeTab === "laman-utama");
          return (
            <button
              key={item}
              onClick={() => {
                SoundFX.click();
                setActiveTab(tabKey);
              }}
              className={`flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                isActive
                  ? "text-blue-700 bg-blue-50 scale-105"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {item === "Laman Utama" && <Compass className="w-6 h-6 mb-1" />}
              {item === "Galeri" && <ImageIcon className="w-6 h-6 mb-1" />}
              {item === "Sudut Apresiasi" && <Star className="w-6 h-6 mb-1" />}
              {item}
            </button>
          );
        })}
        {loggedInStaff && (
          <button
            onClick={() => {
              SoundFX.click();
              setActiveTab("panel-admin");
            }}
            className={`flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all active:scale-90 ${
              activeTab === "panel-admin"
                ? "text-blue-900 bg-yellow-100 scale-105"
                : "text-slate-500"
            }`}
          >
            <Shield className="w-6 h-6 mb-1 text-blue-700" />
            {loggedInStaff.role === "admin" ? "Admin" : "Guru"}
          </button>
        )}
      </div>

      {/* MODAL LOG MASUK ADMIN / GURU */}
      {isStaffLoginModalOpen && (
        <StaffLoginModal
          onClose={() => {
            SoundFX.click();
            setIsStaffLoginModalOpen(false);
          }}
          onLogin={handleStaffLogin}
        />
      )}

      {/* ADD ARTWORK MODAL */}
      {isAddModalOpen && (
        <ArtworkFormModal
          mode="add"
          onClose={() => {
            SoundFX.click();
            setIsAddModalOpen(false);
          }}
          onSubmit={handleAddArtwork}
        />
      )}

      {/* EDIT ARTWORK MODAL */}
      {editingArtwork && loggedInStaff && (
        <ArtworkFormModal
          mode="edit"
          initialData={editingArtwork}
          onClose={() => {
            SoundFX.click();
            setEditingArtwork(null);
          }}
          onSubmit={handleEditArtwork}
        />
      )}

      {/* MODAL POP-UP & ZOOM + DRAG KARYA (z-50) */}
      {selectedArtwork && (
        <ArtworkLightboxModal
          artwork={selectedArtwork}
          artworkYear={getArtworkYear(selectedArtwork.createdAt)}
          activeUserKey={activeUserKey}
          activePassport={activePassport}
          vipRegistry={criticCategoryRegistry}
          isStaffLoggedIn={!!loggedInStaff}
          onClose={() => {
            SoundFX.click();
            setSelectedArtwork(null);
          }}
          onLike={() =>
            toggleLike(selectedArtwork.id, selectedArtwork.likes || [])
          }
          onOpenStarList={(givers: StarGiverItem[]) => {
            SoundFX.click();
            setStarListModalData({
              title: selectedArtwork.title,
              givers,
            });
          }}
          onComment={(text: string, quizAnswers?: any) =>
            addComment(
              selectedArtwork.id,
              text,
              selectedArtwork.comments || [],
              quizAnswers
            )
          }
          onDeleteComment={(commentObj: any) =>
            handleDeleteCommentWithPenalty(selectedArtwork.id, commentObj)
          }
          onRequestEdit={() => {
            SoundFX.click();
            setEditingArtwork(selectedArtwork);
          }}
          onRequestDelete={() => {
            SoundFX.alert();
            setArtworkToDelete(selectedArtwork);
          }}
        />
      )}

      {/* MODAL SENARAI PEMBERI BINTANG GAYA FACEBOOK (IKON CROWN SAHAJA UNTUK VIP) (z-[65]) */}
      {starListModalData && (
        <div
          onClick={() => {
            SoundFX.click();
            setStarListModalData(null);
          }}
          className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-[65] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-4 border-yellow-400 animate-modal-enter"
          >
            <div className="bg-blue-900 px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <div>
                  <h4 className="font-black text-base leading-tight">
                    Pemberi Bintang ({starListModalData.givers.length})
                  </h4>
                  <p className="text-[11px] text-blue-200 line-clamp-1">
                    {starListModalData.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  SoundFX.click();
                  setStarListModalData(null);
                }}
                className="p-1.5 hover:bg-blue-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 p-2">
              {starListModalData.givers.map((g, idx) => {
                const avatarStyle = getAvatarColorClass(g.name, g.isVip);
                return (
                  <div
                    key={`${g.key}-${idx}`}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                      g.isVip
                        ? "bg-gradient-to-r from-amber-50 to-yellow-50/70"
                        : "hover:bg-sky-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarStyle} border-2 border-white flex items-center justify-center font-black text-sm shadow-sm`}
                        >
                          {g.initial}
                        </div>
                        {g.isVip && (
                          <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-yellow-300 border border-yellow-400 rounded-full p-0.5 shadow-xs">
                            <Crown className="w-2.5 h-2.5 fill-current" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <span>{g.name}</span>
                          {g.isVip && (
                            <Crown className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-yellow-300">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      +1
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DAFTAR PENGKRITIK (PASPORT) - LAPISAN HADAPAN (z-[70]) */}
      {isPassportModalOpen && (
        <PassportRegistrationModal
          onClose={() => {
            SoundFX.click();
            setIsPassportModalOpen(false);
            setPendingActionArtworkId(null);
          }}
          onRegister={handleRegisterPassport}
          getGlobalHistoryByName={getGlobalHistoryByName}
          hasPendingArtwork={Boolean(pendingActionArtworkId)}
          onGoToGallery={() => {
            SoundFX.click();
            setIsPassportModalOpen(false);
            if (!pendingActionArtworkId) {
              setActiveTab("galeri");
            }
          }}
        />
      )}

      {/* MODAL PENGESAHAN PADAM KARYA (HANYA ADMIN & GURU) (z-[70]) */}
      {artworkToDelete && loggedInStaff && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-4 border-red-400 p-6 text-center animate-modal-enter">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 animate-bounce">
              <AlertTriangle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Padam Karya Ini?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Adakah anda pasti mahu memadam karya{" "}
              <span className="font-bold text-slate-800">
                "{artworkToDelete.title}"
              </span>{" "}
              oleh{" "}
              <span className="font-bold text-slate-800">
                {artworkToDelete.studentName}
              </span>
              ? Tindakan ini tidak boleh dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  SoundFX.click();
                  setArtworkToDelete(null);
                }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteArtwork}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl shadow-[0_4px_0_rgb(153,27,27)] hover:translate-y-0.5 transition-all"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENGESAHAN KELUAR DARIPADA SISTEM KANTA SENI (z-[75]) */}
      {isExitConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[75] p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border-4 border-yellow-400 p-6 text-center animate-modal-enter">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700 animate-bounce">
              <DoorOpen className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-blue-900 mb-2">
              Keluar daripada Kanta Seni?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Adakah anda pasti mahu menutup dan keluar daripada aplikasi
              pameran maya Kanta Seni sekarang?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  SoundFX.click();
                  setIsExitConfirmModalOpen(false);
                }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Kekal di Sini
              </button>
              <button
                onClick={() => {
                  SoundFX.exitPrompt();
                  setIsExitConfirmModalOpen(false);
                  window.close();
                  showTimedNotice(
                    "Terima kasih melawat Kanta Seni! Anda boleh menutup tab pelayar ini sekarang."
                  );
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-[0_4px_0_rgb(153,27,27)] hover:translate-y-0.5 transition-all"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

// --- AVATAR HURUF PELBAGAI WARNA & SIMBOL DOT (...) SELEPAS 3 BINTANG ---
function StarGiversAvatars({
  givers,
  onOpenStarList,
}: {
  givers: StarGiverItem[];
  onOpenStarList: (givers: StarGiverItem[]) => void;
}) {
  if (!givers || givers.length === 0) return null;

  const visibleGivers = givers.slice(0, 3);
  const hasMoreThanThree = givers.length > 3;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenStarList(givers);
      }}
      title={`Klik untuk lihat senarai penuh pemberi bintang (${givers
        .map((g) => g.name)
        .join(", ")})`}
      className="flex items-center -space-x-2 hover:scale-105 active:scale-95 transition-transform pl-1"
    >
      {visibleGivers.map((g, idx) => {
        const avatarColor = getAvatarColorClass(g.name, g.isVip);
        return (
          <span
            key={`${g.key}-${idx}`}
            className={`relative w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor} border-2 border-white shadow-xs flex items-center justify-center text-[10px] font-black uppercase`}
          >
            {g.initial}
            {g.isVip && (
              <span className="absolute -top-1.5 -right-1 bg-slate-950 text-yellow-300 rounded-full p-[1px] border border-yellow-400">
                <Crown className="w-2 h-2 fill-current" />
              </span>
            )}
          </span>
        );
      })}
      {hasMoreThanThree && (
        <span
          className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 border-2 border-white shadow-xs flex items-center justify-center"
          aria-label="Lihat semua pemberi bintang"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </span>
      )}
    </button>
  );
}

function PassportQuizBox({
  stage,
  questions,
  currentIndex,
  answers,
  onSelectAnswer,
  onChangeStep,
  onRefreshQuestions,
  onClose,
}: {
  stage: "tahap1" | "tahap2";
  questions: AppreciationQuestion[];
  currentIndex: number;
  answers: Record<number, string>;
  onSelectAnswer: (questionIdx: number, ans: string) => void;
  onChangeStep: (idx: number) => void;
  onRefreshQuestions: () => void;
  onClose: () => void;
}) {
  const activeQuestion = questions[currentIndex] || questions[0];
  const selectedAnswer = answers[currentIndex] || "";
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-3.5 mb-3 shadow-sm animate-pop-up text-left">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-blue-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            {stage === "tahap1" ? "Aras Tahap 1" : "Aras Tahap 2"}
          </span>
          <span className="bg-yellow-400 text-blue-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
            {activeQuestion.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              SoundFX.click();
              onRefreshQuestions();
            }}
            className="p-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
            title="Jana set 3 soalan rawak baharu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              SoundFX.click();
              onClose();
            }}
            className="p-1.5 bg-white hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg border border-slate-200 transition-colors"
            title="Tutup soalan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2.5">
        {questions.map((q, idx) => {
          const isDone = Boolean(answers[idx]);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                SoundFX.click();
                onChangeStep(idx);
              }}
              className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 border ${
                isCurrent
                  ? "bg-blue-700 text-yellow-300 border-blue-800 shadow-2xs"
                  : isDone
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-blue-50"
              }`}
            >
              <span>Soalan {idx + 1}</span>
              {isDone && (
                <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 mb-1">
        <span>
          Soalan {currentIndex + 1} daripada {questions.length}
        </span>
        <span>
          {answeredCount}/{questions.length} Dijawab
        </span>
      </div>

      <p className="text-xs font-extrabold text-blue-950 mb-2.5 leading-snug">
        {activeQuestion.question}
      </p>

      <div className="space-y-1.5">
        {activeQuestion.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const optionLetter = String.fromCharCode(65 + idx);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                SoundFX.click();
                onSelectAnswer(currentIndex, opt);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                  : "bg-white hover:bg-blue-50 text-slate-700 border-slate-200"
              }`}
            >
              <span className="flex items-start gap-2">
                <span
                  className={`font-black shrink-0 ${
                    isSelected ? "text-yellow-300" : "text-blue-700"
                  }`}
                >
                  {optionLetter}.
                </span>
                <span className="leading-snug">{opt}</span>
              </span>
              {currentIndex < questions.length - 1 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? "text-yellow-300" : "text-slate-300"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium">
        {allAnswered ? (
          <span className="text-green-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Semua 3 soalan telah dijawab! Tekan Hantar atau tambah ulasan bebas.
          </span>
        ) : (
          <span className="text-slate-500">
            Pilih jawapan untuk terus ke soalan seterusnya.
          </span>
        )}
      </div>
    </div>
  );
}

function StaffLoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (
    u: string,
    p: string
  ) => Promise<{ success: boolean; message?: string }>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsChecking(true);
    const res = await onLogin(username, password);
    setIsChecking(false);
    if (!res.success) {
      setError(res.message || "Log masuk gagal.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 border-yellow-400 animate-modal-enter">
        <div className="bg-blue-900 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <Shield className="absolute top-1 right-10 w-20 h-20 text-blue-700 opacity-40 animate-float-slow" />
          <div>
            <h3 className="text-2xl font-black flex items-center relative z-10">
              <Shield className="mr-2 text-yellow-400" />
              Log Masuk Panel
            </h3>
            <p className="text-xs text-blue-200 font-medium mt-0.5 relative z-10">
              Khusus untuk Pentadbir (Admin) & Guru Mentor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded-r-xl text-xs font-bold flex items-center gap-2 animate-pop-up">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Nama Pengguna (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              required
              placeholder="Masukkan username..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Kata Laluan (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                placeholder="Masukkan kata laluan..."
                className="w-full border-2 border-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setShowPassword((prev) => !prev);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-700 rounded-lg transition-colors"
                title={
                  showPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isChecking}
              className="w-2/3 px-4 py-3 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-yellow-300 font-black rounded-xl shadow-[0_4px_0_rgb(15,23,42)] hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {isChecking ? "Menyemak..." : "Log Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StaffDashboardPanel({
  loggedInStaff,
  artworks,
  allRegisteredCritics,
  availableYears,
  adminCredentials,
  setAdminCredentials,
  teachersList,
  setTeachersList,
  sendToSheet,
  onDeleteCommentWithPenalty,
  onRemoveSingleStar,
  onLogout,
  onShowNotice,
}: any) {
  const isAdmin = loggedInStaff.role === "admin";
  const [subTab, setSubTab] = useState<
    "moderasi" | "senarai" | "guru" | "tetapan"
  >("moderasi");

  const [printYearFilter, setPrintYearFilter] = useState("Semua");
  const [printClassFilter, setPrintClassFilter] = useState("Semua");

  const printClassOptions = [
    "Semua",
    "Tahun 1",
    "Tahun 2",
    "Tahun 3",
    "Tahun 4",
    "Tahun 5",
    "Tahun 6",
    "Guru",
    "PIBG",
    "Lain-lain",
  ];

  const filteredArtistsForPrint = useMemo(() => {
    return artworks.filter((art: any) => {
      const artYear = getArtworkYear(art.createdAt);
      const matchYear =
        printYearFilter === "Semua" || artYear === printYearFilter;
      const matchClass =
        printClassFilter === "Semua" || art.className === printClassFilter;
      return matchYear && matchClass;
    });
  }, [artworks, printYearFilter, printClassFilter]);

  const filteredCriticsForPrint = useMemo(() => {
    return allRegisteredCritics.filter((critic: any) => {
      const matchYear =
        printYearFilter === "Semua" ||
        (Array.isArray(critic.yearsList) &&
          critic.yearsList.includes(printYearFilter));
      const matchClass =
        printClassFilter === "Semua" || critic.className === printClassFilter;
      return matchYear && matchClass;
    });
  }, [allRegisteredCritics, printYearFilter, printClassFilter]);

  const [teacherName, setTeacherName] = useState("");
  const [teacherUser, setTeacherUser] = useState("");
  const [teacherPass, setTeacherPass] = useState("");
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [teacherClass, setTeacherClass] = useState("Semua Kelas");

  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCredentials.password);
  const [showAdminPass, setShowAdminPass] = useState(false);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!teacherName.trim() || !teacherUser.trim() || !teacherPass.trim())
      return;

    const duplicate =
      teacherUser.trim().toLowerCase() ===
        adminCredentials.username.toLowerCase() ||
      teachersList.some(
        (t: any) =>
          t.username.toLowerCase() === teacherUser.trim().toLowerCase()
      );

    if (duplicate) {
      SoundFX.alert();
      onShowNotice(
        "Nama pengguna (username) tersebut sudah wujud. Sila guna username lain."
      );
      return;
    }

    const newTeacher = {
      id: Date.now().toString(),
      fullName: teacherName.trim(),
      username: teacherUser.trim(),
      password: teacherPass.trim(),
      classAssigned: teacherClass,
    };

    const updatedTeachers = [...teachersList, newTeacher];
    setTeachersList(updatedTeachers);
    sendToSheet("syncStaff", {
      teachers: updatedTeachers,
      adminCreds: adminCredentials,
    });

    setTeacherName("");
    setTeacherUser("");
    setTeacherPass("");
    SoundFX.success();
    onShowNotice(
      `Akaun Guru Mentor (${newTeacher.fullName}) berjaya didaftarkan & diselaraskan ke semua peranti!`
    );
  };

  const handleDeleteTeacher = (id: string) => {
    if (!isAdmin) return;
    const updatedTeachers = teachersList.filter((t: any) => t.id !== id);
    setTeachersList(updatedTeachers);
    sendToSheet("syncStaff", {
      teachers: updatedTeachers,
      adminCreds: adminCredentials,
    });
    SoundFX.alert();
    onShowNotice("Akaun guru telah dipadam.");
  };

  const handleUpdateAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newAdminUser.trim() || !newAdminPass.trim()) return;
    const updatedCreds = {
      username: newAdminUser.trim(),
      password: newAdminPass.trim(),
    };
    setAdminCredentials(updatedCreds);
    sendToSheet("syncStaff", {
      teachers: teachersList,
      adminCreds: updatedCreds,
    });
    SoundFX.success();
    onShowNotice("Tetapan Username & Password Admin berjaya dikemas kini!");
  };

  const handlePrintLists = () => {
    SoundFX.click();
    window.print();
  };

  const formatStarLabel = (starKey: string) => {
    if (typeof starKey === "string" && starKey.startsWith("passport-")) {
      return starKey.replace("passport-", "").toUpperCase();
    }
    return starKey;
  };

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 space-y-6 animate-pop-up">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border-b-4 border-yellow-400 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 text-blue-900 p-3.5 rounded-2xl shadow-md">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="bg-yellow-400 text-blue-900 text-xs font-black px-3 py-0.5 rounded-full uppercase">
                {isAdmin ? "MOD PENTADBIR (ADMIN)" : "MOD GURU MENTOR"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              {loggedInStaff.name}
            </h2>
            <p className="text-xs md:text-sm text-blue-200 mt-0.5">
              {isAdmin
                ? "Akses penuh: Moderasi komen & bintang, cetak senarai, daftar guru, dan tetapan sistem."
                : "Akses Mentor: Moderasi komen & bintang murid serta cetak senarai nama berdaftar."}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="self-start md:self-auto bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Log Keluar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border-2 border-blue-100 no-print">
        <button
          onClick={() => {
            SoundFX.click();
            setSubTab("moderasi");
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            subTab === "moderasi"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-blue-50"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Moderasi Komen & Bintang
        </button>

        <button
          onClick={() => {
            SoundFX.click();
            setSubTab("senarai");
          }}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            subTab === "senarai"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-blue-50"
          }`}
        >
          <Users className="w-4 h-4" />
          Senarai Nama & Cetak
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => {
                SoundFX.click();
                setSubTab("guru");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                subTab === "guru"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-blue-50"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Daftar Guru Mentor ({teachersList.length})
            </button>

            <button
              onClick={() => {
                SoundFX.click();
                setSubTab("tetapan");
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                subTab === "tetapan"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-blue-50"
              }`}
            >
              <Settings className="w-4 h-4" />
              Tetapan Admin
            </button>
          </>
        )}
      </div>

      {/* 1. TAB MODERASI KOMEN & BINTANG */}
      {subTab === "moderasi" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-blue-100 space-y-6 animate-pop-up">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-blue-900">
              Kawalan Komen & Bintang Karya
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Amaran Penalti: Jika komen dipadam kerana mengandungi unsur
              sensitif/negatif,{" "}
              <span className="font-bold text-red-600">
                bintang (star) milik pengkritik tersebut pada karya berkenaan
                akan dipadam secara automatik
              </span>
              .
            </p>
          </div>

          {artworks.length === 0 ? (
            <p className="text-center text-slate-400 py-8 italic">
              Tiada karya dalam galeri buat masa ini.
            </p>
          ) : (
            <div className="space-y-6">
              {artworks.map((art: any) => {
                const comments = art.comments || [];
                const likes = art.likes || [];
                return (
                  <div
                    key={art.id}
                    className="border-2 border-slate-200 rounded-2xl p-5 bg-slate-50/60"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            art.imageUrl ||
                            "https://placehold.co/100x100?text=Karya"
                          }
                          alt={art.title}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-yellow-400 shrink-0"
                        />
                        <div>
                          <span className="bg-yellow-400 text-blue-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                            {art.className}
                          </span>
                          <h4 className="text-lg font-black text-slate-800 mt-1">
                            {art.title}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500">
                            Pelukis: {art.studentName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          {likes.length} Bintang
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {comments.length} Komen
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        Senarai Pemberi Bintang ({likes.length}):
                      </h5>
                      {likes.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Tiada bintang diberikan.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {likes.map((starKey: string, i: number) => (
                            <div
                              key={`${starKey}-${i}`}
                              className="inline-flex items-center gap-2 bg-white border border-amber-300 text-slate-700 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
                            >
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                              <span>{formatStarLabel(starKey)}</span>
                              <button
                                onClick={() =>
                                  onRemoveSingleStar(art.id, starKey)
                                }
                                className="text-red-500 hover:text-red-700 ml-1"
                                title="Padam Bintang Ini"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        Senarai Komen ({comments.length}):
                      </h5>
                      {comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Tiada komen pada karya ini.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {comments.map((c: any) => (
                            <div
                              key={c.id}
                              className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                            >
                              <div>
                                <div className="text-xs font-extrabold text-blue-900">
                                  {c.authorName || "Penjelajah Misteri"}{" "}
                                  {c.authorClass ? `(${c.authorClass})` : ""}
                                  {c.timestamp && (
                                    <span className="text-slate-400 font-normal ml-2">
                                      • {formatTimeAgo(c.timestamp)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-line">
                                  {c.text}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  onDeleteCommentWithPenalty(art.id, c)
                                }
                                className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                                title="Padam komen & auto tolak bintang pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Padam & Tolak Bintang
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. TAB SENARAI NAMA & CETAK */}
      {subTab === "senarai" && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-blue-100 space-y-6 animate-pop-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 no-print">
            <div>
              <h3 className="text-2xl font-black text-blue-900">
                Rekod Pendaftaran Galeri Kanta Seni
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Tapis senarai Pelukis Cilik dan Pengkritik mengikut sesi atau
                kelas sebelum mencetak slip rekod.
              </p>
            </div>

            <button
              onClick={handlePrintLists}
              className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black px-5 py-3 rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-0.5 transition-all flex items-center gap-2 border-2 border-blue-900 self-start sm:self-auto"
            >
              <Printer className="w-5 h-5" />
              Cetak Slip Senarai Nama
            </button>
          </div>

          <div className="bg-sky-50/80 p-4 md:p-5 rounded-2xl border-2 border-blue-200 space-y-4 no-print">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center text-blue-900 font-extrabold text-xs md:text-sm mr-1">
                  <Filter className="w-4 h-4 mr-1.5 text-blue-600" />
                  Tapis Sesi / Tahun:
                </span>
                {["Semua", ...availableYears].map((yr: string) => (
                  <button
                    key={yr}
                    onClick={() => {
                      SoundFX.click();
                      setPrintYearFilter(yr);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                      printYearFilter === yr
                        ? "bg-blue-700 text-white shadow-sm scale-105"
                        : "bg-white text-slate-600 border border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {yr === "Semua" ? "Semua Sesi" : `Sesi ${yr}`}
                  </button>
                ))}
              </div>

              {(printYearFilter !== "Semua" ||
                printClassFilter !== "Semua") && (
                <button
                  onClick={() => {
                    SoundFX.click();
                    setPrintYearFilter("Semua");
                    setPrintClassFilter("Semua");
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                >
                  Set Semula Tapisan
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-blue-200/70">
              <span className="text-blue-900 font-extrabold text-xs md:text-sm mr-1">
                Tapis Kelas / Kategori:
              </span>
              {printClassOptions.map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    SoundFX.click();
                    setPrintClassFilter(cls);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    printClassFilter === cls
                      ? "bg-yellow-400 text-blue-900 border-2 border-blue-900 shadow-sm scale-105"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <div
            id="printable-lists-area"
            className="rounded-3xl border-4 border-blue-900 overflow-hidden bg-white shadow-sm"
          >
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white p-6 border-b-4 border-yellow-400 relative overflow-hidden hide-on-screen">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="bg-blue-600 p-3 rounded-2xl border-2 border-yellow-400 shadow-md">
                    <Compass className="text-yellow-300 w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block bg-yellow-400 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      SLIP REKOD RASMI - PAMERAN MAYA PSV
                    </div>
                    <h2 className="text-2xl font-black tracking-tight leading-none">
                      GALERI KANTA SENI
                    </h2>
                    <p className="text-xs text-blue-100 font-semibold mt-1">
                      Misi Eksplorasi & Jejak Bintang - Rekod Pelukis Cilik
                      & Pengkritik
                    </p>
                  </div>
                </div>

                <div className="bg-blue-950/70 border border-yellow-400/60 rounded-2xl px-4 py-3 text-xs w-full sm:w-64 mt-4 sm:mt-0">
                  <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1.5 items-center">
                    <span className="text-blue-200 font-medium">Sesi:</span>
                    <span className="font-black text-yellow-300 text-right">
                      {printYearFilter === "Semua"
                        ? "Semua Sesi"
                        : `Tahun ${printYearFilter}`}
                    </span>

                    <span className="text-blue-200 font-medium">Kategori:</span>
                    <span className="font-black text-yellow-300 text-right truncate">
                      {printClassFilter}
                    </span>

                    <span className="text-blue-200 font-medium">Tarikh:</span>
                    <span className="font-bold text-white text-right">
                      {new Date().toLocaleDateString("ms-MY")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-blue-600/70 text-xs">
                <div className="bg-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">
                    Pelukis Cilik:
                  </span>
                  <span className="font-black text-yellow-300 text-sm">
                    {filteredArtistsForPrint.length} Orang
                  </span>
                </div>
                <div className="bg-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">
                    Pengkritik Aktif:
                  </span>
                  <span className="font-black text-yellow-300 text-sm">
                    {filteredCriticsForPrint.length} Orang
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between">
                  <span className="text-blue-100 font-semibold">
                    Dijana Oleh:
                  </span>
                  <span className="font-bold text-white truncate max-w-[140px]">
                    {loggedInStaff.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8 bg-white">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base md:text-lg font-black text-blue-900 flex items-center gap-2">
                    <span className="bg-blue-600 text-white p-1.5 rounded-lg">
                      <Palette className="w-4 h-4" />
                    </span>
                    1. Senarai Nama Pelukis Cilik Berdaftar (
                    {filteredArtistsForPrint.length} Rekod)
                  </h4>
                </div>
                <div className="overflow-x-auto border-2 border-blue-200 rounded-2xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-blue-100 text-blue-950 border-b-2 border-blue-200">
                        <th className="py-2.5 px-4 font-black w-12">Bil</th>
                        <th className="py-2.5 px-4 font-black">
                          Nama Pelukis Cilik
                        </th>
                        <th className="py-2.5 px-4 font-black">Kelas</th>
                        <th className="py-2.5 px-4 font-black">Sesi</th>
                        <th className="py-2.5 px-4 font-black">Tajuk Karya</th>
                        <th className="py-2.5 px-4 font-black text-center">
                          Bintang
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArtistsForPrint.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-6 text-center text-slate-400 italic"
                          >
                            Tiada rekod pelukis cilik bagi tapisan ini.
                          </td>
                        </tr>
                      ) : (
                        filteredArtistsForPrint.map((art: any, idx: number) => (
                          <tr
                            key={art.id}
                            className="border-b border-slate-100 even:bg-sky-50/40"
                          >
                            <td className="py-2.5 px-4 font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-800">
                              {art.studentName}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700 font-medium">
                              {art.className}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {getArtworkYear(art.createdAt)}
                            </td>
                            <td className="py-2.5 px-4 text-slate-700">
                              {art.title}
                            </td>
                            <td className="py-2.5 px-4 text-center font-black text-amber-600">
                              {art.likes?.length || 0} <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-1" />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base md:text-lg font-black text-blue-900 flex items-center gap-2">
                    <span className="bg-yellow-400 text-blue-900 p-1.5 rounded-lg">
                      <Award className="w-4 h-4" />
                    </span>
                    2. Senarai Nama Pengkritik Berdaftar (
                    {filteredCriticsForPrint.length} Rekod)
                  </h4>
                </div>
                <div className="overflow-x-auto border-2 border-amber-200 rounded-2xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-amber-100 text-blue-950 border-b-2 border-amber-200">
                        <th className="py-2.5 px-4 font-black w-12">Bil</th>
                        <th className="py-2.5 px-4 font-black">
                          Nama Pengkritik
                        </th>
                        <th className="py-2.5 px-4 font-black">
                          Kelas / Kategori
                        </th>
                        <th className="py-2.5 px-4 font-black text-center">
                          Jumlah Komen
                        </th>
                        <th className="py-2.5 px-4 font-black text-center">
                          Jumlah Bintang
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCriticsForPrint.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-6 text-center text-slate-400 italic"
                          >
                            Tiada rekod pengkritik bagi tapisan ini.
                          </td>
                        </tr>
                      ) : (
                        filteredCriticsForPrint.map(
                          (critic: any, idx: number) => (
                            <tr
                              key={critic.normName}
                              className="border-b border-slate-100 even:bg-amber-50/30"
                            >
                              <td className="py-2.5 px-4 font-bold text-slate-500">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-4 font-bold text-slate-800">
                                {critic.displayName}{" "}
                                {critic.isVip ? "(VIP)" : ""}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700 font-medium">
                                {critic.className}
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold text-blue-700">
                                {critic.commentsCount}
                              </td>
                              <td className="py-2.5 px-4 text-center font-black text-amber-600">
                                {critic.likesCount} <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-1" />
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 text-xs text-slate-600 hide-on-screen">
                <div className="space-y-1">
                  <p className="font-bold text-blue-900">
                    Kanta Seni - Sistem Galeri Maya & Apresiasi PSV
                  </p>
                  <p className="text-slate-500">
                    &copy; {new Date().getFullYear()} E&J Studio. Hak Cipta
                    Terpelihara.
                  </p>
                </div>
                <div className="w-64 text-center shrink-0">
                  <div className="h-16 border-b-2 border-slate-500 mb-2"></div>
                  <span className="font-extrabold text-slate-800 block">
                    Pengesahan Guru / Pentadbir
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    (Tandatangan & Cop Rasmi)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB DAFTAR GURU MENTOR */}
      {subTab === "guru" && isAdmin && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-blue-100 space-y-6 animate-pop-up">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Daftar Akaun Guru (Mentor Galeri)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Guru yang didaftarkan akan diselaraskan secara automatik ke semua
              telefon/peranti lain dan diberi akses menyunting/memadam karya
              serta mencetak senarai nama.
            </p>
          </div>

          <form
            onSubmit={handleAddTeacher}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/70 p-5 rounded-2xl border border-blue-200"
          >
            <div>
              <label className="block text-xs font-extrabold text-blue-900 mb-1">
                Nama Penuh Guru *
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
                placeholder="Cth: Cikgu Siti Aminah"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-blue-900 mb-1">
                Kelas Bimbingan
              </label>
              <select
                value={teacherClass}
                onChange={(e) => setTeacherClass(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Semua Kelas">Semua Kelas</option>
                <option value="Tahun 1">Tahun 1</option>
                <option value="Tahun 2">Tahun 2</option>
                <option value="Tahun 3">Tahun 3</option>
                <option value="Tahun 4">Tahun 4</option>
                <option value="Tahun 5">Tahun 5</option>
                <option value="Tahun 6">Tahun 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-blue-900 mb-1">
                Username Log Masuk Guru *
              </label>
              <input
                type="text"
                value={teacherUser}
                onChange={(e) => setTeacherUser(e.target.value)}
                required
                placeholder="Cth: cikgusiti"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-blue-900 mb-1">
                Kata Laluan Guru *
              </label>
              <div className="relative">
                <input
                  type={showTeacherPass ? "text" : "password"}
                  value={teacherPass}
                  onChange={(e) => setTeacherPass(e.target.value)}
                  required
                  placeholder="Cipta kata laluan..."
                  className="w-full bg-white border-2 border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setShowTeacherPass((prev) => !prev);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-700"
                >
                  {showTeacherPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-black px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Simpan & Daftar Guru
              </button>
            </div>
          </form>

          <div>
            <h4 className="text-sm font-extrabold text-slate-700 mb-3">
              Senarai Guru Mentor Aktif ({teachersList.length}):
            </h4>
            {teachersList.length === 0 ? (
              <p className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                Belum ada guru mentor didaftarkan.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teachersList.map((t: any) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-extrabold text-slate-800">
                        {t.fullName}
                      </div>
                      <div className="text-xs text-blue-600 font-semibold">
                        {t.classAssigned}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Username:{" "}
                        <span className="font-mono font-bold text-slate-700">
                          {t.username}
                        </span>{" "}
                        • Password:{" "}
                        <span className="font-mono font-bold text-slate-700">
                          {t.password}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTeacher(t.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                      title="Padam Akaun Guru"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB TETAPAN ADMIN */}
      {subTab === "tetapan" && isAdmin && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-blue-100 max-w-xl animate-pop-up">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Tetapan Akaun Admin
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Kemas kini nama pengguna (username) dan kata laluan (password)
              untuk log masuk Pentadbir Utama.
            </p>
          </div>

          <form onSubmit={handleUpdateAdminCreds} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Username Admin Baharu
              </label>
              <input
                type="text"
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Password Admin Baharu
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setShowAdminPass((prev) => !prev);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-700"
                >
                  {showAdminPass ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-0.5 transition-all"
            >
              Simpan Tetapan Admin
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

// --- MODAL PENDAFTARAN PASPORT (DENGAN PRATONTON KAD VIP GURU & PIBG) ---
function PassportRegistrationModal({
  onClose,
  onRegister,
  getGlobalHistoryByName,
  hasPendingArtwork,
  onGoToGallery,
}: any) {
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    isRenewal: boolean;
    isVip: boolean;
    sessionNumber: number;
    remainingQuota: number;
  } | null>(null);

  const criticCategories = [
    "Tahun 1",
    "Tahun 2",
    "Tahun 3",
    "Tahun 4",
    "Tahun 5",
    "Tahun 6",
    "Guru",
    "PIBG",
    "Lain-lain",
  ];

  const isSelectedVip = isVipCategory(className);

  const { totalSessionsCompleted } = fullName.trim()
    ? getGlobalHistoryByName(fullName)
    : { totalSessionsCompleted: 0 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      SoundFX.alert();
      setErrorMsg("Sila isi Nama Penuh anda.");
      return;
    }
    if (!className) {
      SoundFX.alert();
      setErrorMsg("Sila pilih Kelas / Kategori anda.");
      return;
    }

    const result = onRegister({ fullName, className, email });
    if (!result.success) {
      SoundFX.alert();
      setErrorMsg(result.message);
    } else if (!hasPendingArtwork) {
      setSuccessInfo({
        isRenewal: result.isRenewal,
        isVip: result.isVip,
        sessionNumber: result.sessionNumber,
        remainingQuota: result.remainingQuota,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div
        className={`bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 animate-modal-enter ${
          isSelectedVip ? "border-amber-400" : "border-yellow-400"
        }`}
      >
        <div
          className={`p-6 flex justify-between items-center relative overflow-hidden ${
            isSelectedVip
              ? "bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-yellow-300"
              : "bg-blue-600 text-white"
          }`}
        >
          {isSelectedVip ? (
            <Crown className="absolute top-1 right-10 w-20 h-20 text-yellow-400 opacity-20 animate-float-slow" />
          ) : (
            <Award className="absolute top-1 right-10 w-20 h-20 text-blue-500 opacity-30 animate-float-slow" />
          )}
          <div>
            <h3 className="text-2xl font-black flex items-center relative z-10">
              {isSelectedVip ? (
                <>
                  <Crown className="mr-2 text-yellow-400 fill-current" />
                  Pasport VIP ({className})
                </>
              ) : (
                <>
                  <Award className="mr-2 text-yellow-400" />
                  Daftar Pengkritik
                </>
              )}
            </h3>
            <p
              className={`text-xs font-medium mt-0.5 relative z-10 ${
                isSelectedVip ? "text-amber-200" : "text-blue-100"
              }`}
            >
              3 karya setiap pasport • Boleh daftar semula jika sudah tamat
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {successInfo ? (
          <div className="p-8 text-center animate-pop-up">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce ${
                successInfo.isVip
                  ? "bg-slate-900 text-yellow-400 border-2 border-yellow-400"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {successInfo.isVip ? (
                <Crown className="w-9 h-9 fill-current" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2">
              {successInfo.isVip
                ? `Pasport VIP #${successInfo.sessionNumber} Diaktifkan!`
                : successInfo.isRenewal
                ? `Pasport #${successInfo.sessionNumber} Diaktifkan!`
                : "Pasport Siap!"}
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Selamat bertugas,{" "}
              <span className="font-bold text-blue-900">{fullName}</span> (
              {className}). Anda mempunyai kuota baharu{" "}
              <span className="font-bold text-green-700">
                {successInfo.remainingQuota} karya
              </span>{" "}
              untuk diberi bintang dan komen.
            </p>
            <button
              onClick={onGoToGallery}
              className="w-full py-3.5 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] transition-all"
            >
              Terokai Galeri Sekarang!
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {isSelectedVip && (
              <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-yellow-300 border-2 border-yellow-400 p-3.5 rounded-2xl flex items-center gap-3 shadow-md animate-pop-up">
                <div className="bg-yellow-400 text-slate-950 p-2 rounded-xl shrink-0">
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div className="text-xs">
                  <div className="font-black uppercase tracking-wider text-yellow-400">
                    Akses Tema VIP Diaktifkan ({className})
                  </div>
                  <p className="text-amber-100 mt-0.5">
                    Kad Pasport, avatar bintang, dan lencana komen anda akan
                    dipaparkan dengan tema eksklusif VIP!
                  </p>
                </div>
              </div>
            )}

            {hasPendingArtwork ? (
              <div className="text-xs text-blue-900 font-bold bg-amber-50 px-3 py-2.5 rounded-xl border border-yellow-400">
                Selepas selesai daftar, anda akan terus dibawa kembali ke karya
                yang dipilih tadi!
              </div>
            ) : (
              <div className="text-xs text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                * Menunjukkan soalan yang wajib diisi
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded-r-xl text-xs font-bold flex items-start gap-2 animate-pop-up">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                1. Nama Penuh <span className="text-red-500 text-base">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrorMsg("");
                }}
                required
                placeholder="Masukkan nama penuh anda..."
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
              />
              {fullName.trim().length > 1 && (
                <p className="text-xs font-bold mt-1.5 text-blue-600">
                  {totalSessionsCompleted === 0
                    ? "Nama baharu: Pasport #1 (Kuota 3/3 karya tersedia)."
                    : `Rekod terdahulu ditemui: Mendaftar Pasport Baharu #${
                        totalSessionsCompleted + 1
                      } (Kuota baharu 3/3 karya).`}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                2. Kelas / Kategori{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <select
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value);
                  setErrorMsg("");
                }}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium bg-white"
              >
                <option value="" disabled>
                  -- Pilih Kelas / Kategori --
                </option>
                {criticCategories.map((item) => (
                  <option key={item} value={item}>
                    {isVipCategory(item) ? `${item} (Pasport VIP)` : item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                3. Email{" "}
                <span className="text-slate-400 font-normal text-xs">
                  (Pilihan)
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@moe-dl.edu.my"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`w-2/3 px-4 py-3 font-black rounded-xl transition-all ${
                  isSelectedVip
                    ? "bg-gradient-to-r from-slate-900 to-amber-950 text-yellow-300 border-2 border-yellow-400 shadow-[0_4px_0_rgb(120,53,15)] hover:translate-y-0.5"
                    : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-0.5"
                }`}
              >
                {isSelectedVip
                  ? "Aktifkan Pasport VIP!"
                  : totalSessionsCompleted > 0
                  ? "Aktifkan Pasport Baharu!"
                  : "Aktifkan Passport!"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ArtworkCard({
  artwork,
  artworkYear,
  activeUserKey,
  activePassport,
  vipRegistry,
  isStaffLoggedIn,
  onLike,
  onOpenStarList,
  onComment,
  onDeleteComment,
  onRequestEdit,
  onRequestDelete,
  onOpenPreview,
  index = 0,
}: any) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [starBurst, setStarBurst] = useState(false);

  const criticStage = getStageFromClass(activePassport?.className);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AppreciationQuestion[]>(
    () => pickThreeRandomQuestions(criticStage)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const likesList = Array.isArray(artwork.likes) ? artwork.likes : [];
  const likesCount = likesList.length;
  const hasLiked = likesList.includes(activeUserKey);
  const commentsList = Array.isArray(artwork.comments) ? artwork.comments : [];
  const starGivers = useMemo(
    () => parseStarGivers(likesList, commentsList, vipRegistry),
    [likesList, commentsList, vipRegistry]
  );

  const handleLikeClick = () => {
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 500);
    onLike();
  };

  const handleToggleQuiz = () => {
    SoundFX.click();
    if (!isQuizOpen) {
      setQuizQuestions(pickThreeRandomQuestions(criticStage));
      setCurrentQuestionIdx(0);
      setQuizAnswers({});
      setIsQuizOpen(true);
    } else {
      setIsQuizOpen(false);
      setQuizAnswers({});
      setCurrentQuestionIdx(0);
    }
  };

  const handleRefreshQuiz = () => {
    setQuizQuestions(pickThreeRandomQuestions(criticStage));
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
  };

  const handleSelectQuizAnswer = (qIdx: number, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: answer }));
    if (qIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(qIdx + 1);
    }
  };

  const answeredQuizList = quizQuestions
    .map((q, idx) =>
      quizAnswers[idx]
        ? {
            category: q.category,
            question: q.question,
            answer: quizAnswers[idx],
          }
        : null
    )
    .filter(Boolean);

  const canSubmitComment = Boolean(
    commentText.trim() || answeredQuizList.length > 0
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;

    onComment(
      commentText,
      answeredQuizList.length > 0 ? answeredQuizList : undefined
    );
    setCommentText("");
    setQuizAnswers({});
    setCurrentQuestionIdx(0);
    setIsQuizOpen(false);
  };

  const handleImageError = (e: any) => {
    e.target.src =
      "https://placehold.co/600x400/e2e8f0/475569?text=Gambar+Rosak+atau+Tiada";
  };

  return (
    <div
      className="break-inside-avoid bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group relative animate-pop-up"
      style={{ animationDelay: `${Math.min(index * 0.06, 0.5)}s` }}
    >
      {isStaffLoggedIn && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestEdit();
            }}
            title="Edit Maklumat Karya (Guru / Admin)"
            className="bg-blue-700 hover:bg-blue-800 text-yellow-300 p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md border border-white/60"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete();
            }}
            title="Padam Karya (Guru / Admin)"
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md border border-white/60"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        onClick={onOpenPreview}
        title="Klik untuk besarkan, zoom & seret karya"
        className="relative overflow-hidden bg-slate-100 rounded-t-3xl border-b-4 border-blue-400 cursor-zoom-in group/img"
      >
        <img
          key={artwork.imageUrl}
          src={
            artwork.imageUrl ||
            "https://placehold.co/600x400/e2e8f0/475569?text=Tiada+Gambar"
          }
          alt={artwork.title}
          onError={handleImageError}
          className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover/img:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/75 text-white p-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/img:translate-y-0 shadow-md">
          <ZoomIn className="w-4 h-4" />
        </div>
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <span className="bg-yellow-400 text-blue-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            {artwork.className}
          </span>
          <span className="bg-blue-900/85 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
            {artworkYear}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h4
          onClick={onOpenPreview}
          className="text-xl font-bold text-slate-800 mb-1 leading-tight cursor-pointer hover:text-blue-700 transition-colors"
        >
          {artwork.title}
        </h4>
        <div className="flex items-center text-slate-500 mb-4 font-medium text-sm">
          <User className="w-4 h-4 mr-1.5" />
          <span>{artwork.studentName}</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLikeClick}
              className={`flex items-center space-x-1.5 font-bold transition-colors ${
                hasLiked
                  ? "text-yellow-500"
                  : "text-slate-400 hover:text-yellow-500"
              }`}
              title={
                hasLiked
                  ? "Anda telah memberi bintang pada karya ini"
                  : "Beri Bintang"
              }
            >
              <Star
                className={`w-6 h-6 ${hasLiked ? "fill-current" : ""} ${
                  starBurst ? "animate-star-pop" : ""
                } transition-transform`}
              />
              <span>{likesCount > 0 ? likesCount : "Bintang"}</span>
            </button>

            <StarGiversAvatars
              givers={starGivers}
              onOpenStarList={onOpenStarList}
            />
          </div>

          <button
            onClick={() => {
              SoundFX.click();
              setShowComments(!showComments);
            }}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-blue-500 font-bold transition-colors"
          >
            <MessageCircle className="w-6 h-6 transition-transform hover:scale-110" />
            <span>
              {commentsList.length > 0 ? commentsList.length : "Komen"}
            </span>
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-50 p-4 border-t border-slate-200 animate-pop-up">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-blue-800 flex items-center uppercase tracking-wider">
              <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
              Sudut Apresiasi
            </div>

            {activePassport && (
              <button
                type="button"
                onClick={handleToggleQuiz}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-2xs ${
                  isQuizOpen
                    ? "bg-blue-700 text-yellow-300"
                    : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border border-blue-900/30"
                }`}
                title="Jawab 3 soalan rawak mengenai unsur seni, mesej atau hal benda"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isQuizOpen ? "Tutup Soalan" : "3 Soalan Seni"}</span>
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-3 mb-3 pr-2">
            {commentsList.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-2">
                Belum ada ulasan. Jadilah yang pertama!
              </p>
            ) : (
              commentsList.map((comment: any) => {
                const commentIsVip =
                  Boolean(comment.isVip) || isVipCategory(comment.authorClass);
                const authorDisplay =
                  comment.authorName || "Penjelajah Misteri";
                const avatarStyle = getAvatarColorClass(
                  authorDisplay,
                  commentIsVip
                );

                return (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-2xl shadow-sm border text-sm transition-all ${
                      commentIsVip
                        ? "bg-gradient-to-r from-amber-50/90 via-yellow-50/70 to-white border-amber-300"
                        : "bg-white border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="relative shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarStyle} flex items-center justify-center text-xs font-black uppercase shadow-2xs`}
                          >
                            {authorDisplay.charAt(0).toUpperCase()}
                          </div>
                          {commentIsVip && (
                            <span className="absolute -top-1.5 -right-1 bg-slate-950 text-yellow-300 rounded-full p-[1.5px] border border-yellow-400">
                              <Crown className="w-2.5 h-2.5 fill-current" />
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-blue-900 text-xs flex items-center flex-wrap gap-1">
                          <span>
                            {authorDisplay}
                            {comment.authorClass
                              ? ` (${comment.authorClass})`
                              : ""}
                          </span>

                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {comment.timestamp && (
                          <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {formatTimeAgo(comment.timestamp)}
                          </div>
                        )}
                        {isStaffLoggedIn && (
                          <button
                            onClick={() => onDeleteComment(comment)}
                            className="text-red-500 hover:text-red-700 p-0.5 rounded"
                            title="Padam komen & auto tolak bintang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm whitespace-pre-line pl-9">
                      {comment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {activePassport && isQuizOpen && (
            <PassportQuizBox
              stage={criticStage}
              questions={quizQuestions}
              currentIndex={currentQuestionIdx}
              answers={quizAnswers}
              onSelectAnswer={handleSelectQuizAnswer}
              onChangeStep={setCurrentQuestionIdx}
              onRefreshQuestions={handleRefreshQuiz}
              onClose={() => {
                setIsQuizOpen(false);
                setQuizAnswers({});
                setCurrentQuestionIdx(0);
              }}
            />
          )}

          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center mt-2 relative gap-1.5"
          >
            {activePassport && (
              <button
                type="button"
                onClick={handleToggleQuiz}
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                  isQuizOpen
                    ? "bg-blue-700 text-yellow-300 border-blue-800"
                    : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border-blue-900/30"
                }`}
                title="Ikon Khas: Jawab 3 Soalan Apresiasi Seni"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  answeredQuizList.length > 0
                    ? "Tambah ulasan bebas (atau terus hantar)..."
                    : "Tulis ulasan murni..."
                }
                className="w-full bg-white border border-slate-300 rounded-full py-2 pl-4 pr-11 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <button
                type="submit"
                disabled={!canSubmitComment}
                className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Hantar Komen / Jawapan"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- MODAL POP-UP & ZOOM + DRAG / PAN GAMBAR KARYA ---
function ArtworkLightboxModal({
  artwork,
  artworkYear,
  activeUserKey,
  activePassport,
  vipRegistry,
  isStaffLoggedIn,
  onClose,
  onLike,
  onOpenStarList,
  onComment,
  onDeleteComment,
  onRequestEdit,
  onRequestDelete,
}: any) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  const [commentText, setCommentText] = useState("");
  const [starBurst, setStarBurst] = useState(false);

  const criticStage = getStageFromClass(activePassport?.className);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AppreciationQuestion[]>(
    () => pickThreeRandomQuestions(criticStage)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  const likesList = Array.isArray(artwork.likes) ? artwork.likes : [];
  const likesCount = likesList.length;
  const hasLiked = likesList.includes(activeUserKey);
  const commentsList = Array.isArray(artwork.comments) ? artwork.comments : [];
  const starGivers = useMemo(
    () => parseStarGivers(likesList, commentsList, vipRegistry),
    [likesList, commentsList, vipRegistry]
  );

  const handleZoomIn = () => {
    SoundFX.click();
    setZoom((prev) => Math.min(prev + 0.4, 3.5));
  };

  const handleZoomOut = () => {
    SoundFX.click();
    setZoom((prev) => {
      const next = Math.max(prev - 0.4, 1);
      if (next <= 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    SoundFX.click();
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX - pan.x,
      y: touch.clientY - pan.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    e.stopPropagation();
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleWheelOnImage = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.25, 3.5));
    } else {
      setZoom((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const handleLikeClick = () => {
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 500);
    onLike();
  };

  const handleToggleQuiz = () => {
    SoundFX.click();
    if (!isQuizOpen) {
      setQuizQuestions(pickThreeRandomQuestions(criticStage));
      setCurrentQuestionIdx(0);
      setQuizAnswers({});
      setIsQuizOpen(true);
    } else {
      setIsQuizOpen(false);
      setQuizAnswers({});
      setCurrentQuestionIdx(0);
    }
  };

  const handleRefreshQuiz = () => {
    setQuizQuestions(pickThreeRandomQuestions(criticStage));
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
  };

  const handleSelectQuizAnswer = (qIdx: number, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: answer }));
    if (qIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(qIdx + 1);
    }
  };

  const answeredQuizList = quizQuestions
    .map((q, idx) =>
      quizAnswers[idx]
        ? {
            category: q.category,
            question: q.question,
            answer: quizAnswers[idx],
          }
        : null
    )
    .filter(Boolean);

  const canSubmitComment = Boolean(
    commentText.trim() || answeredQuizList.length > 0
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;

    onComment(
      commentText,
      answeredQuizList.length > 0 ? answeredQuizList : undefined
    );
    setCommentText("");
    setQuizAnswers({});
    setCurrentQuestionIdx(0);
    setIsQuizOpen(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-6 overflow-hidden overscroll-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl border-4 border-yellow-400 flex flex-col md:flex-row relative animate-modal-enter"
      >
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {isStaffLoggedIn && (
            <>
              <button
                onClick={onRequestEdit}
                className="bg-blue-700 hover:bg-blue-800 hover:scale-110 text-yellow-300 p-2 rounded-full shadow-lg transition-all border border-white/50"
                title="Edit Maklumat Karya"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={onRequestDelete}
                className="bg-red-500 hover:bg-red-600 hover:scale-110 text-white p-2 rounded-full shadow-lg transition-all border border-white/50"
                title="Padam Karya"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-slate-800/80 hover:bg-slate-900 hover:scale-110 text-white p-2 rounded-full shadow-lg transition-all"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={viewportRef}
          onWheel={handleWheelOnImage}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`md:w-3/5 bg-slate-900 relative flex flex-col items-center justify-center min-h-[250px] md:min-h-[500px] max-h-[44vh] md:max-h-[92vh] shrink-0 overflow-hidden select-none touch-none ${
            zoom > 1
              ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-zoom-in"
          }`}
        >
          {zoom > 1 && (
            <div className="absolute top-3 left-3 bg-blue-900/85 text-yellow-300 border border-yellow-400/50 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 z-10 pointer-events-none shadow-md">
              <Move className="w-3.5 h-3.5" />
              <span>Seret (Drag) gambar untuk lihat sudut lain</span>
            </div>
          )}

          <div
            onClick={() => {
              if (zoom === 1) {
                SoundFX.click();
                setZoom(1.8);
              }
            }}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.18s ease-out",
            }}
            className="w-full h-full flex items-center justify-center p-4 will-change-transform"
          >
            <img
              key={artwork.imageUrl}
              src={
                artwork.imageUrl ||
                "https://placehold.co/600x400/e2e8f0/475569?text=Tiada+Gambar"
              }
              alt={artwork.title}
              draggable={false}
              className="max-w-full max-h-[38vh] md:max-h-[76vh] object-contain rounded-lg select-none pointer-events-none shadow-xl"
            />
          </div>

          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl z-10"
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-40 transition-colors"
              title="Kecilkan (Zoom Out)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-white min-w-[48px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3.5}
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-40 transition-colors"
              title="Besarkan (Zoom In)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-slate-600 mx-0.5"></div>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-white hover:text-yellow-400 transition-colors"
              title="Set Semula Saiz & Posisi Tengah"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="md:w-2/5 flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
          <div className="p-4 md:p-5 border-b border-slate-100 shrink-0 pr-24 md:pr-28">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-400 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {artwork.className}
              </span>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-full">
                Sesi {artworkYear}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-1 leading-snug">
              {artwork.title}
            </h3>
            <div className="flex items-center text-slate-500 font-semibold text-sm mb-3">
              <User className="w-4 h-4 mr-1.5 text-blue-600" />
              <span>{artwork.studentName}</span>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLikeClick}
                  className={`flex items-center space-x-1.5 font-bold transition-colors ${
                    hasLiked
                      ? "text-yellow-500"
                      : "text-slate-400 hover:text-yellow-500"
                  }`}
                >
                  <Star
                    className={`w-6 h-6 ${hasLiked ? "fill-current" : ""} ${
                      starBurst ? "animate-star-pop" : ""
                    } transition-transform`}
                  />
                  <span>{likesCount > 0 ? likesCount : "Bintang"}</span>
                </button>

                <StarGiversAvatars
                  givers={starGivers}
                  onOpenStarList={onOpenStarList}
                />
              </div>

              <div className="flex items-center space-x-1.5 text-slate-400 font-bold">
                <MessageCircle className="w-6 h-6" />
                <span>
                  {commentsList.length > 0 ? commentsList.length : "Komen"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-5 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-blue-800 flex items-center uppercase tracking-wider">
                <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                Sudut Apresiasi
              </div>
              {activePassport && (
                <button
                  type="button"
                  onClick={handleToggleQuiz}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black transition-all shadow-2xs ${
                    isQuizOpen
                      ? "bg-blue-700 text-yellow-300"
                      : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border border-blue-900/30"
                  }`}
                  title="Jawab 3 soalan rawak mengenai unsur seni, mesej atau hal benda"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isQuizOpen ? "Tutup Soalan" : "3 Soalan Seni"}</span>
                </button>
              )}
            </div>

            {activePassport && isQuizOpen && (
              <PassportQuizBox
                stage={criticStage}
                questions={quizQuestions}
                currentIndex={currentQuestionIdx}
                answers={quizAnswers}
                onSelectAnswer={handleSelectQuizAnswer}
                onChangeStep={setCurrentQuestionIdx}
                onRefreshQuestions={handleRefreshQuiz}
                onClose={() => {
                  setIsQuizOpen(false);
                  setQuizAnswers({});
                  setCurrentQuestionIdx(0);
                }}
              />
            )}

            {commentsList.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-6">
                Belum ada ulasan. Jadilah yang pertama memberi pujian!
              </p>
            ) : (
              commentsList.map((comment: any) => {
                const commentIsVip =
                  Boolean(comment.isVip) || isVipCategory(comment.authorClass);
                const authorDisplay =
                  comment.authorName || "Penjelajah Misteri";
                const avatarStyle = getAvatarColorClass(
                  authorDisplay,
                  commentIsVip
                );

                return (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-2xl shadow-sm border text-sm animate-pop-up ${
                      commentIsVip
                        ? "bg-gradient-to-r from-amber-50/95 via-yellow-50/75 to-white border-amber-300"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="relative shrink-0">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarStyle} flex items-center justify-center text-xs font-black uppercase shadow-2xs`}
                          >
                            {authorDisplay.charAt(0).toUpperCase()}
                          </div>
                          {commentIsVip && (
                            <span className="absolute -top-1.5 -right-1 bg-slate-950 text-yellow-300 rounded-full p-[1.5px] border border-yellow-400">
                              <Crown className="w-2.5 h-2.5 fill-current" />
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-blue-900 text-xs flex items-center flex-wrap gap-1">
                          <span>
                            {authorDisplay}
                            {comment.authorClass
                              ? ` (${comment.authorClass})`
                              : ""}
                          </span>

                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {comment.timestamp && (
                          <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            {formatTimeAgo(comment.timestamp)}
                          </div>
                        )}
                        {isStaffLoggedIn && (
                          <button
                            onClick={() => onDeleteComment(comment)}
                            className="text-red-500 hover:text-red-700 p-0.5 rounded"
                            title="Padam komen & auto tolak bintang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line pl-9">
                      {comment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3.5 md:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center relative gap-2"
            >
              {activePassport && (
                <button
                  type="button"
                  onClick={handleToggleQuiz}
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                    isQuizOpen
                      ? "bg-blue-700 text-yellow-300 border-blue-800"
                      : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border-blue-900/30"
                  }`}
                  title="Ikon Khas: Jawab 3 Soalan Apresiasi Seni"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              )}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    activePassport
                      ? answeredQuizList.length > 0
                        ? "Tambah ulasan bebas (atau terus hantar)..."
                        : `Ulas sebagai ${activePassport.fullName}...`
                      : "Daftar Pasport untuk mengulas..."
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <button
                  type="submit"
                  disabled={!canSubmitComment}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-600 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Hantar Komen / Jawapan"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- BORANG TAMBAH & EDIT KARYA ---
function ArtworkFormModal({
  mode = "add",
  initialData,
  onClose,
  onSubmit,
}: {
  mode?: "add" | "edit";
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    studentName: string;
    className: string;
    imageUrl: string;
  }) => void;
}) {
  const isEdit = mode === "edit" && !!initialData;
  const initialImgUrl = isEdit ? initialData.imageUrl || "" : "";
  const isInitialHttpLink =
    initialImgUrl.startsWith("http://") || initialImgUrl.startsWith("https://");

  const [formData, setFormData] = useState({
    title: isEdit ? initialData.title || "" : "",
    studentName: isEdit ? initialData.studentName || "" : "",
    className: isEdit ? initialData.className || "Tahun 1" : "Tahun 1",
    imageUrl: initialImgUrl,
  });
  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "link">(
    isInitialHttpLink ? "link" : "upload"
  );
  const [rawLinkInput, setRawLinkInput] = useState(
    isInitialHttpLink ? initialImgUrl : ""
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const classes = [
    "Tahun 1",
    "Tahun 2",
    "Tahun 3",
    "Tahun 4",
    "Tahun 5",
    "Tahun 6",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      SoundFX.alert();
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIMENSION = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        let quality = 0.82;
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        while (compressedDataUrl.length > 48000 && quality > 0.45) {
          quality -= 0.08;
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        setRawLinkInput("");
        setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
        setIsProcessingImage(false);
        SoundFX.success();
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setPreviewError(true);
        SoundFX.alert();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawLinkInput(val);
    setPreviewError(false);
    const formatted = formatDirectImageUrl(val);
    setFormData((prev) => ({ ...prev, imageUrl: formatted }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border-4 border-yellow-400 animate-modal-enter">
        <div
          className={`${
            isEdit ? "bg-blue-900" : "bg-blue-600"
          } p-6 flex justify-between items-center text-white relative overflow-hidden sticky top-0 z-10`}
        >
          <Star className="absolute top-2 right-10 w-16 h-16 text-blue-500 opacity-30 animate-float-slow" />
          <h3 className="text-2xl font-black flex items-center relative z-10">
            {isEdit ? (
              <>
                <Pencil className="mr-2 text-yellow-400 w-6 h-6" />
                Edit Maklumat Karya
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 text-yellow-400" />
                Tambah Karya
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isEdit && (
            <div className="bg-amber-50 border-l-4 border-yellow-400 text-amber-900 p-3 rounded-r-xl text-xs font-bold">
              Mod Suntingan Guru / Admin: Anda boleh menukar tajuk, nama murid,
              kelas, atau memuat naik gambar / pautan baharu.
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tajuk Karya
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Cth: Kucing Angkasa Lepas"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nama Pelukis Cilik
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Nama anda..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Kelas
            </label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium bg-white"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Gambar Karya (Pilih Salah Satu Kaedah)
            </label>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-3">
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setImageSourceMode("upload");
                  setPreviewError(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  imageSourceMode === "upload"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-blue-800"
                }`}
              >
                <Upload className="w-4 h-4" />
                Muat Naik Gambar
              </button>
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setImageSourceMode("link");
                  setPreviewError(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  imageSourceMode === "link"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-blue-800"
                }`}
              >
                <Link2 className="w-4 h-4" />
                Link Gambar (URL)
              </button>
            </div>

            {imageSourceMode === "upload" ? (
              <div className="space-y-3">
                <label className="block w-full cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors rounded-xl p-4 text-center text-blue-700 font-medium relative overflow-hidden group">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <ImageIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold">
                      {isProcessingImage
                        ? "Memproses Gambar HD..."
                        : isEdit
                        ? "Klik untuk Tukar Fail Gambar Baharu"
                        : "Klik untuk Pilih Gambar"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!formData.imageUrl}
                  />
                </label>

                {formData.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-md relative bg-slate-900 animate-pop-up">
                    <img
                      key={formData.imageUrl}
                      src={formData.imageUrl}
                      alt="Pratonton Karya"
                      onError={() => setPreviewError(true)}
                      className="w-full max-h-56 object-contain mx-auto"
                    />
                    <div className="bg-green-600 text-white text-[11px] text-center py-1 font-extrabold">
                      PRATONTON GAMBAR SEMASA (NISBAH ASAL)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 bg-blue-50/60 p-4 rounded-2xl border-2 border-blue-100">
                <div>
                  <label className="block text-xs font-extrabold text-blue-900 mb-1">
                    Tampal Pautan (Link) Gambar Baharu:
                  </label>
                  <input
                    type="url"
                    value={rawLinkInput}
                    onChange={handleLinkChange}
                    required={!formData.imageUrl}
                    placeholder="https://... (Google Drive / Pautan Imej)"
                    className="w-full bg-white border-2 border-blue-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    Sokong pautan terus gambar (`.jpg`, `.png`, `.webp`) atau
                    pautan perkongsian <strong>Google Drive</strong> (pastikan
                    tetapan Drive ialah <em>Anyone with the link</em>).
                  </p>
                </div>

                {formData.imageUrl && (
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200 space-y-2">
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                      <img
                        key={formData.imageUrl}
                        src={formData.imageUrl}
                        alt="Pratonton Link"
                        onError={() => setPreviewError(true)}
                        onLoad={() => setPreviewError(false)}
                        className="w-full max-h-48 object-contain mx-auto"
                      />
                    </div>
                    <div className="text-xs text-center">
                      {previewError ? (
                        <span className="text-red-600 font-bold">
                          Gambar tidak dapat dimuatkan. Pastikan link boleh
                          diakses secara umum (Public).
                        </span>
                      ) : (
                        <span className="text-green-700 font-bold">
                          Pratonton gambar berjaya dimuatkan mengikut saiz asal!
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-slate-500 mt-2 flex items-center">
              <Compass className="w-3 h-3 mr-1 shrink-0" />
              Gambar dipaparkan mengikut saiz & nisbah asal agar kekal jelas
              apabila di-zoom.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isProcessingImage || !formData.imageUrl}
              className="flex-2 w-2/3 px-4 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-1 hover:shadow-[0_2px_0_rgb(180,83,9)] transition-all"
            >
              {isEdit ? "Simpan Perubahan" : "Pamerkan Karya!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>