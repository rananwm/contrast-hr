import { StyleSheet } from "react-native";
import React from "react";
import { MButton, MText, MView } from "./MComponents";
import { MModal } from "./MModal";
import { COLORS } from "../constants";
import MScrollView from "./MComponents/MScrollView";
import { t } from "i18next";

const HealthDataSyncingModal = ({ visible, onDismiss, onContinue }) => {
  return (
    <MModal
      onDismiss={onDismiss}
      visible={visible}
      contentContainerStyle={styles.modal}
    >
      <MScrollView>
        <MView>
          <MText style={styles.title}>{t("health.allow_health_data")}</MText>
          <MText>{t("health.we_need_access")}</MText>
          <MText style={styles.subtitle}>{t("health.steps_to_follow")}</MText>

          <MText style={styles.instructionsTitle}>
            {t("health.how_to_enable_permissions")}
          </MText>
          <MText style={styles.instructions}>{t("health.steps.1")}</MText>
          <MText style={styles.instructions}>{t("health.steps.2")}</MText>
          <MText style={styles.instructions}>{t("health.steps.3")}</MText>
          <MText style={styles.instructions}>{t("health.steps.4")}</MText>
          <MText style={styles.instructions}>{t("health.steps.5")}</MText>
          <MText style={styles.instructions}>{t("health.steps.6")}</MText>

          <MView style={styles.buttonContainer}>
            <MButton
              onPress={onDismiss}
              style={[styles.btn, { backgroundColor: COLORS.SECONDARY }]}
            >
              {t("health.cancel")}
            </MButton>
            <MButton style={styles.btn} onPress={onContinue}>
              {t("health.continue")}
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
});
