import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Compass,
  Star,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  User,
  Send,
  X,
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
  ChevronLeft,
  Link2,
  Upload,
  Pencil,
  Calendar,
  Move,
  Volume2,
  VolumeX,
  DoorOpen,
  MoreHorizontal,
  CloudCheck,
  Loader2,
  CornerDownRight,
  Reply,
} from "lucide-react";

// --- URL Google Apps Script Anda ---
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyFr90-D1q5IcmIi-tI60BCSZ1gk7nySgSXPN44WBcoDVp0RK2BBhvWaLoLe5k1p_Z1/exec";

// --- TETAPAN CLOUDINARY CDN (GANTI DENGAN MAKLUMAT AKAUN ANDA) ---
const CLOUDINARY_CLOUD_NAME = "sgvjhuvn"; // Contoh: "dkantaseni123"
const CLOUDINARY_UPLOAD_PRESET = "kantaseni_unsigned";
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

// --- Helper: Optimasi URL Cloudinary (Thumbnail Galeri vs HD Zoom Juri) ---
const getOptimizedArtworkUrl = (
  rawUrl: string,
  mode: "thumb" | "hd" = "thumb"
): string => {
  const formatted = formatDirectImageUrl(rawUrl || "");
  if (!formatted) return "";

  if (
    formatted.includes("res.cloudinary.com") &&
    formatted.includes("/upload/") &&
    !formatted.includes("/upload/w_") &&
    !formatted.includes("/upload/q_")
  ) {
    const transform =
      mode === "thumb" ? "w_700,q_auto,f_auto" : "q_auto:best,f_auto";
    return formatted.replace("/upload/", `/upload/${transform}/`);
  }
  return formatted;
};

// 5 Bidang Utama Pendidikan Seni Visual KSSR (Termasuk Seni Digital)
const PSV_FIELDS = [
  "Menggambar",
  "Corak dan Rekaan",
  "Binaan 3D",
  "Kraf Tradisional",
  "Seni Digital",
] as const;

type PsvFieldType = (typeof PSV_FIELDS)[number];

const normalizePsvField = (val: string): PsvFieldType => {
  const s = String(val || "").trim();
  const low = s.toLowerCase();
  if (low.includes("digital")) return "Seni Digital";
  if (low.includes("gambar")) return "Menggambar";
  if (low.includes("corak") || low.includes("rekaan"))
    return "Corak dan Rekaan";
  if (low.includes("bentuk") || low.includes("binaan")) return "Binaan 3D";
  if (low.includes("kraf") || low.includes("tradisional"))
    return "Kraf Tradisional";
  return (PSV_FIELDS as readonly string[]).includes(s)
    ? (s as PsvFieldType)
    : "Menggambar";
};

// Pemetaan Media / Bahan & Teknik mengikut Bidang PSV KSSR
// Pemetaan Media & Bahan Umum mengikut Bidang PSV (Mesra Murid Sekolah Rendah)
const MEDIA_BY_FIELD: Record<string, string[]> = {
  Menggambar: [
    "Media Kering (Pensel / Pensel Warna / Krayon / Oil Pastel)",
    "Media Kering (Pen Marker / Pen Gel / Arang)",
    "Media Basah (Cat Air / Cat Poster / Cat Tempera)",
    "Media Basah (Cat Akrilik / Dakwat)",
    "Kertas Warna / Majalah / Surat Khabar / Gam",
    "Bahan Alam & Terbuang (Daun Kering / Biji-bijian / Butang)",
    "Lilin / Krayon & Cat Air (Campuran Media)",
  ],
  "Corak dan Rekaan": [
    "Media Basah (Cat Air / Cat Poster / Pewarna Makanan)",
    "Media Kering (Pensel Warna / Krayon / Oil Pastel / Marker)",
    "Kertas Warna / Kertas Lukisan / Kad Manila",
    "Bahan Alam (Sayuran / Daun / Kentang / Bendi)",
    "Alat Harian (Straw / Berus Gigi / Span / Benang / Putik Kapas)",
    "Tisu / Kain Kapas / Tali Rafia & Pewarna",
    "Lilin & Cat Air / Cat Minyak",
  ],
  "Binaan 3D": [
    "Kertas / Kad Manila / Kadbod / Kotak Terpakai",
    "Tanah Liat / Plastisin / Doh Tepung",
    "Bahan Terbuang (Botol Plastik / Cawan Kertas / Tin / Penutup Botol)",
    "Batang Aiskrim / Lidi Satay / Penyedut Minuman (Straw)",
    "Kain / Stoking / Benang Bulu / Kapas",
    "Dawai Lembut / Aluminium Foil / Tali",
    "Cat Poster / Cat Akrilik / Kertas Warna (Kemasan Binaan)",
  ],
  "Kraf Tradisional": [
    "Kertas Warna / Kad Manila / Kertas Lukisan",
    "Tanah Liat / Plastisin",
    "Kayu / Buluh / Rotan / Lidi",
    "Kain Putih / Kain Batik / Benang / Tali",
    "Lilin / Krayon & Pewarna Batik / Cat Air",
    "Manik / Labuci / Butang / Reben",
    "Kadbod / Kotak / Aluminium Foil / Cat Poster",
  ],
  "Seni Digital": [
    "Aplikasi Reka Grafik (Canva / Adobe Express)",
    "AI Generatif (Gemini / NotebookLM / Image Generator)",
    "Perisian Melukis (MS Paint / Paint 3D / Tux Paint)",
    "Aplikasi Lukisan Tablet/Telefon (ibis Paint / Sketchbook / Procreate)",
    "Persembahan & Poster Digital (PowerPoint / Google Slides)",
    "Penyunting Foto & Kolaj Digital (CapCut / Snapseed / Picsart)",
    "Peranti Digital (Komputer / Tablet / Telefon Pintar / Stylus)",
  ],
};

// Helper untuk memisahkan & menggabungkan Media + Cerita Karya di dalam medan description
const formatMediaAndStory = (media: string, story: string): string => {
  const cleanMedia = media.trim();
  const cleanStory = story.trim();
  if (cleanMedia && cleanStory) return `[Media: ${cleanMedia}]\n${cleanStory}`;
  if (cleanMedia) return `[Media: ${cleanMedia}]`;
  return cleanStory;
};

const parseMediaAndStory = (
  rawDescription?: string
): { media: string; story: string } => {
  const desc = String(rawDescription || "").trim();
  const match = desc.match(/^\[Media:\s*(.+?)\](?:\r?\n([\s\S]*))?$/);
  if (match) {
    return {
      media: match[1].trim(),
      story: (match[2] || "").trim(),
    };
  }
  return { media: "", story: desc };
};

type AppreciationQuestion = {
  id?: string;
  field?: string;
  category: string;
  question: string;
  options: string[];
};
const APPRECIATION_QUESTIONS_BY_FIELD: Record<
  PsvFieldType,
  {
    tahap1: AppreciationQuestion[];
    tahap2: AppreciationQuestion[];
  }
> = {
  Menggambar: {
    tahap1: [
      {
        id: "mg-t1-1",
        field: "Menggambar",
        category: "Hal Benda",
        question: "1. Apakah objek yang kamu nampak dalam karya ini?",
        options: [
          "Alam semula jadi seperti pokok, bunga, gunung, awan atau laut",
          "Hidupan atau haiwan seperti rama-rama, ikan, burung atau kucing",
          "Keluarga, rakan-rakan atau manusia yang sedang melakukan aktiviti",
          "Objek buatan manusia seperti rumah, kereta, kapal atau alam fantasi",
        ],
      },
      {
        id: "mg-t1-2",
        field: "Menggambar",
        category: "Unsur Seni",
        question: "2. Apakah warna yang terdapat dalam karya ini?",
        options: [
          "Warna asas yang terang seperti merah, biru dan kuning",
          "Warna sekunder yang ceria seperti hijau, jingga dan ungu",
          "Gabungan warna panas (cerah) dan warna sejuk (tenang)",
          "Pelbagai warna yang harmoni dan menarik perhatian mata",
        ],
      },
      {
        id: "mg-t1-3",
        field: "Menggambar",
        category: "Unsur Seni",
        question: "3. Apakah jenis garisan yang kamu dapat lihat?",
        options: [
          "Garisan lurus, menegak dan melintang pada objek",
          "Garisan melengkung dan beralun yang lembut",
          "Garisan beralun, zigzag dan garisan putus-putus",
          "Gabungan pelbagai jenis garisan tebal dan nipis",
        ],
      },
      {
        id: "mg-t1-4",
        field: "Menggambar",
        category: "Hal Benda",
        question: "4. Apakah tajuk yang sesuai untuk karya ini?",
        options: [
          "Keindahan Alam Semula Jadi di Sekeliling Kita",
          "Suasana Ceria Bersama Keluarga dan Rakan",
          "Dunia Haiwan dan Hidupan yang Comel",
          "Imaginasi Kreatif dan Warna-Warni Kehidupan",
        ],
      },
      {
        id: "mg-t1-5",
        field: "Menggambar",
        category: "Media & Bahan",
        question:
          "5. Apakah bahan yang digunakan untuk menghasilkan karya ini?",
        options: [
          "Pensel warna, krayon atau pen penanda di atas kertas lukisan",
          "Warna air atau warna poster menggunakan berus lukisan",
          "Kertas warna, majalah lama dan gam untuk tampalan (kolaj)",
          "Gabungan bahan kering (krayon) dan bahan basah (warna air)",
        ],
      },
      {
        id: "mg-t1-6",
        field: "Menggambar",
        category: "Kreativiti",
        question:
          "6. Bahagian manakah yang paling kamu suka dalam karya ini? Mengapa?",
        options: [
          "Objek utama di bahagian tengah kerana bentuknya sangat kemas dan jelas",
          "Bahagian latar belakang kerana warnanya sangat cantik dan ceria",
          "Perincian corak kecil pada objek kerana nampak sangat kreatif",
          "Keseluruhan gambar kerana susunannya seimbang dan menarik",
        ],
      },
      {
        id: "mg-t1-7",
        field: "Menggambar",
        category: "Mesej",
        question: "7. Apakah perasaan kamu apabila melihat karya ini?",
        options: [
          "Saya berasa sangat gembira dan ceria melihat warna-warnanya",
          "Saya berasa tenang dan damai seperti berada di alam semula jadi",
          "Saya berasa teruja dan kagum dengan kreativiti pengkarya",
          "Saya berasa bangga dan bersemangat untuk melukis juga",
        ],
      },
      {
        id: "mg-t1-8",
        field: "Menggambar",
        category: "Mesej",
        question: "8. Apakah mesej yang ingin disampaikan melalui karya ini?",
        options: [
          "Kita mestilah menyayangi dan menjaga keindahan alam sekitar",
          "Kasih sayang dan kemesraan bersama keluarga serta rakan-rakan",
          "Menghargai hidupan dan haiwan peliharaan di sekeliling kita",
          "Kreativiti dan imaginasi dapat dikongsi melalui lukisan yang indah",
        ],
      },
    ],
    tahap2: [
      {
        id: "mg-t2-1",
        field: "Menggambar",
        category: "Unsur Seni",
        question:
          "1. Bagaimanakah penggunaan unsur seni seperti garisan, rupa, warna dan jalinan membantu menghasilkan karya yang menarik?",
        options: [
          "Olahan ton warna cerah ke gelap mewujudkan kesan bentuk dan pencahayaan yang hidup",
          "Gabungan garisan dan jalinan tampak memperincikan tekstur permukaan setiap objek",
          "Rupa organik dan geometri digabungkan dengan seimbang untuk membina struktur gambar",
          "Kontra warna panas dan sejuk menjadikan subjek utama lebih menonjol berbanding latar",
        ],
      },
      {
        id: "mg-t2-2",
        field: "Menggambar",
        category: "Prinsip Rekaan",
        question:
          "2. Apakah prinsip rekaan yang paling dominan dalam karya ini? Berikan alasan.",
        options: [
          "Penegasan, kerana subjek utama diletakkan di titik fokus dengan warna yang paling terang",
          "Imbangan (simetri/tidak simetri), kerana taburan objek kiri dan kanan kelihatan stabil",
          "Kesatuan dan harmoni, kerana semua elemen warna dan bentuk saling melengkapi tema",
          "Kepelbagaian, kerana penggunaan pelbagai saiz rupa, garisan dan ton warna mengelakkan kebosanan",
        ],
      },
      {
        id: "mg-t2-3",
        field: "Menggambar",
        category: "Unsur Seni",
        question:
          "3. Bagaimanakah pengkarya menggunakan ruang untuk menghasilkan kesan kedalaman dalam karya?",
        options: [
          "Objek di ruang hadapan dilukis lebih besar dan jelas berbanding objek di ruang belakang",
          "Penggunaan teknik pertindihan objek mewujudkan jarak antara ruang hadapan, tengah dan belakang",
          "Perubahan ton warna yang semakin pudar pada latar belakang memberi ilusi perspektif jauh",
          "Pembahagian garisan ufuk yang kemas memisahkan ruang tanah/air dengan ruang langit",
        ],
      },
      {
        id: "mg-t2-4",
        field: "Menggambar",
        category: "Media & Bahan",
        question:
          "4. Sejauh manakah pemilihan media dan teknik sesuai dengan tema karya yang dihasilkan?",
        options: [
          "Sangat sesuai kerana kawalan sapuan warna dan teknik berjaya menghidupkan suasana tema",
          "Sesuai kerana media yang dipilih memudahkan pengkarya menghasilkan kesan jalinan dan ton",
          "Sangat berkesan kerana gabungan teknik campuran menyerlahkan lagi perincian subjek utama",
          "Sesuai dengan tahap kemahiran murid dan berjaya menyampaikan idea secara visual",
        ],
      },
      {
        id: "mg-t2-5",
        field: "Menggambar",
        category: "Pengkritikan",
        question:
          "5. Apakah kekuatan dan kelemahan yang terdapat pada karya ini?",
        options: [
          "Kekuatan pada pemilihan warna yang harmoni dan komposisi kemas; ruang latar boleh diperincikan lagi",
          "Kekuatan pada lakaran objek yang jelas dan kreatif; kemasan ton cahaya dan bayang boleh ditingkatkan",
          "Kekuatan pada idea penceritaan yang menarik; kontra antara objek utama dan latar boleh dikuatkan",
          "Kekuatan pada ketelitian garisan dan jalinan; kebersihan sapuan warna di bahagian tepi boleh diperbaiki",
        ],
      },
      {
        id: "mg-t2-6",
        field: "Menggambar",
        category: "Mesej",
        question:
          "6. Apakah mesej atau idea yang ingin disampaikan oleh pengkarya? Adakah mesej tersebut berjaya disampaikan?",
        options: [
          "Mesej kelestarian dan keindahan alam sekitar; sangat berjaya disampaikan melalui visual yang segar",
          "Mesej nilai murni, perpaduan dan kasih sayang; berjaya disampaikan melalui ekspresi dan aksi subjek",
          "Mesej penghayatan budaya dan warisan; berjaya melalui pemilihan motif serta suasana latar karya",
          "Mesej imaginasi dan inovasi masa hadapan; berjaya menarik perhatian pemerhati untuk berfikir",
        ],
      },
      {
        id: "mg-t2-7",
        field: "Menggambar",
        category: "Kreativiti",
        question:
          "7. Jika kamu menjadi pengkarya, apakah penambahbaikan yang akan kamu lakukan untuk menjadikan karya ini lebih menarik?",
        options: [
          "Menambahkan kesan pencahayaan dan bayang-bayang (ton) supaya objek kelihatan lebih 3D",
          "Memperincikan jalinan tampak pada latar belakang agar ruang kosong kelihatan lebih hidup",
          "Menguatkan kontra warna pada subjek utama supaya titik tumpu (penegasan) lebih menyerlah",
          "Menambah elemen sampingan yang menyokong jalan cerita tanpa mengganggu imbangan karya",
        ],
      },
    ],
  },
  "Corak dan Rekaan": {
    tahap1: [
      {
        id: "cr-t1-1",
        field: "Corak dan Rekaan",
        category: "Hal Benda",
        question: "1. Apakah motif yang terdapat dalam corak ini?",
        options: [
          "Motif flora seperti bunga, daun dan ranting tumbuhan",
          "Motif fauna seperti rama-rama, ikan atau corak haiwan",
          "Motif geometri seperti bulatan, segi tiga dan segi empat",
          "Corak bebas seperti titisan warna, tiupan atau alunan air",
        ],
      },
      {
        id: "cr-t1-2",
        field: "Corak dan Rekaan",
        category: "Unsur Seni",
        question: "2. Apakah warna yang paling menarik dalam corak ini?",
        options: [
          "Warna merah dan kuning yang sangat cerah dan ceria",
          "Warna biru dan hijau yang kelihatan lembut dan tenang",
          "Campuran pelbagai warna terang yang menyerlahkan motif",
          "Kontra antara warna motif yang gelap dengan latar yang cerah",
        ],
      },
      {
        id: "cr-t1-3",
        field: "Corak dan Rekaan",
        category: "Prinsip Rekaan",
        question: "3. Adakah motif dalam corak ini berulang?",
        options: [
          "Ya, motif diulang secara teratur dan kemas dari kiri ke kanan",
          "Ya, motif disusun berulang dalam barisan atas dan bawah",
          "Ya, motif berulang dalam bentuk bulatan atau pancaran",
          "Tidak berulang secara tetap kerana ia corak bebas tidak terancang",
        ],
      },
      {
        id: "cr-t1-4",
        field: "Corak dan Rekaan",
        category: "Unsur Seni",
        question: "4. Apakah bentuk yang kamu dapat lihat dalam corak ini?",
        options: [
          "Bentuk rupa geometri seperti bulatan, bujur dan segi empat",
          "Bentuk rupa organik seperti kelopak bunga dan dedaun",
          "Garisan beralun, titik-titik dan bentuk abstrak yang unik",
          "Gabungan rupa geometri dan rupa organik yang tersusun rapi",
        ],
      },
      {
        id: "cr-t1-5",
        field: "Corak dan Rekaan",
        category: "Media & Bahan",
        question:
          "5. Apakah bahan yang digunakan untuk menghasilkan corak ini?",
        options: [
          "Warna air/poster dan bahan alam seperti bendi, daun atau pelepah pisang",
          "Kertas warna, gunting dan gam untuk lipatan serta guntingan",
          "Krayon atau lilin dan warna air di atas kertas lukisan",
          "Warna air dan penyedut minuman (straw) atau berus lukisan",
        ],
      },
      {
        id: "cr-t1-6",
        field: "Corak dan Rekaan",
        category: "Teknik",
        question:
          "6. Apakah teknik yang digunakan untuk menghasilkan corak ini?",
        options: [
          "Teknik capan menggunakan bahan semula jadi atau blok mudah",
          "Teknik lipatan dan guntingan kertas warna",
          "Teknik resis (krayon/lilin bersama sapuan warna air)",
          "Teknik tiupan, titisan atau pualaman (corak tidak terancang)",
        ],
      },
      {
        id: "cr-t1-7",
        field: "Corak dan Rekaan",
        category: "Mesej",
        question: "7. Di manakah corak seperti ini boleh digunakan?",
        options: [
          "Boleh dijadikan pembalut hadiah yang cantik dan ceria",
          "Boleh dijadikan kulit buku latihan atau penanda buku",
          "Boleh dijadikan hiasan kad ucapan atau beg kertas",
          "Boleh dijadikan corak pada baju, kain atau hiasan dinding",
        ],
      },
    ],
    tahap2: [
      {
        id: "cr-t2-1",
        field: "Corak dan Rekaan",
        category: "Prinsip Rekaan",
        question:
          "1. Bagaimanakah susunan motif menghasilkan corak yang menarik dan seimbang?",
        options: [
          "Susunan terancang (grid/batu-bata/cerminan) mewujudkan imbangan dan keseragaman yang kemas",
          "Pengulangan motif pada jarak yang konsisten menghasilkan irama dan pergerakan visual",
          "Keseimbangan antara rupa positif (motif) dan rupa negatif (ruang latar) mengelakkan kesesakan",
          "Susunan berpusat/jejari menarik perhatian terus ke bahagian tengah rekaan corak",
        ],
      },
      {
        id: "cr-t2-2",
        field: "Corak dan Rekaan",
        category: "Pengkritikan",
        question:
          "2. Apakah perbezaan kesan visual antara corak terancang dengan corak tidak terancang?",
        options: [
          "Corak terancang mempunyai susunan motif berulang yang sistematik; corak tidak terancang bersifat bebas dan rawak",
          "Corak terancang kelihatan lebih formal dan berstruktur, manakala corak tidak terancang menghasilkan jalinan organik yang unik",
          "Corak terancang menggunakan grid atau ukuran tertentu, manakala corak tidak terancang bergantung pada aliran media seperti pualaman atau tiupan",
          "Kedua-duanya menarik tetapi corak tidak terancang sukar diulang semula dengan bentuk yang 100% sama",
        ],
      },
      {
        id: "cr-t2-3",
        field: "Corak dan Rekaan",
        category: "Unsur Seni",
        question:
          "3. Bagaimanakah penggunaan warna menghasilkan kesan harmoni, kontra atau penegasan dalam corak ini?",
        options: [
          "Gabungan warna sekeluarga (harmoni) menjadikan keseluruhan permukaan corak sedap dipandang",
          "Penggunaan warna penggenap antara latar belakang dan motif mewujudkan kontra yang jelas",
          "Satu warna cerah diletakkan pada motif utama untuk menjadi titik penegasan dalam corak",
          "Peralihan warna panas dan sejuk memberi dinamik dan keceriaan pada rekaan",
        ],
      },
      {
        id: "cr-t2-4",
        field: "Corak dan Rekaan",
        category: "Media & Bahan",
        question:
          "4. Sejauh manakah teknik dan bahan yang digunakan sesuai untuk menghasilkan corak tersebut?",
        options: [
          "Sangat sesuai kerana sifat bahan menyerap warna dengan baik dan menghasilkan kesan corak yang jelas",
          "Sesuai kerana teknik yang dipilih membolehkan pengulangan motif dilakukan dengan kemas dan konsisten",
          "Sangat berkesan kerana alat dan bahan mudah dikawal untuk menghasilkan perincian motif",
          "Sesuai serta selamat digunakan bagi menghasilkan rekaan corak yang berkualiti",
        ],
      },
      {
        id: "cr-t2-5",
        field: "Corak dan Rekaan",
        category: "Kreativiti",
        question:
          "5. Apakah keunikan motif yang digunakan berbanding corak lain yang pernah kamu lihat?",
        options: [
          "Motif alam semula jadi telah digayakan (stilasi) menjadi bentuk moden yang ringkas tetapi menarik",
          "Gabungan unsur geometri dan organik dalam satu unit motif mencipta identiti tersendiri",
          "Kesan jalinan rawak daripada teknik yang digunakan menghasilkan corak yang eksklusif",
          "Susunan motifnya kreatif dan tidak terikat dengan susunan biasa yang sering dilihat",
        ],
      },
      {
        id: "cr-t2-6",
        field: "Corak dan Rekaan",
        category: "Mesej",
        question:
          "6. Bagaimanakah corak ini boleh diaplikasikan dalam kehidupan seharian atau produk komersial?",
        options: [
          "Boleh dicetak pada produk pembungkusan komersial seperti beg kertas, kotak hadiah dan pembalut",
          "Sesuai diaplikasikan pada rekaan tekstil seperti kain batik moden, tudung, kemeja atau langsir",
          "Boleh dijadikan corak hiasan dalaman seperti kertas dinding (wallpaper), jubin atau sarung kusyen",
          "Sesuai untuk produk alat tulis seperti kulit buku nota, fail dan penanda buku komersial",
        ],
      },
      {
        id: "cr-t2-7",
        field: "Corak dan Rekaan",
        category: "Kreativiti",
        question:
          "7. Jika kamu diberi peluang mengubah suai corak ini, apakah idea kreatif yang akan kamu tambahkan?",
        options: [
          "Menambah variasi saiz motif (kecil dan besar) untuk mewujudkan kesan irama yang lebih dinamik",
          "Menggabungkan dua teknik berbeza seperti resis dan capan bagi memperkayakan jalinan",
          "Menambah garisan sempadan (bingkai corak) supaya rekaan siap sedia untuk dijadikan produk",
          "Meneroka palet warna yang lebih kontras antara motif utama dan ruang latar",
        ],
      },
    ],
  },
  "Binaan 3D": {
    tahap1: [
      {
        id: "bn-t1-1",
        field: "Binaan 3D",
        category: "Hal Benda",
        question: "1. Apakah objek yang dihasilkan melalui binaan ini?",
        options: [
          "Model kenderaan seperti kereta, kapal terbang, roket atau bot",
          "Model bangunan, rumah mini, menara atau istana",
          "Binaan haiwan, robot, topeng muka atau boneka comel",
          "Hiasan gantung (mobail), tabung atau pemandangan mini (diorama)",
        ],
      },
      {
        id: "bn-t1-2",
        field: "Binaan 3D",
        category: "Unsur Seni",
        question: "2. Apakah bentuk yang kamu dapat lihat pada binaan ini?",
        options: [
          "Bentuk kotak (kubus dan kuboid) yang mempunyai bucu",
          "Bentuk silinder (bulat memanjang) dan bentuk kon",
          "Bentuk sfera (bulat) dan bentuk piramid",
          "Gabungan pelbagai bentuk 3D yang dicantum bersama",
        ],
      },
      {
        id: "bn-t1-3",
        field: "Binaan 3D",
        category: "Unsur Seni",
        question: "3. Apakah warna yang digunakan pada binaan ini?",
        options: [
          "Warna-warna terang dan ceria seperti merah, kuning dan biru",
          "Warna semula jadi bahan seperti coklat kotak dan putih",
          "Warna metalik atau warna gelap yang nampak moden",
          "Gabungan pelbagai warna hiasan yang menarik perhatian",
        ],
      },
      {
        id: "bn-t1-4",
        field: "Binaan 3D",
        category: "Media & Bahan",
        question:
          "4. Apakah bahan yang digunakan untuk menghasilkan binaan ini?",
        options: [
          "Bahan kitar semula seperti kotak, botol plastik dan penutup botol",
          "Kertas warna, kadbod, gam dan pita pelekat",
          "Plastisin, tanah liat atau doh yang dibentuk dengan tangan",
          "Gulungan tisu, cawan kertas, lidi dan warna poster",
        ],
      },
      {
        id: "bn-t1-5",
        field: "Binaan 3D",
        category: "Prinsip Rekaan",
        question: "5. Adakah binaan ini kelihatan kukuh?",
        options: [
          "Ya, tapaknya lebar dan binaan boleh berdiri tegak dengan stabil",
          "Ya, setiap bahagian dicantum dengan kemas dan tidak mudah tanggal",
          "Sederhana kukuh kerana diperbuat daripada kertas yang ringan",
          "Kukuh dan seimbang apabila diletakkan di atas meja",
        ],
      },
      {
        id: "bn-t1-6",
        field: "Binaan 3D",
        category: "Kreativiti",
        question: "6. Bahagian manakah yang paling menarik pada binaan ini?",
        options: [
          "Bahagian kepala atau hadapan binaan kerana perinciannya comel",
          "Bahagian hiasan warna dan corak di sekeliling badan binaan",
          "Cara bahan terbuang dicantum menjadi bentuk baharu yang kreatif",
          "Keseluruhan bentuk 3D binaan yang kemas dan menyerupai objek sebenar",
        ],
      },
      {
        id: "bn-t1-7",
        field: "Binaan 3D",
        category: "Mesej",
        question: "7. Apakah kegunaan binaan ini?",
        options: [
          "Boleh dijadikan alat permainan kreatif yang menyeronokkan",
          "Boleh dijadikan perhiasan cantik di atas meja atau bilik darjah",
          "Boleh digunakan sebagai bekas simpanan atau tabung duit",
          "Boleh digunakan sebagai alat persembahan (topeng / boneka)",
        ],
      },
    ],
    tahap2: [
      {
        id: "bn-t2-1",
        field: "Binaan 3D",
        category: "Unsur Seni",
        question:
          "1. Bagaimanakah gabungan bentuk, ruang dan jalinan mempengaruhi keindahan binaan ini?",
        options: [
          "Bentuk konkrit 3D mempunyai isi padu yang jelas dan menarik apabila dilihat dari pelbagai sudut",
          "Olahan ruang dalaman dan luaran menjadikan struktur binaan tidak kelihatan terlalu padat",
          "Jalinan sentuh daripada kepelbagaian bahan memberi variasi tekstur yang memperkayakan permukaan",
          "Gabungan ketiga-tiga unsur menjadikan binaan kelihatan realistik dan mempunyai nilai estetik tinggi",
        ],
      },
      {
        id: "bn-t2-2",
        field: "Binaan 3D",
        category: "Prinsip Rekaan",
        question:
          "2. Adakah prinsip imbangan dan kesatuan berjaya diaplikasikan dalam binaan ini? Berikan alasan.",
        options: [
          "Ya, imbangan simetri pada kiri dan kanan membolehkan binaan berdiri stabil tanpa mudah tumbang",
          "Ya, imbangan tidak simetri diolah dengan bijak melalui agihan berat bahagian yang sepadan",
          "Ya, kesatuan tercapai apabila pelbagai bahan terpakai dicantum menjadi satu bentuk objek yang utuh",
          "Sebahagiannya berjaya, namun tapak binaan boleh diperkukuhkan lagi untuk imbangan maksimum",
        ],
      },
      {
        id: "bn-t2-3",
        field: "Binaan 3D",
        category: "Media & Bahan",
        question:
          "3. Sejauh manakah pemilihan bahan mempengaruhi kekuatan dan kestabilan binaan?",
        options: [
          "Sangat mempengaruhi kerana bahan keras seperti kadbod tebal dan botol plastik menyokong struktur utama",
          "Penggunaan bahan yang lebih berat di bahagian tapak membantu merendahkan pusat graviti supaya stabil",
          "Bahan ringan seperti kertas dan span sesuai untuk bahagian atas tanpa membebankan tapak binaan",
          "Pemilihan bahan kitar semula yang tepat menjadikan binaan tahan lasak dan mesra alam",
        ],
      },
      {
        id: "bn-t2-4",
        field: "Binaan 3D",
        category: "Teknik",
        question:
          "4. Apakah kelebihan dan kekurangan teknik yang digunakan untuk menghasilkan binaan ini?",
        options: [
          "Kelebihan teknik asemblaj ialah mudah mencantum bahan sedia ada; kekurangannya memerlukan gam kuat agar tahan lama",
          "Kelebihan teknik lipatan/potongan kadbod ialah bentuk kemas; kekurangannya perlu ukuran tepat supaya simetri",
          "Kelebihan teknik luakan/picitan ialah bebas membentuk perincian; kekurangannya mengambil masa untuk kering",
          "Teknik yang dipilih sangat praktikal untuk murid, cuma kemasan sambungan boleh diperhalusi lagi",
        ],
      },
      {
        id: "bn-t2-5",
        field: "Binaan 3D",
        category: "Kreativiti",
        question:
          "5. Bagaimanakah unsur kreativiti dan inovasi dapat dikenal pasti dalam binaan ini?",
        options: [
          "Penggunaan semula bahan terbuang (3R) yang diubah suai menjadi komponen berfungsi pada model",
          "Gabungan idea tradisional dan elemen futuristik dalam reka bentuk struktur 3D",
          "Penyelesaian masalah sambungan dan hiasan tanpa bergantung kepada bahan beli siap",
          "Keaslian idea dan perincian kecil yang membezakan binaan ini daripada model biasa",
        ],
      },
      {
        id: "bn-t2-6",
        field: "Binaan 3D",
        category: "Pengkritikan",
        question:
          "6. Adakah binaan ini memenuhi fungsi atau tujuan asal penghasilannya? Jelaskan.",
        options: [
          "Ya, binaan ini berfungsi dengan baik sebagai model hiasan atau diorama yang menyampaikan maklumat",
          "Ya, binaan ini boleh digunakan secara praktikal mengikut tujuan asalnya seperti bekas serbaguna atau topeng",
          "Ya, ia berjaya menggambarkan konsep objek sebenar dalam skala mini dengan tepat dan menarik",
          "Memenuhi tujuan pembelajaran seni 3D serta berpotensi ditingkatkan lagi dari segi ketahanan guna",
        ],
      },
      {
        id: "bn-t2-7",
        field: "Binaan 3D",
        category: "Kreativiti",
        question:
          "7. Apakah cadangan penambahbaikan yang boleh menjadikan binaan ini lebih kreatif, kukuh dan berfungsi?",
        options: [
          "Menambah lapisan tapak yang lebih lebar dan berat supaya binaan lebih kukuh dan stabil",
          "Mengemaskan bahagian cantuman/gam dengan balutan kertas atau sapuan cat agar tidak kelihatan",
          "Menambah elemen mekanikal mudah (bahagian boleh gerak) atau pencahayaan kecil untuk nilai inovasi",
          "Memperincikan tekstur permukaan dan kombinasi warna kontra agar lebih menonjol dari jauh",
        ],
      },
    ],
  },
  "Kraf Tradisional": {
    tahap1: [
      {
        id: "kt-t1-1",
        field: "Kraf Tradisional",
        category: "Hal Benda",
        question: "1. Apakah nama kraf tradisional yang kamu lihat?",
        options: [
          "Kraf Batik atau Tekat yang mempunyai corak cantik",
          "Kraf Anyaman tikar atau kelarai tradisional",
          "Permainan tradisional seperti Wau Bulan atau Gasing",
          "Tembikar (Labu Sayong) atau Perhiasan Diri (Dokoh / Cucuk Sanggul)",
        ],
      },
      {
        id: "kt-t1-2",
        field: "Kraf Tradisional",
        category: "Media & Bahan",
        question: "2. Apakah bahan yang digunakan untuk menghasilkan kraf ini?",
        options: [
          "Kertas lukisan, krayon/lilin dan warna air (batik mudah)",
          "Jalur kertas warna yang dianyam berselang-seli dan gam",
          "Tanah liat, plastisin atau doh untuk membentuk tembikar",
          "Kadbod, kertas warna, lidi, benang dan gunting",
        ],
      },
      {
        id: "kt-t1-3",
        field: "Kraf Tradisional",
        category: "Hal Benda",
        question: "3. Apakah motif yang terdapat pada kraf ini?",
        options: [
          "Motif flora seperti bunga raya, daun dan sulur paut",
          "Motif fauna seperti rama-rama, burung atau ikan",
          "Motif geometri seperti pucuk rebung dan corak kelarai",
          "Motif awan larat dan garisan tradisi yang halus",
        ],
      },
      {
        id: "kt-t1-4",
        field: "Kraf Tradisional",
        category: "Unsur Seni",
        question: "4. Apakah warna yang paling menonjol pada kraf ini?",
        options: [
          "Warna merah, kuning keemasan dan jingga yang menyerlah",
          "Warna biru, ungu dan hijau yang sangat menarik",
          "Warna tanah seperti coklat, hitam dan putih yang klasik",
          "Gabungan warna-warna ceria yang menghidupkan corak tradisi",
        ],
      },
      {
        id: "kt-t1-5",
        field: "Kraf Tradisional",
        category: "Mesej",
        question: "5. Apakah kegunaan kraf tradisional ini?",
        options: [
          "Digunakan sebagai pakaian atau kain hiasan (Batik / Tekat)",
          "Digunakan sebagai alat permainan rakyat masa lapang (Wau / Gasing)",
          "Digunakan sebagai bekas menyimpan air atau hiasan rumah (Tembikar)",
          "Digunakan sebagai alas duduk, tudung saji atau perhiasan diri",
        ],
      },
      {
        id: "kt-t1-6",
        field: "Kraf Tradisional",
        category: "Media & Bahan",
        question:
          "6. Adakah kraf ini dihasilkan menggunakan bahan semula jadi?",
        options: [
          "Kraf asal menggunakan bahan semula jadi seperti buluh, rotan, mengkuang atau tanah liat",
          "Kraf murid ini menggunakan bahan gantian seperti kertas warna dan kadbod",
          "Ya, menggunakan bahan gantian yang mudah didapati di sekolah",
          "Menggunakan gabungan bahan gantian moden untuk meniru kraf tradisional",
        ],
      },
      {
        id: "kt-t1-7",
        field: "Kraf Tradisional",
        category: "Hal Benda",
        question: "7. Pernahkah kamu melihat kraf seperti ini?",
        options: [
          "Ya, saya pernah melihatnya di rumah, sekolah atau majlis kenduri",
          "Ya, saya pernah melihatnya di televisyen, buku teks atau muzium",
          "Ya, ahli keluarga saya mempunyai kraf seperti ini di rumah",
          "Baru pertama kali saya melihatnya dan ia kelihatan sangat unik",
        ],
      },
      {
        id: "kt-t1-8",
        field: "Kraf Tradisional",
        category: "Mesej",
        question: "8. Mengapakah kita perlu menghargai kraf tradisional?",
        options: [
          "Kerana kraf tradisional ialah warisan budaya negara kita yang berharga",
          "Supaya seni warisan nenek moyang tidak hilang ditelan zaman",
          "Kerana pembuatannya memerlukan kesabaran dan kemahiran yang tinggi",
          "Supaya generasi muda berbangga dengan identiti seni Malaysia",
        ],
      },
    ],
    tahap2: [
      {
        id: "kt-t2-1",
        field: "Kraf Tradisional",
        category: "Kreativiti",
        question:
          "1. Apakah keunikan motif dan corak yang terdapat pada kraf tradisional ini?",
        options: [
          "Motif flora dan alam semula jadi diolah secara halus dengan susunan yang penuh makna simbolik",
          "Corak kelarai dan pucuk rebung tersusun secara matematik dan berulang dengan sangat teliti",
          "Gabungan garisan melengkung (awan larat) dan motif tradisi mencerminkan kehalusan budi masyarakat",
          "Keunikan motifnya menyerlahkan identiti tempatan yang berbeza daripada seni moden barat",
        ],
      },
      {
        id: "kt-t2-2",
        field: "Kraf Tradisional",
        category: "Unsur Seni",
        question:
          "2. Bagaimanakah unsur seni dan prinsip rekaan mempengaruhi keindahan kraf ini?",
        options: [
          "Imbangan simetri pada bentuk dan susunan motif menjadikan kraf kelihatan stabil dan harmoni",
          "Jalinan sentuh daripada anyaman/ukiran serta garisan batik memberi kesan permukaan yang kaya",
          "Kontra warna antara motif dan latar belakang menonjolkan keindahan reka corak utama",
          "Kesatuan antara bentuk fizikal kraf dengan ragam hiasnya melahirkan nilai estetik yang tinggi",
        ],
      },
      {
        id: "kt-t2-3",
        field: "Kraf Tradisional",
        category: "Media & Bahan",
        question:
          "3. Mengapakah bahan semula jadi sering digunakan dalam penghasilan kraf tradisional?",
        options: [
          "Kerana bahan seperti buluh, rotan, daun mengkuang dan tanah liat mudah diperoleh dari alam sekitar",
          "Bahan semula jadi bersifat mesra alam, tahan lasak dan mempunyai tekstur asli yang cantik",
          "Masyarakat dahulu memanfaatkan sumber hutan dan alam sekeliling secara bijaksana dan lestari",
          "Sifat semula jadi bahan sesuai dengan fungsi kegunaan kraf seperti tanah liat yang menyejukkan air",
        ],
      },
      {
        id: "kt-t2-4",
        field: "Kraf Tradisional",
        category: "Teknik",
        question:
          "4. Apakah perbezaan teknik penghasilan kraf tradisional dengan teknik penghasilan kraf moden?",
        options: [
          "Kraf tradisional dihasilkan secara buatan tangan (manual) yang teliti, manakala kraf moden banyak menggunakan mesin",
          "Kraf tradisional mengekalkan teknik warisan turun-temurun, manakala kraf moden meneroka teknologi dan bahan sintetik",
          "Penghasilan kraf tradisional mengambil masa lebih lama dan bernilai eksklusif berbanding pengeluaran kilang moden",
          "Kraf tradisional terikat dengan pantang larang dan aturan motif asal, manakala kraf moden lebih bebas",
        ],
      },
      {
        id: "kt-t2-5",
        field: "Kraf Tradisional",
        category: "Mesej",
        question:
          "5. Bagaimanakah identiti budaya masyarakat dapat ditonjolkan melalui motif kraf ini?",
        options: [
          "Pemilihan motif flora tempatan (seperti bunga raya, tampuk manggis, pucuk rebung) melambangkan alam Nusantara",
          "Susunan motif yang tertib dan halus mencerminkan nilai kesopanan serta kehalusan budi pekerti masyarakat",
          "Reka bentuk kraf berkait rapat dengan adat resam, perayaan dan kehidupan harian masyarakat Malaysia",
          "Penggunaan warna tradisi dan nama-nama kelarai mengekalkan warisan bahasa serta budaya bangsa",
        ],
      },
      {
        id: "kt-t2-6",
        field: "Kraf Tradisional",
        category: "Pengkritikan",
        question:
          "6. Sejauh manakah kraf tradisional ini masih relevan dalam kehidupan masyarakat masa kini?",
        options: [
          "Sangat relevan kerana ia kini dijadikan simbol identiti negara, pakaian rasmi dan hiasan eksklusif",
          "Masih relevan apabila diadaptasi sebagai cenderamata pelancongan dan hiasan dalaman moden",
          "Relevan sebagai sumber pendapatan ekonomi usahawan kraf tempatan dan industri kreatif negara",
          "Perlu terus diperkenalkan kepada generasi muda di sekolah agar kekal relevan pada masa hadapan",
        ],
      },
      {
        id: "kt-t2-7",
        field: "Kraf Tradisional",
        category: "Pengkritikan",
        question:
          "7. Apakah cabaran yang mungkin dihadapi dalam usaha mengekalkan seni kraf tradisional?",
        options: [
          "Kekurangan pelapis generasi muda yang berminat mempelajari kemahiran kraf yang rumit dan teliti",
          "Persaingan dengan produk moden keluaran kilang yang lebih murah dan pantas dihasilkan",
          "Kesukaran mendapatkan bahan mentah semula jadi berkualiti akibat pembangunan dan perubahan alam",
          "Kos penghasilan dan masa pembuatan yang panjang menyebabkan harga kraf asli agak tinggi",
        ],
      },
      {
        id: "kt-t2-8",
        field: "Kraf Tradisional",
        category: "Kreativiti",
        question:
          "8. Bagaimanakah teknologi moden boleh membantu memelihara dan mengembangkan seni kraf tradisional?",
        options: [
          "Promosi dan pemasaran digital melalui media sosial serta e-dagang ke pasaran antarabangsa",
          "Penggunaan perisian reka bentuk grafik untuk mendokumentasi dan mencipta variasi motif baharu",
          "Pameran maya (seperti Kanta Seni) dan video tutorial dalam talian untuk mendidik generasi muda",
          "Penggunaan peralatan moden bagi mempercepatkan proses penyediaan bahan tanpa menghilangkan seni tangan",
        ],
      },
      {
        id: "kt-t2-9",
        field: "Kraf Tradisional",
        category: "Kreativiti",
        question:
          "9. Jika kamu diminta menghasilkan produk kraf tradisional yang mempunyai nilai komersial, apakah inovasi yang akan kamu lakukan tanpa menghilangkan identiti asalnya?",
        options: [
          "Mengaplikasikan motif batik atau anyaman kelarai pada aksesori moden seperti sarung telefon, beg komputer riba atau kasut",
          "Menggunakan gabungan warna kontemporari (pastel atau monokrom) sambil mengekalkan motif tradisi asli",
          "Menghasilkan kit DIY kraf tradisional untuk pelancong dan murid sekolah mencuba sendiri di rumah",
          "Mencipta produk lampu hiasan atau bekas serbaguna moden yang menggabungkan ukiran/anyaman tradisional",
        ],
      },
    ],
  },
  "Seni Digital": {
    tahap1: [
      {
        id: "sd-t1-1",
        category: "Hal Benda",
        question:
          "Apakah gambar atau watak utama yang kamu lukis pada skrin dalam karya digital ini?",
        options: [
          "Dalam karya digital ini, saya melukis watak kartun atau haiwan comel yang ceria.",
          "Saya melukis pemandangan alam semula jadi seperti pelangi, pokok, dan rumah di atas skrin.",
          "Karya ini memaparkan objek harian dan kenderaan kegemaran saya yang berwarna-warni.",
        ],
      },
      {
        id: "sd-t1-2",
        category: "Media & Bahan",
        question:
          "Apakah peranti dan aplikasi digital yang kamu gunakan untuk menghasilkan karya ini?",
        options: [
          "Saya menggunakan tablet dan aplikasi lukisan digital untuk melakar serta mewarna karya ini.",
          "Saya menghasilkan karya ini menggunakan komputer riba dan tetikus pada perisian melukis asas.",
          "Saya menggunakan telefon pintar dengan jari dan aplikasi lukisan mudah alih untuk berkarya.",
        ],
      },
      {
        id: "sd-t1-3",
        category: "Teknik",
        question:
          "Apakah alat digital (seperti berus, bentuk asas, atau baldi warna) yang paling kamu suka gunakan?",
        options: [
          "Saya paling suka menggunakan alat baldi warna (fill bucket) kerana ia mewarna ruang dengan cepat dan kemas.",
          "Saya gemar menggunakan berus digital pelbagai saiz untuk membuat garisan tebal dan nipis.",
          "Saya suka menggunakan alat bentuk asas (bulatan dan segi empat) untuk membina objek dengan tepat.",
        ],
      },
      {
        id: "sd-t1-4",
        category: "Unsur Seni",
        question:
          "Apakah warna-warna terang atau garisan digital yang kamu pilih untuk mencantikkan karya ini?",
        options: [
          "Saya memilih warna-warna terang seperti kuning, merah, dan biru supaya karya kelihatan ceria.",
          "Saya menggabungkan garisan lurus dan melengkung yang kemas untuk membentuk rupa objek.",
          "Saya menggunakan warna kontra antara latar belakang dan gambar utama supaya mudah dilihat.",
        ],
      },
      {
        id: "sd-t1-5",
        category: "Prinsip Rekaan",
        question:
          "Bagaimanakah kamu menyusun gambar utama di tengah atau di ruang skrin supaya nampak kemas?",
        options: [
          "Saya meletakkan gambar utama tepat di bahagian tengah skrin supaya menjadi tumpuan.",
          "Saya menyusun objek besar dan kecil secara seimbang di kiri dan kanan ruang lukisan.",
          "Saya memastikan ruang latar belakang tidak terlalu penuh supaya karya kelihatan teratur.",
        ],
      },
      {
        id: "sd-t1-6",
        category: "Mesej",
        question:
          "Apakah cerita atau perasaan gembira yang ingin kamu sampaikan melalui karya digital ini?",
        options: [
          "Karya digital ini menceritakan kegembiraan saya bermain bersama kawan-kawan dan keluarga.",
          "Saya ingin berkongsi rasa sayang terhadap alam sekitar dan haiwan peliharaan melalui lukisan ini.",
          "Lukisan ini menggambarkan dunia imaginasi saya yang penuh warna dan menyeronokkan.",
        ],
      },
      {
        id: "sd-t1-7",
        category: "Kreativiti",
        question:
          "Apakah bahagian yang paling menyeronokkan semasa kamu melukis menggunakan komputer atau tablet?",
        options: [
          "Bahagian paling menyeronokkan ialah apabila saya dapat mencuba pelbagai jenis berus dan warna digital.",
          "Saya seronok kerana boleh memadam kesilapan dengan mudah menggunakan butang undo tanpa mengotorkan kertas.",
          "Saya gembira dapat mengezum masuk (zoom in) untuk mewarna bahagian kecil dengan lebih teliti.",
        ],
      },
      {
        id: "sd-t1-8",
        category: "Pengkritikan",
        question:
          "Jika kamu boleh menambah satu lagi kesan khas atau pelekat digital pada karya ini, apakah yang akan kamu tambah?",
        options: [
          "Saya ingin menambah kesan kilauan bintang atau cahaya supaya karya kelihatan lebih ajaib.",
          "Saya mahu menambah bingkai digital yang cantik di sekeliling lukisan ini.",
          "Saya ingin menambah teks tajuk yang ceria supaya mesej lukisan lebih jelas difahami.",
        ],
      },
    ],
    tahap2: [
      {
        id: "sd-t2-1",
        category: "Hal Benda",
        question:
          "Huraikan tema atau subjek utama karya seni digital ini serta sumber ilham kamu menghasilkannya.",
        options: [
          "Tema utama karya ini ialah keharmonian alam dan teknologi yang diilhamkan daripada persekitaran harian.",
          "Subjek utama karya ini ialah ilustrasi watak dan budaya tempatan yang diolah dalam gaya moden.",
          "Karya ini mengangkat tema penjagaan alam sekitar yang diilhamkan daripada poster kempen kesedaran.",
        ],
      },
      {
        id: "sd-t2-2",
        category: "Media & Bahan",
        question:
          "Nyatakan perisian, peranti input (tetikus, stylus, atau skrin sentuh), serta jenis berus digital yang diaplikasikan.",
        options: [
          "Karya ini dihasilkan menggunakan aplikasi lukisan digital pada tablet dengan pen stylus dan berus cat air digital.",
          "Saya menggunakan perisian grafik di komputer dengan tetikus serta kombinasi berus pen teknikal dan airbrush.",
          "Karya ini dilukis pada skrin sentuh menggunakan berus tekstur lembut untuk kesan lorekan yang halus.",
        ],
      },
      {
        id: "sd-t2-3",
        category: "Teknik",
        question:
          "Bagaimanakah kamu memanfaatkan fungsi lapisan (layers), alat bentuk, atau kesan tekstur digital semasa berkarya?",
        options: [
          "Saya mengasingkan lakaran garisan, warna asas, dan bayang pada lapisan (layers) berbeza agar mudah disunting.",
          "Saya menggabungkan alat bentuk geometri dengan kesan kecerunan warna (gradient) untuk latar belakang yang kemas.",
          "Saya menggunakan lapisan tekstur dan mod campuran warna untuk memberi kedalaman pada permukaan objek.",
        ],
      },
      {
        id: "sd-t2-4",
        category: "Unsur Seni",
        question:
          "Analisis penggunaan unsur warna, ton cahaya, dan jalinan digital yang menghidupkan suasana karya ini.",
        options: [
          "Gabungan warna harmoni dan ton cahaya cerah berjaya mewujudkan suasana yang segar dan bertenaga.",
          "Penggunaan kontras warna panas dan sejuk serta kesan pencahayaan digital menonjolkan bentuk tiga dimensi objek.",
          "Jalinan digital pada latar belakang memberi kesan visual yang menarik tanpa menenggelamkan subjek utama.",
        ],
      },
      {
        id: "sd-t2-5",
        category: "Prinsip Rekaan",
        question:
          "Bagaimanakah prinsip penegasan, imbangan, dan kesatuan diwujudkan dalam susun atur grafik digital ini?",
        options: [
          "Prinsip penegasan diwujudkan melalui saiz subjek utama yang lebih besar dan warna yang lebih menyerlah di tengah komposisi.",
          "Imbangan asimetri yang terancang antara elemen grafik dan ruang kosong menjadikan reka letak kelihatan profesional.",
          "Kesatuan dicapai melalui pemilihan palet warna yang konsisten dan gaya garisan yang seragam di seluruh karya.",
        ],
      },
      {
        id: "sd-t2-6",
        category: "Mesej",
        question:
          "Apakah mesej visual atau nilai murni yang ingin disampaikan kepada penonton melalui rekaan digital ini?",
        options: [
          "Karya ini menyampaikan mesej kepentingan menjaga kelestarian alam demi generasi masa hadapan.",
          "Saya ingin memupuk semangat perpaduan, kasih sayang, dan nilai murni masyarakat Malaysia melalui visual ini.",
          "Rekaan digital ini mengajak penonton menghargai kreativiti seni moden yang menggabungkan budaya dan inovasi.",
        ],
      },
      {
        id: "sd-t2-7",
        category: "Kreativiti",
        question:
          "Apakah cabaran teknikal semasa mengawal alat digital dan bagaimana kamu menyelesaikannya secara kreatif?",
        options: [
          "Cabaran utama ialah mengawal ketepatan garisan melengkung, dan saya mengatasinya dengan melaras tetapan penstabil berus (stabilizer).",
          "Saya menghadapi kesukaran memilih padanan warna yang sesuai, lalu menggunakan palet warna terhad supaya hasil lebih kemas.",
          "Menguruskan banyak lapisan (layers) agak mengelirukan pada awalnya, jadi saya menamakan setiap lapisan mengikut bahagian lukisan.",
        ],
      },
      {
        id: "sd-t2-8",
        category: "Pengkritikan",
        question:
          "Buat penilaian kendiri tentang kekuatan reka letak digital ini dan cadangkan satu penambahbaikan untuk karya seterusnya.",
        options: [
          "Kekuatan utama karya ini ialah pemilihan warna yang menarik, namun pada masa hadapan saya ingin memperhalusi kesan bayang dan pencahayaan.",
          "Susun atur subjek utama sudah jelas dan seimbang, dan untuk karya seterusnya saya ingin meneroka teknik jalinan digital yang lebih pelbagai.",
          "Kemas kini garisan digital sangat kemas, dan saya bercadang menambah elemen latar belakang yang lebih terperinci pada karya akan datang.",
        ],
      },
    ],
  },
};

const getStageFromClass = (className?: string): "tahap1" | "tahap2" => {
  if (!className) return "tahap2";
  const clean = className.trim().toLowerCase();
  if (clean === "tahun 1" || clean === "tahun 2" || clean === "tahun 3") {
    return "tahap1";
  }
  return "tahap2";
};

const pickThreeRandomQuestions = (
  stage: "tahap1" | "tahap2",
  rawField?: string
): AppreciationQuestion[] => {
  const field = normalizePsvField(rawField);
  const pool = APPRECIATION_QUESTIONS_BY_FIELD[field][stage];
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

export interface StarGiverItem {
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

export default function App() {
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

  // --- State Pop-up & Zoom Karya (Termasuk Auto-Buka Soalan Apresiasi) ---
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [openSelectedArtworkQuiz, setOpenSelectedArtworkQuiz] = useState(false);

  // --- State Pop-up Senarai Pemberi Bintang (Gaya Facebook) ---
  const [starListModalData, setStarListModalData] = useState<{
    title: string;
    givers: StarGiverItem[];
  } | null>(null);

  // --- State Penapis (Filter) Galeri ---
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedMonth, setSelectedMonth] = useState("Semua");
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [selectedField, setSelectedField] = useState("Semua");

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

  // --- Senarai Pengkritik Berdaftar dari Tab "Pengkritik" Google Sheets ---
  const [registeredCriticsFromSheet, setRegisteredCriticsFromSheet] = useState<
    Array<{
      normName: string;
      fullName: string;
      className: string;
      email?: string;
      isVip?: boolean;
      sessionsCount?: number;
      lastActive?: any;
    }>
  >([]);

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

    window.history.pushState(
      { kantaSeniGuard: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      const state = uiStateRef.current;

      window.history.pushState(
        { kantaSeniGuard: true },
        "",
        window.location.href
      );

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
        setOpenSelectedArtworkQuiz(false);
        return;
      }

      if (state.activeTab !== "laman-utama") {
        SoundFX.click();
        setActiveTab("laman-utama");
        return;
      }

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
        const normalized = Array.isArray(data)
          ? data.map((item: any) => ({
              ...item,
              id: String(item.id ?? "").trim(),
              title: String(item.title ?? ""),
              studentName: String(item.studentName ?? ""),
              className: String(item.className ?? "Tahun 1"),
              field: normalizePsvField(item.field),
              imageUrl: String(item.imageUrl ?? ""),
              description: String(item.description ?? ""),
              likes: Array.isArray(item.likes) ? item.likes : [],
              comments: Array.isArray(item.comments)
                ? item.comments.map((c: any) => ({
                    ...c,
                    replies: Array.isArray(c.replies) ? c.replies : [],
                  }))
                : [],
            }))
          : [];
        setArtworks(normalized);
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

    fetch(`${SCRIPT_URL}?type=critics`)
      .then((res) => res.json())
      .then((criticsData) => {
        if (Array.isArray(criticsData)) {
          setRegisteredCriticsFromSheet(criticsData);
          setCriticCategoryRegistry((prev) => {
            const merged = { ...prev };
            criticsData.forEach((c: any) => {
              if (c.normName && c.className && c.className !== "-") {
                merged[c.normName] = c.className;
              }
            });
            return merged;
          });
        }
      })
      .catch((error) => {
        console.error("Ralat memuat turun data pengkritik:", error);
      });
  }, []);

  // --- Penghantaran Data ke Google Sheets dengan Penjejak Status Segerak ---
  const sendToSheet = async (action: string, payload: any) => {
    pendingWritesRef.current += 1;
    setSyncState("saving");
    try {
      const response = await fetch(`${SCRIPT_URL}?action=${action}`, {
        method: "POST",
        body: JSON.stringify({ ...payload, action }),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return { status: "ok", raw: text };
      }
    } catch (err) {
      console.error("Ralat menghantar data:", err);
      return null;
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

    // 1. Masukkan dahulu semua pengkritik berdaftar daripada tab "Pengkritik" Google Sheets
    registeredCriticsFromSheet.forEach((rc) => {
      if (!rc.normName) return;
      const regYear = rc.lastActive
        ? getArtworkYear(rc.lastActive)
        : new Date().getFullYear().toString();
      const detectedClass =
        rc.className || criticCategoryRegistry[rc.normName] || "-";
      criticMap[rc.normName] = {
        normName: rc.normName,
        displayName: rc.fullName || toTitleCase(rc.normName),
        className: detectedClass,
        isVip: Boolean(rc.isVip) || isVipCategory(detectedClass),
        commentsCount: 0,
        likesCount: 0,
        artworksReviewed: new Set(),
        yearsActive: new Set([regYear]),
      };
    });

    const registerCommentActivity = (
      authorName: string,
      authorClass: string,
      isVipFlag: boolean,
      timestamp: any,
      artId: string,
      artYear: string
    ) => {
      if (!authorName || authorName === "Penjelajah Misteri") return;
      const norm = normalizeName(authorName);
      const commentYear = timestamp ? getArtworkYear(timestamp) : artYear;
      const detectedClass = authorClass || criticCategoryRegistry[norm] || "-";
      if (!criticMap[norm]) {
        criticMap[norm] = {
          normName: norm,
          displayName: authorName.trim(),
          className: detectedClass,
          isVip: Boolean(isVipFlag) || isVipCategory(detectedClass),
          commentsCount: 0,
          likesCount: 0,
          artworksReviewed: new Set(),
          yearsActive: new Set(),
        };
      }
      criticMap[norm].commentsCount += 1;
      criticMap[norm].yearsActive.add(commentYear);
      if (authorClass && criticMap[norm].className === "-") {
        criticMap[norm].className = authorClass;
        criticMap[norm].isVip =
          Boolean(isVipFlag) || isVipCategory(authorClass);
      }
      criticMap[norm].artworksReviewed.add(artId);
    };

    // 2. Gabungkan aktiviti komen, balasan & bintang daripada semua karya
    artworks.forEach((art) => {
      const artYear = getArtworkYear(art.createdAt);

      if (Array.isArray(art.comments)) {
        art.comments.forEach((c: any) => {
          registerCommentActivity(
            c.authorName,
            c.authorClass,
            Boolean(c.isVip),
            c.timestamp,
            art.id,
            artYear
          );
          if (Array.isArray(c.replies)) {
            c.replies.forEach((r: any) => {
              registerCommentActivity(
                r.authorName,
                r.authorClass,
                Boolean(r.isVip),
                r.timestamp,
                art.id,
                artYear
              );
            });
          }
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
  }, [artworks, criticCategoryRegistry, registeredCriticsFromSheet]);

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

    const criticRecord = {
      normName: norm,
      fullName: cleanName,
      className: formData.className,
      email: formData.email.trim(),
      isVip: vipStatus,
      sessionsCount: sessionNumber,
      lastActive: Date.now(),
    };

    setRegisteredCriticsFromSheet((prev) => {
      const filtered = prev.filter((item) => item.normName !== norm);
      return [criticRecord, ...filtered];
    });

    sendToSheet("registerCritic", criticRecord);

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
          `Pasport${vipTag} #${sessionNumber} aktif untuk ${cleanName}! Teruskan memberi bintang, komen atau balasan pada karya "${targetArt.title}".`
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

  // --- PENGGUNAAN KUOTA PASPORT SEMASA (HANYA BINTANG MENGIRA HAD 3/3; KOMEN, BALAS & KUIZ TIADA HAD) ---
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

    // Komen, balasan komen & 3 soalan apresiasi adalah TIADA HAD selagi pasport masih aktif
    if (actionType === "comment") {
      return true;
    }

    // Had penggunaan pasport dikira apabila pengguna memberikan Bintang (Star)
    const sessionInteracted = new Set<string>(
      activePassport.sessionInteractedArtworkIds || []
    );

    if (!sessionInteracted.has(artworkId) && sessionInteracted.size >= 3) {
      SoundFX.alert();
      setActivePassport(null);
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Kuota 3 bintang bagi pasport semasa anda telah tamat! Sila daftar pasport baharu untuk meneruskan."
      );
      setIsPassportModalOpen(true);
      return false;
    }

    sessionInteracted.add(artworkId);

    const updatedUsedCount = sessionInteracted.size;
    const norm = normalizeName(activePassport.fullName);

    if (updatedUsedCount >= 3) {
      setPassportSessionsCount((prev) => ({
        ...prev,
        [norm]: (prev[norm] || 0) + 1,
      }));
      setActivePassport(null);
      showTimedNotice(
        "Kuota 3/3 bintang bagi pasport ini telah selesai! Daftar pasport baharu bila-bila masa untuk memberi bintang seterusnya."
      );
    } else {
      setActivePassport({
        ...activePassport,
        usedCount: updatedUsedCount,
        sessionInteractedArtworkIds: Array.from(sessionInteracted),
      });
    }

    return true;
  };

  // --- Actions: Tambah & Edit Karya ---
  const handleAddArtwork = (newArtwork: any) => {
    const createdArt = {
      id: Date.now().toString(),
      ...newArtwork,
      field: normalizePsvField(newArtwork.field),
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

  const handleEditArtwork = async (updatedData: {
    title: string;
    studentName: string;
    className: string;
    field: string;
    imageUrl: string;
    description?: string;
  }) => {
    if (!editingArtwork || !loggedInStaff) return;

    const targetId = String(editingArtwork.id ?? "").trim();
    const cleanImageUrl = formatDirectImageUrl(updatedData.imageUrl.trim());
    const normalizedField = normalizePsvField(updatedData.field);
    const updatedArt = {
      ...editingArtwork,
      id: targetId,
      title: updatedData.title.trim(),
      studentName: updatedData.studentName.trim(),
      className: updatedData.className,
      field: normalizedField,
      imageUrl: cleanImageUrl,
      description: (updatedData.description || "").trim(),
      updatedAt: Date.now(),
    };

    setArtworks((prev) =>
      prev.map((art) =>
        String(art.id ?? "").trim() === targetId ? updatedArt : art
      )
    );

    if (
      selectedArtwork &&
      String(selectedArtwork.id ?? "").trim() === targetId
    ) {
      setSelectedArtwork(updatedArt);
    }

    setEditingArtwork(null);
    SoundFX.success();
    showTimedNotice(
      `Maklumat & gambar karya "${updatedArt.title}" berjaya dikemas kini ke pangkalan data!`
    );

    await sendToSheet("edit", {
      id: targetId,
      title: updatedArt.title,
      studentName: updatedArt.studentName,
      className: updatedArt.className,
      field: updatedArt.field,
      imageUrl: updatedArt.imageUrl,
      description: updatedArt.description,
    });
  };

  // --- FUNGSI BINTANG (KLIK SEKALI = BERI BINTANG; KLIK SEMULA = BATAL BINTANG & PULANG KUOTA) ---
  const toggleLike = async (artworkId: string, currentLikes: string[]) => {
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
      // 1. BATAL BINTANG (UNSTAR) SEPERTI FACEBOOK
      SoundFX.click();
      const optimisticLikes = currentLikes.filter((k) => k !== userKey);

      setArtworks((prev) =>
        prev.map((art) => {
          if (String(art.id) === String(artworkId)) {
            const updated = { ...art, likes: optimisticLikes };
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

      // 2. PULANGKAN SEMULA 1 KUOTA BINTANG KE PASPORT AKTIF
      const sessionInteracted = new Set<string>(
        activePassport.sessionInteractedArtworkIds || []
      );
      if (sessionInteracted.has(artworkId)) {
        sessionInteracted.delete(artworkId);
        setActivePassport({
          ...activePassport,
          usedCount: sessionInteracted.size,
          sessionInteractedArtworkIds: Array.from(sessionInteracted),
        });
      }

      showTimedNotice("Bintang dibatalkan & kuota pasport dipulangkan.");

      // Kemaskini senarai likes baharu ke Google Sheets
      await sendToSheet("update", {
        id: artworkId,
        likes: optimisticLikes,
      });
      return;
    }

    // BERI BINTANG BAHARU (SEMAK & TOLAK KUOTA 3/3)
    if (activePassport.className) {
      setCriticCategoryRegistry((prev) => ({
        ...prev,
        [norm]: activePassport.className,
      }));
    }

    const allowed = recordPassportUsageForArtwork(artworkId, "star");
    if (!allowed) return;

    SoundFX.star();
    const optimisticLikes = [...currentLikes, userKey];

    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updated = { ...art, likes: optimisticLikes };
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

    const serverRes = await sendToSheet("toggleLike", {
      id: artworkId,
      userId: userKey,
    });

    if (serverRes && Array.isArray(serverRes.likes)) {
      setArtworks((prev) =>
        prev.map((art) => {
          if (String(art.id) === String(artworkId)) {
            const synced = { ...art, likes: serverRes.likes };
            if (
              selectedArtwork &&
              String(selectedArtwork.id) === String(artworkId)
            ) {
              setSelectedArtwork(synced);
            }
            return synced;
          }
          return art;
        })
      );
    }
  };

  // --- FUNGSI KOMEN (ANTI-TINDIH: APPEND TERUS KE PANGKALAN DATA) ---
  const addComment = async (
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
        ? `${quizFormatted}\n\nKomen Tambahan: ${cleanFreeText}`
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
      replies: [],
    };

    const optimisticComments = [...currentComments, newComment];

    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updated = {
            ...art,
            comments: optimisticComments,
          };
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

    const serverRes = await sendToSheet("addComment", {
      id: artworkId,
      comment: newComment,
    });

    if (serverRes && Array.isArray(serverRes.comments)) {
      setArtworks((prev) =>
        prev.map((art) => {
          if (String(art.id) === String(artworkId)) {
            const synced = { ...art, comments: serverRes.comments };
            if (
              selectedArtwork &&
              String(selectedArtwork.id) === String(artworkId)
            ) {
              setSelectedArtwork(synced);
            }
            return synced;
          }
          return art;
        })
      );
    }
  };

  // --- FUNGSI BALAS KOMEN (WAJIB ADA PASPORT; BALAS KOMEN TANPA HAD TANPA TOLAK KUOTA 3/3) ---
  const addReply = async (
    artworkId: string,
    commentId: string,
    replyText: string
  ) => {
    const cleanReply = replyText.trim();
    if (!cleanReply) return false;

    if (!activePassport) {
      SoundFX.alert();
      setPendingActionArtworkId(artworkId);
      showTimedNotice(
        "Sila daftar Pasport Pengkritik terlebih dahulu sebelum membalas komen."
      );
      setIsPassportModalOpen(true);
      return false;
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

    SoundFX.comment();

    const newReply = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: visitorId,
      authorName: activePassport.fullName,
      authorClass: activePassport.className,
      isVip: vipStatus,
      text: cleanReply,
      timestamp: Date.now(),
    };

    let updatedCommentsForFallback: any[] = [];

    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updatedComments = (art.comments || []).map((c: any) => {
            if (String(c.id) === String(commentId)) {
              const existingReplies = Array.isArray(c.replies) ? c.replies : [];
              return {
                ...c,
                replies: [...existingReplies, newReply],
              };
            }
            return c;
          });
          updatedCommentsForFallback = updatedComments;
          const updatedArt = { ...art, comments: updatedComments };
          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updatedArt);
          }
          return updatedArt;
        }
        return art;
      })
    );

    const serverRes = await sendToSheet("addReply", {
      id: artworkId,
      commentId: String(commentId),
      reply: newReply,
      comments: updatedCommentsForFallback,
    });

    if (serverRes && Array.isArray(serverRes.comments)) {
      setArtworks((prev) =>
        prev.map((art) => {
          if (String(art.id) === String(artworkId)) {
            const synced = { ...art, comments: serverRes.comments };
            if (
              selectedArtwork &&
              String(selectedArtwork.id) === String(artworkId)
            ) {
              setSelectedArtwork(synced);
            }
            return synced;
          }
          return art;
        })
      );
    }

    return true;
  };

  // --- FUNGSI MODERASI ADMIN & GURU: PADAM BALASAN KOMEN ---
  const handleDeleteReply = (
    artworkId: string,
    commentId: string,
    replyObj: any
  ) => {
    setArtworks((prev) =>
      prev.map((art) => {
        if (String(art.id) === String(artworkId)) {
          const updatedComments = (art.comments || []).map((c: any) => {
            if (String(c.id) === String(commentId)) {
              const filteredReplies = (c.replies || []).filter(
                (r: any) => String(r.id) !== String(replyObj.id)
              );
              return { ...c, replies: filteredReplies };
            }
            return c;
          });

          const updated = { ...art, comments: updatedComments };
          sendToSheet("update", {
            id: artworkId,
            comments: updatedComments,
          });

          if (
            selectedArtwork &&
            String(selectedArtwork.id) === String(artworkId)
          ) {
            setSelectedArtwork(updated);
          }

          SoundFX.alert();
          showTimedNotice(
            `Balasan oleh "${replyObj.authorName}" telah berjaya dipadam.`
          );
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
          sendToSheet("update", {
            id: artworkId,
            comments: updatedComments,
            likes: updatedLikes,
          });
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
          sendToSheet("update", {
            id: artworkId,
            likes: updatedLikes,
          });
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
      setOpenSelectedArtworkQuiz(false);
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

  // --- PENAPISAN KARYA MENGIKUT TAHUN, BULAN, KELAS & BIDANG SENI VISUAL ---
  const filteredArtworks = artworks.filter((art) => {
    const artYear = getArtworkYear(art.createdAt);
    const artMonth = getArtworkMonth(art.createdAt);
    const artField = normalizePsvField(art.field);
    const matchYear = selectedYear === "Semua" || artYear === selectedYear;
    const matchMonth = selectedMonth === "Semua" || artMonth === selectedMonth;
    const matchClass =
      selectedClass === "Semua" || art.className === selectedClass;
    const matchField = selectedField === "Semua" || artField === selectedField;
    return matchYear && matchMonth && matchClass && matchField;
  });

  // --- PENORMALAN TAJUK KARYA (KALIS HURUF BESAR/KECIL & SIMBOL) ---
  const normalizeTitleKey = (title: string): string => {
    if (!title) return "tanpa-tajuk";
    const cleaned = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || "tanpa-tajuk";
  };

  // --- KUMPULKAN KARYA MENGIKUT BIDANG SENI VISUAL DAHULU, KEMUDIAN TAJUK YANG SAMA ---
  const groupedArtworksByField = useMemo(() => {
    return PSV_FIELDS.map((fieldName) => {
      const fieldItems = filteredArtworks.filter(
        (art) => normalizePsvField(art.field) === fieldName
      );

      const titleGroupsMap = new Map<
        string,
        {
          key: string;
          displayTitle: string;
          items: any[];
        }
      >();

      fieldItems.forEach((art) => {
        const key = normalizeTitleKey(art.title);
        if (!titleGroupsMap.has(key)) {
          const cleanDisplay =
            String(art.title || "")
              .replace(/[^a-zA-Z0-9\s]/g, " ")
              .replace(/\s+/g, " ")
              .trim() || "Tanpa Tajuk";
          titleGroupsMap.set(key, {
            key,
            displayTitle: toTitleCase(cleanDisplay),
            items: [],
          });
        }
        titleGroupsMap.get(key)!.items.push(art);
      });

      return {
        fieldName,
        totalArtworks: fieldItems.length,
        titleGroups: Array.from(titleGroupsMap.values()),
      };
    }).filter((fg) => fg.totalArtworks > 0);
  }, [filteredArtworks]);

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
            <img
              src="/logo.png"
              alt="Logo Kanta Seni"
              className="w-20 h-20 object-contain rounded-2xl shadow-lg animate-bounce relative z-10 bg-white p-1.5"
            />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 animate-pulse">
            Sedang Memuatkan Kanta Seni...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800 overflow-clip relative flex flex-col">
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
                @keyframes artistDrawing {
                    0% { transform: translate(0px, 0px) rotate(-12deg) scale(1); }
                    20% { transform: translate(14px, -6px) rotate(4deg) scale(1.08); }
                    40% { transform: translate(4px, 8px) rotate(-15deg) scale(1.02); }
                    60% { transform: translate(18px, 4px) rotate(8deg) scale(1.1); }
                    80% { transform: translate(6px, -8px) rotate(-6deg) scale(1.04); }
                    100% { transform: translate(0px, 0px) rotate(-12deg) scale(1); }
                }
                .animate-artist-drawing {
                    animation: artistDrawing 4.2s ease-in-out infinite;
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
                    .print-only-table {
                        display: none !important;
                    }
                }


                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 10mm;
                    }
                    * {
                        animation: none !important;
                        transform: none !important;
                        transition: none !important;
                    }
                    
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                        font-size: 11pt !important;
                    }
                    
                    .no-print {
                        display: none !important;
                    }

                    .screen-only-table {
                        display: none !important;
                    }

                    .print-only-table {
                        display: block !important;
                    }
                    
                    html, body, #root, main, section, .min-h-screen, .flex-1 {
                        height: auto !important;
                        min-height: 0 !important;
                        overflow: visible !important;
                        position: static !important;
                        display: block !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    
                    .overflow-x-auto, .overflow-hidden, .overflow-y-auto {
                        overflow: visible !important;
                        overflow-x: visible !important;
                        overflow-y: visible !important;
                    }
                    
                    #printable-lists-area {
                        position: static !important;
                        width: 100% !important;
                        display: block !important;
                        background: white !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: 2px solid #1e3a8a !important;
                    }
                    
                    table {
                        width: 100% !important;
                        table-layout: auto !important;
                        border-collapse: collapse !important;
                        page-break-inside: auto !important;
                        font-size: 9pt !important;
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
                        word-break: normal !important;
                        overflow-wrap: break-word !important;
                    }
                }
`}</style>

      {/* --- HEADER RESPONSIF (TELEFON, TABLET & KOMPUTER) --- */}
      <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-40 w-full border-b-4 border-yellow-400 transition-all no-print">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-5 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 gap-1.5 sm:gap-2.5">
            {/* Kiri: Logo & Tajuk */}
            <div
              className="flex items-center cursor-pointer group min-w-0 flex-1 lg:flex-initial"
              onClick={() => {
                SoundFX.click();
                setActiveTab("laman-utama");
              }}
            >
              <div className="bg-white p-1 sm:p-1.5 rounded-xl mr-2 sm:mr-3 shadow-sm border-2 border-yellow-400 transform -rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 overflow-hidden shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo Kanta Seni"
                  className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl xl:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors truncate">
                  KANTA SENI
                </h1>
                <span className="text-[9px] sm:text-[11px] xl:text-xs font-semibold text-blue-600 uppercase tracking-wider block truncate">
                  Misi Eksplorasi & Jejak Bintang
                </span>
              </div>
            </div>

            {/* Kanan: Kawalan & Butang */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 shrink-0">
              {/* PENUNJUK STATUS SEGERAK PANGKALAN DATA (CLOUD SYNC) */}
              {syncState === "saving" && (
                <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold animate-pulse shrink-0">
                  <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                  <span className="hidden xl:inline">Menyimpan...</span>
                </div>
              )}
              {syncState === "saved" && (
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shrink-0">
                  <CloudCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xl:inline">Tersimpan</span>
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
                className={`p-1.5 sm:p-2 rounded-full border-2 transition-all active:scale-90 shrink-0 ${
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
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              {/* NAVIGASI UTAMA DESKTOP / TABLET BESAR */}
              <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
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
                        className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full font-bold text-xs xl:text-sm whitespace-nowrap transition-all duration-300 active:scale-95 ${
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

              {/* STATUS PASPORT / DAFTAR PASPORT (RESPONSIF TELEFON & DESKTOP) */}
              {activePassport && activePassport.usedCount < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setActiveTab("sudut-apresiasi");
                  }}
                  className={`flex items-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-[11px] xl:text-xs font-bold whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0 ${
                    isCurrentPassportVip
                      ? "bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-2 border-yellow-400 text-yellow-300"
                      : "bg-green-50 border-2 border-green-400 text-green-900 hover:bg-green-100"
                  }`}
                  title={`Pasport Aktif: ${activePassport.fullName} (Baki ${
                    3 - activePassport.usedCount
                  }/3)`}
                >
                  <span className="relative inline-flex items-center sm:mr-1">
                    <Award
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse ${
                        isCurrentPassportVip
                          ? "text-yellow-400"
                          : "text-green-600"
                      }`}
                    />
                    {isCurrentPassportVip && (
                      <span className="hidden sm:inline-block ml-1 bg-black text-yellow-400 border border-yellow-400 text-[8px] font-black px-1 py-0.2 rounded-full uppercase tracking-wider leading-none">
                        VIP
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:inline truncate max-w-[68px] xl:max-w-[95px]">
                    {activePassport.fullName}
                  </span>
                  <span
                    className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-black leading-none ${
                      isCurrentPassportVip
                        ? "bg-amber-500/30 text-yellow-200 border border-yellow-400/50"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {3 - activePassport.usedCount}/3
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setIsPassportModalOpen(true);
                  }}
                  className="flex items-center bg-amber-50 border-2 border-amber-300 text-amber-800 p-1.5 sm:px-2.5 xl:px-3.5 sm:py-1.5 rounded-full text-[11px] xl:text-xs font-bold whitespace-nowrap hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all shrink-0"
                  title="Daftar Pasport Pengkritik"
                >
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1 text-amber-600 shrink-0" />
                  <span className="hidden sm:inline">Pasport</span>
                </button>
              )}

              {/* BUTANG LOG MASUK / PANEL ADMIN & GURU */}
              {loggedInStaff ? (
                <button
                  onClick={() => {
                    SoundFX.click();
                    setActiveTab("panel-admin");
                  }}
                  className={`flex items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black whitespace-nowrap transition-all shadow-sm border-2 shrink-0 ${
                    activeTab === "panel-admin"
                      ? "bg-blue-900 text-yellow-300 border-yellow-400 scale-105"
                      : "bg-blue-800 text-white border-blue-900 hover:bg-blue-900"
                  }`}
                  title="Buka Panel Kawalan"
                >
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-yellow-400 shrink-0" />
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
                  className="flex items-center bg-slate-800 hover:bg-slate-900 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all shadow-sm hover:scale-105 active:scale-95 shrink-0"
                  title="Log Masuk Admin atau Guru Mentor"
                >
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-yellow-400 shrink-0" />
                  <span>
                    Admin<span className="hidden sm:inline"> / Guru</span>
                  </span>
                </button>
              )}

              {/* BUTANG KELUAR APLIKASI DENGAN PENGESAHAN */}
              <button
                onClick={() => {
                  SoundFX.exitPrompt();
                  setIsExitConfirmModalOpen(true);
                }}
                className="flex items-center bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 p-1.5 sm:px-2.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-all active:scale-95 shrink-0"
                title="Keluar daripada Kanta Seni"
              >
                <DoorOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 xl:mr-1 shrink-0" />
                <span className="hidden xl:inline">Keluar</span>
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
                className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-400/50 rounded-full transition-all p-1.5"
                title="Tutup notifikasi"
              >
                <X className="w-4 h-4 stroke-[2.75]" />
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
              <Palette className="absolute top-6 left-6 md:top-9 md:left-12 text-yellow-300 w-16 h-16 md:w-20 md:h-20 opacity-75 animate-float-slow pointer-events-none" />
              <Brush className="absolute top-8 right-8 md:top-12 md:right-16 text-amber-300 w-12 h-12 md:w-16 md:h-16 opacity-80 animate-artist-drawing pointer-events-none" />
              <PenTool
                className="hidden sm:block absolute top-1/2 left-6 md:left-10 -translate-y-1/2 text-sky-200 w-8 h-8 md:w-9 md:h-9 opacity-60 animate-artist-drawing pointer-events-none"
                style={{ animationDelay: "0.6s" }}
              />
              <Shapes
                className="absolute bottom-7 left-10 md:bottom-10 md:left-24 text-yellow-200 w-10 h-10 md:w-12 md:h-12 opacity-55 animate-float-reverse pointer-events-none"
                style={{ animationDelay: "0.8s" }}
              />
              <Frame
                className="absolute bottom-6 right-8 md:bottom-10 md:right-20 text-yellow-300 w-14 h-14 md:w-20 md:h-20 opacity-60 animate-float-slow pointer-events-none"
                style={{ animationDelay: "1.3s" }}
              />
              <Sparkles className="absolute top-1/3 right-1/4 text-yellow-200 w-6 h-6 md:w-7 md:h-7 opacity-70 animate-pulse pointer-events-none" />
              <Sparkles
                className="hidden sm:block absolute bottom-1/3 left-1/4 text-sky-200 w-7 h-7 opacity-55 animate-pulse pointer-events-none"
                style={{ animationDelay: "1s" }}
              />

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
                        setOpenSelectedArtworkQuiz(false);
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
                        setOpenSelectedArtworkQuiz(false);
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
                        setOpenSelectedArtworkQuiz(false);
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
                  Klik pada gambar karya untuk meneliti karya.
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
                  selectedClass !== "Semua" ||
                  selectedField !== "Semua") && (
                  <button
                    onClick={() => {
                      SoundFX.click();
                      setSelectedYear("Semua");
                      setSelectedMonth("Semua");
                      setSelectedClass("Semua");
                      setSelectedField("Semua");
                    }}
                    className="text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Set Semula Tapisan
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
                <span className="text-blue-900 font-bold text-sm mr-1">
                  Bidang Seni Visual:
                </span>
                {["Semua", ...PSV_FIELDS].map((fld) => (
                  <button
                    key={fld}
                    onClick={() => {
                      SoundFX.click();
                      setSelectedField(fld);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all active:scale-95 ${
                      selectedField === fld
                        ? "bg-yellow-400 text-blue-950 border-2 border-blue-900 shadow-sm scale-105"
                        : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-yellow-100"
                    }`}
                  >
                    {fld === "Semua" ? "Semua Bidang" : fld}
                  </button>
                ))}
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
                  Jadilah pelukis pertama yang mempamerkan karya seni anda.
                </p>
                <button
                  onClick={() => {
                    SoundFX.click();
                    setIsAddModalOpen(true);
                  }}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md transition-all"
                >
                  Daftar Karya
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
                    setSelectedField("Semua");
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2.5 px-6 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Tunjuk Semua Karya
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {groupedArtworksByField.map((fieldSection) => (
                  <div
                    key={fieldSection.fieldName}
                    className="bg-gradient-to-b from-blue-50/90 to-white p-5 md:p-7 rounded-[2rem] border-4 border-blue-200 shadow-md space-y-6"
                  >
                    {/* PENGEPALA UTAMA BIDANG SENI VISUAL */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-900 text-white px-5 py-4 rounded-2xl border-b-4 border-yellow-400 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 text-blue-950 p-2.5 rounded-xl shadow-xs">
                          <Shapes className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-yellow-300 block">
                            Bidang Seni Visual
                          </span>
                          <h4 className="text-xl md:text-2xl font-black tracking-tight">
                            {fieldSection.fieldName}
                          </h4>
                        </div>
                      </div>
                      <span className="bg-yellow-400 text-blue-950 text-xs md:text-sm font-black px-4 py-1.5 rounded-full shadow-xs">
                        {fieldSection.totalArtworks} Karya •{" "}
                        {fieldSection.titleGroups.length} Tajuk
                      </span>
                    </div>

                    {/* SUB-KUMPULAN MENGIKUT TAJUK YANG SAMA DALAM BIDANG TERSEBUT */}
                    <div className="space-y-6">
                      {fieldSection.titleGroups.map((group) => (
                        <div
                          key={`${fieldSection.fieldName}-${group.key}`}
                          className="bg-white p-4 md:p-6 rounded-3xl border-2 border-blue-100 shadow-xs"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-5 border-b-2 border-yellow-300">
                            <div className="flex items-center gap-2.5">
                              <span className="bg-blue-700 text-yellow-300 p-2 rounded-xl shadow-2xs">
                                <Palette className="w-5 h-5" />
                              </span>
                              <h5 className="text-lg md:text-xl font-black text-blue-950 tracking-tight">
                                {group.displayTitle}
                              </h5>
                            </div>
                            <span className="bg-yellow-100 text-blue-950 text-xs font-black px-3.5 py-1 rounded-full border border-yellow-400">
                              {group.items.length} Karya
                            </span>
                          </div>

                          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                            {group.items.map((artwork, idx) => (
                              <ArtworkCard
                                key={`${artwork.id}-${artwork.updatedAt || ""}`}
                                index={idx}
                                artwork={artwork}
                                artworkYear={getArtworkYear(artwork.createdAt)}
                                activeUserKey={activeUserKey}
                                activePassport={activePassport}
                                vipRegistry={criticCategoryRegistry}
                                isStaffLoggedIn={!!loggedInStaff}
                                onLike={() =>
                                  toggleLike(artwork.id, artwork.likes || [])
                                }
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
                                onReply={(commentId: string, text: string) => {
                                  if (!activePassport) {
                                    SoundFX.alert();
                                    setPendingActionArtworkId(artwork.id);
                                    showTimedNotice(
                                      "Sila daftar Pasport terlebih dahulu untuk membalas komen."
                                    );
                                    setIsPassportModalOpen(true);
                                    return false;
                                  }
                                  return addReply(artwork.id, commentId, text);
                                }}
                                onDeleteReply={(
                                  commentId: string,
                                  replyObj: any
                                ) =>
                                  handleDeleteReply(
                                    artwork.id,
                                    commentId,
                                    replyObj
                                  )
                                }
                                onDeleteComment={(commentObj: any) =>
                                  handleDeleteCommentWithPenalty(
                                    artwork.id,
                                    commentObj
                                  )
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
                                  setOpenSelectedArtworkQuiz(false);
                                  setSelectedArtwork(artwork);
                                }}
                                onOpenPreviewWithQuiz={() => {
                                  SoundFX.click();
                                  setOpenSelectedArtworkQuiz(true);
                                  setSelectedArtwork(artwork);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                      : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-2 border-yellow-400"
                  }`}
                >
                  {isCurrentPassportVip && (
                    <>
                      <Crown className="absolute -bottom-4 -right-4 w-32 h-32 text-yellow-400/15 rotate-12 pointer-events-none" />
                      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-yellow-400 animate-pulse pointer-events-none" />
                    </>
                  )}

                  {/* Baris 1: Lencana Pasport & Baki Kuota */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-white/15 relative z-10">
                    {isCurrentPassportVip ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-black text-yellow-400 border border-yellow-400 px-3.5 py-1.5 rounded-full shadow-sm">
                        PASPORT VIP • {activePassport.className.toUpperCase()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-yellow-400 text-blue-950 px-3.5 py-1 rounded-full shadow-sm">
                        <Award className="w-3.5 h-3.5" />
                        PASPORT #{activePassport.sessionNumber || 1} AKTIF
                      </span>
                    )}

                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isCurrentPassportVip
                          ? "bg-amber-500/20 text-yellow-300 border border-yellow-400/40"
                          : "bg-blue-950/60 text-yellow-300 border border-blue-400/30"
                      }`}
                    >
                      Baki Kuota: {3 - activePassport.usedCount} / 3 Karya
                    </span>
                  </div>

                  {/* Baris 2: Nama Pemegang Pasport */}
                  <div className="mb-4 relative z-10">
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-widest mb-1 ${
                        isCurrentPassportVip
                          ? "text-amber-300/80"
                          : "text-blue-200"
                      }`}
                    >
                      Nama Pengkritik Berdaftar
                    </span>
                    <h4
                      className={`text-xl sm:text-2xl font-black leading-snug break-words ${
                        isCurrentPassportVip ? "text-yellow-300" : "text-white"
                      }`}
                    >
                      {activePassport.fullName}
                    </h4>
                  </div>

                  {/* Baris 3: Kategori / Kelas & E-mel dalam Kotak Berasingan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 relative z-10">
                    <div
                      className={`px-3.5 py-2 rounded-xl border ${
                        isCurrentPassportVip
                          ? "bg-white/5 border-yellow-400/25"
                          : "bg-blue-950/40 border-blue-400/25"
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-wider ${
                          isCurrentPassportVip
                            ? "text-amber-300/80"
                            : "text-blue-200"
                        }`}
                      >
                        Kelas / Kategori
                      </span>
                      <span className="text-sm font-extrabold block mt-0.5">
                        {activePassport.className}
                      </span>
                    </div>

                    <div
                      className={`px-3.5 py-2 rounded-xl border ${
                        isCurrentPassportVip
                          ? "bg-white/5 border-yellow-400/25"
                          : "bg-blue-950/40 border-blue-400/25"
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-wider ${
                          isCurrentPassportVip
                            ? "text-amber-300/80"
                            : "text-blue-200"
                        }`}
                      >
                        E-mel
                      </span>
                      <span className="text-sm font-semibold block mt-0.5 truncate">
                        {activePassport.email || "Tiada rekod e-mel"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-10 mb-5">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black uppercase tracking-wider border border-blue-200">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Proses Misi Ekplorasi Karya (3 Langkah Mudah)
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
                    Berikan pujian, jawab 3 soalan apresiasi atau balas komen.
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
                    bintang dan komen!
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
                              className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${badgeBg}`}
                            >
                              #{index + 1}
                              {critic.isVip && (
                                <span className="absolute -bottom-1.5 -right-1.5 bg-black text-yellow-400 border border-yellow-400 text-[7px] font-black px-1 py-[0.5px] rounded-full uppercase leading-none">
                                  VIP
                                </span>
                              )}
                            </span>
                            <div>
                              <div className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-1.5 flex-wrap">
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
            onDeleteReply={handleDeleteReply}
            onRemoveSingleStar={handleRemoveSingleStar}
            onLogout={handleStaffLogout}
            onShowNotice={(msg: string) => showTimedNotice(msg)}
          />
        )}
      </main>

      {/* --- FOOTER HAK CIPTA E&J STUDIO --- */}
      <footer className="bg-white border-t-4 border-yellow-400 text-slate-600 py-5 px-4 pb-24 lg:pb-5 mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <img
              src="/logo.png"
              alt="Logo Kanta Seni"
              className="w-5 h-5 object-contain rounded"
            />
            <span>Kanta Seni - Misi Eksplorasi & Jejak Bintang</span>
          </div>
          <div className="text-center sm:text-right font-semibold text-slate-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-black text-blue-800">E&J Studio</span>. Hak
            Cipta Terpelihara.
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - HANYA PAPAR DI TAB GALERI */}
      {activeTab === "galeri" && (
        <div className="fixed bottom-20 lg:bottom-10 right-4 sm:right-6 lg:right-10 z-40 animate-pop-up no-print">
          <button
            onClick={() => {
              SoundFX.click();
              setIsAddModalOpen(true);
            }}
            className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 p-4 md:p-5 rounded-full shadow-[0_8px_0_rgb(30,58,138)] hover:shadow-[0_4px_0_rgb(30,58,138)] hover:translate-y-1 active:translate-y-2 transition-all duration-200 flex items-center justify-center border-4 border-blue-900 group"
            title="Tambah Karya Baru"
          >
            <Plus className="w-7 h-7 sm:w-8 sm:h-8 font-bold group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* MOBILE & TABLET BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-1.5 sm:p-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] no-print">
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
              className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-90 ${
                isActive
                  ? "text-blue-700 bg-blue-50 scale-105"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {item === "Laman Utama" && (
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" />
              )}
              {item === "Galeri" && (
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" />
              )}
              {item === "Sudut Apresiasi" && (
                <Star className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1" />
              )}
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
            className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-90 ${
              activeTab === "panel-admin"
                ? "text-blue-900 bg-yellow-100 scale-105"
                : "text-slate-500"
            }`}
          >
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 text-blue-700" />
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

      {/* ADD ARTWORK MODAL (z-[65] SUPAYA SENTIASA DI HADAPAN) */}
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

      {/* EDIT ARTWORK MODAL (z-[65] SUPAYA SENTIASA DI HADAPAN LIGHTBOX) */}
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
          initialOpenQuiz={openSelectedArtworkQuiz}
          onClose={() => {
            SoundFX.click();
            setSelectedArtwork(null);
            setOpenSelectedArtworkQuiz(false);
          }}
          onLike={() =>
            toggleLike(selectedArtwork.id, selectedArtwork.likes || [])
          }
          onRequestPassport={() => {
            SoundFX.click();
            setPendingActionArtworkId(selectedArtwork.id);
            setIsPassportModalOpen(true);
          }}
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
          onReply={(commentId: string, text: string) => {
            if (!activePassport) {
              SoundFX.alert();
              setPendingActionArtworkId(selectedArtwork.id);
              showTimedNotice(
                "Sila daftar Pasport Pengkritik terlebih dahulu untuk membalas komen."
              );
              setIsPassportModalOpen(true);
              return false;
            }
            return addReply(selectedArtwork.id, commentId, text);
          }}
          onDeleteReply={(commentId: string, replyObj: any) =>
            handleDeleteReply(selectedArtwork.id, commentId, replyObj)
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

      {/* MODAL SENARAI PEMBERI BINTANG GAYA FACEBOOK (z-[65]) */}
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
                title="Tutup"
                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm border border-red-300/60 transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5 stroke-[2.75]" />
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
                          <span className="absolute -bottom-1 -right-1.5 bg-black text-yellow-400 border border-yellow-400 text-[8px] font-black px-1 py-[1px] rounded-full uppercase leading-none shadow-xs">
                            VIP
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 flex-wrap">
                          <span>{g.name}</span>
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
              <span className="absolute -bottom-1 -right-1.5 bg-black text-yellow-400 border border-yellow-400 rounded-full px-1 py-[0.5px] text-[6.5px] font-black uppercase leading-none shadow-2xs">
                VIP
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
  field,
  questions,
  currentIndex,
  answers,
  onSelectAnswer,
  onChangeStep,
  onRefreshQuestions,
  onClose,
}: {
  stage: "tahap1" | "tahap2";
  field: PsvFieldType;
  questions: AppreciationQuestion[];
  currentIndex: number;
  answers: Record<number, string>;
  onSelectAnswer: (questionIdx: number, ans: string) => void;
  onChangeStep: (idx: number) => void;
  onRefreshQuestions: () => void;
  onClose: () => void;
}) {
  const safeQuestions =
    Array.isArray(questions) && questions.length > 0
      ? questions
      : pickThreeRandomQuestions(stage, field);
  const activeQuestion = safeQuestions[currentIndex] || safeQuestions[0];
  if (!activeQuestion) return null;
  const selectedAnswer = answers[currentIndex] || "";
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const allAnswered = answeredCount === safeQuestions.length;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-3.5 mb-3 shadow-sm animate-pop-up text-left">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-blue-900 text-yellow-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            Bidang Seni Visual: {field}
          </span>
          <span className="bg-blue-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            {stage === "tahap1" ? "Tahap 1 (Thn 1-3)" : "Tahap 2 (Thn 4-6)"}
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
            className="p-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg border border-red-200 transition-all"
            title="Tutup soalan"
          >
            <X className="w-3.5 h-3.5 stroke-[2.75]" />
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
            Semua 3 soalan telah dijawab! Tekan Hantar atau tambah komen bebas.
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
            title="Tutup"
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md border border-red-300/60 transition-all hover:scale-105 active:scale-95 relative z-10"
          >
            <X className="w-5 h-5 stroke-[2.75]" />
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
              Nama Pengguna (Username){" "}
              <span className="text-red-500 text-base">*</span>
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
              Kata Laluan (Password){" "}
              <span className="text-red-500 text-base">*</span>
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
  onDeleteReply,
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

  const ITEMS_PER_PAGE = 10;
  const [artistPage, setArtistPage] = useState(1);
  const [criticPage, setCriticPage] = useState(1);

  useEffect(() => {
    setArtistPage(1);
    setCriticPage(1);
  }, [printYearFilter, printClassFilter]);

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

  const totalArtistPages = Math.max(
    1,
    Math.ceil(filteredArtistsForPrint.length / ITEMS_PER_PAGE)
  );
  const safeArtistPage = Math.min(artistPage, totalArtistPages);
  const paginatedArtists = useMemo(() => {
    const startIdx = (safeArtistPage - 1) * ITEMS_PER_PAGE;
    return filteredArtistsForPrint.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredArtistsForPrint, safeArtistPage]);

  const totalCriticPages = Math.max(
    1,
    Math.ceil(filteredCriticsForPrint.length / ITEMS_PER_PAGE)
  );
  const safeCriticPage = Math.min(criticPage, totalCriticPages);
  const paginatedCritics = useMemo(() => {
    const startIdx = (safeCriticPage - 1) * ITEMS_PER_PAGE;
    return filteredCriticsForPrint.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredCriticsForPrint, safeCriticPage]);

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
              Kawalan Komen, Balasan & Bintang Karya
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Amaran Penalti: Jika komen utama dipadam kerana mengandungi unsur
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
                        Senarai Komen & Balasan ({comments.length}):
                      </h5>
                      {comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          Tiada komen pada karya ini.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {comments.map((c: any) => (
                            <div
                              key={c.id}
                              className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5"
                            >
                              <div className="flex items-center justify-between gap-3">
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

                              {/* Senarai Balasan Komen dalam Moderasi */}
                              {Array.isArray(c.replies) &&
                                c.replies.length > 0 && (
                                  <div className="pl-4 border-l-2 border-blue-200 space-y-1.5">
                                    {c.replies.map((r: any) => (
                                      <div
                                        key={r.id}
                                        className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                                      >
                                        <div>
                                          <span className="font-bold text-blue-800">
                                            {r.authorName}
                                          </span>
                                          {r.authorClass && (
                                            <span className="text-slate-500 ml-1">
                                              ({r.authorClass})
                                            </span>
                                          )}
                                          <p className="text-slate-700 mt-0.5">
                                            {r.text}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            onDeleteReply(art.id, c.id, r)
                                          }
                                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 shrink-0"
                                          title="Padam balasan ini"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
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
            {/* PENGEPALA SLIP CETAKAN RASMI */}
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white p-5 sm:p-6 border-b-4 border-yellow-400 relative overflow-hidden hide-on-screen">
              <div className="flex flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="bg-white p-1.5 rounded-2xl border-2 border-yellow-400 shadow-md shrink-0">
                    <img
                      src="/logo.png"
                      alt="Logo Kanta Seni"
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                  <div>
                    <div className="inline-block bg-yellow-400 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                      SLIP REKOD RASMI - PAMERAN MAYA PSV
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                      GALERI KANTA SENI
                    </h2>
                    <p className="text-xs text-blue-100 font-semibold mt-1">
                      Misi Eksplorasi & Jejak Bintang - Rekod Pelukis Cilik &
                      Pengkritik
                    </p>
                  </div>
                </div>

                <div className="bg-blue-950/70 border border-yellow-400/60 rounded-2xl px-4 py-3 text-xs w-56 shrink-0">
                  <div className="grid grid-cols-[75px_1fr] gap-x-2 gap-y-1 items-center">
                    <span className="text-blue-200 font-medium">Sesi:</span>
                    <span className="font-black text-yellow-300 text-right whitespace-nowrap">
                      {printYearFilter === "Semua"
                        ? "Semua Sesi"
                        : `Tahun ${printYearFilter}`}
                    </span>

                    <span className="text-blue-200 font-medium">Kategori:</span>
                    <span className="font-black text-yellow-300 text-right whitespace-nowrap">
                      {printClassFilter}
                    </span>

                    <span className="text-blue-200 font-medium">Tarikh:</span>
                    <span className="font-bold text-white text-right whitespace-nowrap">
                      {new Date().toLocaleDateString("ms-MY")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-blue-600/70 text-xs space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2">
                    <span className="text-blue-100 font-semibold">
                      Jumlah Pelukis Cilik:
                    </span>
                    <span className="font-black text-yellow-300 text-sm">
                      {filteredArtistsForPrint.length} Orang
                    </span>
                  </div>
                  <div className="bg-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2">
                    <span className="text-blue-100 font-semibold">
                      Jumlah Pengkritik Aktif:
                    </span>
                    <span className="font-black text-yellow-300 text-sm">
                      {filteredCriticsForPrint.length} Orang
                    </span>
                  </div>
                </div>

                <div className="bg-blue-950/60 border border-blue-400/30 rounded-xl px-3.5 py-2.5 flex items-baseline gap-2.5 w-full">
                  <span className="text-blue-200 font-bold uppercase tracking-wider text-[11px] shrink-0">
                    Dijana Oleh:
                  </span>
                  <span className="font-black text-yellow-300 text-sm leading-snug whitespace-normal break-words flex-1">
                    {loggedInStaff.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-8 bg-white">
              {/* JADUAL 1: SENARAI PELUKIS CILIK */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="text-base md:text-lg font-black text-blue-900 flex items-center gap-2">
                    <span className="bg-blue-600 text-yellow-300 p-1.5 rounded-lg">
                      <Palette className="w-4 h-4" />
                    </span>
                    1. Senarai Nama Pelukis Cilik Berdaftar (
                    {filteredArtistsForPrint.length} Rekod)
                  </h4>
                  {filteredArtistsForPrint.length > ITEMS_PER_PAGE && (
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 no-print">
                      Halaman {safeArtistPage} daripada {totalArtistPages} (10
                      nama/halaman)
                    </span>
                  )}
                </div>

                <div className="screen-only-table">
                  <div className="overflow-x-auto border-2 border-blue-200 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-blue-100 text-blue-950 border-b-2 border-blue-200">
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap w-10 text-center">
                            Bil
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Nama Pelukis Cilik
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap">
                            Kelas
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap">
                            Bidang Seni Visual
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Sesi
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Tajuk Karya
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Bintang
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedArtists.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-6 text-center text-slate-400 italic"
                            >
                              Tiada rekod pelukis cilik bagi tapisan ini.
                            </td>
                          </tr>
                        ) : (
                          paginatedArtists.map((art: any, idx: number) => {
                            const rowNumber =
                              (safeArtistPage - 1) * ITEMS_PER_PAGE + idx + 1;
                            return (
                              <tr
                                key={art.id}
                                className="even:bg-sky-50/40 hover:bg-blue-50/40"
                              >
                                <td className="py-2.5 px-2.5 font-bold text-slate-500 whitespace-nowrap text-center">
                                  {rowNumber}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-800 leading-snug">
                                  {art.studentName}
                                </td>
                                <td className="py-2.5 px-2.5 text-slate-700 font-medium whitespace-nowrap">
                                  {art.className}
                                </td>
                                <td className="py-2.5 px-2.5 text-blue-900 font-semibold whitespace-nowrap">
                                  {normalizePsvField(art.field)}
                                </td>
                                <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap text-center">
                                  {getArtworkYear(art.createdAt)}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700 leading-snug">
                                  {art.title}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-black text-amber-600 whitespace-nowrap">
                                  {art.likes?.length || 0}{" "}
                                  <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-0.5 -mt-0.5" />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalArtistPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1 no-print">
                      <span className="text-xs font-semibold text-slate-500">
                        Memaparkan {(safeArtistPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                        {Math.min(
                          safeArtistPage * ITEMS_PER_PAGE,
                          filteredArtistsForPrint.length
                        )}{" "}
                        daripada {filteredArtistsForPrint.length} rekod
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            SoundFX.click();
                            setArtistPage((p) => Math.max(1, p - 1));
                          }}
                          disabled={safeArtistPage <= 1}
                          className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-blue-200 bg-white hover:bg-blue-50 text-blue-900 disabled:opacity-40 flex items-center gap-1 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Sebelum
                        </button>
                        {Array.from(
                          { length: totalArtistPages },
                          (_, i) => i + 1
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              SoundFX.click();
                              setArtistPage(pageNum);
                            }}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                              safeArtistPage === pageNum
                                ? "bg-blue-700 text-yellow-300 shadow-xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-blue-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            SoundFX.click();
                            setArtistPage((p) =>
                              Math.min(totalArtistPages, p + 1)
                            );
                          }}
                          disabled={safeArtistPage >= totalArtistPages}
                          className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-blue-200 bg-white hover:bg-blue-50 text-blue-900 disabled:opacity-40 flex items-center gap-1 transition-colors"
                        >
                          Seterusnya
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="print-only-table">
                  <div className="overflow-x-auto border-2 border-blue-200 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-blue-100 text-blue-950 border-b-2 border-blue-200">
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap w-10 text-center">
                            Bil
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Nama Pelukis Cilik
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap">
                            Kelas
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap">
                            Bidang Seni Visual
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Sesi
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Tajuk Karya
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Bintang
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredArtistsForPrint.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-6 text-center text-slate-400 italic"
                            >
                              Tiada rekod pelukis cilik bagi tapisan ini.
                            </td>
                          </tr>
                        ) : (
                          filteredArtistsForPrint.map(
                            (art: any, idx: number) => (
                              <tr
                                key={`print-${art.id}`}
                                className="even:bg-sky-50/40"
                              >
                                <td className="py-2.5 px-2.5 font-bold text-slate-500 whitespace-nowrap text-center">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-800 leading-snug">
                                  {art.studentName}
                                </td>
                                <td className="py-2.5 px-2.5 text-slate-700 font-medium whitespace-nowrap">
                                  {art.className}
                                </td>
                                <td className="py-2.5 px-2.5 text-blue-900 font-semibold whitespace-nowrap">
                                  {normalizePsvField(art.field)}
                                </td>
                                <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap text-center">
                                  {getArtworkYear(art.createdAt)}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700 leading-snug">
                                  {art.title}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-black text-amber-600 whitespace-nowrap">
                                  {art.likes?.length || 0}{" "}
                                  <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-0.5 -mt-0.5" />
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* JADUAL 2: SENARAI PENGKRITIK */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="text-base md:text-lg font-black text-blue-900 flex items-center gap-2">
                    <span className="bg-blue-600 text-yellow-300 p-1.5 rounded-lg">
                      <Award className="w-4 h-4" />
                    </span>
                    2. Senarai Nama Pengkritik Berdaftar (
                    {filteredCriticsForPrint.length} Rekod)
                  </h4>
                  {filteredCriticsForPrint.length > ITEMS_PER_PAGE && (
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 no-print">
                      Halaman {safeCriticPage} daripada {totalCriticPages} (10
                      nama/halaman)
                    </span>
                  )}
                </div>

                <div className="screen-only-table">
                  <div className="overflow-x-auto border-2 border-amber-200 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-amber-100 text-blue-950 border-b-2 border-amber-200">
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap w-10 text-center">
                            Bil
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Nama Pengkritik
                          </th>
                          <th className="py-2.5 px-3 font-black whitespace-nowrap">
                            Kelas / Kategori
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Jumlah Komen
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Jumlah Bintang
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedCritics.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-6 text-center text-slate-400 italic"
                            >
                              Tiada rekod pengkritik bagi tapisan ini.
                            </td>
                          </tr>
                        ) : (
                          paginatedCritics.map((critic: any, idx: number) => {
                            const rowNumber =
                              (safeCriticPage - 1) * ITEMS_PER_PAGE + idx + 1;
                            return (
                              <tr
                                key={critic.normName}
                                className="even:bg-amber-50/30 hover:bg-amber-50/60"
                              >
                                <td className="py-2.5 px-2.5 font-bold text-slate-500 whitespace-nowrap text-center">
                                  {rowNumber}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-800 leading-snug">
                                  {critic.displayName}{" "}
                                  {critic.isVip ? "(VIP)" : ""}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                                  {critic.className}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 whitespace-nowrap">
                                  {critic.commentsCount}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-black text-amber-600 whitespace-nowrap">
                                  {critic.likesCount}{" "}
                                  <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-0.5 -mt-0.5" />
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalCriticPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1 no-print">
                      <span className="text-xs font-semibold text-slate-500">
                        Memaparkan {(safeCriticPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                        {Math.min(
                          safeCriticPage * ITEMS_PER_PAGE,
                          filteredCriticsForPrint.length
                        )}{" "}
                        daripada {filteredCriticsForPrint.length} rekod
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            SoundFX.click();
                            setCriticPage((p) => Math.max(1, p - 1));
                          }}
                          disabled={safeCriticPage <= 1}
                          className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-amber-300 bg-white hover:bg-amber-50 text-blue-900 disabled:opacity-40 flex items-center gap-1 transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Sebelum
                        </button>
                        {Array.from(
                          { length: totalCriticPages },
                          (_, i) => i + 1
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => {
                              SoundFX.click();
                              setCriticPage(pageNum);
                            }}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                              safeCriticPage === pageNum
                                ? "bg-amber-500 text-blue-950 shadow-xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            SoundFX.click();
                            setCriticPage((p) =>
                              Math.min(totalCriticPages, p + 1)
                            );
                          }}
                          disabled={safeCriticPage >= totalCriticPages}
                          className="px-3 py-1.5 rounded-lg text-xs font-extrabold border border-amber-300 bg-white hover:bg-amber-50 text-blue-900 disabled:opacity-40 flex items-center gap-1 transition-colors"
                        >
                          Seterusnya
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="print-only-table">
                  <div className="overflow-x-auto border-2 border-amber-200 rounded-2xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-amber-100 text-blue-950 border-b-2 border-amber-200">
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap w-10 text-center">
                            Bil
                          </th>
                          <th className="py-2.5 px-3 font-black">
                            Nama Pengkritik
                          </th>
                          <th className="py-2.5 px-3 font-black whitespace-nowrap">
                            Kelas / Kategori
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Jumlah Komen
                          </th>
                          <th className="py-2.5 px-2.5 font-black whitespace-nowrap text-center">
                            Jumlah Bintang
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
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
                                key={`print-${critic.normName}`}
                                className="even:bg-amber-50/30"
                              >
                                <td className="py-2.5 px-2.5 font-bold text-slate-500 whitespace-nowrap text-center">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-slate-800 leading-snug">
                                  {critic.displayName}{" "}
                                  {critic.isVip ? "(VIP)" : ""}
                                </td>
                                <td className="py-2.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                                  {critic.className}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 whitespace-nowrap">
                                  {critic.commentsCount}
                                </td>
                                <td className="py-2.5 px-2.5 text-center font-black text-amber-600 whitespace-nowrap">
                                  {critic.likesCount}{" "}
                                  <Star className="w-3.5 h-3.5 inline-block text-amber-500 fill-current ml-0.5 -mt-0.5" />
                                </td>
                              </tr>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-dashed border-slate-300 flex flex-row justify-between items-end gap-8 text-xs text-slate-600 hide-on-screen">
                <div className="pb-1">
                  <p className="font-bold text-blue-900">
                    Kanta Seni - Misi Eksplorasi & Jejak Bintang
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    &copy; {new Date().getFullYear()} E&J Studio. Hak Cipta
                    Terpelihara.
                  </p>
                </div>

                <div className="w-64 text-center shrink-0">
                  <p className="text-[11px] font-semibold text-slate-500 mb-14">
                    Disahkan oleh:
                  </p>
                  <div className="border-t-2 border-slate-800 pt-1.5">
                    <span className="font-black text-slate-800 block uppercase tracking-wide">
                      Pengesahan Guru / Pentadbir
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Tandatangan & Cop Rasmi
                    </span>
                  </div>
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
                Nama Penuh Guru <span className="text-red-500 text-sm">*</span>
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
                Username Log Masuk Guru{" "}
                <span className="text-red-500 text-sm">*</span>
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
                Kata Laluan Guru <span className="text-red-500 text-sm">*</span>
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
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-black text-blue-900">
                        {t.fullName}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Username:{" "}
                        <span className="font-bold text-slate-800">
                          {t.username}
                        </span>{" "}
                        • Kata Laluan:{" "}
                        <span className="font-mono bg-white px-1.5 py-0.5 rounded border">
                          {t.password}
                        </span>
                      </div>
                      <span className="inline-block mt-1.5 bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {t.classAssigned}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTeacher(t.id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-xl transition-colors"
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
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Tetapan Log Masuk Admin
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Tukar nama pengguna (Username) atau kata laluan (Password)
              Pentadbir Utama di sini.
            </p>
          </div>

          <form onSubmit={handleUpdateAdminCreds} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Username Admin Baharu{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <input
                type="text"
                value={newAdminUser}
                onChange={(e) => setNewAdminUser(e.target.value)}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Kata Laluan Admin Baharu{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  required
                  className="w-full border-2 border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm font-semibold focus:outline-none focus:border-blue-600"
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
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black py-3.5 rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:translate-y-0.5 transition-all border-2 border-blue-900"
            >
              Simpan Perubahan Tetapan Admin
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

// --- MODAL PENDAFTARAN PENGKRITIK (PASPORT) ---
function PassportRegistrationModal({
  onClose,
  onRegister,
  getGlobalHistoryByName,
  hasPendingArtwork,
  onGoToGallery,
}: {
  onClose: () => void;
  onRegister: (data: {
    fullName: string;
    className: string;
    email: string;
  }) => {
    success: boolean;
    message?: string;
    isRenewal?: boolean;
    isVip?: boolean;
    sessionNumber?: number;
    remainingQuota?: number;
  };
  getGlobalHistoryByName: (name: string) => {
    starredArtworkIds: string[];
    commentedArtworkIds: string[];
    totalSessionsCompleted: number;
  };
  hasPendingArtwork: boolean;
  onGoToGallery: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("Tahun 1");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [regResult, setRegResult] = useState<{
    isRenewal?: boolean;
    isVip?: boolean;
    sessionNumber?: number;
  }>({});

  const liveHistory = useMemo(
    () => getGlobalHistoryByName(fullName),
    [fullName, getGlobalHistoryByName]
  );

  const isSelectedVip = isVipCategory(className);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const result = onRegister({
      fullName: fullName.trim(),
      className,
      email: email.trim(),
    });

    if (result.success) {
      setRegResult({
        isRenewal: result.isRenewal,
        isVip: result.isVip,
        sessionNumber: result.sessionNumber,
      });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div
        className={`bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 transition-colors duration-300 animate-modal-enter ${
          isSelectedVip ? "border-amber-500" : "border-yellow-400"
        }`}
      >
        <div
          className={`p-6 flex justify-between items-center relative overflow-hidden transition-colors duration-300 ${
            isSelectedVip
              ? "bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-yellow-300"
              : "bg-blue-700 text-white"
          }`}
        >
          <Award
            className={`absolute top-1 right-10 w-20 h-20 opacity-40 animate-float-slow ${
              isSelectedVip ? "text-yellow-400" : "text-blue-500"
            }`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black flex items-center relative z-10">
                <Award
                  className={`mr-2 ${
                    isSelectedVip ? "text-yellow-400" : "text-yellow-400"
                  }`}
                />
                {isSelectedVip ? "Pasport VIP" : "Pasport Pengkritik"}
              </h3>
            </div>
            <p
              className={`text-xs font-medium mt-0.5 relative z-10 ${
                isSelectedVip ? "text-amber-200/80" : "text-blue-200"
              }`}
            >
              {isSelectedVip
                ? "Pasport Eksklusif Guru & PIBG (Kuota 3 karya/pasport)"
                : "Kuota 3 karya bagi setiap pasport (boleh daftar semula jika tamat)"}
            </p>
          </div>
          <button
            onClick={onClose}
            title="Tutup"
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md border border-red-300/60 transition-all hover:scale-105 active:scale-95 relative z-10"
          >
            <X className="w-5 h-5 stroke-[2.75]" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 border ${
                isSelectedVip
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : "bg-sky-50 border-blue-200 text-blue-900"
              }`}
            >
              <Lock
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isSelectedVip ? "text-amber-600" : "text-blue-600"
                }`}
              />
              <span>
                Setiap pasport memberi kuota <strong>3 karya</strong> untuk
                diberi bintang & komen. Anda juga boleh{" "}
                <strong>membalas komen tanpa had</strong>. Jika pasport tamat,
                anda boleh daftar semula untuk mendapat pasport baharu!
              </span>
            </div>

            {fullName.trim().length > 0 &&
              liveHistory.totalSessionsCompleted > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-xl text-xs text-amber-950 flex items-center justify-between gap-2 animate-pop-up">
                  <div>
                    <span className="font-black block">
                      Selamat Kembali! Rekod Sedia Ada Dikesan
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Anda telah melengkapkan{" "}
                      <strong>
                        {liveHistory.totalSessionsCompleted} pasport
                      </strong>{" "}
                      sebelum ini. Daftar sekarang untuk Pasport #
                      {liveHistory.totalSessionsCompleted + 1} (Kuota baharu 3/3
                      karya)!
                    </span>
                  </div>
                </div>
              )}

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Nama Penuh <span className="text-red-500 text-base">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Cth: Ahmad Zikri bin Roslan"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                Kelas / Kategori{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white font-semibold"
              >
                <option value="Tahun 1">Tahun 1</option>
                <option value="Tahun 2">Tahun 2</option>
                <option value="Tahun 3">Tahun 3</option>
                <option value="Tahun 4">Tahun 4</option>
                <option value="Tahun 5">Tahun 5</option>
                <option value="Tahun 6">Tahun 6</option>
                <option value="Guru">Guru (VIP Emas)</option>
                <option value="PIBG">PIBG (VIP Emas)</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">
                E-mel (Pilihan)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Cth: pengkritik@sekolah.edu.my"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
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
                className={`w-2/3 px-4 py-3 font-black rounded-xl hover:translate-y-0.5 transition-all border-2 flex items-center justify-center gap-2 ${
                  isSelectedVip
                    ? "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-slate-900 shadow-[0_4px_0_rgb(15,23,42)]"
                    : "bg-yellow-400 hover:bg-yellow-300 text-blue-900 border-blue-900 shadow-[0_4px_0_rgb(180,83,9)]"
                }`}
              >
                {liveHistory.totalSessionsCompleted > 0
                  ? isSelectedVip
                    ? `Jana Pasport VIP #${
                        liveHistory.totalSessionsCompleted + 1
                      }`
                    : `Jana Pasport Baharu #${
                        liveHistory.totalSessionsCompleted + 1
                      }`
                  : isSelectedVip
                  ? "Jana Pasport VIP!"
                  : "Jana Pasport!"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-5 animate-pop-up">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-bounce ${
                regResult.isVip
                  ? "bg-amber-100 text-amber-600 ring-4 ring-yellow-400"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {regResult.isVip ? (
                <Crown className="w-10 h-10 fill-current" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>
            <div>
              <h4 className="text-xl font-black text-blue-900">
                {regResult.isVip
                  ? `Pasport VIP #${regResult.sessionNumber || 1} Diaktifkan!`
                  : regResult.isRenewal
                  ? `Pasport Baharu #${regResult.sessionNumber} Diaktifkan!`
                  : "Pasport Berjaya Dijana!"}
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Kuota baharu <strong>3 daripada 3 karya</strong> kini aktif
                untuk <strong>{fullName}</strong>.
              </p>
            </div>

            <button
              onClick={onGoToGallery}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center"
            >
              {hasPendingArtwork ? "Teruskan pada Karya Ini" : "Ke Galeri Seni"}{" "}
              <Compass className="ml-2 w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- KOMPONEN ITEM KOMEN & BALASAN KOMEN ---
function CommentThreadItem({
  comment,
  vipRegistry,
  activePassport,
  isStaffLoggedIn,
  isLightbox = false,
  onReply,
  onDeleteReply,
  onDeleteComment,
}: {
  comment: any;
  vipRegistry: Record<string, string>;
  activePassport: any;
  isStaffLoggedIn: boolean;
  isLightbox?: boolean;
  onReply: (commentId: string, text: string) => Promise<boolean> | boolean;
  onDeleteReply: (commentId: string, replyObj: any) => void;
  onDeleteComment: (commentObj: any) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const authorName = comment.authorName || "Penjelajah Misteri";
  const authorInitial = (authorName.charAt(0) || "P").toUpperCase();
  const normAuthor = authorName.trim().toLowerCase().replace(/\s+/g, " ");
  const detectedClass = comment.authorClass || vipRegistry?.[normAuthor] || "";
  const isCommentVip = Boolean(comment.isVip) || isVipCategory(detectedClass);
  const replies = Array.isArray(comment.replies) ? comment.replies : [];

  const handleOpenReply = () => {
    SoundFX.click();
    if (!activePassport) {
      onReply(comment.id, "");
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = replyText.trim();
    if (!clean || isSubmittingReply) return;

    setIsSubmittingReply(true);
    const ok = await onReply(comment.id, clean);
    setIsSubmittingReply(false);
    if (ok) {
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div
      className={`rounded-2xl transition-all ${
        isLightbox ? "p-4 text-sm shadow-md" : "p-3 text-xs shadow-sm"
      } ${
        isCommentVip
          ? "bg-gradient-to-br from-[#3b230a] via-[#231405] to-[#0f0a05] text-amber-50 border-2 border-amber-500/80"
          : isLightbox
          ? "bg-slate-50 border border-slate-200 text-slate-800"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Baris Atas: Avatar + Nama (Kategori) + Masa */}
      <div className="flex justify-between items-center gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar Bulat + Lencana VIP bertindih di bawah */}
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${
                isCommentVip
                  ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 text-slate-950 border-2 border-yellow-200"
                  : "bg-blue-600 text-white border-2 border-white"
              }`}
            >
              {authorInitial}
            </div>
            {isCommentVip && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black text-yellow-400 border border-yellow-400 text-[8px] font-black px-1.5 py-[0.5px] rounded-full uppercase tracking-wider leading-none shadow-xs">
                VIP
              </span>
            )}
          </div>

          {/* Nama & Kategori (cth: abu bin ali (Guru)) */}
          <div className="truncate">
            <span
              className={`font-black text-sm ${
                isCommentVip ? "text-yellow-300" : "text-blue-800"
              }`}
            >
              {authorName}
            </span>
            {detectedClass && (
              <span
                className={`font-bold text-xs ml-1.5 ${
                  isCommentVip ? "text-amber-200" : "text-slate-600"
                }`}
              >
                ({detectedClass})
              </span>
            )}
          </div>
        </div>

        {/* Masa & Butang Padam Staf */}
        <div className="flex items-center gap-1.5 shrink-0">
          {comment.timestamp && (
            <span
              className={`text-[11px] font-medium ${
                isCommentVip ? "text-amber-200/75" : "text-slate-400"
              }`}
            >
              {formatTimeAgo(comment.timestamp)}
            </span>
          )}
          {isStaffLoggedIn && (
            <button
              type="button"
              onClick={() => onDeleteComment(comment)}
              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/50 transition-colors"
              title="Padam komen ini & tolak bintang pengguna"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Isi Komen */}
      <p
        className={`leading-relaxed whitespace-pre-line ${
          isCommentVip ? "text-amber-50/95 font-medium" : "text-slate-700"
        }`}
      >
        {comment.text}
      </p>

      {/* Butang Balas Komen */}
      <div className="mt-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleOpenReply}
          className={`inline-flex items-center gap-1 font-extrabold transition-colors ${
            isLightbox ? "text-xs" : "text-[11px]"
          } ${
            isCommentVip
              ? "text-yellow-400 hover:text-yellow-300"
              : activePassport
              ? "text-blue-700 hover:text-blue-900"
              : "text-amber-700 hover:text-amber-900"
          }`}
        >
          <Reply className="w-3 h-3" />
          <span>Balas</span>
          {!activePassport && (
            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full border border-amber-300">
              Pasport
            </span>
          )}
        </button>

        {replies.length > 0 && (
          <span
            className={`text-[10px] font-semibold ${
              isCommentVip ? "text-amber-200/70" : "text-slate-400"
            }`}
          >
            {replies.length} balasan
          </span>
        )}
      </div>

      {/* Kotak Input Balas Komen */}
      {isReplying && activePassport && (
        <form
          onSubmit={handleSendReply}
          className="mt-2.5 pl-2.5 border-l-2 border-yellow-400 flex items-center gap-1.5 animate-pop-up"
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Balas sebagai ${activePassport.fullName} (tanpa had)...`}
            autoFocus
            className="flex-1 text-xs bg-white text-slate-800 border-2 border-blue-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!replyText.trim() || isSubmittingReply}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-1.5 rounded-xl transition-all active:scale-90 shrink-0"
            title="Hantar balasan"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              SoundFX.click();
              setIsReplying(false);
              setReplyText("");
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            title="Batal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Senarai Balasan Komen Bersarang */}
      {replies.length > 0 && (
        <div
          className={`mt-2.5 pl-3 border-l-2 space-y-2 ${
            isCommentVip ? "border-amber-500/50" : "border-blue-200"
          }`}
        >
          {replies.map((reply: any) => {
            const normReplyAuthor = (reply.authorName || "")
              .trim()
              .toLowerCase()
              .replace(/\s+/g, " ");
            const replyClass =
              reply.authorClass || vipRegistry?.[normReplyAuthor] || "";
            const isReplyVip =
              Boolean(reply.isVip) || isVipCategory(replyClass);

            return (
              <div
                key={reply.id}
                className={`rounded-xl p-2 text-xs ${
                  isReplyVip
                    ? "bg-gradient-to-r from-[#2c1906] to-[#140c04] text-amber-50 border border-amber-500/70"
                    : "bg-white text-slate-800 border border-slate-200/80"
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-0.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <CornerDownRight
                      className={`w-3 h-3 shrink-0 ${
                        isReplyVip ? "text-yellow-400" : "text-blue-400"
                      }`}
                    />
                    <span
                      className={`font-extrabold ${
                        isReplyVip ? "text-yellow-300" : "text-blue-800"
                      }`}
                    >
                      {reply.authorName || "Pengkritik"}
                    </span>
                    {isReplyVip && (
                      <span className="inline-flex items-center bg-black text-yellow-400 border border-yellow-400 text-[8px] font-black px-1 py-0.2 rounded-full uppercase">
                        VIP
                      </span>
                    )}
                    {replyClass && (
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                          isReplyVip
                            ? "text-amber-200"
                            : "text-slate-500 bg-slate-100"
                        }`}
                      >
                        ({replyClass})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {reply.timestamp && (
                      <span
                        className={`text-[9px] ${
                          isReplyVip ? "text-amber-200/70" : "text-slate-400"
                        }`}
                      >
                        {formatTimeAgo(reply.timestamp)}
                      </span>
                    )}
                    {isStaffLoggedIn && (
                      <button
                        type="button"
                        onClick={() => onDeleteReply(comment.id, reply)}
                        className="text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                        title="Padam balasan ini"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p
                  className={`leading-snug pl-4 whitespace-pre-line ${
                    isReplyVip ? "text-amber-50/90" : "text-slate-700"
                  }`}
                >
                  {reply.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- ARTWORK CARD ---
function ArtworkCard({
  artwork,
  artworkYear,
  activeUserKey,
  activePassport,
  vipRegistry,
  isStaffLoggedIn,
  onLike,
  onOpenStarList,
  onRequestEdit,
  onRequestDelete,
  onOpenPreview,
  index = 0,
}: any) {
  const [starPopAnim, setStarPopAnim] = useState(false);

  const likes = artwork.likes || [];
  const comments = artwork.comments || [];
  const isLiked = activePassport ? likes.includes(activeUserKey) : false;

  const { media, story } = useMemo(
    () => parseMediaAndStory(artwork.description),
    [artwork.description]
  );

  const starGivers = useMemo(
    () => parseStarGivers(likes, comments, vipRegistry),
    [likes, comments, vipRegistry]
  );

  const totalRepliesCount = useMemo(
    () =>
      comments.reduce(
        (acc: number, c: any) =>
          acc + (Array.isArray(c.replies) ? c.replies.length : 0),
        0
      ),
    [comments]
  );

  const handleStarClick = () => {
    setStarPopAnim(true);
    setTimeout(() => setStarPopAnim(false), 450);
    onLike();
  };

  const animDelay = `${Math.min(index * 0.06, 0.5)}s`;

  return (
    <div
      style={{ animationDelay: animDelay }}
      className="break-inside-avoid bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-slate-100 overflow-hidden flex flex-col animate-pop-up group/card"
    >
      <div
        onClick={onOpenPreview}
        title="Klik untuk besarkan dan zoom karya"
        className="relative group overflow-hidden bg-slate-100 cursor-zoom-in"
      >
        <img
          src={
            getOptimizedArtworkUrl(artwork.imageUrl, "thumb") ||
            "https://placehold.co/600x400?text=Karya+Seni+Murid"
          }
          alt={artwork.title}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e: any) => {
            e.target.src =
              "https://placehold.co/600x400/e2e8f0/475569?text=Gambar+Tidak+Dijumpai";
          }}
        />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          <span className="bg-yellow-400/95 backdrop-blur-sm text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
            {artwork.className}
          </span>
          <span className="bg-blue-900/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {artworkYear}
          </span>
          <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            {normalizePsvField(artwork.field)}
          </span>
        </div>

        <div className="absolute inset-0 bg-blue-950/0 group-hover:bg-blue-950/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/95 text-blue-900 font-extrabold text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
            <ZoomIn className="w-4 h-4 text-blue-600" />
            Lihat & Zoom Karya
          </span>
        </div>

        {isStaffLoggedIn && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestEdit();
              }}
              className="bg-blue-600/95 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition-all opacity-95 hover:opacity-100 hover:scale-110 active:scale-90"
              title="Edit Maklumat & Gambar Karya (Admin/Guru)"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete();
              }}
              className="bg-red-500/95 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all opacity-95 hover:opacity-100 hover:scale-110 active:scale-90"
              title="Padam Karya (Admin/Guru)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h4 className="text-xl font-extrabold text-slate-800 mb-1 leading-snug group-hover/card:text-blue-800 transition-colors">
          {artwork.title}
        </h4>
        <div
          title={artwork.studentName}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 mb-3 min-w-0"
        >
          <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
          </span>
          <span className="truncate">{artwork.studentName}</span>
        </div>

        {(media || story) && (
          <div className="space-y-2 mb-3">
            {media && (
              <div
                title={media}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-[11px] font-extrabold max-w-full"
              >
                <Palette className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                <span className="truncate">{media}</span>
              </div>
            )}
            {story && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-sky-50/70 p-2.5 rounded-xl border border-blue-100">
                "{story}"
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleStarClick}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-bold text-sm transition-all active:scale-90 ${
                isLiked
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-inner"
                  : "bg-slate-100 text-slate-500 hover:bg-yellow-50 hover:text-yellow-600"
              }`}
              title={
                isLiked
                  ? "Anda telah memberi bintang pada karya ini"
                  : "Beri Bintang Apresiasi"
              }
            >
              <Star
                className={`w-5 h-5 ${starPopAnim ? "animate-star-pop" : ""} ${
                  isLiked ? "fill-current text-yellow-500" : "text-amber-500"
                }`}
              />
              <span>{likes.length}</span>
            </button>

            <StarGiversAvatars
              givers={starGivers}
              onOpenStarList={onOpenStarList}
            />
          </div>

          <button
            type="button"
            onClick={onOpenPreview}
            title="Klik untuk buka pop-up & tulis/lihat komen serta 3 soalan apresiasi"
            className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 text-sm font-bold px-3.5 py-1.5 rounded-full transition-colors active:scale-95"
          >
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>
              {comments.length}
              {totalRepliesCount > 0 ? ` (+${totalRepliesCount})` : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/// --- MODAL POP-UP & ZOOM + DRAG (PAN) GAMBAR KARYA (z-50) ---
function ArtworkLightboxModal({
  artwork,
  artworkYear,
  activeUserKey,
  activePassport,
  vipRegistry,
  isStaffLoggedIn,
  initialOpenQuiz = false,
  onClose,
  onLike,
  onRequestPassport,
  onOpenStarList,
  onComment,
  onReply,
  onDeleteReply,
  onDeleteComment,
  onRequestEdit,
  onRequestDelete,
}: any) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Ref untuk auto-skrol 1 laluan skrol tunggal ke komen terakhir & kotak soalan + butang Hantar
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const lastCommentAnchorRef = useRef<HTMLDivElement>(null);
  const bottomFormAnchorRef = useRef<HTMLDivElement>(null);

  const [commentInput, setCommentInput] = useState("");
  const [starPopAnim, setStarPopAnim] = useState(false);

  const stage = getStageFromClass(artwork.className);
  const artworkField = normalizePsvField(artwork.field);
  const { media: artworkMedia, story: artworkStory } = useMemo(
    () => parseMediaAndStory(artwork.description),
    [artwork.description]
  );

  const [isQuizOpen, setIsQuizOpen] = useState(
    Boolean(initialOpenQuiz && activePassport)
  );
  const [quizQuestions, setQuizQuestions] = useState<AppreciationQuestion[]>(
    () => pickThreeRandomQuestions(stage, artworkField)
  );
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    setQuizQuestions(pickThreeRandomQuestions(stage, artworkField));
    setCurrentQuizIdx(0);
    setQuizAnswers({});
    if (initialOpenQuiz && activePassport) {
      setIsQuizOpen(true);
    }
  }, [artwork.id, stage, artworkField, initialOpenQuiz, activePassport]);

  // Auto-skrol lancar apabila kotak 3 soalan dibuka supaya komen terakhir, soalan penuh & butang Hantar kelihatan
  useEffect(() => {
    if (!isQuizOpen) return;

    const timer = setTimeout(() => {
      const isDesktop =
        typeof window !== "undefined" && window.innerWidth >= 1024;
      const scrollContainer = isDesktop
        ? rightPanelRef.current
        : modalContainerRef.current;

      if (scrollContainer && lastCommentAnchorRef.current) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const anchorRect = lastCommentAnchorRef.current.getBoundingClientRect();
        const targetTop =
          scrollContainer.scrollTop + (anchorRect.top - containerRect.top) - 16;

        scrollContainer.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      } else if (bottomFormAnchorRef.current) {
        bottomFormAnchorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isQuizOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const likes = artwork.likes || [];
  const comments = artwork.comments || [];
  const isLiked = activePassport ? likes.includes(activeUserKey) : false;

  const starGivers = useMemo(
    () => parseStarGivers(likes, comments, vipRegistry),
    [likes, comments, vipRegistry]
  );

  const handleZoomIn = () => {
    SoundFX.click();
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    SoundFX.click();
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    SoundFX.click();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleToggleDoubleClickZoom = () => {
    if (isDragging) return;
    SoundFX.click();
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(2.5);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleStarClick = () => {
    setStarPopAnim(true);
    setTimeout(() => setStarPopAnim(false), 450);
    onLike();
  };

  const handleSelectQuizAnswer = (qIdx: number, ans: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: ans }));
    if (qIdx < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuizIdx(qIdx + 1);
      }, 180);
    } else {
      // Selepas soalan ke-3 dipilih, pastikan butang Hantar di bawah jelas kelihatan
      setTimeout(() => {
        bottomFormAnchorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 180);
    }
  };

  const answeredList = quizQuestions
    .map((q, idx) =>
      quizAnswers[idx]
        ? {
            category: q.category,
            question: q.question,
            answer: quizAnswers[idx],
          }
        : null
    )
    .filter(Boolean) as Array<{
    category: string;
    question: string;
    answer: string;
  }>;

  const canSubmitComment =
    commentInput.trim().length > 0 || answeredList.length > 0;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;
    onComment(
      commentInput.trim(),
      answeredList.length > 0 ? answeredList : undefined
    );
    setCommentInput("");
    setQuizAnswers({});
    setCurrentQuizIdx(0);
    setIsQuizOpen(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6"
    >
      {/* 1 SKROL TUNGGAL SAHAJA: Mudah alih/tablet skrol di container utama; Desktop skrol di lajur kanan */}
      <div
        ref={modalContainerRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] w-full max-w-6xl max-h-[92vh] lg:h-[90vh] overflow-y-auto lg:overflow-hidden shadow-2xl border-4 border-yellow-400 flex flex-col lg:flex-row relative animate-modal-enter"
      >
        <button
          onClick={onClose}
          title="Tutup Paparan"
          className="sticky lg:absolute top-3 right-3 ml-auto lg:ml-0 z-30 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-90 border-2 border-white shrink-0"
        >
          <X className="w-5 h-5 stroke-[2.75]" />
        </button>

        {/* Bahagian Kiri: Kawasan Gambar & Kawalan Zoom + Drag */}
        <div className="lg:w-3/5 bg-slate-900 relative flex flex-col justify-between min-h-[260px] sm:min-h-[360px] lg:h-full shrink-0 overflow-hidden select-none -mt-10 lg:mt-0">
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-lg">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              title="Kecilkan (Zoom Out)"
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-30 transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-xs font-extrabold text-yellow-400 min-w-[44px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 4}
              title="Besarkan (Zoom In)"
              className="p-1.5 text-white hover:text-yellow-400 disabled:opacity-30 transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                title="Saiz Asal"
                className="p-1.5 text-slate-300 hover:text-white border-l border-slate-600 pl-2 ml-1 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div
            onDoubleClick={handleToggleDoubleClickZoom}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: zoomLevel > 1 ? "none" : "auto" }}
            className={`flex-1 flex items-center justify-center overflow-hidden p-4 md:p-8 ${
              zoomLevel > 1
                ? isDragging
                  ? "cursor-grabbing"
                  : "cursor-grab"
                : "cursor-zoom-in"
            }`}
          >
            <img
              src={
                artwork.imageUrl ||
                "https://placehold.co/800x600?text=Karya+Seni+Murid"
              }
              alt={artwork.title}
              draggable={false}
              style={{
                transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`,
              }}
              className={`max-h-[48vh] lg:max-h-[76vh] w-auto object-contain rounded-xl shadow-2xl ${
                isDragging ? "" : "transition-transform duration-200 ease-out"
              }`}
              onError={(e: any) => {
                e.target.src =
                  "https://placehold.co/800x600/1e293b/94a3b8?text=Gambar+Tidak+Dijumpai";
              }}
            />
          </div>

          <div className="bg-slate-950/80 text-slate-300 text-xs text-center py-2 px-4 font-medium flex items-center justify-center gap-1.5 shrink-0">
            {zoomLevel > 1 ? (
              <>
                <Move className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>
                  Seret gambar untuk gerakkan paparan • Tekan 2x untuk kembali
                  ke saiz asal
                </span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>
                  Tip: Tekan 2x pada gambar atau klik ikon + untuk zoom &amp;
                  seret ke semua arah
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bahagian Kanan: Satu Aliran Skrol Tunggal (Maklumat + Komen + Soalan Penuh + Butang Hantar) */}
        <div
          ref={rightPanelRef}
          className="lg:w-2/5 flex flex-col lg:h-full lg:overflow-y-auto bg-white border-t-4 lg:border-t-0 lg:border-l-4 border-yellow-400"
        >
          {/* Maklumat Karya */}
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3 lg:pr-10">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-yellow-400 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full">
                  {artwork.className}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  Sesi {artworkYear}
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                  {artworkField}
                </span>
              </div>
              {isStaffLoggedIn && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onRequestEdit}
                    className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={onRequestDelete}
                    className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Padam
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-2xl font-black text-blue-950 leading-tight mb-2">
              {artwork.title}
            </h3>

            {/* Nama Pelukis 1 Baris + Ikon Lencana Kontra */}
            <div
              title={artwork.studentName}
              className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 min-w-0"
            >
              <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
              </span>
              <span className="truncate">{artwork.studentName}</span>
            </div>

            {/* PENERANGAN: MEDIA / BAHAN & TEKNIK + CERITA KARYA */}
            {(artworkMedia || artworkStory) && (
              <div className="mb-4 space-y-2.5">
                {artworkMedia && (
                  <div className="bg-indigo-50/90 border border-indigo-200 rounded-2xl p-3 flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Palette className="w-4 h-4 text-indigo-700" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-800">
                        Media &amp; Bahan
                      </span>
                      <span className="block text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                        {artworkMedia}
                      </span>
                    </div>
                  </div>
                )}

                {artworkStory && (
                  <div className="bg-amber-50/85 border border-amber-200 rounded-2xl p-3.5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
                      Cerita &amp; Keterangan Karya
                    </span>
                    {artworkStory}
                  </div>
                )}
              </div>
            )}

            {/* Baris Butang Bintang + Avatar (Kiri) & Bilangan Komen (Kanan) */}
            <div className="flex items-center justify-between gap-3 w-full pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={handleStarClick}
                  title={
                    isLiked
                      ? "Klik sekali lagi untuk batalkan bintang"
                      : "Klik untuk beri bintang pada karya ini"
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-extrabold text-sm transition-all shadow-xs active:scale-90 shrink-0 ${
                    isLiked
                      ? "bg-white text-amber-800 border-2 border-yellow-400"
                      : "bg-slate-100 text-slate-600 hover:bg-yellow-50 hover:text-yellow-800 border-2 border-transparent"
                  }`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      starPopAnim ? "animate-star-pop" : ""
                    } ${
                      isLiked
                        ? "fill-current text-yellow-500"
                        : "text-amber-500"
                    }`}
                  />
                  <span>{likes.length} Bintang</span>
                </button>

                <StarGiversAvatars
                  givers={starGivers}
                  onOpenStarList={onOpenStarList}
                />
              </div>

              <div className="text-sm font-bold text-slate-600 flex items-center gap-1.5 shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>{comments.length} Komen</span>
              </div>
            </div>
          </div>

          {/* Senarai Komen (Tanpa skrol berasingan) */}
          <div className="flex-1 p-5 sm:p-6 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Jejak Apresiasi &amp; Komen
            </h4>
            {comments.length === 0 ? (
              <div
                ref={lastCommentAnchorRef}
                className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
              >
                <p className="text-sm text-slate-400 italic">
                  Belum ada komen pada karya ini. <br />
                  Berikan kata-kata semangat kepada rakan anda!
                </p>
              </div>
            ) : (
              comments.map((c: any, idx: number) => (
                <div
                  key={c.id}
                  ref={
                    idx === comments.length - 1 ? lastCommentAnchorRef : null
                  }
                >
                  <CommentThreadItem
                    comment={c}
                    vipRegistry={vipRegistry}
                    activePassport={activePassport}
                    isStaffLoggedIn={isStaffLoggedIn}
                    isLightbox={true}
                    onReply={(commentId: string, text: string) =>
                      onReply(commentId, text)
                    }
                    onDeleteReply={(commentId: string, replyObj: any) =>
                      onDeleteReply(commentId, replyObj)
                    }
                    onDeleteComment={(commentObj: any) =>
                      onDeleteComment(commentObj)
                    }
                  />
                </div>
              ))
            )}
          </div>

          {/* Bahagian Soalan Apresiasi Penuh & Borang Hantar (Sentiasa berada tepat di bawah soalan) */}
          <div
            ref={bottomFormAnchorRef}
            className="p-4 sm:p-5 bg-sky-50 border-t-2 border-blue-200 mt-auto"
          >
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              {activePassport ? (
                <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span className="truncate max-w-[180px]">
                    {activePassport.fullName} (Baki{" "}
                    {3 - activePassport.usedCount}/3 ★)
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onRequestPassport}
                  className="text-xs font-extrabold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Daftar Pasport Dahulu
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!activePassport) {
                    onRequestPassport();
                    return;
                  }
                  SoundFX.click();
                  setIsQuizOpen((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 transition-all active:scale-95 shadow-xs ${
                  isQuizOpen
                    ? "bg-blue-800 text-yellow-300 border-blue-900"
                    : "bg-yellow-400 text-blue-900 border-yellow-500 hover:bg-yellow-300"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {isQuizOpen ? "Tutup Soalan" : "Jawab 3 Soalan Apresiasi"}
              </button>
            </div>

            {/* Kotak 3 Soalan dipapar PENUH tanpa skrol dalaman */}
            {isQuizOpen && activePassport && (
              <div className="mb-3">
                <PassportQuizBox
                  stage={stage}
                  field={artworkField}
                  questions={quizQuestions}
                  currentIndex={currentQuizIdx}
                  answers={quizAnswers}
                  onSelectAnswer={handleSelectQuizAnswer}
                  onChangeStep={setCurrentQuizIdx}
                  onRefreshQuestions={() => {
                    setQuizQuestions(
                      pickThreeRandomQuestions(stage, artworkField)
                    );
                    setCurrentQuizIdx(0);
                    setQuizAnswers({});
                  }}
                  onClose={() => setIsQuizOpen(false)}
                />
              </div>
            )}

            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={
                  answeredList.length > 0
                    ? "Tambah komen bebas (pilihan) & tekan Hantar..."
                    : activePassport
                    ? "Tulis pujian atau jawab 3 soalan di atas..."
                    : "Sila daftar Pasport untuk komen..."
                }
                className="flex-1 text-sm bg-white border-2 border-blue-200 rounded-full px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!canSubmitComment}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-full font-bold text-sm transition-all shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Hantar</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODAL FORM TAMBAH & EDIT KARYA (z-[65] SUPAYA SENTIASA DI HADAPAN LIGHTBOX) ---
function ArtworkFormModal({
  mode = "add",
  initialData,
  onClose,
  onSubmit,
}: {
  mode?: "add" | "edit";
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const initialField = normalizePsvField(initialData?.field) as PsvFieldType;
  const parsedInitial = parseMediaAndStory(initialData?.description);

  const [title, setTitle] = useState(initialData?.title || "");
  const [studentName, setStudentName] = useState(
    initialData?.studentName || ""
  );
  const [className, setClassName] = useState(
    initialData?.className || "Tahun 1"
  );
  const [field, setField] = useState<PsvFieldType>(initialField);
  const [selectedMedia, setSelectedMedia] = useState<string>(
    parsedInitial.media || (MEDIA_BY_FIELD[initialField]?.[0] ?? "")
  );
  const [story, setStory] = useState(parsedInitial.story || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const [uploadMethod, setUploadMethod] = useState<"file" | "url">(
    initialData?.imageUrl && !initialData.imageUrl.startsWith("data:")
      ? "url"
      : "file"
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const availableMediaOptions = useMemo(() => {
    const baseList = MEDIA_BY_FIELD[field] || [];
    if (selectedMedia && !baseList.includes(selectedMedia)) {
      return [selectedMedia, ...baseList];
    }
    return baseList;
  }, [field, selectedMedia]);

  const handleFieldChange = (newField: PsvFieldType) => {
    setField(newField);
    const nextMediaList = MEDIA_BY_FIELD[newField] || [];
    setSelectedMedia(nextMediaList[0] || "");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      SoundFX.alert();
      alert("Sila pilih fail gambar sahaja (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      SoundFX.alert();
      alert("Saiz gambar melebihi 10MB. Sila pilih gambar yang lebih kecil.");
      return;
    }

    setIsProcessingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        SoundFX.success();
      } else {
        throw new Error(
          result.error?.message || "Muat naik ke Cloudinary gagal."
        );
      }
    } catch (err: any) {
      SoundFX.alert();
      alert(
        "Gagal memuat naik gambar ke Cloudinary: " +
          (err.message || "Sila semak sambungan internet anda.")
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !studentName.trim() || !imageUrl.trim()) return;
    const finalImageUrl = formatDirectImageUrl(imageUrl.trim());
    const combinedDescription = formatMediaAndStory(selectedMedia, story);
    onSubmit({
      title: title.trim(),
      studentName: studentName.trim(),
      className,
      field,
      imageUrl: finalImageUrl,
      description: combinedDescription,
    });
  };

  const isEditMode = mode === "edit";

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[65] p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border-4 border-yellow-400 my-auto animate-modal-enter">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white relative overflow-hidden">
          <Sparkles className="absolute top-2 right-12 w-16 h-16 text-blue-400 opacity-40 animate-float-slow" />
          <h3 className="text-2xl font-black flex items-center relative z-10">
            {isEditMode ? (
              <>
                <Pencil className="mr-2 text-yellow-300" /> Kemaskini Maklumat
                Karya
              </>
            ) : (
              <>
                <Plus className="mr-2 text-yellow-300" /> Borang Daftar Karya
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            title="Tutup"
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md border border-red-300/60 transition-all hover:scale-105 active:scale-95 relative z-10"
          >
            <X className="w-5 h-5 stroke-[2.75]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* BARIS 1: TAJUK KARYA SENI (LEBAR PENUH) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tajuk Karya Seni <span className="text-red-500 text-base">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Cth: Pemandangan Kampungku"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* BARIS 2: NAMA MURID (LEBAR PENUH — SAMA SAIZ DENGAN TAJUK KARYA SENI) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Nama Murid <span className="text-red-500 text-base">*</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="Cth: Muhammad Adam Daniel bin Abdullah"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* BARIS 3: KELAS / TAHUN & BIDANG SENI VISUAL (SEIMBANG 2 KOLUM) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Kelas / Tahun <span className="text-red-500 text-base">*</span>
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white font-semibold"
              >
                <option value="Tahun 1">Tahun 1</option>
                <option value="Tahun 2">Tahun 2</option>
                <option value="Tahun 3">Tahun 3</option>
                <option value="Tahun 4">Tahun 4</option>
                <option value="Tahun 5">Tahun 5</option>
                <option value="Tahun 6">Tahun 6</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Bidang Seni Visual{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <select
                value={field}
                onChange={(e) =>
                  handleFieldChange(e.target.value as PsvFieldType)
                }
                required
                className="w-full border-2 border-amber-300 bg-amber-50/70 text-blue-950 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-bold"
              >
                {PSV_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BARIS 3.5: MEDIA & BAHAN (DINAMIK MENGIKUT BIDANG) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Media &amp; Bahan{" "}
              <span className="text-red-500 text-base">*</span>
            </label>
            <select
              value={selectedMedia}
              onChange={(e) => setSelectedMedia(e.target.value)}
              required
              className="w-full border-2 border-indigo-200 bg-indigo-50/70 text-indigo-950 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              {availableMediaOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* BARIS 3.6: CERITA / KETERANGAN KARYA (PILIHAN) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Cerita / Keterangan Karya{" "}
              <span className="text-xs font-normal text-slate-400">
                (Pilihan)
              </span>
            </label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Ceritakan secara ringkas inspirasi atau maksud karya ini..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* BARIS 4: MUAT NAIK GAMBAR KARYA */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {isEditMode
                ? "Tukar / Muat Naik Gambar Karya Baharu"
                : "Muat Naik Gambar Karya"}{" "}
              <span className="text-red-500 text-base">*</span>
            </label>

            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-3">
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setUploadMethod("file");
                }}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  uploadMethod === "file"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-blue-800"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Fail / Kamera
              </button>
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setUploadMethod("url");
                }}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  uploadMethod === "url"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-blue-800"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Pautan Gambar (URL)
              </button>
            </div>

            {uploadMethod === "file" ? (
              <div className="border-2 border-dashed border-blue-300 bg-sky-50/70 rounded-2xl p-4 text-center hover:bg-sky-50 transition-colors">
                <input
                  id="artwork-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="artwork-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-sm">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-blue-900">
                    {isProcessingImage
                      ? "Sedang memuat naik gambar ke Cloudinary..."
                      : imageUrl
                      ? "Klik untuk tukar gambar lain"
                      : "Klik di sini untuk pilih gambar dari peranti"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sokong JPG, PNG, WEBP (Automatik dioptimumkan ke Cloudinary)
                  </span>
                </label>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required={uploadMethod === "url"}
                  placeholder="https://... atau pautan Google Drive"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Tips: Pautan perkongsian Google Drive (Anyone with the link)
                  akan ditukar secara automatik.
                </p>
              </div>
            )}

            {/* RUANG PRATONTON GAMBAR YANG TELAH DIMUAT NAIK */}
            {imageUrl && (
              <div className="mt-3.5 space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Pratonton karya yang telah dimuat naik:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Sedia Dihantar!
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-slate-100">
                  <img
                    src={formatDirectImageUrl(imageUrl)}
                    alt="Pratonton Karya"
                    className="w-full max-h-44 object-contain mx-auto"
                    onError={(e: any) => {
                      e.target.src =
                        "https://placehold.co/600x300/fee2e2/991b1b?text=Pautan+Gambar+Tidak+Sah";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      SoundFX.click();
                      setImageUrl("");
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-transform hover:scale-105"
                    title="Buang gambar ini"
                  >
                    <X className="w-4 h-4 stroke-[2.75]" />
                  </button>
                </div>
              </div>
            )}
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
              disabled={!imageUrl.trim() || isProcessingImage}
              className="w-2/3 px-4 py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-900 font-black rounded-xl shadow-[0_4px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-0.5 active:translate-y-1 transition-all border-2 border-blue-900"
            >
              {isEditMode ? "Simpan Perubahan" : "Hantar ke Galeri!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
