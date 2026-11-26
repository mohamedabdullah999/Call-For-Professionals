/**
 * Organiser logos, in the same order as https://expertslive.sa/sponsors/ (checked 26 Nov 2026).
 * White artwork on transparent, trimmed to the visible area and sized for 2x screens.
 */
export interface OrganiserLogo {
  name: string;
  src: string;
  width: number;
  height: number;
}

import { withBasePath } from './base-path';

const FILES: OrganiserLogo[] = [
  { name: "Princess Nourah bint Abdulrahman University", src: '/logos/organisers/pnu.png', width: 248, height: 150 },
  { name: "AI in Healthcare Research Chair", src: '/logos/organisers/rcai.png', width: 316, height: 150 },
  { name: "Year of AI 2026", src: '/logos/organisers/year-of-ai-2026.png', width: 406, height: 150 },
  { name: "Cloud Mechanics", src: '/logos/organisers/cloud-mechanics.png', width: 440, height: 116 },
  { name: "Microsoft", src: '/logos/organisers/microsoft.png', width: 440, height: 103 },
  { name: "MCIT", src: '/logos/organisers/mcit.png', width: 440, height: 122 },
  { name: "Saudi Digital Academy", src: '/logos/organisers/sda.png', width: 440, height: 70 },
  { name: "Smart Code", src: '/logos/organisers/smart-code.png', width: 252, height: 150 },
  { name: "ZAT.VC", src: '/logos/organisers/zat-vc.png', width: 140, height: 150 },
  { name: "Mindware", src: '/logos/organisers/mindware.png', width: 440, height: 128 },
  { name: "Dell Technologies", src: '/logos/organisers/dell-technologies.png', width: 440, height: 62 },
  { name: "NVIDIA", src: '/logos/organisers/nvidia.png', width: 440, height: 93 },
  { name: "robopack", src: '/logos/organisers/robopack.png', width: 440, height: 85 },
  { name: "Zerotouch", src: '/logos/organisers/zerotouch.png', width: 150, height: 150 },
  { name: "Sulava", src: '/logos/organisers/sulava.png', width: 256, height: 150 },
  { name: "Admin By Request", src: '/logos/organisers/admin-by-request.png', width: 440, height: 74 },
  { name: "Bespin Global", src: '/logos/organisers/bespin-global.png', width: 440, height: 108 },
  { name: "LogiSam", src: '/logos/organisers/logisam.png', width: 372, height: 150 },
  { name: "Patch My PC", src: '/logos/organisers/patch-my-pc.png', width: 440, height: 105 },
  { name: "Onyx Data", src: '/logos/organisers/onyx-data.png', width: 104, height: 150 },
  { name: "Login VSI", src: '/logos/organisers/login-vsi.png', width: 440, height: 69 },
  { name: "Tier3Tech", src: '/logos/organisers/tier3tech.png', width: 232, height: 150 },
  { name: "Tawwaq", src: '/logos/organisers/tawwaq.png', width: 407, height: 150 },
  { name: "FutureLeap", src: '/logos/organisers/futureleap.png', width: 440, height: 74 },
  { name: "CapNest", src: '/logos/organisers/capnest.png', width: 405, height: 150 },
  { name: "Alfia", src: '/logos/organisers/alfia.png', width: 440, height: 143 },
  { name: "Raseel Company", src: '/logos/organisers/raseel.png', width: 440, height: 142 },
  { name: "Voice of FM", src: '/logos/organisers/voice-of-fm.png', width: 440, height: 130 },
  { name: "Convz", src: '/logos/organisers/convz.png', width: 440, height: 57 },
  { name: "AYEN", src: '/logos/organisers/ayen.png', width: 150, height: 150 },
  { name: "Plus", src: '/logos/organisers/plus.png', width: 297, height: 150 },
  { name: "STF", src: '/logos/organisers/stf.png', width: 238, height: 150 },
  { name: "Beetleware", src: '/logos/organisers/beetleware.png', width: 276, height: 150 },
  { name: "Blend", src: '/logos/organisers/blend.png', width: 128, height: 150 },
  { name: "Thabat", src: '/logos/organisers/thabat.png', width: 318, height: 150 },
  { name: "ThaatAi", src: '/logos/organisers/thaat-ai.png', width: 143, height: 150 },
  { name: "Cloudativ", src: '/logos/organisers/cloudativ.png', width: 440, height: 83 },
  { name: "CoreSys", src: '/logos/organisers/coresys.png', width: 157, height: 150 },
  { name: "INFINIARC Pro", src: '/logos/organisers/infiniarc-pro.png', width: 440, height: 34 },
  { name: "System Center Dudes", src: '/logos/organisers/system-center-dudes.png', width: 440, height: 83 },
  { name: "Lenks.ai", src: '/logos/organisers/lenks-ai.png', width: 440, height: 84 },
  { name: "Rifqa", src: '/logos/organisers/rifqa.png', width: 372, height: 150 },
  { name: "Majlis Business", src: '/logos/organisers/majlis-business.png', width: 440, height: 94 },
  { name: "Code Founders", src: '/logos/organisers/code-founders.png', width: 440, height: 110 },
  { name: "Echora", src: '/logos/organisers/echora.png', width: 440, height: 92 },
  { name: "ALS – Alhazmi Legal Services", src: '/logos/organisers/als-alhazmi-legal.png', width: 215, height: 150 },
  { name: "AK Events", src: '/logos/organisers/ak-events.png', width: 146, height: 150 },
  { name: "VirtuWa", src: '/logos/organisers/virtuwa.png', width: 440, height: 103 },
  { name: "Unbound Focus 30", src: '/logos/organisers/unbound-focus-30.png', width: 260, height: 150 },
  { name: "DataCode", src: '/logos/organisers/datacode.png', width: 440, height: 74 },
  { name: "Khallak Fahim", src: '/logos/organisers/khallak-fahim.png', width: 167, height: 150 },
  { name: "StartupKit", src: '/logos/organisers/startupkit.png', width: 235, height: 150 },
  { name: "esense", src: '/logos/organisers/esense.png', width: 440, height: 138 },
  { name: "IDARK360", src: '/logos/organisers/idark360.png', width: 440, height: 93 },
  { name: "TABsense", src: '/logos/organisers/tabsense.png', width: 440, height: 66 },
  { name: "Jmaa", src: '/logos/organisers/jmaa.png', width: 380, height: 150 },
  { name: "Prime Digital Innovations", src: '/logos/organisers/prime-digital-innovations.png', width: 226, height: 150 },
  { name: "Tamkeen Intelligent", src: '/logos/organisers/tamkeen-intelligent.png', width: 440, height: 110 },
  { name: "VAZA", src: '/logos/organisers/vaza.png', width: 242, height: 150 },
  { name: "Makarim Water", src: '/logos/organisers/makarim-water.png', width: 294, height: 150 },
  { name: "Flow Ventures", src: '/logos/organisers/flow-ventures.png', width: 440, height: 143 },
  { name: "OSARH Cloud", src: '/logos/organisers/osarh-cloud.png', width: 235, height: 150 },
  { name: "Numkin", src: '/logos/organisers/numkin.png', width: 197, height: 150 },
  { name: "SPP", src: '/logos/organisers/spp.png', width: 440, height: 137 },
  { name: "Masar", src: '/logos/organisers/masar.png', width: 300, height: 150 },
  { name: "Sahalat", src: '/logos/organisers/sahalat.png', width: 440, height: 123 },
  { name: "Sanabel Electronic Newspaper", src: '/logos/organisers/sanabel.png', width: 183, height: 150 },
  { name: "BROCA Group", src: '/logos/organisers/broca-group.png', width: 418, height: 150 },
  { name: "PRIMEWAVE", src: '/logos/organisers/primewave.png', width: 234, height: 150 },
];

/** Same list with the base path added to each src (next/image does not add it). */
export const ORGANISER_LOGOS: OrganiserLogo[] = FILES.map((logo) => ({ ...logo, src: withBasePath(logo.src) }));
