import React from "react";
import { StyleSheet } from "react-native";
import { MText, MView } from "../components/MComponents";
import MLayout from "../components/MLayout";
import MScrollView from "../components/MComponents/MScrollView";
import RenderHTML from "react-native-render-html";
import { COLORS } from "../constants";

const NotificationDetailsScreen = ({
  route: {
    params: { notification = null },
  },
}) => {
  return (
    <MLayout statusBarColor="#fff" headerTitle="Notification Detail">
      <MScrollView contentContainerStyle={styles.container}>
        <MText style={styles.title}>{notification?.name || ""}</MText>
        <RenderHTML
          contentWidth={300}
          source={{
            html: notification?.description || "",
          }}
        />
        <RenderHTML
          contentWidth={300}
          source={{
            html: notification?.description_full || "",
          }}
        />
      </MScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.PRIMARY,
  },
});

export default NotificationDetailsScreen;
