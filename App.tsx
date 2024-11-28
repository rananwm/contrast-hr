import React, { useEffect } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { AppNavigator } from "./navigation/auth.navigation.component";
import { I18nextProvider } from "react-i18next";
import i18n from "./localization/localization";
import {
  initialize,
  readRecords,
  requestPermission,
} from "react-native-health-connect";
import AppleHealthKit from "react-native-health";
import { COLORS } from "./constants";

// const theme = {
//   "colors": {
//     "primary": "rgb(233, 81, 1)",
//     "onPrimary": "rgb(255, 255, 255)",
//     "primaryContainer": "rgb(255, 218, 212)",
//     "onPrimaryContainer": "rgb(65, 0, 0)",
//     "secondary": "rgb(119, 86, 81)",
//     "onSecondary": "rgb(255, 255, 255)",
//     "secondaryContainer": "rgb(255, 218, 212)",
//     "onSecondaryContainer": "rgb(44, 21, 18)",
//     "tertiary": "rgb(112, 92, 46)",
//     "onTertiary": "rgb(255, 255, 255)",
//     "tertiaryContainer": "rgb(251, 223, 166)",
//     "onTertiaryContainer": "rgb(37, 26, 0)",
//     "error": "rgb(186, 26, 26)",
//     "onError": "rgb(255, 255, 255)",
//     "errorContainer": "rgb(255, 218, 214)",
//     "onErrorContainer": "rgb(65, 0, 2)",
//     "background": "rgb(255, 251, 255)",
//     "onBackground": "rgb(32, 26, 25)",
//     "surface": "rgb(255, 251, 255)",
//     "onSurface": "rgb(32, 26, 25)",
//     "surfaceVariant": "rgb(245, 221, 218)",
//     "onSurfaceVariant": "rgb(83, 67, 65)",
//     "outline": "rgb(133, 115, 112)",
//     "outlineVariant": "rgb(216, 194, 190)",
//     "shadow": "rgb(0, 0, 0)",
//     "scrim": "rgb(0, 0, 0)",
//     "inverseSurface": "rgb(54, 47, 46)",
//     "inverseOnSurface": "rgb(251, 238, 236)",
//     "inversePrimary": "rgb(255, 180, 168)",
//     "elevation": {
//       "level0": "transparent",
//       "level1": "rgb(252, 239, 242)",
//       "level2": "rgb(250, 231, 235)",
//       "level3": "rgb(248, 224, 227)",
//       "level4": "rgb(247, 221, 224)",
//       "level5": "rgb(246, 216, 219)"
//     },
//     "surfaceDisabled": "rgba(32, 26, 25, 0.12)",
//     "onSurfaceDisabled": "rgba(32, 26, 25, 0.38)",
//     "backdrop": "rgba(59, 45, 43, 0.4)"
//   }
// }

const theme = {
  colors: {
    primary: COLORS.SECONDARY,
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 215, 245)",
    onPrimaryContainer: "rgb(56, 0, 56)",
    secondary: "rgb(230, 230, 230)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(230, 230, 230)",
    onSecondaryContainer: "rgb(39, 22, 36)",
    tertiary: "rgb(130, 83, 69)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 219, 209)",
    onTertiaryContainer: "rgb(50, 18, 8)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(30, 26, 29)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(30, 26, 29)",
    surfaceVariant: "rgb(230, 230, 230)",
    onSurfaceVariant: "rgb(78, 68, 75)",
    outline: "rgb(128, 116, 124)",
    outlineVariant: "rgb(209, 194, 203)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(52, 47, 50)",
    inverseOnSurface: "rgb(248, 238, 242)",
    inversePrimary: "rgb(255, 170, 243)",
    elevation: {
      level0: "transparent",
      level1: "rgb(230, 230, 230)",
      level2: "rgb(230, 230, 230)",
      level3: "rgb(230, 230, 230)",
      level4: "rgb(230, 230, 230)",
      level5: "rgb(230, 230, 230)",
    },
    surfaceDisabled: "rgba(30, 26, 29, 0.12)",
    onSurfaceDisabled: "rgba(30, 26, 29, 0.38)",
    backdrop: "rgba(55, 46, 52, 0.4)",
  },
};
const AndroidInitializeHealthConnect = async () => {
  try {
    const isInitialized = await initialize();
    const grantedPermissions = await requestPermission([
      { accessType: "read", recordType: "HeartRate" },
    ]);

    const { records } = await readRecords("HeartRate", {
      timeRangeFilter: {
        operator: "between",
        // last week start time
        startTime: new Date(
          new Date().setDate(new Date().getDate() - 7)
        ).toISOString(),
        endTime: new Date().toISOString(),
      },
    });
    console.log("🚀 ~ initializeHealthConnect ~ records:", records[0].samples);
  } catch (error) {
    console.log("🚀 ~ initializeHealthConnect ~ error:", error);
  }
  // check if granted
};
const AppleHealthInitialize = async () => {
  try {
    let options = {
      permissions: {
        read: ["StepCount", "HeartRate"],
        write: [],
      },
    };
    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log("error initializing Healthkit: ", err);
        return;
      }
      AppleHealthKit?.getHeartRateVariabilitySamples(
        {
          startDate: new Date(
            new Date().setDate(new Date().getDate() - 7)
          ).toISOString(),
          endDate: new Date().toISOString(),
          ascending: false,
        },
        (err, results) => {
          if (err) {
            console.log("error getting heart rate variability: ", err);
            return;
          }
          console.log(
            "🚀 ~ AppleHealthInitialize HeartRateVariability ~ results",
            results
          );
        }
      );
      AppleHealthKit.getStepCount(
        {
          startDate: new Date(
            new Date().setDate(new Date().getDate() - 7)
          ).toISOString(),
          endDate: new Date().toISOString(),
          ascending: false,
        },
        (err, results) => {
          if (err) {
            console.log("error getting step count: ", err);
            return;
          }
          console.log(
            "🚀 ~ AppleHealthInitialize StepCount ~ results",
            results
          );
        }
      );
      // Height Example
      AppleHealthKit.getHeartRateSamples(
        {
          startDate: new Date(
            new Date().setDate(new Date().getDate() - 7)
          ).toISOString(),
          endDate: new Date().toISOString(),
          ascending: false,
        },
        (err, results) => {
          if (err) {
            console.log("error getting heart rate: ", err);
            return;
          }
          console.log("🚀 ~ AppleHealthInitialize ~ results", results);
        }
      );
    });
  } catch (error) {
    console.log("🚀 ~ AppleHealthInitialize ~ error:", error);
  }
};
export default () => {
  useEffect(() => {
    // if (Platform.OS === "android") {
    //   AndroidInitializeHealthConnect();
    // } else {
    //   AppleHealthInitialize();
    // }
  }, []);
  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <AppNavigator />
      </I18nextProvider>
    </PaperProvider>
  );
};
