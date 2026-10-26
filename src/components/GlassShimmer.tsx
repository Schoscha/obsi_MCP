import React from 'react';

interface Props {
  themeMode: 'weiss' | 'bunt';
  sparklePosition?: 'top-right' | 'top-left' | 'bottom-right';
}

export const GlassShimmer: React.FC<Props> = ({
  themeMode,
  sparklePosition = 'top-right',
}) => {
  const isWeiss = themeMode === 'weiss';

  return (
    <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none z-10 select-none">
      {/* 1. Diagonal Specular Liquid-Glass Shimmer Sweep on Hover */}
      <div
        className={`absolute -inset-[100%] opacity-0 group-hover:opacity-100 group-hover:animate-telemetry-shimmer transition-opacity duration-300 pointer-events-none ${
          isWeiss
            ? 'bg-gradient-to-r from-transparent via-white/55 via-indigo-200/40 via-purple-200/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-300/40 via-fuchsia-400/50 via-white/70 to-transparent'
        }`}
        style={{
          transform: 'rotate(25deg)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* 2. Futuristic Telemetry Sparkle Starburst (Primary Corner Glint) */}
      <div
        className={`absolute transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-50 pointer-events-none ${
          sparklePosition === 'top-right'
            ? 'top-2.5 right-3'
            : sparklePosition === 'top-left'
            ? 'top-2.5 left-3'
            : 'bottom-2.5 right-3'
        }`}
      >
        <svg
          className={`w-4 h-4 group-hover:animate-telemetry-sparkle-spin drop-shadow-sm ${
            isWeiss ? 'text-indigo-500' : 'text-cyan-300'
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* 4-point Precision Telemetry Starburst */}
          <path d="M12 0 L13.8 8.2 L22 12 L13.8 15.8 L12 24 L10.2 15.8 L2 12 L10.2 8.2 Z" />
          <circle cx="12" cy="12" r="2.2" fill={isWeiss ? '#ffffff' : '#fdf4ff'} />
        </svg>
      </div>

      {/* 3. Secondary Telemetry Micro-Glint (Opposite edge) */}
      <div className="absolute bottom-2.5 left-3 transition-all duration-700 opacity-0 group-hover:opacity-75 group-hover:scale-100 scale-0 pointer-events-none delay-100">
        <svg
          className={`w-2.5 h-2.5 group-hover:animate-pulse ${
            isWeiss ? 'text-purple-400' : 'text-fuchsia-400'
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
        </svg>
      </div>

      {/* 4. Soft Liquid Edge Specular Sheen */}
      <div
        className={`absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-0 group-hover:opacity-100 border pointer-events-none ${
          isWeiss
            ? 'border-white/60 shadow-[inset_0_0_12px_rgba(255,255,255,0.8)]'
            : 'border-cyan-300/40 shadow-[inset_0_0_16px_rgba(34,211,238,0.25)]'
        }`}
      />
    </div>
  );
};
