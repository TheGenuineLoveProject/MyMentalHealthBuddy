import React from "react";

export type LivingLumiAvatarProps = {
  emotion?: "calm" | "supportive" | "celebrate" | "reflect" | "guide";
  variant?: "floating" | "inline";
  label?: string;
};

export default function LivingLumiAvatar({
  emotion = "supportive",
  variant = "floating",
  label = "Lumi, your gentle companion",
}: LivingLumiAvatarProps) {
  return (
    <div
      className={`lumi-living-companion lumi-living-companion--${variant} lumi-living-companion--${emotion}`}
      aria-label={label}
      role="img"
    >
      <div className="lumi-living-companion__aura" />
      <span className="lumi-living-companion__sparkle" />
      <span className="lumi-living-companion__sparkle" />
      <span className="lumi-living-companion__sparkle" />

      <svg
        className="lumi-living-companion__svg"
        viewBox="0 0 190 230"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lumiBody" cx="45%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="46%" stopColor="#FFF9F2" />
            <stop offset="78%" stopColor="#DDE7D5" />
            <stop offset="100%" stopColor="#AFC6A1" />
          </radialGradient>

          <linearGradient id="lumiGold" x1="0" x2="1">
            <stop offset="0%" stopColor="#FFD46B" />
            <stop offset="100%" stopColor="#F9BEC5" />
          </linearGradient>

          <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="16" stdDeviation="10" floodColor="#38533F" floodOpacity="0.22" />
          </filter>
        </defs>

        <ellipse cx="95" cy="204" rx="46" ry="10" fill="rgba(56,83,63,0.18)" />

        <g className="lumi-leg-left">
          <path d="M70 168 C62 184 63 198 76 202 C87 196 85 181 82 168 Z" fill="#C7D8BC" />
          <ellipse cx="76" cy="202" rx="16" ry="7" fill="#90AF85" />
        </g>

        <g className="lumi-leg-right">
          <path d="M108 168 C105 184 106 198 119 202 C132 196 128 181 121 168 Z" fill="#C7D8BC" />
          <ellipse cx="119" cy="202" rx="16" ry="7" fill="#90AF85" />
        </g>

        <g className="lumi-arm-left">
          <path d="M55 104 C32 112 25 132 35 143 C48 141 56 126 66 114 Z" fill="#DDE7D5" />
          <circle cx="34" cy="143" r="9" fill="#FFD6DA" />
        </g>

        <g className="lumi-arm-right">
          <path d="M135 104 C158 112 165 132 155 143 C142 141 134 126 124 114 Z" fill="#DDE7D5" />
          <circle cx="156" cy="143" r="9" fill="#AEE9FF" />
        </g>

        <g className="lumi-head" filter="url(#softShadow)">
          <path
            d="M95 31 C130 31 153 59 153 96 C153 139 130 176 95 176 C60 176 37 139 37 96 C37 59 60 31 95 31Z"
            fill="url(#lumiBody)"
            stroke="rgba(111,147,103,0.42)"
            strokeWidth="3"
          />

          <path
            d="M72 35 C74 19 83 10 95 18 C107 10 116 19 118 35"
            fill="none"
            stroke="#FFD46B"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <circle cx="66" cy="102" r="9" fill="#213628" className="lumi-eye" />
          <circle cx="124" cy="102" r="9" fill="#213628" className="lumi-eye" />
          <circle cx="69" cy="99" r="3" fill="#FFFFFF" />
          <circle cx="127" cy="99" r="3" fill="#FFFFFF" />

          <ellipse cx="55" cy="122" rx="13" ry="7" fill="#FFD6DA" className="lumi-cheek" />
          <ellipse cx="135" cy="122" rx="13" ry="7" fill="#FFD6DA" className="lumi-cheek" />

          <path
            className="lumi-mouth"
            d="M78 127 C86 139 104 139 112 127"
            fill="none"
            stroke="#38533F"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M58 70 C69 58 82 53 95 53 C108 53 121 58 132 70"
            fill="none"
            stroke="url(#lumiGold)"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.72"
          />
        </g>
      </svg>
    </div>
  );
}
