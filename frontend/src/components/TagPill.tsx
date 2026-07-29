import React from 'react';

interface TagPillProps {
  label: string;
  icon?: React.ReactNode;
  emoji?: string;
  selected: boolean;
  onClick: () => void;
  categoryTheme?: 'pink' | 'yellow' | 'purple' | 'lavender' | 'teal' | 'peach' | 'blue' | 'grey';
  count?: number;
}

export default function TagPill({
  label,
  icon,
  emoji,
  selected,
  onClick,
  categoryTheme = 'pink',
  count
}: TagPillProps) {
  const getThemeStyles = () => {
    switch (categoryTheme) {
      case 'pink':
        return selected
          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
          : 'bg-rose-50 text-rose-900 border-rose-100 hover:bg-rose-100/70';
      case 'yellow':
        return selected
          ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
          : 'bg-amber-50 text-amber-900 border-amber-100 hover:bg-amber-100/70';
      case 'purple':
        return selected
          ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
          : 'bg-purple-50 text-purple-900 border-purple-100 hover:bg-purple-100/70';
      case 'lavender':
        return selected
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
          : 'bg-indigo-50 text-indigo-900 border-indigo-100 hover:bg-indigo-100/70';
      case 'teal':
        return selected
          ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
          : 'bg-teal-50 text-teal-900 border-teal-100 hover:bg-teal-100/70';
      case 'peach':
        return selected
          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
          : 'bg-orange-50 text-orange-900 border-orange-100 hover:bg-orange-100/70';
      case 'blue':
        return selected
          ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200'
          : 'bg-sky-50 text-sky-900 border-sky-100 hover:bg-sky-100/70';
      case 'grey':
      default:
        return selected
          ? 'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200'
          : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200/70';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all duration-200 transform active:scale-95 cursor-pointer ${getThemeStyles()}`}
    >
      {emoji && <span className="text-base leading-none">{emoji}</span>}
      {icon && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-white/30">
          {count}
        </span>
      )}
    </button>
  );
}
