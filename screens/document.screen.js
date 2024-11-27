import { Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { getAuthData, getItems } from "../src/store";
import { get_documents } from "../src/api";
import { MText, MTouchable, MView } from "../components/MComponents";
import { t } from "i18next";
import { COLORS, ROUTES } from "../constants";
import moment from "moment";
import MLayout from "../components/MLayout";
import { ActivityIndicator } from "react-native-paper";

const DocumentScreen = ({ navigation }) => {
  const [auth, setAuth] = React.useState("");
  const [documents, setDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    getAuthData(setAuth)
      .then(async (auth) => {
        setAuth(auth);
        if (auth && auth.data) {
          await getItems(auth, [
            {
              key: "documents",
              stateHook: setDocuments,
              apiFallback: get_documents,
            },
          ]);
        } else {
          console.log("auth failed!!!", auth);
          alert("Your session has expired. Please log in again.");
          removeData("auth");
          navigation.navigate(ROUTES.LOGIN);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>
          {t("documents.title")}{" "}
          <MText style={{ color: COLORS.PRIMARY, fontWeight: "bold" }}>
            {t("documents.active")}
          </MText>
        </Text>
        {loading ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator />
          </MView>
        ) : documents?.length > 0 ? (
          <MView style={styles.tableContainer}>
            <MView style={{ ...styles.tableHeader() }}>
              <MText style={{ ...styles.primaryCareLabel, maxWidth: "40%" }}>
                {t("documents.name")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("documents.signature")}
              </MText>
              <MText style={styles.primaryCareLabel}>
                {t("documents.created")}
              </MText>
              <MText style={styles.primaryCareLabel}></MText>
            </MView>

            {documents?.map((item, index) => {
              return (
                <MView style={{ ...styles.tableHeader(index) }} key={index}>
                  <MText
                    style={{ ...styles.primaryCareValue, maxWidth: "40%" }}
                  >
                    {item?.name || "N/A"}
                  </MText>
                  <MView style={styles.primaryCareValue}>
                    <MView
                      style={styles.badge(!!(item?.document_sign === "1"))}
                    >
                      <MText
                        style={styles.badgeTxt(!!(item?.document_sign === "1"))}
                      >
                        {item?.document_sign === "1"
                          ? auth?.data?.name + " " + auth?.data?.surname
                          : "N/A"}

                        {moment(item?.person_agreement_created).isValid() &&
                          "\n" +
                            moment(item?.person_agreement_created).format("ll")}
                      </MText>
                    </MView>
                  </MView>
                  <MText style={styles.primaryCareValue}>
                    {moment(item?.created).format("ll")}
                  </MText>
                  <MView style={{ minWidth: "20%" }}>
                    {item ? (
                      <MTouchable
                        style={styles.btn}
                        onPress={() => {
                          navigation?.navigate(ROUTES.DOCUMENT_DETAIL, {
                            document: item,
                            auth: auth,
                          });
                        }}
                      >
                        <MText style={styles.btnTxt}>
                          {t("documents.view")}
                        </MText>
                      </MTouchable>
                    ) : (
                      <MView style={{ width: 45 }} />
                    )}
                  </MView>
                </MView>
              );
            })}
          </MView>
        ) : (
          <MText style={styles.noDocumentFound}>
            {t("documents.no_document_found")}
          </MText>
        )}
      </ScrollView>
    </MLayout>
  );
};
const styles = StyleSheet.create({
  tableContainer: {},
  tableHeader: (index) => ({
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: index % 2 === 0 ? COLORS.GREY_BG : COLORS.WHITE,
    padding: 10,
  }),
  primaryCareLabel: {
    color: COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 12,
    flex: 1,
    maxWidth: "20%",
  },
  primaryCareValue: {
    color: COLORS.BLACK,
    fontSize: 12,
    textAlign: "left",
    flex: 1,
    maxWidth: "20%",
  },
  btn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    width: 45,
    alignSelf: "center",
  },
  btnTxt: {
    fontSize: 10,
    color: COLORS.WHITE,
    textAlign: "center",
  },
  badge: (isRequired) => ({
    backgroundColor: isRequired ? COLORS.LIGHT_RED : COLORS.LIGHTER_GREY,
    alignSelf: "flex-start",
    borderRadius: 6,
    color: isRequired ? COLORS.WHITE : COLORS.BLACK,
    height: "auto",
    padding: 5,
    maxWidth: "95%",
  }),
  badgeTxt: (isRequired) => ({
    fontSize: 10,
    color: isRequired ? COLORS.WHITE : COLORS.BLACK,
  }),
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
});
export default DocumentScreen;
