import { Linking, Platform, Pressable, StyleSheet } from "react-native";
import React from "react";
import { MButton, MText, MView } from "./MComponents";
import { MModal } from "./MModal";
import { COLORS } from "../constants";
import MScrollView from "./MComponents/MScrollView";
import { t } from "i18next";
import { IconButton } from "react-native-paper";

const HealthDataSyncingModal = ({
  visible,
  onDismiss,
  onContinue,
  disabled,
}) => {
  const isIOS = Platform.OS === "ios";
  const steps = t(`health.${Platform.OS}.steps`, { returnObjects: true }) || [];
  const toggleHealthSetings = () => {
    if (isIOS) {
      Linking.openURL("x-apple-health://sources");
    } else {
      Linking.openSettings();
    }
  };
  return (
    <MModal
      onDismiss={onDismiss}
      visible={visible}
      contentContainerStyle={styles.modal}
    >
      <MScrollView>
        <Pressable onPress={onDismiss} style={styles.closeIcon}>
          <IconButton icon="close" size={24} />
        </Pressable>
        <MView>
          <MText style={styles.title}>
            {t(`health.${Platform.OS}.allow_health_data`)}
          </MText>
          <MText>{t(`health.${Platform.OS}.we_need_access`)}</MText>
          <MText style={styles.subtitle}>
            {t(`health.${Platform.OS}.steps_to_follow`)}
          </MText>
          <MText style={styles.instructionsTitle}>
            {t(`health.${Platform.OS}.how_to_enable_permissions`)}
          </MText>
          {steps.map((step, index) => (
            <MText key={index} style={styles.instructions}>
              {step}
            </MText>
          ))}
          <MView style={styles.buttonContainer}>
            <MButton
              onPress={toggleHealthSetings}
              style={[styles.btn, { backgroundColor: COLORS.SECONDARY }]}
            >
              {t(`health.open_settings`)}
            </MButton>
            <MButton
              style={[styles.btn, { opacity: disabled ? 0.6 : 1 }]}
              onPress={onContinue}
              disabled={disabled}
            >
              {t(`health.${Platform.OS}.continue`)}
            </MButton>
          </MView>
        </MView>
      </MScrollView>
    </MModal>
  );
};

export default HealthDataSyncingModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 10,
    maxHeight: "80%", // Adjust modal height for long content
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  instructions: {
    marginTop: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modal: {
    width: "90%",
    minHeight: 200,
    borderRadius: 20,
    alignSelf: "center",
    backgroundColor: COLORS.WHITE,
    padding: 20,
  },
  btn: {
    marginTop: 12,
    backgroundColor: COLORS.PRIMARY,
    width: "45%",
    borderRadius: 8,
  },
  closeIcon: {
    position: "absolute",
    top: -14,
    right: -16,
    zIndex: 10,
  },
});
