import React from "react";
import { StyleSheet } from "react-native";
import { MText, MView } from "../components/MComponents";
import MLayout from "../components/MLayout";
import { NotificationList } from "../components/NotificationList";
import MScrollView from "../components/MComponents/MScrollView";
import { t } from "i18next";
import { COLORS } from "../constants";

const NotificationScreen = () => {
  return (
    <MLayout isProfileHeader>
      <MScrollView style={styles.container}>
        <MView
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingVertical: 10,
            marginBottom: 20,
          }}
        >
          <NotificationList card_style={styles.job} />
        </MView>
      </MScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  txt: {
    color: "#fff",
  },
});

export default NotificationScreen;
