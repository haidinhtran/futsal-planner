import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { AttackDirection } from "@/types/futsal";

interface Props {
  attackDirection: AttackDirection;
  onToggle: () => void;
}

export const SettingsDirectionControl: React.FC<Props> = ({
  attackDirection,
  onToggle,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-1.5">
        Hướng tấn công
      </label>
      <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <span
          className={`text-sm font-bold ${attackDirection === "left" ? "text-blue-700 font-black" : "text-slate-500"}`}
        >
          Trái
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={attackDirection === "right"}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
            attackDirection === "right" ? "bg-blue-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-xs transition duration-200 ${
              attackDirection === "right" ? "translate-x-5" : "translate-x-0"
            }`}
          >
            {attackDirection === "right" ? (
              <ArrowRight className="w-3 h-3 text-blue-600 stroke-[3]" />
            ) : (
              <ArrowLeft className="w-3 h-3 text-slate-400 stroke-[3]" />
            )}
          </span>
        </button>
        <span
          className={`text-sm font-bold ${attackDirection === "right" ? "text-blue-700 font-black" : "text-slate-500"}`}
        >
          Phải
        </span>
      </div>
    </div>
  );
};
