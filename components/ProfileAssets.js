import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { MText, MView } from "./MComponents";
import moment from "moment";
import { t } from "i18next";
import { getAuthData, getItems, removeData } from "../src/store";
import { get_profile_assets_allowances } from "../src/api";
import MLayout from "./MLayout";
import { COLORS } from "../constants";
import { ActivityIndicator } from "react-native-paper";

const ProfileAssets = ({ navigation }) => {
  const [auth, setAuth] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          {
            key: "profile_assets",
            stateHook: setData,
            apiFallback: get_profile_assets_allowances,
          },
        ]);

        setLoaded(false);
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);
  const assets = data?.[0] || {};
  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1, padding: 20 }}
      >
        {loaded ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          </MView>
        ) : (
          <>
            <MText style={styles.headerTitle}>
              {t("profile.summary.profile_assets")}
            </MText>

            {Object?.entries(assets || {}).length > 0 ? (
              <MView style={styles.container}>
                {Object?.entries(assets || {})?.map(([key, item]) => {
                  return (
                    <MView style={styles.valueContainer} key={key}>
                      <MText style={styles.title}>
                        {t(`profile.assets.${key}`)}:
                      </MText>
                      {typeof item === "string" ? (
                        <MText style={styles.value}>
                          {key === "created"
                            ? moment(item).format("YYYY-MM-DD")
                            : item || "N/A"}
                        </MText>
                      ) : (
                        <MText style={styles.value}>
                          {key === "tags" ? item?.general.join(", ") : "N/A"}
                        </MText>
                      )}
                    </MView>
                  );
                })}
              </MView>
            ) : (
              <MText style={styles.textCenter}>N/A</MText>
            )}
          </>
        )}
      </ScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    margin: 10,
  },
  value: {
    fontSize: 12,
    color: "black",
    margin: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    flexWrap: "wrap",
  },
  valueContainer: {
    display: "flex",
    width: "50%",
    flexWrap: "wrap",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },
  textCenter: {
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});
export default ProfileAssets;
