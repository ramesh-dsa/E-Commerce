import React from "react";

interface LogoProps {
  variant?: "black" | "white" | "accent";
  className?: string;
  height?: number;
}

export function Logo({
  variant = "black",
  className = "",
  height = 28,
}: LogoProps) {
  const fillColor = variant === "white" ? "#FFFFFF" : "#0B0B0B";

  // Exact letter path geometry matching the reference wordmark
  // 1000 x 250 viewBox, centered horizontally and vertically
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="160 55 658 140"
      height={height}
      className={`w-auto shrink-0 select-none ${className}`}
      aria-label="VEYRO Logo"
    >
      {variant === "accent" && (
        <rect
          x="170"
          y="48"
          width="638"
          height="5"
          rx="2.5"
          fill="#FFD400"
        />
      )}
      <g fill={fillColor} fillRule="evenodd">
        {/* Letter V */}
        <path d="M 170,68 C 170,66 172,65 174,65 L 190,65 C 192,65 194,66 195,68 L 227.5,153 L 260,68 C 261,66 263,65 265,65 L 281,65 C 283,65 285,66 285,68 L 237,183 C 235,186 220,186 218,183 Z" />

        {/* Letter E */}
        <path d="M 308,65 L 401,65 C 404,65 406,67 406,70 L 406,82 C 406,85 404,87 401,87 L 330,87 L 330,114 L 383,114 C 386,114 388,116 388,119 L 388,131 C 388,134 386,136 383,136 L 330,136 L 330,163 L 401,163 C 404,163 406,165 406,168 L 406,180 C 406,183 404,185 401,185 L 308,185 C 306,185 306,183 306,180 L 306,70 C 306,67 306,65 308,65 Z" />

        {/* Letter Y */}
        <path d="M 429,68 C 428,66 430,65 432,65 L 448,65 C 450,65 452,66 453,68 L 474,115 L 474,182 C 474,184 476,185 478,185 L 492,185 C 494,185 496,184 496,182 L 496,115 L 517,68 C 518,66 520,65 522,65 L 538,65 C 540,65 542,66 541,68 L 488,136 Z" />

        {/* Letter R */}
        <path d="M 564,65 L 634,65 C 655,65 666,74 666,97 C 666,115 655,126 636,129 L 667,181 C 669,184 667,185 664,185 L 644,185 C 641,185 639,183 638,181 L 611,133 L 586,133 L 586,182 C 586,184 584,185 582,185 L 566,185 C 563,185 562,183 562,181 L 562,69 C 562,66 563,65 564,65 Z M 586,86 L 630,86 C 641,86 646,90 646,98 C 646,107 641,112 630,112 L 586,112 Z" />

        {/* Letter O (Modern stadium / squircle geometry) */}
        <path d="M 724,65 L 774,65 C 796,65 808,77 808,99 L 808,151 C 808,173 796,185 774,185 L 724,185 C 702,185 690,173 690,151 L 690,99 C 690,77 702,65 724,65 Z M 726,87 C 717,87 712,92 712,101 L 712,149 C 712,158 717,163 726,163 L 772,163 C 781,163 786,158 786,149 L 786,101 C 786,92 781,87 772,87 Z" />
      </g>
    </svg>
  );
}
