export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;
export const TOTAL_RUKUS = 558;
export const TOTAL_JUZ = 30;

export const SURAH_NAMES = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6
];

export const SURAH_RUKU_COUNTS = [
  1, 40, 20, 24, 16, 20, 24, 10, 16, 11,
  10, 12, 6, 7, 6, 16, 12, 12, 6, 8,
  7, 10, 6, 9, 6, 11, 7, 9, 7, 6,
  4, 3, 9, 6, 5, 5, 5, 5, 8, 9,
  6, 5, 7, 3, 4, 4, 4, 4, 2, 3,
  3, 2, 3, 3, 3, 3, 4, 3, 3, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1
];

export const TARAWEEH_27_NIGHT_RUKUS = [
  21, 42, 61, 82, 101, 123, 145, 167, 187, 208,
  233, 261, 281, 302, 326, 347, 366, 384, 400, 420,
  439, 458, 477, 497, 517, 536, 558
];

export function getAbsoluteRuku(surah: number, rukuInSurah: number): number {
  if (surah < 1 || surah > 114) return 0;
  let count = 0;
  for (let i = 0; i < surah - 1; i++) {
    count += SURAH_RUKU_COUNTS[i];
  }
  return count + rukuInSurah;
}

export function getRelativeRuku(absolute: number): { surah: number; ruku: number } {
  if (absolute <= 0) return { surah: 1, ruku: 0 };
  let count = 0;
  for (let i = 0; i < SURAH_RUKU_COUNTS.length; i++) {
    if (absolute <= count + SURAH_RUKU_COUNTS[i]) {
      return { surah: i + 1, ruku: absolute - count };
    }
    count += SURAH_RUKU_COUNTS[i];
  }
  return { surah: 114, ruku: 1 };
}

// Juz-Ruku reference data (verified via Quran Foundation API)
// Each entry: [juzNumber, startRuku, endRuku, surahs covered string]
// Note: Some boundary rukus may span across Juz divisions
export const JUZ_RUKU_DATA: Array<{
  juz: number;
  name: string;
  startRuku: number;
  endRuku: number;
  rukuCount: number;
  surahs: string;
}> = [
  { juz: 1,  name: "Alif Lam Meem",       startRuku: 1,   endRuku: 17,  rukuCount: 17, surahs: "Al-Fatihah – Al-Baqarah (1–141)" },
  { juz: 2,  name: "Sayaqool",             startRuku: 18,  endRuku: 33,  rukuCount: 16, surahs: "Al-Baqarah (142–252)" },
  { juz: 3,  name: "Tilkal Rusul",         startRuku: 34,  endRuku: 50,  rukuCount: 17, surahs: "Al-Baqarah (253–286) – Al-Imran (1–92)" },
  { juz: 4,  name: "Lan Tana Loo",         startRuku: 51,  endRuku: 64,  rukuCount: 14, surahs: "Al-Imran (93–200) – An-Nisa (1–23)" },
  { juz: 5,  name: "Wal Mohsanat",         startRuku: 65,  endRuku: 81,  rukuCount: 17, surahs: "An-Nisa (24–147)" },
  { juz: 6,  name: "La Yuhibbullah",       startRuku: 82,  endRuku: 95,  rukuCount: 14, surahs: "An-Nisa (148–176) – Al-Ma'idah (1–81)" },
  { juz: 7,  name: "Wa Iza Samiu",         startRuku: 96,  endRuku: 114, rukuCount: 19, surahs: "Al-Ma'idah (82–120) – Al-An'am (1–110)" },
  { juz: 8,  name: "Wa Lau Annana",        startRuku: 115, endRuku: 131, rukuCount: 17, surahs: "Al-An'am (111–165) – Al-A'raf (1–87)" },
  { juz: 9,  name: "Qalal Malao",          startRuku: 132, endRuku: 149, rukuCount: 18, surahs: "Al-A'raf (88–206) – Al-Anfal (1–40)" },
  { juz: 10, name: "Wa A'lamu",            startRuku: 150, endRuku: 166, rukuCount: 17, surahs: "Al-Anfal (41–75) – At-Tawbah (1–92)" },
  { juz: 11, name: "Yatazeroon",           startRuku: 167, endRuku: 182, rukuCount: 16, surahs: "At-Tawbah (93–129) – Yunus – Hud (1–5)" },
  { juz: 12, name: "Wa Mamin Da'abat",     startRuku: 183, endRuku: 198, rukuCount: 16, surahs: "Hud (6–123) – Yusuf (1–52)" },
  { juz: 13, name: "Wa Ma Ubrioo",         startRuku: 199, endRuku: 217, rukuCount: 19, surahs: "Yusuf (53–111) – Ar-Ra'd – Ibrahim" },
  { juz: 14, name: "Rubama",               startRuku: 218, endRuku: 239, rukuCount: 22, surahs: "Al-Hijr – An-Nahl" },
  { juz: 15, name: "Subhanallazi",         startRuku: 240, endRuku: 260, rukuCount: 21, surahs: "Al-Isra – Al-Kahf (1–74)" },
  { juz: 16, name: "Qal Alam",             startRuku: 261, endRuku: 277, rukuCount: 17, surahs: "Al-Kahf (75–110) – Maryam – Ta-Ha" },
  { juz: 17, name: "Aqtarabo",             startRuku: 278, endRuku: 294, rukuCount: 17, surahs: "Al-Anbiya – Al-Hajj" },
  { juz: 18, name: "Qadd Aflaha",          startRuku: 295, endRuku: 311, rukuCount: 17, surahs: "Al-Mu'minun – An-Nur – Al-Furqan (1–20)" },
  { juz: 19, name: "Wa Qalallazina",       startRuku: 312, endRuku: 329, rukuCount: 18, surahs: "Al-Furqan (21–77) – Ash-Shu'ara – An-Naml (1–55)" },
  { juz: 20, name: "A'man Khalaq",         startRuku: 330, endRuku: 346, rukuCount: 17, surahs: "An-Naml (56–93) – Al-Qasas – Al-Ankabut (1–45)" },
  { juz: 21, name: "Utlu Ma Oohi",         startRuku: 347, endRuku: 365, rukuCount: 19, surahs: "Al-Ankabut (46–69) – Ar-Rum – Luqman – As-Sajdah – Al-Ahzab (1–30)" },
  { juz: 22, name: "Wa Manyaqnut",         startRuku: 366, endRuku: 383, rukuCount: 18, surahs: "Al-Ahzab (31–73) – Saba – Fatir – Ya-Sin (1–27)" },
  { juz: 23, name: "Wa Mali",              startRuku: 384, endRuku: 400, rukuCount: 17, surahs: "Ya-Sin (28–83) – As-Saffat – Sad – Az-Zumar (1–31)" },
  { juz: 24, name: "Faman Azlam",          startRuku: 401, endRuku: 419, rukuCount: 19, surahs: "Az-Zumar (32–75) – Ghafir – Fussilat (1–46)" },
  { juz: 25, name: "Elahe Yuruddo",        startRuku: 420, endRuku: 439, rukuCount: 20, surahs: "Fussilat (47–54) – Ash-Shura – Az-Zukhruf – Ad-Dukhan – Al-Jathiyah" },
  { juz: 26, name: "Ha'a Meem",            startRuku: 440, endRuku: 457, rukuCount: 18, surahs: "Al-Ahqaf – Muhammad – Al-Fath – Al-Hujurat – Qaf – Adh-Dhariyat (1–30)" },
  { juz: 27, name: "Qala Fama Khatbukum",  startRuku: 458, endRuku: 477, rukuCount: 20, surahs: "Adh-Dhariyat (31–60) – At-Tur – An-Najm – Al-Qamar – Ar-Rahman – Al-Waqi'ah – Al-Hadid" },
  { juz: 28, name: "Qadd Sami Allah",      startRuku: 478, endRuku: 497, rukuCount: 20, surahs: "Al-Mujadila – Al-Hashr – Al-Mumtahanah – As-Saff – Al-Jumu'ah – Al-Munafiqun – At-Taghabun – At-Talaq – At-Tahrim" },
  { juz: 29, name: "Tabarakallazi",        startRuku: 498, endRuku: 519, rukuCount: 22, surahs: "Al-Mulk – Al-Qalam – Al-Haqqah – Al-Ma'arij – Nuh – Al-Jinn – Al-Muzzammil – Al-Muddaththir – Al-Qiyamah – Al-Insan – Al-Mursalat" },
  { juz: 30, name: "Amma Yatasa'aloon",    startRuku: 520, endRuku: 558, rukuCount: 39, surahs: "An-Naba – An-Nas (37 Surahs)" },
];
