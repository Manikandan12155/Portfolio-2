const MoonFloor = () => {
  return (
    <div className="relative w-full h-40 overflow-hidden">
      {/* Moon surface gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,15%,18%)] via-[hsl(220,15%,12%)] to-transparent" />

      {/* Crater texture */}
      <svg
        className="absolute bottom-0 w-full"
        height="140"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Main terrain line */}
        <path
          d="M0 60 Q60 40, 120 55 Q180 70, 240 50 Q320 30, 400 52 Q460 65, 520 48 Q600 35, 680 55 Q740 68, 800 45 Q880 30, 960 50 Q1020 62, 1080 42 Q1160 28, 1240 48 Q1320 60, 1380 45 Q1420 38, 1440 50 L1440 140 L0 140 Z"
          fill="hsl(220, 12%, 16%)"
        />
        <path
          d="M0 60 Q60 40, 120 55 Q180 70, 240 50 Q320 30, 400 52 Q460 65, 520 48 Q600 35, 680 55 Q740 68, 800 45 Q880 30, 960 50 Q1020 62, 1080 42 Q1160 28, 1240 48 Q1320 60, 1380 45 Q1420 38, 1440 50"
          stroke="hsl(185, 40%, 25%)"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />

        {/* Craters */}
        <ellipse cx="200" cy="100" rx="35" ry="10" fill="hsl(220, 10%, 12%)" opacity="0.6" />
        <ellipse cx="200" cy="100" rx="35" ry="10" stroke="hsl(220, 10%, 20%)" strokeWidth="0.5" fill="none" />

        <ellipse cx="650" cy="90" rx="50" ry="12" fill="hsl(220, 10%, 11%)" opacity="0.5" />
        <ellipse cx="650" cy="90" rx="50" ry="12" stroke="hsl(220, 10%, 20%)" strokeWidth="0.5" fill="none" />

        <ellipse cx="1100" cy="95" rx="40" ry="9" fill="hsl(220, 10%, 12%)" opacity="0.6" />
        <ellipse cx="1100" cy="95" rx="40" ry="9" stroke="hsl(220, 10%, 20%)" strokeWidth="0.5" fill="none" />

        <ellipse cx="400" cy="110" rx="20" ry="6" fill="hsl(220, 10%, 13%)" opacity="0.4" />
        <ellipse cx="900" cy="115" rx="25" ry="7" fill="hsl(220, 10%, 13%)" opacity="0.4" />
        <ellipse cx="1350" cy="105" rx="18" ry="5" fill="hsl(220, 10%, 13%)" opacity="0.4" />

        {/* Small rocks */}
        <circle cx="150" cy="85" r="3" fill="hsl(220, 10%, 20%)" />
        <circle cx="500" cy="75" r="2" fill="hsl(220, 10%, 22%)" />
        <circle cx="750" cy="80" r="4" fill="hsl(220, 10%, 18%)" />
        <circle cx="1000" cy="78" r="2.5" fill="hsl(220, 10%, 21%)" />
        <circle cx="1300" cy="82" r="3" fill="hsl(220, 10%, 19%)" />
      </svg>

      {/* Landing pad glow */}
      <div className="absolute bottom-8 right-6 md:right-10 flex flex-col items-center">
        <div className="w-12 h-[2px] bg-primary/40 rounded-full shadow-[0_0_10px_hsl(185,100%,50%,0.3)]" />
        <div className="w-8 h-[1px] bg-primary/20 mt-1 rounded-full" />
      </div>

      {/* Stars near horizon */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground/20"
          style={{
            left: `${10 + i * 12}%`,
            top: `${5 + (i % 3) * 8}px`,
          }}
        />
      ))}
    </div>
  );
};

export default MoonFloor;
