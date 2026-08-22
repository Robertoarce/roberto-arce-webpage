<template>
  <!--
    TokyoArt — layered "Tokyo woodblock print × ceramic mosaic" scene.
    Every visual group is an independent layer (data-layer=...) so the parent
    can parallax / animate each one separately with GSAP.
  -->
  <svg
    class="tokyo-art pointer-events-none"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Illustration of Tokyo: red sun, skyline, Tokyo Tower, temple, cherry blossoms and waves, drawn as a mosaic print"
  >
    <defs>
      <linearGradient id="ta-paper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7f1e6" />
        <stop offset="0.6" stop-color="#f4efe5" />
        <stop offset="1" stop-color="#efe7d5" />
      </linearGradient>
      <radialGradient id="ta-sun" cx="0.42" cy="0.4" r="0.9">
        <stop offset="0" stop-color="#da5b43" />
        <stop offset="0.55" stop-color="#c43d2c" />
        <stop offset="1" stop-color="#9b2a1b" />
      </radialGradient>
      <pattern id="ta-window" width="14" height="12" patternUnits="userSpaceOnUse">
        <rect width="2.4" height="2.6" fill="#f4efe5" opacity="0.55" />
      </pattern>
      <pattern id="ta-mosaic" width="26" height="26" patternUnits="userSpaceOnUse">
        <rect width="26" height="26" fill="none" />
        <rect x="1" y="1" width="24" height="24" rx="4" fill="none" stroke="#0d1c2e" stroke-opacity="0.05" />
        <rect x="6" y="6" width="9" height="9" rx="2.5" fill="#0d1c2e" fill-opacity="0.055" />
        <rect x="16" y="16" width="6" height="6" rx="2" fill="#c43d2c" fill-opacity="0.05" />
      </pattern>
      <g id="ta-sakura">
        <g fill="#e08d7e">
          <ellipse cx="0" cy="-5.4" rx="3.1" ry="5.2" />
          <ellipse cx="0" cy="-5.4" rx="3.1" ry="5.2" transform="rotate(72)" />
          <ellipse cx="0" cy="-5.4" rx="3.1" ry="5.2" transform="rotate(144)" />
          <ellipse cx="0" cy="-5.4" rx="3.1" ry="5.2" transform="rotate(216)" />
          <ellipse cx="0" cy="-5.4" rx="3.1" ry="5.2" transform="rotate(288)" />
        </g>
        <circle r="2.2" fill="#c43d2c" />
      </g>
    </defs>

    <!-- ================= background: paper + coordinate grid ========= -->
    <g data-layer="bg">
      <rect width="1440" height="900" fill="url(#ta-paper)" />
      <!-- faint coordinate / graph-paper grid (data-viz motif) -->
      <g stroke="#5b7a99" stroke-opacity="0.08" stroke-width="1">
        <path d="M0 60 H1440 M0 120 H1440 M0 180 H1440 M0 240 H1440 M0 300 H1440 M0 360 H1440 M0 420 H1440" />
        <path d="M120 0 V520 M240 0 V520 M360 0 V520 M480 0 V520 M600 0 V520 M720 0 V520 M840 0 V520 M960 0 V520 M1080 0 V520 M1200 0 V520 M1320 0 V520" />
      </g>
      <!-- compass ring behind the sun -->
      <circle cx="1010" cy="230" r="222" fill="none" stroke="#5b7a99" stroke-opacity="0.14" stroke-width="1" />
      <circle cx="1010" cy="230" r="266" fill="none" stroke="#5b7a99" stroke-opacity="0.08" stroke-width="1" stroke-dasharray="2 6" />
    </g>

    <!-- ================= clouds (ukiyo-e scallops) =================== -->
    <g data-layer="clouds" fill="#f2eadb" stroke="#0d1c2e" stroke-opacity="0.07">
      <g>
        <ellipse cx="180" cy="128" rx="96" ry="26" />
        <ellipse cx="252" cy="112" rx="62" ry="22" />
        <ellipse cx="112" cy="116" rx="52" ry="18" />
      </g>
      <g>
        <ellipse cx="1260" cy="96" rx="88" ry="24" />
        <ellipse cx="1328" cy="82" rx="58" ry="20" />
        <ellipse cx="1196" cy="86" rx="48" ry="16" />
      </g>
      <g opacity="0.7">
        <ellipse cx="86" cy="270" rx="70" ry="18" />
        <ellipse cx="140" cy="258" rx="46" ry="15" />
      </g>
    </g>

    <!-- ================= red sun ===================================== -->
    <g data-layer="sun">
      <circle cx="1010" cy="230" r="212" fill="#c43d2c" opacity="0.12" />
      <circle cx="1010" cy="230" r="150" fill="url(#ta-sun)" />
      <!-- halftone scan lines inside the disc -->
      <g stroke="#f4efe5" stroke-opacity="0.12" stroke-width="1.5">
        <path d="M900 210 H1120 M906 230 H1114 M900 250 H1120" />
      </g>
      <circle cx="1010" cy="230" r="167" fill="none" stroke="#f4efe5" stroke-opacity="0.5" stroke-width="2" />
    </g>

    <!-- ================= skyline ===================================== -->
    <g data-layer="skyline">
      <g fill="#0d1c2e">
        <rect x="30" y="470" width="90" height="90" />
        <rect x="120" y="430" width="70" height="130" />
        <rect x="190" y="490" width="60" height="70" />
        <rect x="250" y="440" width="104" height="120" />
        <rect x="354" y="482" width="64" height="78" />
        <rect x="418" y="422" width="80" height="138" />
        <rect x="630" y="462" width="70" height="98" />
        <rect x="700" y="430" width="92" height="130" />
        <rect x="792" y="482" width="60" height="78" />
        <rect x="852" y="450" width="102" height="110" />
        <rect x="954" y="484" width="64" height="76" />
        <rect x="1018" y="442" width="84" height="118" />
        <rect x="1102" y="472" width="66" height="88" />
        <rect x="1286" y="472" width="92" height="88" />
        <rect x="1378" y="448" width="66" height="112" />
      </g>
      <!-- window dots -->
      <g fill="url(#ta-window)">
        <rect x="30" y="470" width="90" height="90" />
        <rect x="120" y="430" width="70" height="130" />
        <rect x="250" y="440" width="104" height="120" />
        <rect x="700" y="430" width="92" height="130" />
        <rect x="852" y="450" width="102" height="110" />
        <rect x="1018" y="442" width="84" height="118" />
        <rect x="1286" y="472" width="92" height="88" />
        <rect x="1378" y="448" width="66" height="112" />
      </g>
      <!-- antennae + roof data nodes -->
      <g stroke="#0d1c2e" stroke-width="3" stroke-linecap="round">
        <path d="M285 440 V414 M418 422 V402 M746 430 V406 M903 450 V430 M1060 442 V418" />
      </g>
      <g fill="#5b7a99">
        <circle cx="285" cy="414" r="5" />
        <circle cx="418" cy="402" r="5" />
        <circle cx="746" cy="406" r="5" />
        <circle cx="903" cy="430" r="5" />
        <circle cx="1060" cy="418" r="5" />
      </g>
      <g stroke="#5b7a99" stroke-opacity="0.55" stroke-width="1.4" fill="none">
        <path d="M285 414 L418 402 L746 406 L903 430 L1060 418" />
      </g>
    </g>

    <!-- ================= Tokyo Tower ================================= -->
    <g data-layer="tower" stroke="#c43d2c" stroke-width="4.5" stroke-linecap="round" fill="none">
      <!-- antenna -->
      <path d="M560 250 V330" stroke-width="3" />
      <!-- upper deck (special observatory) -->
      <path d="M536 330 H584" />
      <!-- upper shaft -->
      <path d="M546 330 V470 M574 330 V470" />
      <!-- lower deck (main observatory) -->
      <path d="M521 470 H599" />
      <!-- flared legs -->
      <path d="M530 470 L498 560 M590 470 L622 560" />
      <!-- lattice diagonals -->
      <g stroke-width="2" stroke-opacity="0.7">
        <path d="M546 348 L574 366 M574 348 L546 366 M546 396 L574 414 M574 396 L546 414 M546 444 L574 462 M574 444 L546 462" />
        <path d="M530 492 L498 516 M530 516 L498 492 M590 492 L622 516 M590 516 L622 492" />
      </g>
      <path d="M498 560 H622" stroke-width="5" />
      <!-- beacon -->
      <circle cx="560" cy="250" r="5" fill="#c43d2c" stroke="none" />
    </g>

    <!-- ================= temple / pagoda ============================= -->
    <g data-layer="temple">
      <!-- spire -->
      <g stroke="#0d1c2e" stroke-width="3" fill="none">
        <path d="M1240 380 V356" />
      </g>
      <circle cx="1240" cy="354" r="4" fill="#c43d2c" />
      <!-- tier 1 -->
      <path d="M1188 420 Q1240 406 1292 420 L1284 430 L1196 430 Z" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <rect x="1206" y="430" width="68" height="26" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <path d="M1188 420 Q1240 406 1292 420" fill="none" stroke="#c43d2c" stroke-width="2.5" />
      <!-- tier 2 -->
      <path d="M1164 456 Q1240 440 1316 456 L1308 468 L1172 468 Z" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <rect x="1184" y="468" width="112" height="28" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <path d="M1164 456 Q1240 440 1316 456" fill="none" stroke="#c43d2c" stroke-width="2.5" />
      <!-- tier 3 -->
      <path d="M1140 496 Q1240 478 1340 496 L1330 510 L1150 510 Z" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <rect x="1164" y="510" width="152" height="34" fill="#f7f1e6" stroke="#0d1c2e" stroke-width="3" />
      <path d="M1140 496 Q1240 478 1340 496" fill="none" stroke="#c43d2c" stroke-width="2.5" />
      <!-- base -->
      <path d="M1130 544 H1350 V560 H1130 Z" fill="#e4d8bf" stroke="#0d1c2e" stroke-width="3" />
    </g>

    <!-- ================= cherry blossoms ============================= -->
    <g data-layer="flowers">
      <use href="#ta-sakura" x="150" y="122" transform="scale(0.9)" />
      <use href="#ta-sakura" x="402" y="200" transform="scale(0.7)" />
      <use href="#ta-sakura" x="688" y="120" transform="scale(1)" />
      <use href="#ta-sakura" x="980" y="170" transform="scale(0.75)" />
      <use href="#ta-sakura" x="1226" y="110" transform="scale(0.8)" />
      <use href="#ta-sakura" x="1466" y="222" transform="scale(0.9)" />
      <use href="#ta-sakura" x="88" y="372" transform="scale(0.8)" />
      <use href="#ta-sakura" x="478" y="356" transform="scale(0.6)" />
      <use href="#ta-sakura" x="800" y="320" transform="scale(0.7)" />
      <use href="#ta-sakura" x="1066" y="390" transform="scale(0.65)" />
      <use href="#ta-sakura" x="1388" y="322" transform="scale(0.8)" />
      <use href="#ta-sakura" x="333" y="66" transform="scale(0.55)" />
      <use href="#ta-sakura" x="600" y="452" transform="scale(0.6)" />
    </g>

    <!-- ================= waves (foreground) ========================== -->
    <g data-layer="waves">
      <!-- back wave -->
      <path
        d="M -20 900 L -20 726
           C 120 694 260 702 380 742
           C 500 782 660 792 820 762
           C 980 732 1160 742 1300 774
           C 1380 790 1440 780 1460 780
           L 1460 900 Z"
        fill="#162c45"
      />
      <!-- front wave with crests -->
      <path
        d="M -20 900 L -20 794
           C 40 744 130 722 210 752
           C 252 768 242 808 190 830
           C 320 782 470 774 560 802
           C 660 832 760 828 860 802
           C 960 776 1080 780 1180 812
           C 1280 842 1380 838 1460 808
           L 1460 900 Z"
        fill="#0d1c2e"
      />
      <!-- foam dots -->
      <g fill="#f4efe5">
        <circle cx="210" cy="748" r="7" />
        <circle cx="258" cy="760" r="5" />
        <circle cx="150" cy="740" r="4" />
        <circle cx="560" cy="798" r="7" />
        <circle cx="612" cy="806" r="4" />
        <circle cx="508" cy="788" r="4" />
        <circle cx="860" cy="798" r="7" />
        <circle cx="910" cy="806" r="4" />
        <circle cx="810" cy="786" r="4" />
        <circle cx="1180" cy="806" r="7" />
        <circle cx="1230" cy="814" r="4" />
      </g>
      <!-- vermillion crest accent -->
      <path d="M120 740 Q210 728 300 752" fill="none" stroke="#c43d2c" stroke-width="3" stroke-linecap="round" opacity="0.8" />
      <!-- data points riding the wave -->
      <g fill="#7f9cb5">
        <circle cx="330" cy="760" r="4" />
        <circle cx="700" cy="786" r="4" />
        <circle cx="1020" cy="782" r="4" />
        <circle cx="1310" cy="800" r="4" />
      </g>
    </g>

    <!-- ================= data-viz motifs ============================= -->
    <g data-layer="data">
      <!-- network graph, upper-left -->
      <g stroke="#5b7a99" stroke-width="1.5" stroke-opacity="0.7" fill="none">
        <path d="M186 172 L262 132 L344 190 L218 258 Z" />
        <path d="M186 172 L344 190 M262 132 L218 258" stroke-opacity="0.4" />
      </g>
      <g fill="#0d1c2e">
        <circle cx="186" cy="172" r="6" />
        <circle cx="262" cy="132" r="5" />
        <circle cx="344" cy="190" r="5.5" />
        <circle cx="218" cy="258" r="4.5" />
      </g>
      <circle cx="186" cy="172" r="10" fill="none" stroke="#c43d2c" stroke-width="1.6" />
      <!-- sparkline -->
      <g fill="none" stroke="#0d1c2e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M920 480 L952 470 L984 484 L1016 458 L1048 468 L1080 444 L1112 452" />
      </g>
      <circle cx="1112" cy="452" r="4" fill="#c43d2c" stroke="none" />
      <!-- tiny bar chart -->
      <g fill="#0d1c2e">
        <rect x="120" y="506" width="10" height="26" />
        <rect x="136" y="492" width="10" height="40" />
        <rect x="152" y="516" width="10" height="16" />
        <rect x="168" y="482" width="10" height="50" fill="#c43d2c" />
        <rect x="184" y="500" width="10" height="32" />
      </g>
      <path d="M116 534 H198" stroke="#0d1c2e" stroke-width="1.4" />
      <!-- mono data labels -->
      <g font-family="'JetBrains Mono', ui-monospace, monospace" font-size="11" fill="#0d1c2e" opacity="0.55">
        <text x="206" y="160">36.41</text>
        <text x="256" y="250">σ 12.8</text>
        <text x="936" y="472">Δ +18%</text>
        <text x="120" y="548">n = 5</text>
      </g>
    </g>

    <!-- ================= mosaic tile texture ========================= -->
    <g data-layer="mosaic">
      <rect width="1440" height="900" fill="url(#ta-mosaic)" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'TokyoArt',
};
</script>

<style scoped>
.tokyo-art {
  width: 100%;
  height: 100%;
  display: block;
}
/* Let GSAP scale layers around their own centre */
.tokyo-art [data-layer] {
  transform-box: fill-box;
  transform-origin: center;
}
</style>
