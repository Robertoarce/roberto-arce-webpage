<template>
  <!--
    ParisArt — layered "Paris postcard" scene drawn as flat vector layers.
    Every visual group is an independent layer (data-layer=...) so the parent
    can reveal / parallax / animate each one separately with GSAP.

    Layers that are revealed from the bottom (city, eiffel, river, bridge,
    foreground) are clipped with objectBoundingBox <clipPath> elements whose
    <rect> is tweened from y=1 (fully hidden) to y=0 (fully visible).

    DOM order == paint order:
      sky → clouds → sun → city → eiffel → river → foreground → boat → bridge → mosaic

    The bridge is painted ABOVE the boat, so the boat visually disappears
    underneath it as it crosses the Seine — no physics required.
  -->
  <svg
    class="paris-art pointer-events-none"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Illustration of Paris: warm sun, drifting clouds, Haussmann skyline, the Eiffel Tower, the Seine with a golden bridge and a boat, and a foreground of flowers"
  >
    <defs>
      <!-- paper / dawn sky -->
      <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fdf6e7" />
        <stop offset="0.55" stop-color="#f6e6c8" />
        <stop offset="1" stop-color="#f1dcb2" />
      </linearGradient>

      <!-- sun -->
      <linearGradient id="pa-sun" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f5b46c" />
        <stop offset="0.55" stop-color="#e2702f" />
        <stop offset="1" stop-color="#c43d2c" />
      </linearGradient>

      <!-- bridge gold -->
      <linearGradient id="pa-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e5b657" />
        <stop offset="1" stop-color="#c99a3e" />
      </linearGradient>

      <!-- the Seine -->
      <linearGradient id="pa-river" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b9d2e4" />
        <stop offset="1" stop-color="#9ab7ce" />
      </linearGradient>

      <!-- foreground grass -->
      <linearGradient id="pa-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a8bd8c" />
        <stop offset="1" stop-color="#8aa06c" />
      </linearGradient>

      <!-- windows on cream façades -->
      <pattern id="pa-window" width="12" height="14" patternUnits="userSpaceOnUse">
        <rect width="4" height="5" fill="#0d1c2e" opacity="0.3" />
      </pattern>

      <!-- windows on ink silhouettes -->
      <pattern id="pa-window-light" width="12" height="14" patternUnits="userSpaceOnUse">
        <rect width="4" height="5" fill="#f7f1e6" opacity="0.5" />
      </pattern>

      <!-- mosaic tile texture (brand motif) -->
      <pattern id="pa-mosaic" width="26" height="26" patternUnits="userSpaceOnUse">
        <rect width="26" height="26" fill="none" />
        <rect x="1" y="1" width="24" height="24" rx="4" fill="none" stroke="#0d1c2e" stroke-opacity="0.05" />
        <rect x="6" y="6" width="9" height="9" rx="2.5" fill="#0d1c2e" fill-opacity="0.05" />
        <rect x="16" y="16" width="6" height="6" rx="2" fill="#c43d2c" fill-opacity="0.05" />
        <rect x="16" y="5" width="5" height="5" rx="2" fill="#d9a441" fill-opacity="0.06" />
      </pattern>

      <!-- a single flat blossom -->
      <g id="pa-flower">
        <g fill="#f7f1e6" stroke="#0d1c2e" stroke-opacity="0.15" stroke-width="1">
          <circle cx="0" cy="-4" r="3.2" />
          <circle cx="0" cy="-4" r="3.2" transform="rotate(72)" />
          <circle cx="0" cy="-4" r="3.2" transform="rotate(144)" />
          <circle cx="0" cy="-4" r="3.2" transform="rotate(216)" />
          <circle cx="0" cy="-4" r="3.2" transform="rotate(288)" />
        </g>
        <circle r="2.4" fill="#c43d2c" />
      </g>

      <!-- ============ reveal clips (bottom-up) ============ -->
      <!-- y=1 hides the whole layer; y=0 reveals it fully. -->
      <clipPath id="pc-city" clipPathUnits="objectBoundingBox">
        <rect id="pc-city-rect" x="0" y="1" width="1" height="1" />
      </clipPath>
      <clipPath id="pc-eiffel" clipPathUnits="objectBoundingBox">
        <rect id="pc-eiffel-rect" x="0" y="1" width="1" height="1" />
      </clipPath>
      <clipPath id="pc-river" clipPathUnits="objectBoundingBox">
        <rect id="pc-river-rect" x="0" y="1" width="1" height="1" />
      </clipPath>
      <clipPath id="pc-bridge" clipPathUnits="objectBoundingBox">
        <rect id="pc-bridge-rect" x="0" y="1" width="1" height="1" />
      </clipPath>
      <clipPath id="pc-foreground" clipPathUnits="objectBoundingBox">
        <rect id="pc-foreground-rect" x="0" y="1" width="1" height="1" />
      </clipPath>
    </defs>

    <!-- ================= sky (paper + data-viz motifs) ================ -->
    <g data-layer="sky">
      <rect width="1440" height="900" fill="url(#pa-sky)" />
      <!-- faint graph-paper grid -->
      <g stroke="#5b7a99" stroke-opacity="0.06" stroke-width="1">
        <path d="M0 90 H1440 M0 180 H1440 M0 270 H1440 M0 360 H1440 M0 450 H1440 M0 540 H1440" />
        <path d="M180 0 V900 M360 0 V900 M540 0 V900 M720 0 V900 M900 0 V900 M1080 0 V900 M1260 0 V900" />
      </g>
      <!-- compass ring -->
      <circle cx="190" cy="250" r="86" fill="none" stroke="#5b7a99" stroke-opacity="0.12" stroke-width="1" />
      <circle cx="190" cy="250" r="104" fill="none" stroke="#5b7a99" stroke-opacity="0.07" stroke-width="1" stroke-dasharray="2 6" />
      <!-- birds -->
      <g fill="none" stroke="#5b7a99" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round">
        <path d="M310 208 q7 -8 14 0 M322 214 q7 -8 14 0 M288 220 q6 -7 12 0" />
      </g>
      <!-- sparkline + coordinates -->
      <g fill="none" stroke="#0d1c2e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" opacity="0.5">
        <path d="M1150 322 L1178 314 L1206 320 L1234 306 L1262 312 L1290 296 L1318 302" />
      </g>
      <circle cx="1318" cy="302" r="3.5" fill="#c43d2c" stroke="none" opacity="0.65" />
      <text
        x="1150" y="344"
        font-family="'JetBrains Mono', ui-monospace, monospace"
        font-size="11" fill="#0d1c2e" opacity="0.45"
      >48.8566° N · 2.3522° E</text>
    </g>

    <!-- ================= clouds (left) ================================ -->
    <g data-layer="cloud-left" fill="#f4ead6" stroke="#0d1c2e" stroke-opacity="0.08">
      <ellipse cx="190" cy="128" rx="96" ry="26" />
      <ellipse cx="262" cy="110" rx="60" ry="21" />
      <ellipse cx="122" cy="116" rx="50" ry="18" />
      <ellipse cx="330" cy="122" rx="42" ry="15" />
      <g opacity="0.75">
        <ellipse cx="96" cy="268" rx="66" ry="17" />
      </g>
    </g>

    <!-- ================= clouds (right) =============================== -->
    <g data-layer="cloud-right" fill="#f4ead6" stroke="#0d1c2e" stroke-opacity="0.08">
      <ellipse cx="1250" cy="100" rx="92" ry="25" />
      <ellipse cx="1318" cy="84" rx="56" ry="20" />
      <ellipse cx="1186" cy="90" rx="46" ry="17" />
      <ellipse cx="1378" cy="104" rx="40" ry="14" />
      <g opacity="0.75">
        <ellipse cx="1290" cy="228" rx="58" ry="15" />
      </g>
    </g>

    <!-- ================= sun ========================================== -->
    <g data-layer="sun">
      <circle cx="1040" cy="200" r="150" fill="#e2702f" opacity="0.10" />
      <circle cx="1040" cy="200" r="104" fill="url(#pa-sun)" />
      <g stroke="#f7f1e6" stroke-opacity="0.22" stroke-width="1.5">
        <path d="M972 190 H1108 M978 206 H1102 M972 222 H1108" />
      </g>
      <circle cx="1040" cy="200" r="116" fill="none" stroke="#f7f1e6" stroke-opacity="0.55" stroke-width="2" />
    </g>

    <!-- ================= city (Haussmann skyline) ===================== -->
    <g data-layer="city" clip-path="url(#pc-city)">
      <!-- b1 -->
      <g>
        <rect x="0" y="502" width="62" height="146" fill="#e7d9bd" />
        <rect x="0" y="502" width="62" height="146" fill="url(#pa-window)" />
        <rect x="0" y="502" width="62" height="6" fill="#0d1c2e" opacity="0.08" />
        <g>
          <rect x="8" y="606" width="26" height="12" fill="#c43d2c" />
          <rect x="16" y="606" width="2" height="12" fill="#f7f1e6" />
          <rect x="24" y="606" width="2" height="12" fill="#f7f1e6" />
        </g>
      </g>
      <!-- b2 mansard -->
      <g>
        <rect x="62" y="468" width="70" height="180" fill="#e7d9bd" />
        <rect x="62" y="468" width="70" height="180" fill="url(#pa-window)" />
        <path d="M62 468 L132 468 L121 446 L73 446 Z" fill="#5b7a99" />
        <rect x="62" y="468" width="70" height="5" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b3 -->
      <g>
        <rect x="132" y="522" width="80" height="126" fill="#dcc9a2" />
        <rect x="132" y="522" width="80" height="126" fill="url(#pa-window)" />
        <rect x="132" y="522" width="80" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- Arc de Triomphe -->
      <g>
        <rect x="212" y="500" width="94" height="148" fill="#0d1c2e" />
        <rect x="206" y="488" width="106" height="14" fill="#0d1c2e" />
        <path d="M250 648 V588 Q259 574 268 588 V648 Z" fill="#f7f1e6" />
        <rect x="244" y="516" width="30" height="7" fill="#f7f1e6" opacity="0.55" />
        <rect x="244" y="556" width="30" height="7" fill="#f7f1e6" opacity="0.55" />
        <rect x="242" y="618" width="34" height="4" fill="#f7f1e6" opacity="0.4" />
      </g>
      <!-- b5 -->
      <g>
        <rect x="306" y="512" width="58" height="136" fill="#0d1c2e" />
        <rect x="306" y="512" width="58" height="136" fill="url(#pa-window-light)" />
        <rect x="306" y="512" width="58" height="6" fill="#f7f1e6" opacity="0.12" />
      </g>
      <!-- b6 — Invalides-style dome -->
      <g>
        <rect x="364" y="452" width="78" height="196" fill="#e7d9bd" />
        <rect x="364" y="452" width="78" height="196" fill="url(#pa-window)" />
        <rect x="386" y="540" width="34" height="108" fill="#f7f1e6" />
        <path d="M382 540 L421 522 L460 540 Z" fill="#0d1c2e" />
        <rect x="388" y="438" width="30" height="16" fill="#d9a441" />
        <path d="M388 438 Q 403 396 418 438 Z" fill="url(#pa-gold)" />
        <path d="M403 420 V406" stroke="#0d1c2e" stroke-width="3" stroke-linecap="round" />
        <circle cx="403" cy="403" r="3" fill="#c43d2c" />
      </g>
      <!-- b7 -->
      <g>
        <rect x="442" y="500" width="66" height="148" fill="#e7d9bd" />
        <rect x="442" y="500" width="66" height="148" fill="url(#pa-window)" />
        <rect x="442" y="500" width="66" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b8 mansard -->
      <g>
        <rect x="508" y="522" width="86" height="126" fill="#e7d9bd" />
        <rect x="508" y="522" width="86" height="126" fill="url(#pa-window)" />
        <path d="M508 522 L594 522 L583 502 L519 502 Z" fill="#5b7a99" />
        <rect x="508" y="522" width="86" height="5" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b9 (right of the Tower) -->
      <g>
        <rect x="594" y="530" width="78" height="118" fill="#dcc9a2" />
        <rect x="594" y="530" width="78" height="118" fill="url(#pa-window)" />
        <rect x="594" y="530" width="78" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b10 -->
      <g>
        <rect x="672" y="488" width="68" height="160" fill="#0d1c2e" />
        <rect x="672" y="488" width="68" height="160" fill="url(#pa-window-light)" />
        <rect x="672" y="488" width="68" height="6" fill="#f7f1e6" opacity="0.12" />
      </g>
      <!-- b11 -->
      <g>
        <rect x="740" y="502" width="86" height="146" fill="#e7d9bd" />
        <rect x="740" y="502" width="86" height="146" fill="url(#pa-window)" />
        <rect x="740" y="502" width="86" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b12 mansard -->
      <g>
        <rect x="826" y="466" width="64" height="182" fill="#e7d9bd" />
        <rect x="826" y="466" width="64" height="182" fill="url(#pa-window)" />
        <path d="M826 466 L890 466 L879 444 L837 444 Z" fill="#5b7a99" />
      </g>
      <!-- b13 — Pantheon-style dome -->
      <g>
        <rect x="890" y="468" width="82" height="180" fill="#e7d9bd" />
        <rect x="890" y="468" width="82" height="180" fill="url(#pa-window)" />
        <rect x="906" y="560" width="50" height="88" fill="#f7f1e6" />
        <path d="M902 560 L931 540 L960 560 Z" fill="#0d1c2e" />
        <path d="M900 468 Q 931 416 962 468 Z" fill="#5b7a99" />
        <path d="M931 468 V448" stroke="#0d1c2e" stroke-width="3" stroke-linecap="round" />
      </g>
      <!-- b14 -->
      <g>
        <rect x="972" y="510" width="70" height="138" fill="#e7d9bd" />
        <rect x="972" y="510" width="70" height="138" fill="url(#pa-window)" />
        <rect x="972" y="510" width="70" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b15 mansard + awning -->
      <g>
        <rect x="1042" y="474" width="84" height="174" fill="#dcc9a2" />
        <rect x="1042" y="474" width="84" height="174" fill="url(#pa-window)" />
        <path d="M1042 474 L1126 474 L1114 452 L1054 452 Z" fill="#5b7a99" />
        <g>
          <rect x="1060" y="596" width="30" height="12" fill="#c43d2c" />
          <rect x="1070" y="596" width="2" height="12" fill="#f7f1e6" />
          <rect x="1078" y="596" width="2" height="12" fill="#f7f1e6" />
        </g>
      </g>
      <!-- b16 — Sacré-Cœur -->
      <g>
        <path d="M1120 648 Q 1172 552 1224 648 Z" fill="#e7d9bd" />
        <rect x="1132" y="574" width="80" height="74" fill="#f7f1e6" />
        <circle cx="1172" cy="546" r="26" fill="#f7f1e6" stroke="#0d1c2e" stroke-opacity="0.5" stroke-width="2" />
        <rect x="1158" y="566" width="28" height="12" fill="#f7f1e6" stroke="#0d1c2e" stroke-opacity="0.5" stroke-width="1.5" />
        <path d="M1172 520 V504 M1164 510 H1180" stroke="#0d1c2e" stroke-width="3" stroke-linecap="round" />
        <rect x="1126" y="626" width="92" height="22" fill="#f7f1e6" stroke="#0d1c2e" stroke-opacity="0.35" stroke-width="1.5" />
      </g>
      <!-- b17 -->
      <g>
        <rect x="1220" y="512" width="64" height="136" fill="#e7d9bd" />
        <rect x="1220" y="512" width="64" height="136" fill="url(#pa-window)" />
        <rect x="1220" y="512" width="64" height="6" fill="#0d1c2e" opacity="0.08" />
      </g>
      <!-- b18 -->
      <g>
        <rect x="1284" y="478" width="80" height="170" fill="#0d1c2e" />
        <rect x="1284" y="478" width="80" height="170" fill="url(#pa-window-light)" />
        <rect x="1284" y="478" width="80" height="6" fill="#f7f1e6" opacity="0.12" />
      </g>
      <!-- b19 mansard -->
      <g>
        <rect x="1364" y="502" width="76" height="146" fill="#e7d9bd" />
        <rect x="1364" y="502" width="76" height="146" fill="url(#pa-window)" />
        <path d="M1364 502 L1440 502 L1428 480 L1376 480 Z" fill="#5b7a99" />
      </g>
    </g>

    <!-- ================= Eiffel Tower ================================= -->
    <g data-layer="eiffel" clip-path="url(#pc-eiffel)" fill="none" stroke="#0d1c2e" stroke-linecap="round">
      <!-- antenna + beacon -->
      <path d="M560 168 V124" stroke-width="3" />
      <circle cx="560" cy="122" r="4" fill="#c43d2c" stroke="none" />
      <!-- upper shaft -->
      <path d="M552 250 V330 M568 250 V330" stroke-width="3.5" />
      <g stroke-width="2" stroke-opacity="0.75">
        <path d="M552 262 L568 280 M568 262 L552 280" />
        <path d="M552 292 L568 310 M568 292 L552 310" />
        <path d="M552 320 L568 330 M568 320 L552 330" />
      </g>
      <!-- upper deck -->
      <path d="M528 330 H592" stroke-width="5" />
      <!-- mid shaft -->
      <path d="M540 330 V470 M580 330 V470" stroke-width="4" />
      <g stroke-width="2" stroke-opacity="0.75">
        <path d="M540 352 L580 380 M580 352 L540 380" />
        <path d="M540 402 L580 430 M580 402 L540 430" />
        <path d="M540 452 L580 470 M580 452 L540 470" />
      </g>
      <!-- lower deck -->
      <path d="M512 470 H608" stroke-width="6" />
      <!-- legs -->
      <path d="M522 470 L490 648 M598 470 L630 648" stroke-width="4.5" />
      <path d="M540 470 L534 620 M580 470 L586 620" stroke-width="3" />
      <g stroke-width="2" stroke-opacity="0.75">
        <path d="M496 520 H624" />
        <path d="M490 580 H630" />
        <path d="M496 520 L630 580 M624 520 L490 580" />
        <path d="M500 620 H620" />
      </g>
      <!-- base arch -->
      <path d="M490 648 Q560 596 630 648" stroke-width="3.5" />
    </g>

    <!-- ================= the Seine ==================================== -->
    <g data-layer="river" clip-path="url(#pc-river)">
      <path
        d="M0 648 C 150 638, 320 654, 500 646 C 700 638, 900 656, 1100 646 C 1300 636, 1400 650, 1440 644 L1440 770 L0 770 Z"
        fill="url(#pa-river)"
      />
      <path
        d="M0 648 C 150 638, 320 654, 500 646 C 700 638, 900 656, 1100 646 C 1300 636, 1400 650, 1440 644"
        fill="none" stroke="#8fb0c8" stroke-width="2" opacity="0.8"
      />
      <g fill="none" stroke="#8fb0c8" stroke-width="2" opacity="0.7">
        <path d="M60 686 Q 180 676 320 688 Q 460 698 600 688" />
        <path d="M700 714 Q 860 704 1020 716 Q 1180 726 1360 714" />
      </g>
      <!-- reflections -->
      <g stroke="#f7f1e6" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round">
        <path d="M90 660 h22 M150 670 h16 M260 662 h20 M420 668 h18 M560 660 h24 M760 672 h16 M960 666 h20 M1120 662 h18 M1280 672 h22 M1370 664 h16" />
        <path d="M180 726 h14 M420 736 h12 M840 730 h16 M1180 740 h14" />
      </g>
    </g>

    <!-- ================= foreground (flowers) ========================= -->
    <g data-layer="foreground" clip-path="url(#pc-foreground)">
      <path
        d="M0 900 L0 782 C 120 762, 260 776, 400 760 C 560 746, 700 768, 840 754 C 1000 742, 1180 766, 1290 750 C 1360 742, 1410 756, 1440 750 L1440 900 Z"
        fill="url(#pa-grass)"
      />
      <path
        d="M0 900 L0 836 C 220 822, 460 834, 700 822 C 980 808, 1220 830, 1440 818 L1440 900 Z"
        fill="#7f9662" opacity="0.55"
      />
      <!-- grass blades -->
      <g fill="none" stroke="#5f7a4c" stroke-width="2" stroke-linecap="round" opacity="0.8">
        <path d="M150 802 q-4 -14 2 -18" />
        <path d="M470 800 q4 -12 -2 -16" />
        <path d="M790 796 q-3 -12 3 -15" />
        <path d="M1080 804 q4 -13 -1 -17" />
        <path d="M1330 798 q-4 -12 2 -15" />
      </g>
      <!-- blossoms -->
      <use href="#pa-flower" x="140" y="776" transform="scale(1)" />
      <use href="#pa-flower" x="300" y="772" transform="scale(0.85)" />
      <use href="#pa-flower" x="470" y="764" transform="scale(0.9)" />
      <use href="#pa-flower" x="640" y="772" transform="scale(1)" />
      <use href="#pa-flower" x="790" y="762" transform="scale(0.8)" />
      <use href="#pa-flower" x="930" y="758" transform="scale(0.95)" />
      <use href="#pa-flower" x="1090" y="768" transform="scale(0.85)" />
      <use href="#pa-flower" x="1250" y="760" transform="scale(1)" />
      <use href="#pa-flower" x="1360" y="766" transform="scale(0.8)" />
      <use href="#pa-flower" x="70" y="806" transform="scale(0.7)" />
      <use href="#pa-flower" x="390" y="830" transform="scale(0.75)" />
      <use href="#pa-flower" x="720" y="824" transform="scale(0.7)" />
      <use href="#pa-flower" x="1010" y="840" transform="scale(0.75)" />
      <use href="#pa-flower" x="1180" y="826" transform="scale(0.7)" />
      <use href="#pa-flower" x="1390" y="830" transform="scale(0.7)" />
      <!-- gold pollen dots -->
      <g fill="#d9a441" opacity="0.9">
        <circle cx="200" cy="800" r="2" />
        <circle cx="540" cy="792" r="2" />
        <circle cx="870" cy="784" r="2" />
        <circle cx="1150" cy="798" r="2" />
        <circle cx="1290" cy="830" r="2" />
      </g>
    </g>

    <!-- ================= boat (bateau mouche) ========================= -->
    <!-- transform sets the start position: off the left edge, on the river.
         GSAP tweens only x from there. -->
    <g data-layer="boat" transform="translate(-300 680)">
      <!-- wake -->
      <g stroke="#f7f1e6" stroke-opacity="0.7" stroke-width="2.5" stroke-linecap="round">
        <path d="M-14 52 h18 M-8 60 h12" />
      </g>
      <!-- hull -->
      <path d="M6 44 Q 30 60 104 60 Q 178 60 198 44 L 198 38 Q 180 44 104 44 Q 30 44 6 38 Z" fill="#0d1c2e" />
      <!-- red stripe -->
      <rect x="8" y="47" width="186" height="5" rx="2" fill="#c43d2c" />
      <!-- cabin -->
      <rect x="58" y="18" width="88" height="24" rx="4" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="2.5" />
      <!-- cabin roof -->
      <rect x="52" y="12" width="100" height="9" rx="4" fill="#5b7a99" stroke="#0d1c2e" stroke-width="2" />
      <!-- windows -->
      <g fill="#0d1c2e" opacity="0.75">
        <rect x="66" y="24" width="10" height="9" rx="1.5" />
        <rect x="82" y="24" width="10" height="9" rx="1.5" />
        <rect x="98" y="24" width="10" height="9" rx="1.5" />
        <rect x="114" y="24" width="10" height="9" rx="1.5" />
        <rect x="130" y="24" width="10" height="9" rx="1.5" />
      </g>
      <!-- bow flag + name plate -->
      <path d="M8 38 L22 42 L8 46 Z" fill="#c43d2c" />
      <rect x="60" y="44" width="34" height="6" rx="1.5" fill="#f7f1e6" opacity="0.85" />
    </g>

    <!-- ================= bridge (above the boat) ====================== -->
    <g data-layer="bridge" clip-path="url(#pc-bridge)">
      <!-- decorative arch -->
      <path d="M700 670 Q 780 706 864 670" fill="none" stroke="#d9a441" stroke-width="3.5" />
      <!-- stone piers -->
      <rect x="692" y="656" width="34" height="114" fill="#f7e7c4" stroke="#0d1c2e" stroke-width="3" />
      <rect x="838" y="656" width="34" height="114" fill="#f7e7c4" stroke="#0d1c2e" stroke-width="3" />
      <rect x="686" y="650" width="46" height="10" rx="3" fill="#d9a441" stroke="#0d1c2e" stroke-width="2.5" />
      <rect x="832" y="650" width="46" height="10" rx="3" fill="#d9a441" stroke="#0d1c2e" stroke-width="2.5" />
      <!-- deck -->
      <rect x="676" y="636" width="212" height="34" rx="9" fill="url(#pa-gold)" stroke="#0d1c2e" stroke-width="3" />
      <path d="M684 662 H880" stroke="#0d1c2e" stroke-width="1.5" opacity="0.35" />
      <!-- railing -->
      <path d="M680 634 V620 M856 634 V620 M680 620 H856" fill="none" stroke="#0d1c2e" stroke-width="2.5" />
      <g stroke="#0d1c2e" stroke-width="2">
        <path d="M700 634 V622 M720 634 V622 M740 634 V622 M760 634 V622 M780 634 V622 M800 634 V622 M820 634 V622 M840 634 V622" />
      </g>
      <!-- lamps -->
      <g>
        <path d="M686 620 V596" stroke="#0d1c2e" stroke-width="2.5" />
        <circle cx="686" cy="592" r="5" fill="#c43d2c" />
        <path d="M878 620 V596" stroke="#0d1c2e" stroke-width="2.5" />
        <circle cx="878" cy="592" r="5" fill="#c43d2c" />
        <path d="M782 634 V616" stroke="#0d1c2e" stroke-width="2" />
        <circle cx="782" cy="613" r="3.5" fill="#c43d2c" />
      </g>
      <!-- statues on the piers -->
      <circle cx="709" cy="650" r="4" fill="#d9a441" />
      <circle cx="855" cy="650" r="4" fill="#d9a441" />
    </g>

    <!-- ================= mosaic tile texture ========================== -->
    <g data-layer="mosaic">
      <rect width="1440" height="900" fill="url(#pa-mosaic)" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'ParisArt',
};
</script>

<style scoped>
.paris-art {
  width: 100%;
  height: 100%;
  display: block;
}
/* Let GSAP scale layers around their own centre */
.paris-art [data-layer] {
  transform-box: fill-box;
  transform-origin: center;
}

/* Reduced motion: show the whole scene at once */
@media (prefers-reduced-motion: reduce) {
  [data-layer="city"],
  [data-layer="eiffel"],
  [data-layer="river"],
  [data-layer="bridge"],
  [data-layer="foreground"] {
    clip-path: none;
  }
  [data-layer="boat"] {
    transform: translate(600px, 680px);
  }
}
</style>
