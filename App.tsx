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
import useHealth from "./hooks/useHealth";
import { AuthProvider } from "./context/AuthContext";

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

export default () => {
  const { initializeAndSyncHealthData } = useHealth();
  useEffect(() => {
    initializeAndSyncHealthData();
  }, []);
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <AppNavigator />
        </I18nextProvider>
      </PaperProvider>
    </AuthProvider>
  );
};
