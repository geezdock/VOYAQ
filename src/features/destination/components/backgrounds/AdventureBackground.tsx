import { SceneBackground } from "./SceneBackground";

export function AdventureBackground() {
  return (
    <SceneBackground>
      <path d="M0 720 Q80 660 180 690 Q280 720 380 670 Q480 620 580 655 Q680 690 780 650 Q880 610 980 640 Q1080 670 1180 635 Q1280 600 1380 625 Q1440 638 1460 630" strokeWidth="2" opacity="0.5" />
      <path d="M0 760 Q120 710 240 740 Q360 770 480 730 Q600 690 720 720 Q840 750 960 715 Q1080 680 1200 705 Q1320 730 1440 700" strokeWidth="1.4" opacity="0.35" />
      <path d="M0 800 Q180 770 360 790 Q540 810 720 780 Q900 750 1080 775 Q1260 800 1440 770" strokeWidth="1" opacity="0.2" />

      <path d="M180 690 L210 580 L240 600 L270 630 L300 665" strokeWidth="1.5" opacity="0.4" />
      <path d="M210 590 L225 540 L240 600" strokeWidth="1" opacity="0.3" />
      <path d="M220 595 L230 575 L240 600" strokeWidth="0.8" opacity="0.2" />

      <path d="M580 655 L610 540 L640 560 L670 590 L700 625" strokeWidth="1.5" opacity="0.4" />
      <path d="M610 550 L625 500 L640 560" strokeWidth="1" opacity="0.3" />
      <path d="M620 555 L630 535 L640 560" strokeWidth="0.8" opacity="0.2" />

      <path d="M980 640 L1010 520 L1040 540 L1070 570 L1100 605" strokeWidth="1.5" opacity="0.4" />
      <path d="M1010 530 L1025 480 L1040 540" strokeWidth="1" opacity="0.3" />
      <path d="M1020 535 L1030 515 L1040 540" strokeWidth="0.8" opacity="0.2" />

      <g opacity="0.25">
        <path d="M780 650 L790 580 L800 590 M795 585 L805 578 L815 588" strokeWidth="1.2" />
        <path d="M790 590 L790 650" strokeWidth="1" />
        <path d="M795 600 Q802 596 810 600" strokeWidth="0.7" />
        <path d="M792 615 Q799 611 807 615" strokeWidth="0.7" />
      </g>
      <g opacity="0.2">
        <path d="M380 670 L390 600 L400 610 M395 605 L405 598 L415 608" strokeWidth="1" />
        <path d="M390 610 L390 670" strokeWidth="0.8" />
        <path d="M395 618 Q400 615 405 618" strokeWidth="0.6" />
      </g>
      <g opacity="0.2">
        <path d="M1280 625 L1290 560 L1300 570 M1295 565 L1305 558 L1315 568" strokeWidth="1" />
        <path d="M1290 570 L1290 625" strokeWidth="0.8" />
        <path d="M1295 578 L1300 575 1305 578" strokeWidth="0.6" />
      </g>

      <g opacity="0.18">
        <ellipse cx="800" cy="530" rx="18" ry="24" strokeWidth="1" />
        <path d="M800 506 L800 520" strokeWidth="0.8" />
        <path d="M782 530 L800 525 L818 530" strokeWidth="0.8" />
        <path d="M785 545 L800 540 L815 545" strokeWidth="0.8" />
      </g>

      <g opacity="0.15">
        <circle cx="280" cy="710" r="2.5" strokeWidth="0.8" />
        <circle cx="320" cy="700" r="2" strokeWidth="0.8" />
        <circle cx="360" cy="705" r="2.5" strokeWidth="0.8" />
        <circle cx="480" cy="680" r="2" strokeWidth="0.8" />
        <circle cx="520" cy="675" r="2.5" strokeWidth="0.8" />
        <circle cx="700" cy="670" r="2" strokeWidth="0.8" />
        <circle cx="860" cy="650" r="2.5" strokeWidth="0.8" />
        <circle cx="900" cy="645" r="2" strokeWidth="0.8" />
        <circle cx="1140" cy="650" r="2.5" strokeWidth="0.8" />
        <circle cx="1180" cy="645" r="2" strokeWidth="0.8" />
        <circle cx="1360" cy="635" r="2.5" strokeWidth="0.8" />
      </g>

      <g opacity="0.12">
        <path d="M200 760 Q240 730 280 750 Q320 770 360 745" strokeWidth="1" />
        <path d="M640 730 Q680 700 720 720 Q760 740 800 715" strokeWidth="1" />
        <path d="M1080 710 Q1120 680 1160 700 Q1200 720 1240 695" strokeWidth="1" />
      </g>
    </SceneBackground>
  );
}
