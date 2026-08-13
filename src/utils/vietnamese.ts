/**
 * Removes Vietnamese diacritics / tones from a string for accent-insensitive searching.
 * Example:
 *   removeVietnameseTones("Nguyễn Cao Tấn") => "nguyen cao tan"
 *   removeVietnameseTones("Nguyen Minh Tan") => "nguyen minh tan"
 */
export const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};
