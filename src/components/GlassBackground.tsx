interface Props {
  themeMode: 'weiss' | 'bunt';
}

export const GlassBackground = ({ themeMode }: Props) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Alpine Mountain Backdrop */}
      {themeMode === 'weiss' ? (
        /* Weiss Mode: Pristine snowy mountain peaks, pale blue daylight sky, icy lake reflection */
        <div className="absolute inset-0 bg-gradient-to-b from-[#b8cde3] via-[#d7e4f0] to-[#eaf1f7] transition-all duration-700">
          {/* Mountain silhouettes in pale slate / icy blues */}
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-75"
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
          >
            <defs>
              <linearGradient id="snowSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3bfdb" />
                <stop offset="45%" stopColor="#c5d8ea" />
                <stop offset="100%" stopColor="#e3edf5" />
              </linearGradient>
              <linearGradient id="snowMountainFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#c3d5e8" />
                <stop offset="100%" stopColor="#95b1cf" />
              </linearGradient>
              <linearGradient id="snowMountainMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eef4fa" />
                <stop offset="40%" stopColor="#a8c1da" />
                <stop offset="100%" stopColor="#6783a3" />
              </linearGradient>
              <linearGradient id="lakeWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a2bedb" />
                <stop offset="100%" stopColor="#dce8f2" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="1440" height="900" fill="url(#snowSky)" />

            {/* Distant Snow Peaks */}
            <polygon
              points="0,600 0,350 140,240 280,380 420,210 560,340 720,180 880,310 1020,190 1180,320 1320,250 1440,360 1440,600"
              fill="url(#snowMountainFar)"
              opacity="0.85"
            />

            {/* Mid Distance Sharp Alps */}
            <polygon
              points="0,620 0,420 180,310 320,440 490,260 640,410 820,240 960,390 1120,270 1280,420 1440,330 1440,620"
              fill="url(#snowMountainMid)"
              opacity="0.9"
            />

            {/* Pristine Mirror Lake Horizon */}
            <rect y="580" width="1440" height="320" fill="url(#lakeWater)" opacity="0.8" />

            {/* Reflection lines */}
            <line x1="0" y1="580" x2="1440" y2="580" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>
      ) : (
        /* Bunt Mode: Sunset alpine mountain twilight with radiant magenta, amber and purple reflections */
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1335] via-[#2f1b4a] to-[#120a24] transition-all duration-700">
          <svg
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            preserveAspectRatio="none"
            viewBox="0 0 1440 900"
          >
            <defs>
              <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7b39" />
                <stop offset="25%" stopColor="#ec4899" />
                <stop offset="60%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#1e1138" />
              </linearGradient>
              <linearGradient id="sunsetMountainFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="60%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#3b0764" />
              </linearGradient>
              <linearGradient id="sunsetMountainMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="40%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#1e1035" />
              </linearGradient>
              <linearGradient id="sunsetLakeWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2e1065" />
                <stop offset="100%" stopColor="#0f0728" />
              </linearGradient>
            </defs>

            <rect width="1440" height="900" fill="url(#sunsetSky)" />

            <polygon
              points="0,600 0,350 140,240 280,380 420,210 560,340 720,180 880,310 1020,190 1180,320 1320,250 1440,360 1440,600"
              fill="url(#sunsetMountainFar)"
              opacity="0.75"
            />

            <polygon
              points="0,620 0,420 180,310 320,440 490,260 640,410 820,240 960,390 1120,270 1280,420 1440,330 1440,620"
              fill="url(#sunsetMountainMid)"
              opacity="0.9"
            />

            <rect y="580" width="1440" height="320" fill="url(#sunsetLakeWater)" opacity="0.9" />
            <line x1="0" y1="580" x2="1440" y2="580" stroke="#f472b6" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Steamy Glass / Droplets Texture Overlay (like background_Typographie.jpg) */}
      <div className="absolute inset-0 steamy-droplets opacity-40 mix-blend-overlay" />

      {/* Subtle Prismatic Caustic Rainbow Sheen at Top and Edges */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 10% 30%, rgba(236,72,153,0.15) 0%, transparent 40%), radial-gradient(circle at 90% 25%, rgba(56,189,248,0.2) 0%, transparent 40%)',
        }}
      />
    </div>
  );
};
