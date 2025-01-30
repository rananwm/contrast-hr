import ROUTES from "./routes";
// import IMGS from './imgs';
// import COLORS from './colors';
const COLORS = {
  PRIMARY: "#000",
  SECONDARY: "#29abe2",
  WHITE: "#fff",
  BLACK: "#000",
  LIGHT_BLACK: "#333",
  DARK_GREY: "#808080",
  GREY: "#A9A9A9",
  LIGHT_GREY: "#D3D3D3",
  LIGHTER_GREY: "#E1E1E1",
  GREY_BG: "#F9F9F9",
  LIGHT_RED: "#8D3432",
  LIGHT_RED_BG: "#F9DFDA",
};
const TELE_HEALTH_PLAN_NAME = {
  TSX63ZTK: "WHVC Therapy",
  EX4K12W9: "WHVC Medical",
  ZOWS7G2L: "WHVC Therapy",
  ZDWS7G2L: "WHVC Therapy",
  JEQ5P2H4: "WHVC Therapy",
  XLK385UG: "WHVC Medical",
  BJWQFQF5: "WHVC Medical",
  YBG7TE2N: "WHVC Therapy",
  YRD895YT: "WHVC Medical",
  YDN67LR6: "WHVC Therapy",
};
const REQUIRED_PERMISSIONS = [
  { accessType: "read", recordType: "CyclingPedalingCadence" },
  { accessType: "read", recordType: "Distance" },
  { accessType: "read", recordType: "ExerciseSession" },
  { accessType: "read", recordType: "Hydration" },
  { accessType: "read", recordType: "SleepSession" },
  { accessType: "read", recordType: "StepsCadence" },
  { accessType: "read", recordType: "Steps" },
];
const WEB_URL = "https://app.contrasthr.com";
const API_KEY =
  "ZihESGeUZsP0bKf6l32l1GskLVDGzwckYIq5SN59u6DAYLpkH39atcObzeL7bDk";
const API_BASE_URL = "https://app.contrasthr.com/api-app";
const APP_LOGO = {
  CONTRAST: require("../assets/logo/contrast_logo.png"),
  SPARKJOY: require("../assets/logo/sparkjoy_logo.png"),
  WORKPLAY: require("../assets/logo/workplay_logo.png"),
  CONTRAST_DARK: require("../assets/logo/contrast_dark_logo.png"),
  SPARKJOY_DARK: require("../assets/logo/sparkjoy_dark_logo.png"),
  WORKPLAY_DARK: require("../assets/logo/workplay_dark_logo.png"),
  WORKPLAY_STACKED: require("../assets/logo/workplay_stacked_logo.png"),
};
export {
  ROUTES,
  COLORS,
  TELE_HEALTH_PLAN_NAME,
  WEB_URL,
  API_BASE_URL,
  API_KEY,
  APP_LOGO,
  REQUIRED_PERMISSIONS,
};
