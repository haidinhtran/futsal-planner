import type { Player } from "@/types/futsal";

export const getEnglishRoleTitle = (role: string): string => {
  switch (role) {
    case "GOALKEEPER":
      return "Goalkeeper";
    case "FIXO":
      return "Fixo";
    case "ALA_LEFT":
      return "Ala Left";
    case "ALA_RIGHT":
      return "Ala Right";
    case "PIVOT":
      return "Pivot";
    default:
      return role;
  }
};

export const getVietnameseShortName = (fullName: string): string => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return parts.slice(-2).join(" ");
};

export const getPlayerTotalScore = (p: Player): number => {
  let sum = 0;
  let count = 0;
  if (p.stamina !== null) {
    sum += p.stamina;
    count++;
  }
  if (p.attack !== null) {
    sum += p.attack;
    count++;
  }
  if (p.defense !== null) {
    sum += p.defense;
    count++;
  }
  return count > 0 ? sum : -1;
};

export const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case "GOALKEEPER":
      return "badge-gk rounded-t-sm";
    case "FIXO":
      return "badge-fixo rounded-t-sm";
    case "ALA_LEFT":
    case "ALA_RIGHT":
      return "badge-ala rounded-t-sm";
    case "PIVOT":
      return "badge-pivot rounded-t-sm";
    default:
      return "bg-slate-700 text-white rounded-t-sm";
  }
};

export const getRoleBorderLeftClass = (role: string): string => {
  switch (role) {
    case "GOALKEEPER":
      return "border-l-emerald-500";
    case "FIXO":
      return "border-l-purple-500";
    case "ALA_LEFT":
    case "ALA_RIGHT":
      return "border-l-sky-500";
    case "PIVOT":
      return "border-l-amber-500";
    default:
      return "border-l-blue-500";
  }
};
