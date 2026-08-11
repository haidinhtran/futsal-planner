/**
 * Rút gọn tên tiếng Việt (ví dụ: "Hồ Đắc Thạnh" -> "Đắc Thạnh", "Nguyễn Cao Tấn" -> "Cao Tấn")
 */
export const getVietnameseShortName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return parts.slice(-2).join(' ');
};

/**
 * Format chỉ số cầu thủ (stamina, attack, defense). Trả về '-' nếu null/undefined.
 */
export const formatPlayerStat = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '-';
  return String(val);
};

/**
 * Tính phần trăm độ dài thanh chỉ số stat bar (0% - 100%)
 */
export const getStatBarWidth = (val: number | null | undefined): string => {
  if (val === null || val === undefined) return '0%';
  const pct = Math.min(Math.max((val / 10) * 100, 0), 100);
  return `${pct}%`;
};

/**
 * Tính tổng điểm trung bình chỉ số cầu thủ
 */
export const calculatePlayerTotalScore = (player: { stamina: number | null; attack: number | null; defense: number | null }): number => {
  let sum = 0;
  let count = 0;
  if (player.stamina !== null && player.stamina !== undefined) { sum += player.stamina; count++; }
  if (player.attack !== null && player.attack !== undefined) { sum += player.attack; count++; }
  if (player.defense !== null && player.defense !== undefined) { sum += player.defense; count++; }
  return count > 0 ? sum : -1;
};

/**
 * Tạo mã ngày định dạng DDMMYY cho tên file xuất
 */
export const getFormattedDateCode = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};
