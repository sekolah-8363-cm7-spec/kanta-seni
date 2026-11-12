import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  Star,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  User,
  Send,
  X,
  Map,
  Filter,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Award,
  CheckCircle2,
  Lock,
  Crown,
  BarChart3,
  Sparkles,
  Shield,
  Printer,
  Trash2,
  UserPlus,
  Settings,
  LogOut,
  KeyRound,
  Users,
  Palette,
  Eye,
  EyeOff,
  Brush,
  PenTool,
  Shapes,
  Frame,
  HelpCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

// --- URL Google Apps Script Anda ---
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyFr90-D1q5IcmIi-tI60BCSZ1gk7nySgSXPN44WBcoDVp0RK2BBhvWaLoLe5k1p_Z1/exec";

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

// Pilih 3 soalan rawak berbeza mengikut tahap (mengutamakan kepelbagaian kategori Unsur Seni, Hal Benda, Mesej Karya)
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

export default function App() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("laman-utama");

  // --- State Pengesahan Padam Karya ---
  const [artworkToDelete, setArtworkToDelete] = useState<any>(null);

  // --- State Pop-up & Zoom Karya ---
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  // --- State Penapis (Filter) Galeri ---
  const [selectedYear, setSelectedYear] = useState("Semua");
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

  // --- State Pasport Pengkritik ---
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);
  const [passportNotice, setPassportNotice] = useState<string | null>(null);
  const [activePassport, setActivePassport] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("kantaseni_active_passport");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [nameUsageHistory, setNameUsageHistory] = useState<
    Record<string, number>
  >(() => {
    try {
      const saved = localStorage.getItem("kantaseni_passport_usage");
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
    if (activePassport) {
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
      "kantaseni_passport_usage",
      JSON.stringify(nameUsageHistory)
    );
  }, [nameUsageHistory]);

  // --- Tarik Data Karya & Data Staf dari Google Sheets (Selaras dengan Code.gs) ---
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
        if (staffData && staffData.adminCreds && staffData.adminCreds.username) {
          setAdminCredentials(staffData.adminCreds);
        }
      })
      .catch((error) => {
        console.error("Ralat memuat turun data guru:", error);
      });
  }, []);

  const sendToSheet = (action: string, payload: any) => {
    fetch(`${SCRIPT_URL}?action=${action}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    }).catch((err) => console.error("Ralat menghantar data:", err));
  };

  const normalizeName = (name: string) =>
    name.trim().toLowerCase().replace(/\s+/g, " ");

  const toTitleCase = (str: string) =>
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

  // --- SEMAKAN MERENTAS PERANTI (GLOBAL DARI GOOGLE SHEETS) ---
  const getGlobalUsageByName = (fullName: string) => {
    const norm = normalizeName(fullName);
    if (!norm) return { totalUsed: 0, interactedIds: [] as string[] };

    const targetUserKey = `passport-${norm}`;
    const interactedArtIds = new Set<string>();

    artworks.forEach((art) => {
      const hasLiked =
        Array.isArray(art.likes) && art.likes.includes(targetUserKey);
      const hasCommented =
        Array.isArray(art.comments) &&
        art.comments.some(
          (c: any) => c.authorName && normalizeName(c.authorName) === norm
        );

      if (hasLiked || hasCommented) {
        interactedArtIds.add(art.id);
      }
    });

    const recordedLocal = nameUsageHistory[norm] || 0;
    const totalUsed = Math.max(recordedLocal, interactedArtIds.size);

    return {
      totalUsed,
      interactedIds: Array.from(interactedArtIds),
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
          if (!criticMap[norm]) {
            criticMap[norm] = {
              normName: norm,
              displayName: c.authorName.trim(),
              className: c.authorClass || "-",
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
          }
          criticMap[norm].artworksReviewed.add(art.id);
        });
      }

      if (Array.isArray(art.likes)) {
        art.likes.forEach((likeKey: string) => {
          if (typeof likeKey === "string" && likeKey.startsWith("passport-")) {
            const norm = normalizeName(likeKey.replace("passport-", ""));
            if (!norm) return;
            if (!criticMap[norm]) {
              criticMap[norm] = {
                normName: norm,
                displayName: toTitleCase(norm),
                className: "-",
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
  }, [artworks]);

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

  // --- Segerakkan Pasport Aktif dengan Data Terkini dari Google Sheets ---
  useEffect(() => {
    if (!loading && activePassport && artworks.length > 0) {
      const { totalUsed, interactedIds } = getGlobalUsageByName(
        activePassport.fullName
      );
      if (totalUsed >= 3) {
        setActivePassport(null);
      } else if (totalUsed > activePassport.usedCount) {
        setActivePassport((prev: any) =>
          prev
            ? {
                ...prev,
                usedCount: totalUsed,
                maxAllowed: 3,
                interactedArtworkIds: Array.from(
                  new Set([...prev.interactedArtworkIds, ...interactedIds])
                ),
              }
            : null
        );
      }
    }
  }, [loading, artworks]);

  const handleRegisterPassport = (formData: {
    fullName: string;
    className: string;
    email: string;
  }) => {
    const { totalUsed, interactedIds } = getGlobalUsageByName(
      formData.fullName
    );

    if (totalUsed >= 3) {
      return {
        success: false,
        message: `Maaf, nama "${formData.fullName.trim()}" telah digunakan dan mencapai had maksimum 3 karya (rekod disahkan daripada sistem).`,
      };
    }

    const remainingQuota = 3 - totalUsed;
    const isReturningUser = totalUsed > 0;

    const syncedPassport = {
      fullName: formData.fullName.trim(),
      className: formData.className,
      email: formData.email.trim(),
      usedCount: totalUsed,
      maxAllowed: 3,
      interactedArtworkIds: interactedIds,
      issuedAt: Date.now(),
    };

    setActivePassport(syncedPassport);
    setIsPassportModalOpen(false);

    if (isReturningUser) {
      setPassportNotice(
        `Selamat kembali, ${syncedPassport.fullName}! Rekod lama anda ditemui. Baki kuota anda ialah ${remainingQuota}/3 karya.`
      );
    } else {
      setPassportNotice(
        `Pasport berjaya dijana untuk ${syncedPassport.fullName}! Anda mempunyai ${remainingQuota}/3 kuota apresiasi.`
      );
    }

    setTimeout(() => setPassportNotice(null), 6000);
    return { success: true, isReturningUser, remainingQuota };
  };

  const consumePassportQuota = (artworkId: string): boolean => {
    if (!activePassport) {
      setPassportNotice(
        "Sila daftar 'Dapatkan Passport Saya!' di Sudut Apresiasi terlebih dahulu sebelum memberi bintang atau komen."
      );
      setActiveTab("sudut-apresiasi");
      setIsPassportModalOpen(true);
      return false;
    }

    const { interactedIds } = getGlobalUsageByName(activePassport.fullName);
    const allInteracted = new Set([
      ...activePassport.interactedArtworkIds,
      ...interactedIds,
    ]);

    if (allInteracted.has(artworkId)) {
      return true;
    }

    if (allInteracted.size >= 3) {
      setActivePassport(null);
      setPassportNotice("Kuota 3 penggunaan Pasport anda telah tamat!");
      setActiveTab("sudut-apresiasi");
      return false;
    }

    allInteracted.add(artworkId);
    const updatedUsedCount = allInteracted.size;
    const updatedIds = Array.from(allInteracted);
    const norm = normalizeName(activePassport.fullName);

    setNameUsageHistory((prev) => ({
      ...prev,
      [norm]: updatedUsedCount,
    }));

    if (updatedUsedCount >= 3) {
      setActivePassport(null);
      setPassportNotice(
        "Tahniah! Anda telah melengkapkan semua 3/3 misi Pasport anda."
      );
      setTimeout(() => setPassportNotice(null), 6000);
    } else {
      setActivePassport({
        ...activePassport,
        usedCount: updatedUsedCount,
        maxAllowed: 3,
        interactedArtworkIds: updatedIds,
      });
    }

    return true;
  };

  // --- Actions ---
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
    sendToSheet("add", createdArt);
  };

  const toggleLike = (artworkId: string, currentLikes: string[]) => {
    const userKey = activePassport
      ? `passport-${normalizeName(activePassport.fullName)}`
      : visitorId;
    const hasLiked = currentLikes.includes(userKey);

    if (!hasLiked) {
      const allowed = consumePassportQuota(artworkId);
      if (!allowed) return;
    }

    const newLikes = hasLiked
      ? currentLikes.filter((id) => id !== userKey)
      : [...currentLikes, userKey];

    setArtworks((prev) =>
      prev.map((art) => {
        if (art.id === artworkId) {
          const updated = { ...art, likes: newLikes };
          sendToSheet("update", updated);
          if (selectedArtwork && selectedArtwork.id === artworkId) {
            setSelectedArtwork(updated);
          }
          return updated;
        }
        return art;
      })
    );
  };

  // Menyokong 3 kaedah komen: ulasan bebas, jawapan 3 soalan rawak berurutan, atau kedua-duanya sekali
  const addComment = (
    artworkId: string,
    commentText: string,
    currentComments: any[],
    quizAnswers?: Array<{ category: string; question: string; answer: string }>
  ) => {
    const cleanFreeText = commentText.trim();
    const hasQuizAnswers = Array.isArray(quizAnswers) && quizAnswers.length > 0;
    if (!cleanFreeText && !hasQuizAnswers) return;

    const allowed = consumePassportQuota(artworkId);
    if (!allowed) return;

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
      authorName: activePassport
        ? activePassport.fullName
        : "Penjelajah Misteri",
      authorClass: activePassport ? activePassport.className : "",
      text: formattedText,
      timestamp: Date.now(),
    };

    setArtworks((prev) =>
      prev.map((art) => {
        if (art.id === artworkId) {
          const updated = {
            ...art,
            comments: [...currentComments, newComment],
          };
          sendToSheet("update", updated);
          if (selectedArtwork && selectedArtwork.id === artworkId) {
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
        if (art.id === artworkId) {
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
          if (selectedArtwork && selectedArtwork.id === artworkId) {
            setSelectedArtwork(updated);
          }

          setPassportNotice(
            starPenalized
              ? `Komen oleh "${commentObj.authorName}" telah dipadam dan 1 Bintang telah ditolak sebagai penalti.`
              : `Komen oleh "${commentObj.authorName}" telah dipadam.`
          );
          setTimeout(() => setPassportNotice(null), 5000);

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
        if (art.id === artworkId) {
          const updatedLikes = (art.likes || []).filter(
            (k: string) => k !== starKeyToRemove
          );
          const updated = { ...art, likes: updatedLikes };
          sendToSheet("update", updated);
          if (selectedArtwork && selectedArtwork.id === artworkId) {
            setSelectedArtwork(updated);
          }
          setPassportNotice("1 Bintang telah berjaya dipadam daripada karya.");
          setTimeout(() => setPassportNotice(null), 4000);
          return updated;
        }
        return art;
      })
    );
  };

  const confirmDeleteArtwork = () => {
    if (!artworkToDelete) return;
    const targetId = artworkToDelete.id;
    setArtworks((prev) => prev.filter((art) => art.id !== targetId));
    sendToSheet("delete", { id: targetId });
    if (selectedArtwork && selectedArtwork.id === targetId) {
      setSelectedArtwork(null);
    }
    setArtworkToDelete(null);
  };

  // --- FUNGSI LOG MASUK STAFF (SEMAK TERUS DARI ?type=staff DI GOOGLE SHEETS) ---
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
      return { success: true };
    }

    return {
      success: false,
      message: "Nama pengguna (Username) atau kata laluan salah!",
    };
  };

  const handleStaffLogout = () => {
    setLoggedInStaff(null);
    if (activeTab === "panel-admin") {
      setActiveTab("laman-utama");
    }
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

  const filteredArtworks = artworks.filter((art) => {
    const artYear = getArtworkYear(art.createdAt);
    const matchYear = selectedYear === "Semua" || artYear === selectedYear;
    const matchClass =
      selectedClass === "Semua" || art.className === selectedClass;
    return matchYear && matchClass;
  });

  const activeUserKey = activePassport
    ? `passport-${normalizeName(activePassport.fullName)}`
    : visitorId;

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
                .animate-float-slow { animation: floatSlow 4.5s ease-in-out infinite; }
                .animate-float-reverse { animation: floatReverse 5.2s ease-in-out infinite; }
                .animate-brush-stroke { animation: brushStroke 4.8s ease-in-out infinite; }
                .animate-pop-up { animation: popInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .animate-modal-enter { animation: modalEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
                .animate-crown { animation: crownWobble 3s ease-in-out infinite; }
                .animate-star-pop { animation: starPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }

                @media print {
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-lists-area, #printable-lists-area * {
                        visibility: visible;
                    }
                    #printable-lists-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                        padding: 12px !important;
                        box-shadow: none !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>

      {/* --- HEADER --- */}
      <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-40 border-b-4 border-yellow-400 transition-all no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => setActiveTab("laman-utama")}
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

            <div className="flex items-center space-x-2 md:space-x-3">
              {activePassport ? (
                <div
                  onClick={() => setActiveTab("sudut-apresiasi")}
                  className="hidden sm:flex items-center bg-green-50 border-2 border-green-400 text-green-900 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-green-100 hover:scale-105 active:scale-95 transition-all"
                  title="Klik untuk lihat status Pasport"
                >
                  <Award className="w-4 h-4 mr-1.5 text-green-600 animate-pulse" />
                  <span className="truncate max-w-[100px]">
                    {activePassport.fullName}
                  </span>
                  <span className="ml-1.5 bg-green-600 text-white px-2 py-0.5 rounded-full">
                    {3 - activePassport.usedCount}/3
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab("sudut-apresiasi");
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
                        onClick={() =>
                          setActiveTab(
                            tabKey === "galeri-seni" ? "galeri" : tabKey
                          )
                        }
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
                  onClick={() => setActiveTab("panel-admin")}
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
                  onClick={() => setIsStaffLoginModalOpen(true)}
                  className="flex items-center bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                  title="Log Masuk Admin atau Guru Mentor"
                >
                  <Shield className="w-4 h-4 mr-1.5 text-yellow-400" />
                  <span>Admin / Guru</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFIKASI SISTEM */}
      {passportNotice && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full animate-pop-up no-print">
          <div className="bg-blue-900 text-white px-5 py-3.5 rounded-2xl shadow-lg border-2 border-yellow-400 flex items-center justify-between gap-3">
            <div className="flex items-center text-sm font-bold">
              <Award className="w-5 h-5 mr-2.5 text-yellow-400 shrink-0 animate-bounce" />
              <span>{passportNotice}</span>
            </div>
            <button
              onClick={() => setPassportNotice(null)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
                  onClick={() => setActiveTab("galeri")}
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
                      onClick={() => setSelectedArtwork(top3Artworks[1])}
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
                      onClick={() => setSelectedArtwork(top3Artworks[0])}
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
                      onClick={() => setSelectedArtwork(top3Artworks[2])}
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
                  Klik pada gambar karya untuk melihat dengan lebih besar dan
                  zoom.
                </p>
              </div>
              <div className="self-start md:self-auto text-sm font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                {filteredArtworks.length} Karya Dipaparkan
              </div>
            </div>

            {/* --- BAR PENAPIS (FILTER) --- */}
            <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border-2 border-blue-100 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center text-blue-900 font-bold text-sm shrink-0">
                  <Filter className="w-4 h-4 mr-1.5 text-blue-600" />
                  Sesi / Tahun:
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-sky-50 border-2 border-blue-200 text-blue-900 font-bold text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
                >
                  <option value="Semua">Semua Tahun</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      Tahun {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-blue-900 font-bold text-sm mr-1">
                  Kelas:
                </span>
                {classOptions.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
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
                  onClick={() => setIsAddModalOpen(true)}
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
                  {selectedYear !== "Semua"
                    ? `Tahun ${selectedYear}`
                    : "semua tahun"}
                  ).
                </p>
                <button
                  onClick={() => {
                    setSelectedYear("Semua");
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
                    key={artwork.id}
                    index={idx}
                    artwork={artwork}
                    artworkYear={getArtworkYear(artwork.createdAt)}
                    activeUserKey={activeUserKey}
                    activePassport={activePassport}
                    isStaffLoggedIn={!!loggedInStaff}
                    onLike={() => toggleLike(artwork.id, artwork.likes || [])}
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
                    onRequestDelete={() => setArtworkToDelete(artwork)}
                    onOpenPreview={() => setSelectedArtwork(artwork)}
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
                karya kegemaran (maksimum 3 karya), berikan 'Bintang' dan
                tinggalkan komen positif!
              </p>

              {activePassport && (
                <div className="max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 rounded-2xl shadow-lg border-2 border-yellow-400 text-left relative z-10 animate-pop-up">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-yellow-400 text-blue-900 px-3 py-0.5 rounded-full">
                      PASPORT AKTIF
                    </span>
                    <span className="text-xs font-bold text-blue-200">
                      Baki Kuota: {3 - activePassport.usedCount} / 3 Karya
                    </span>
                  </div>
                  <h4 className="text-xl font-black">
                    {activePassport.fullName}
                  </h4>
                  <p className="text-sm text-blue-100 font-semibold">
                    {activePassport.className}{" "}
                    {activePassport.email ? `• ${activePassport.email}` : ""}
                  </p>
                </div>
              )}

              {/* NAMA PROSES DI ATAS KOTAK LANGKAH 1 HINGGA 3 */}
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
                  onClick={() => setActiveTab("galeri")}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center"
                >
                  Kembali ke Galeri <Compass className="ml-2 w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPassportModalOpen(true)}
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
                      onClick={() => setCriticMetricFilter(tab.id as any)}
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
                              <div className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
                                <span>{critic.displayName}</span>
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
            onShowNotice={(msg: string) => {
              setPassportNotice(msg);
              setTimeout(() => setPassportNotice(null), 5000);
            }}
          />
        )}
      </main>

      {/* --- FOOTER HAK CIPTA E&J STUDIO --- */}
      <footer className="bg-white border-t-4 border-yellow-400 text-slate-600 py-5 px-4 pb-24 md:pb-5 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Palette className="w-4 h-4 text-blue-600" />
            <span>Kanta Seni — Misi Eksplorasi &amp; Jejak Bintang</span>
          </div>
          <div className="text-center sm:text-right font-semibold text-slate-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-black text-blue-800">E&amp;J Studio</span>.
            Hak Cipta Terpelihara.
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - HANYA PAPAR DI TAB GALERI */}
      {activeTab === "galeri" && (
        <div className="fixed bottom-20 md:bottom-10 right-6 md:right-10 z-50 animate-pop-up no-print">
          <button
            onClick={() => setIsAddModalOpen(true)}
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
              onClick={() => setActiveTab(tabKey)}
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
            onClick={() => setActiveTab("panel-admin")}
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
          onClose={() => setIsStaffLoginModalOpen(false)}
          onLogin={handleStaffLogin}
        />
      )}

      {/* MODAL DAFTAR PENGKRITIK (PASPORT) */}
      {isPassportModalOpen && (
        <PassportRegistrationModal
          onClose={() => setIsPassportModalOpen(false)}
          onRegister={handleRegisterPassport}
          getGlobalUsageByName={getGlobalUsageByName}
          onGoToGallery={() => {
            setIsPassportModalOpen(false);
            setActiveTab("galeri");
          }}
        />
      )}

      {/* ADD ARTWORK MODAL */}
      {isAddModalOpen && (
        <AddArtworkForm
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddArtwork}
        />
      )}

      {/* MODAL POP-UP & ZOOM KARYA */}
      {selectedArtwork && (
        <ArtworkLightboxModal
          artwork={selectedArtwork}
          artworkYear={getArtworkYear(selectedArtwork.createdAt)}
          activeUserKey={activeUserKey}
          activePassport={activePassport}
          isStaffLoggedIn={!!loggedInStaff}
          onClose={() => setSelectedArtwork(null)}
          onLike={() =>
            toggleLike(selectedArtwork.id, selectedArtwork.likes || [])
          }
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
        />
      )}

      {/* MODAL PENGESAHAN PADAM KARYA */}
      {artworkToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                onClick={() => setArtworkToDelete(null)}
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
    </div>
  );
}

// --- SUB-COMPONENTS ---

// Komponen Kotak 3 Soalan Apresiasi Rawak Berurutan (Khas untuk Pemegang Pasport)
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
            onClick={onRefreshQuestions}
            className="p-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
            title="Jana set 3 soalan rawak baharu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg border border-slate-200 transition-colors"
            title="Tutup soalan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PENUNJUK PROGRES 3 SOALAN (S1 -> S2 -> S3) */}
      <div className="flex items-center gap-1.5 mb-2.5">
        {questions.map((q, idx) => {
          const isDone = Boolean(answers[idx]);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onChangeStep(idx)}
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
              onClick={() => onSelectAnswer(currentIndex, opt)}
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
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-700 rounded-lg transition-colors"
                title={
                  showPassword ? "Sembunyikan kata laluan" : "Lihat kata laluan"
                }
                aria-label={
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

  // State Penapis Rekod Pendaftaran / Cetakan
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

  // Penapisan Senarai Pelukis Cilik mengikut Sesi & Kelas
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

  // Penapisan Senarai Pengkritik mengikut Sesi & Kelas
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

  // State Borang Daftar Guru (Admin sahaja)
  const [teacherName, setTeacherName] = useState("");
  const [teacherUser, setTeacherUser] = useState("");
  const [teacherPass, setTeacherPass] = useState("");
  const [showTeacherPass, setShowTeacherPass] = useState(false);
  const [teacherClass, setTeacherClass] = useState("Semua Kelas");

  // State Tetapan Akaun Admin (Admin sahaja)
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
    onShowNotice("Tetapan Username & Password Admin berjaya dikemas kini!");
  };

  const handlePrintLists = () => {
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
      {/* HEADER PANEL STAFF */}
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

      {/* MENU TAB KAWALAN (DISESUAIKAN MENGIKUT PERANAN ADMIN VS GURU) */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl shadow-sm border-2 border-blue-100 no-print">
        <button
          onClick={() => setSubTab("moderasi")}
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
          onClick={() => setSubTab("senarai")}
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
              onClick={() => setSubTab("guru")}
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
              onClick={() => setSubTab("tetapan")}
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

      {/* 1. TAB MODERASI KOMEN & BINTANG (ADMIN & GURU) */}
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

                    {/* SENARAI BINTANG PADA KARYA INI */}
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

                    {/* SENARAI KOMEN PADA KARYA INI */}
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

      {/* 2. TAB SENARAI NAMA PELUKIS CILIK & PENGKRITIK + BUTANG TAPISAN & CETAK */}
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

          {/* BAR BUTANG TAPISAN SESI / TAHUN & KELAS UNTUK CETAKAN */}
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
                    onClick={() => setPrintYearFilter(yr)}
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
                  onClick={() => setPrintClassFilter(cls)}
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

          {/* KAWASAN SLIP CETAKAN BERTEMAKAN KANTA SENI */}
          <div
            id="printable-lists-area"
            className="rounded-3xl border-4 border-blue-900 overflow-hidden bg-white shadow-sm"
          >
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white p-6 border-b-4 border-yellow-400 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="bg-yellow-400 text-blue-900 p-3 rounded-2xl border-2 border-white shadow-md">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block bg-yellow-400 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      SLIP REKOD RASMI • PAMERAN MAYA PSV
                    </div>
                    <h2 className="text-2xl font-black tracking-tight leading-none">
                      GALERI KANTA SENI
                    </h2>
                    <p className="text-xs text-blue-100 font-semibold mt-1">
                      Misi Eksplorasi &amp; Jejak Bintang — Rekod Pelukis Cilik
                      &amp; Pengkritik
                    </p>
                  </div>
                </div>

                <div className="bg-blue-950/70 border border-yellow-400/60 rounded-2xl px-4 py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-blue-200">Tempoh / Sesi:</span>
                    <span className="font-black text-yellow-300">
                      {printYearFilter === "Semua"
                        ? "Semua Sesi"
                        : `Tahun ${printYearFilter}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-blue-200">Kelas / Kategori:</span>
                    <span className="font-black text-yellow-300">
                      {printClassFilter}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-blue-200">Tarikh Cetakan:</span>
                    <span className="font-bold text-white">
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
                              {art.likes?.length || 0} ★
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
                                {critic.displayName}
                              </td>
                              <td className="py-2.5 px-4 text-slate-700 font-medium">
                                {critic.className}
                              </td>
                              <td className="py-2.5 px-4 text-center font-bold text-blue-700">
                                {critic.commentsCount}
                              </td>
                              <td className="py-2.5 px-4 text-center font-black text-amber-600">
                                {critic.likesCount} ★
                              </td>
                            </tr>
                          )
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs text-slate-600">
                <div>
                  <p className="font-bold text-blue-900">
                    Kanta Seni — Sistem Galeri Maya &amp; Apresiasi PSV
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    &copy; {new Date().getFullYear()} E&amp;J Studio. Hak Cipta
                    Terpelihara.
                  </p>
                </div>
                <div className="w-56 pt-6 border-b border-slate-400 text-center">
                  <span className="font-bold text-slate-700 block">
                    Pengesahan Guru / Pentadbir
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB DAFTAR GURU MENTOR (HANYA ADMIN) */}
      {subTab === "guru" && isAdmin && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-blue-100 space-y-6 animate-pop-up">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Daftar Akaun Guru (Mentor Galeri)
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Guru yang didaftarkan akan diselaraskan secara automatik ke
              semua telefon/peranti lain dan diberi akses memadam komen/bintang
              murid serta mencetak senarai nama.
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
                  onClick={() => setShowTeacherPass((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-700"
                  title={
                    showTeacherPass
                      ? "Sembunyikan kata laluan"
                      : "Lihat kata laluan"
                  }
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
                Simpan &amp; Daftar Guru
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

      {/* 4. TAB TETAPAN USERNAME & PASSWORD ADMIN (HANYA ADMIN) */}
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
                  onClick={() => setShowAdminPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-700"
                  title={
                    showAdminPass
                      ? "Sembunyikan kata laluan"
                      : "Lihat kata laluan"
                  }
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

function PassportRegistrationModal({
  onClose,
  onRegister,
  getGlobalUsageByName,
  onGoToGallery,
}: any) {
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    isReturningUser: boolean;
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

  const { totalUsed } = fullName.trim()
    ? getGlobalUsageByName(fullName)
    : { totalUsed: 0 };
  const remainingForName = Math.max(0, 3 - totalUsed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Sila isi Nama Penuh anda.");
      return;
    }
    if (!className) {
      setErrorMsg("Sila pilih Kelas / Kategori anda.");
      return;
    }

    const result = onRegister({ fullName, className, email });
    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setSuccessInfo({
        isReturningUser: result.isReturningUser,
        remainingQuota: result.remainingQuota,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 border-yellow-400 animate-modal-enter">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <Award className="absolute top-1 right-10 w-20 h-20 text-blue-500 opacity-30 animate-float-slow" />
          <div>
            <h3 className="text-2xl font-black flex items-center relative z-10">
              <Award className="mr-2 text-yellow-400" />
              Daftar Pengkritik
            </h3>
            <p className="text-xs text-blue-100 font-medium mt-0.5 relative z-10">
              Had penggunaan: 3 karya bagi setiap nama
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {successInfo ? (
          <div className="p-8 text-center animate-pop-up">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2">
              {successInfo.isReturningUser
                ? "Pasport Dipulihkan!"
                : "Pasport Siap!"}
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Selamat bertugas,{" "}
              <span className="font-bold text-blue-900">{fullName}</span> (
              {className}).
              {successInfo.isReturningUser
                ? ` Rekod anda sebelum ini telah diselaraskan. Anda mempunyai baki `
                : ` Anda boleh memberi bintang dan komen pada `}
              <span className="font-bold text-green-700">
                {successInfo.remainingQuota} karya
              </span>
              .
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
            <div className="text-xs text-red-600 font-bold bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              * Menunjukkan soalan yang wajib diisi
            </div>

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
                <p
                  className={`text-xs font-bold mt-1.5 ${
                    remainingForName > 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {remainingForName === 3 &&
                    "Nama baharu: Baki 3 daripada 3 kuota tersedia."}
                  {remainingForName > 0 &&
                    remainingForName < 3 &&
                    `Rekod sedia ada ditemui: Baki ${remainingForName} daripada 3 kuota.`}
                  {remainingForName === 0 &&
                    "Had 3 penggunaan pasport untuk nama ini telah penuh."}
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
                    {item}
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
                disabled={fullName.trim().length > 1 && remainingForName === 0}
                className="w-2/3 px-4 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-0.5 transition-all"
              >
                {totalUsed > 0 && remainingForName > 0
                  ? "Sambung Pasport!"
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
  isStaffLoggedIn,
  onLike,
  onComment,
  onDeleteComment,
  onRequestDelete,
  onOpenPreview,
  index = 0,
}: any) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [starBurst, setStarBurst] = useState(false);

  // State 3 Soalan Apresiasi Rawak Berurutan (untuk pemegang Pasport)
  const criticStage = getStageFromClass(activePassport?.className);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AppreciationQuestion[]>(
    () => pickThreeRandomQuestions(criticStage)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const likesCount = artwork.likes ? artwork.likes.length : 0;
  const hasLiked = artwork.likes
    ? artwork.likes.includes(activeUserKey)
    : false;
  const commentsList = artwork.comments || [];

  const handleLikeClick = () => {
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 500);
    onLike();
  };

  const handleToggleQuiz = () => {
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRequestDelete();
        }}
        title="Padam Karya"
        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:bg-red-600 hover:scale-110 shadow-md"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        onClick={onOpenPreview}
        title="Klik untuk besarkan & zoom karya"
        className="relative overflow-hidden bg-slate-100 rounded-t-3xl border-b-4 border-blue-400 cursor-zoom-in group/img"
      >
        <img
          src={
            artwork.imageUrl ||
            "https://placehold.co/600x400/e2e8f0/475569?text=Tiada+Gambar"
          }
          alt={artwork.title}
          onError={handleImageError}
          className="w-full h-auto object-cover min-h-[200px] transition-transform duration-500 ease-out group-hover/img:scale-105"
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

        <div className="flex items-center space-x-4 border-t border-slate-100 pt-4">
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

          <button
            onClick={() => setShowComments(!showComments)}
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
              commentsList.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-sm transition-all hover:border-blue-200"
                >
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="font-bold text-blue-900 text-xs">
                      {comment.authorName || "Penjelajah Misteri"}
                      {comment.authorClass ? ` (${comment.authorClass})` : ""}
                    </div>
                    <div className="flex items-center gap-1.5">
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
                  <p className="text-slate-700 text-sm whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* KOTAK 3 SOALAN RAWAK PELBAGAI PILIHAN BERURUTAN */}
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

function ArtworkLightboxModal({
  artwork,
  artworkYear,
  activeUserKey,
  activePassport,
  isStaffLoggedIn,
  onClose,
  onLike,
  onComment,
  onDeleteComment,
}: any) {
  const [zoom, setZoom] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [starBurst, setStarBurst] = useState(false);

  // State 3 Soalan Apresiasi Rawak Berurutan (untuk pemegang Pasport)
  const criticStage = getStageFromClass(activePassport?.className);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<AppreciationQuestion[]>(
    () => pickThreeRandomQuestions(criticStage)
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const likesCount = artwork.likes ? artwork.likes.length : 0;
  const hasLiked = artwork.likes
    ? artwork.likes.includes(activeUserKey)
    : false;
  const commentsList = artwork.comments || [];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.75));
  const handleResetZoom = () => setZoom(1);

  const handleLikeClick = () => {
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 500);
    onLike();
  };

  const handleToggleQuiz = () => {
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
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl border-4 border-yellow-400 flex flex-col md:flex-row relative animate-modal-enter"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-slate-800/80 hover:bg-slate-900 hover:scale-110 text-white p-2 rounded-full shadow-lg transition-all"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* BAHAGIAN GAMBAR KARYA */}
        <div className="md:w-3/5 bg-slate-900 relative flex flex-col items-center justify-center min-h-[220px] md:min-h-[500px] max-h-[38vh] md:max-h-[92vh] shrink-0 overflow-hidden">
          <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
            <img
              src={
                artwork.imageUrl ||
                "https://placehold.co/600x400/e2e8f0/475569?text=Tiada+Gambar"
              }
              alt={artwork.title}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
              className="max-h-[32vh] md:max-h-[65vh] w-auto object-contain transition-transform duration-200 rounded-lg select-none"
            />
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.75}
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-40 transition-colors"
              title="Kecilkan (Zoom Out)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-white min-w-[48px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-40 transition-colors"
              title="Besarkan (Zoom In)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-slate-600 mx-0.5"></div>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-white hover:text-yellow-400 transition-colors"
              title="Saiz Asal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BAHAGIAN MAKLUMAT, SOALAN & KOMEN (BOLEH SKROL PENUH KE BAWAH) */}
        <div className="md:w-2/5 flex-1 min-h-0 flex flex-col overflow-hidden bg-white">
          <div className="p-4 md:p-5 border-b border-slate-100 shrink-0">
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

            <div className="flex items-center space-x-4 pt-2.5 border-t border-slate-100">
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
              <div className="flex items-center space-x-1.5 text-slate-400 font-bold">
                <MessageCircle className="w-6 h-6" />
                <span>
                  {commentsList.length > 0 ? commentsList.length : "Komen"}
                </span>
              </div>
            </div>
          </div>

          {/* KAWASAN SKROL PENUH UNTUK KOTAK SOALAN & SENARAI KOMEN */}
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

            {/* KOTAK 3 SOALAN RAWAK PELBAGAI PILIHAN BERURUTAN (DALAM RUANG SKROL PENUH) */}
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
              commentsList.map((comment: any) => (
                <div
                  key={comment.id}
                  className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-sm animate-pop-up"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-blue-900 text-xs">
                      {comment.authorName || "Penjelajah Misteri"}
                      {comment.authorClass ? ` (${comment.authorClass})` : ""}
                    </div>
                    <div className="flex items-center gap-1.5">
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
                  <p className="text-slate-700 whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              ))
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

function AddArtworkForm({ onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    title: "",
    studentName: "",
    className: "Tahun 1",
    imageUrl: "",
  });

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
    onSubmit(formData);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 350;
        const MAX_HEIGHT = 350;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.4);
        setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 border-yellow-400 animate-modal-enter">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <Star className="absolute top-2 right-10 w-16 h-16 text-blue-500 opacity-30 animate-float-slow" />
          <h3 className="text-2xl font-black flex items-center relative z-10">
            <ImageIcon className="mr-2 text-yellow-400" />
            Tambah Karya
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
              Muat Naik Gambar Karya
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex-1 w-full cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 hover:bg-blue-100 hover:border-blue-400 transition-colors rounded-xl p-4 text-center text-blue-700 font-medium relative overflow-hidden group">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Klik untuk Pilih Gambar</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!formData.imageUrl}
                />
              </label>

              {formData.imageUrl ? (
                <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-yellow-400 shrink-0 shadow-md relative animate-pop-up">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1 font-bold">
                    BERJAYA
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-xl bg-slate-100 border-2 border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                  <span className="text-xs font-bold px-2 text-center">
                    Tiada Gambar
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center">
              <Compass className="w-3 h-3 mr-1" />
              Gambar akan dikecilkan saiznya secara automatik.
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
              className="flex-2 w-2/3 px-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-1 hover:shadow-[0_2px_0_rgb(180,83,9)] transition-all"
            >
              Pamerkan Karya!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
