import React, { useState } from "react";
import { MView, MText, MButton, MInput, MTouchable } from "./MComponents";
import { getAuthData, getItems, removeData } from "../src/store";
import {
  notifications_get,
  notifications_archived_get,
  notification_clear,
} from "../src/api";
import { NotificationCard } from "./NotificationCard";
import { LoadingNotification } from "./Loading";
import { t } from "i18next";
import { useNavigation } from "@react-navigation/native";
import { COLORS, ROUTES } from "../constants";
import { Dimensions, Platform } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const NotificationList = (props) => {
  const [toggle, setToggle] = useState({});
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [search, setSearch] = useState("");
  const [archivedNotifications, setArchivedNotifications] =
    React.useState(null);
  const navigation = useNavigation();

  const [showArchivedNotifications, setShowArchivedNotifications] =
    React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getAuthData(setAuth)
      .then(async (auth) => {
        if (auth && auth.data) {
          setAuth(auth?.data);
          await getItems(auth, [
            {
              key: "notifications",
              stateHook: setNotifications,
              apiFallback: notifications_get,
            },
            {
              key: "notifications_archived",
              stateHook: setArchivedNotifications,
              apiFallback: notifications_archived_get,
            },
          ]);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    // console.log("notifications", archivedNotifications)
  }, []);

  const archive_notification = async (notification_id) => {
    try {
      const auth = await getAuthData(setAuth);
      if (auth && auth.data) {
        const res = await notification_clear(
          auth.data.profile_auth,
          auth.cookie,
          notification_id
        );
        if (res && res.status === 200) {
          getItems(auth, [
            {
              key: "notifications",
              stateHook: setNotifications,
              apiFallback: notifications_get,
            },
          ]);
        }

        await removeData("notifications");
        await removeData("notifications_archived");
        // get notifications again
        await getItems(auth, [
          {
            key: "notifications",
            stateHook: setNotifications,
            apiFallback: notifications_get,
          },
          {
            key: "notifications_archived",
            stateHook: setArchivedNotifications,
            apiFallback: notifications_archived_get,
          },
        ]);
      }
    } catch (error) {
      console.log("🚀 ~ constarchive_notification= ~ error:", error);
    }
  };

  const render_notification_list = (isArchived) => {
    const notificatios = isArchived ? archivedNotifications : notifications;
    return (
      <MView style={{ flex: 1, justifyContent: "center" }}>
        {notificatios && notificatios.length != 0 ? (
          notificatios.map((notification, index) => (
            <NotificationCard
              is_archived={isArchived}
              key={"notification_" + notification.id}
              notification={notification}
              onChangeToggle={() => {
                setToggle({
                  ...toggle,
                  [index]: !toggle[index] || false,
                });
                archive_notification(notification.id);
                // remove notification from list
                const newNotifications = notificatios.filter(
                  (item) => item.id !== notification.id
                );
                setNotifications(newNotifications);
                // remove toggle index
                const newToggle = toggle;
                delete newToggle[index];
                setToggle(newToggle);
              }}
              toggle={toggle[index]}
              auth={auth}
              action={() => {
                navigation.navigate(ROUTES.NOTIFICATIONS_DETAIL, {
                  notification,
                });
              }}
              toggleStyle={{
                position: "absolute",
                right: 0,
                top: -40,
              }}
              style={{
                flex: 1,
                flexGrow: 1,
                marginVertical: 10,
                width: "95%",
                alignSelf: "center",
                backgroundColor: "#ffffff",
                borderWidth: 0,
                boxShadow: 0,
                borderRadius: 5,
                paddingVertical: 10,
                paddingTop: 20,
              }}
            />
          ))
        ) : (
          <MText
            style={{
              marginTop: 20,
              textAlign: "center",
            }}
          >
            {t("notifications.no_new_notifications_to_display")}
          </MText>
        )}
      </MView>
    );
  };

  return (
    <MView style={{ flex: 1 }}>
      <MText
        style={{
          fontSize: 25,
          fontWeight: "bold",
          margin: 15,
        }}
      >
        {t("notifications.notifications")}
      </MText>
      <MView
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <MInput
          style={{
            backgroundColor: COLORS.WHITE,
            borderColor: COLORS.PRIMARY,
            color: COLORS.GREY,
            minWidth: Platform.OS === "android" ? "55%" : "60%",
            maxWidth: Dimensions.get("screen").width - 200,
            height: 40,
          }}
          mode="outlined"
          value={search}
          onChangeText={setSearch}
          textColor={COLORS.GREY}
          placeholderTextColor={COLORS.GREY}
          placeholder={"Filter Notifications"}
          outlineStyle={{ borderWidth: 1, borderColor: COLORS.LIGHTER_GREY }}
        />
        <MTouchable
          style={{
            padding: 10,
            backgroundColor: !showArchivedNotifications
              ? COLORS.PRIMARY
              : COLORS.GREY,
            borderRadius: 5,
            height: 40,
            alignSelf: "center",
            marginHorizontal: 5,
          }}
          onPress={() => {
            setShowArchivedNotifications(false);
          }}
        >
          <MText
            style={{
              color: COLORS.WHITE,
            }}
          >
            Active
          </MText>
        </MTouchable>
        <MTouchable
          style={{
            padding: 10,
            backgroundColor: showArchivedNotifications
              ? COLORS.PRIMARY
              : COLORS.GREY,
            borderRadius: 5,
            height: 40,
            alignSelf: "center",
          }}
          onPress={() => {
            setShowArchivedNotifications(true);
          }}
        >
          <MText
            style={{
              color: COLORS.WHITE,
            }}
          >
            Archive
          </MText>
        </MTouchable>
      </MView>
      {loading ? (
        <MView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: Dimensions.get("screen").height / 2.2,
          }}
        >
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </MView>
      ) : (
        render_notification_list(showArchivedNotifications)
      )}
    </MView>
  );
};
