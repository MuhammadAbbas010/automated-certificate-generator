interface IconProps {
  size?: number;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ChevronDown = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const GridIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

export const PlusIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const DocIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const GearIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const SearchIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const BellIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);

export const EditIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);

export const TrashIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
  </svg>
);

export const CheckIcon = ({ size = 15 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const XIcon = ({ size = 9 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

export const SparkleIcon = ({ size = 10 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z" />
  </svg>
);

export const SendIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const UsersIcon = ({ size = 13 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
    <circle cx="10" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const MenuIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const MoreIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round">
    <circle cx="12" cy="5" r="0.5" />
    <circle cx="12" cy="12" r="0.5" />
    <circle cx="12" cy="19" r="0.5" />
    <path d="M12 5v0M12 12v0M12 19v0" />
  </svg>
);

export const ExportIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 21h16" />
  </svg>
);

export const ClockIcon = ({ size = 13 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const WarningIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.6L1.8 18a1.5 1.5 0 001.3 2.3h17.8a1.5 1.5 0 001.3-2.3L13.7 3.6a1.5 1.5 0 00-2.6 0z" />
    <path d="M12 9v4" />
    <path d="M12 16.5v.01" />
  </svg>
);

export const FolderIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a1 1 0 011-1h5l2 2h9a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
  </svg>
);
