import { Alert, Dimensions, Image, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useMemo } from "react";
import {
  MButton,
  MIcon,
  MText,
  MTouchable,
  MView,
} from "../components/MComponents";
import { COLORS } from "../constants";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import MLayout from "../components/MLayout";
import {
  download_document,
  download_document_signature,
  submit_signature,
} from "../src/api";
import SignatureScreen from "react-native-signature-canvas";
import RNFS from "react-native-fs";
import { t } from "i18next";

const DocumentDetailScreen = ({ navigation, route }) => {
  const document = route?.params?.document || null;
  const refetchDocuments = route?.params?.refetchDocuments || null;
  const [signatureStart, setSignatureStart] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);
  const [signatureBase64, setSignatureBase64] = React.useState("");
  const auth = route?.params?.auth || null;
  const onDownloadDocument = async () => {
    try {
      if (downloadLoading) return;
      setDownloadLoading(true);
      const response = await download_document(
        auth?.data?.profile_auth,
        auth?.cookie,
        document?.document_auth,
        document?.document
      );
      console.log("🚀 ~ onDownloadDocument ~ response:", response);
    } catch (error) {
      console.log("🚀 ~ onDownloadDocument ~ error:", error);
    } finally {
      setDownloadLoading(false);
    }
  };
  const getDocumentSignature = async () => {
    try {
      const response = await download_document_signature(
        auth?.data?.profile_auth,
        auth?.cookie,
        document?.document_auth
      );
      if (response?.startsWith("ey")) {
        setSignatureBase64("");
      } else {
        setSignatureBase64(response);
      }
    } catch (error) {
      console.log("🚀 ~ getDocumentSignature ~ error:", error);
    }
  };
  const handleOK = async (base64String) => {
    try {
      const base64Data = base64String.replace(/^data:image\/png;base64,/, "");
      const path = `${RNFS.DocumentDirectoryPath}/tempImage_${Date.now()}.png`;
      await RNFS.writeFile(path, base64Data, "base64");

      const response = await submit_signature(
        auth?.data?.profile_auth,
        auth?.cookie,
        document?.document_auth,
        {
          uri: `file://${path}`,
          name: `signature_${Date.now()}`,
          type: "image/png",
        }
      );

      await RNFS.unlink(path);
      getDocumentSignature();
      if (response?.status === "success") {
        Alert.alert("Success", t("documents.signature_success"));
      } else {
        Alert.alert("Error", t("documents.signature_error"));
      }
    } catch (error) {
      console.log("🚀 ~ handleOK ~ error:", error);
    }
  };
  const base64Image = useMemo(() => {
    return signatureBase64 ? `data:image/png;base64,${signatureBase64}` : null;
  }, [signatureBase64]);
  useEffect(() => {
    getDocumentSignature();
  }, []);

  return (
    <MLayout statusBarColor={COLORS.WHITE} isProfileHeader>
      <ScrollView style={styles.container} scrollEnabled={!signatureStart}>
        <MView style={styles.flex_row}>
          <MTouchable onPress={() => navigation?.goBack()}>
            <MIcon source="keyboard-backspace" size={24} />
          </MTouchable>
          <MText style={styles.title}>{document?.name}</MText>
        </MView>
        {document?.content && (
          <MView style={styles.cardContainer}>
            <RenderHTML
              contentWidth={300}
              source={{ html: document?.content || "" }}
            />
          </MView>
        )}

        <MView style={styles.cardContainer}>
          {document?.document && (
            <>
              <MText style={styles.docTxt}>
                {t("documents.download")}{" "}
                <MText style={{ color: COLORS.PRIMARY }}>
                  {t("documents.document")}
                </MText>
              </MText>
              <MButton
                style={styles.downloadBtn}
                loading={downloadLoading}
                // disabled={downloadLoading}
                onPress={onDownloadDocument}
              >
                {t("documents.download")}
              </MButton>
              <MView style={styles.separator} />
            </>
          )}

          <MText style={styles.docTxt}>
            {t("documents.document")}{" "}
            <MText style={{ color: COLORS.PRIMARY }}>
              {t("documents.details")}
            </MText>
          </MText>
          <MView style={styles.detailContainer}>
            <MText style={styles.detailLabel}>{t("documents.signature")}</MText>
            <MText style={styles.detailValue}>{t("documents.yes")}</MText>
          </MView>
          <MView style={styles.detailContainer}>
            <MText style={styles.detailLabel}>{t("documents.created")}</MText>
            <MText style={styles.detailValue}>
              {moment(document?.created).format("LLL")}
            </MText>
          </MView>
          <MView style={styles.detailContainer}>
            <MText style={styles.detailLabel}>{t("documents.modified")}</MText>
            <MText style={styles.detailValue}>
              {document?.modified
                ? moment(document?.modified).format("LLL")
                : t("documents.never")}
            </MText>
          </MView>
        </MView>
        {document?.document_sign === "1" && (
          <MView style={styles.cardContainer}>
            <MText style={styles.docTxt}>
              {t("documents.signature")}{" "}
              <MText style={{ color: COLORS.PRIMARY }}>
                {t("documents.electronics")}
              </MText>
            </MText>
            {!base64Image && (
              <MText>
                {t("documents.i")}{" "}
                <MText style={styles.txtBold}>
                  {auth?.data?.name + " " + auth?.data?.surname}
                </MText>
                , {t("documents.signature_instruction")}{" "}
                <MText style={styles.txtBold}>{document?.name}</MText>
                {t("documents.as_of")}{" "}
                <MText style={styles.txtBold}>
                  {moment(document?.created).format("LLL")}
                </MText>
              </MText>
            )}

            {!base64Image ? (
              <MView style={styles.signatureCanvasContainer}>
                <SignatureScreen
                  onOK={handleOK}
                  onBegin={() => setSignatureStart(true)}
                  onEnd={() => setSignatureStart(false)}
                  onEmpty={() => console.log("empty")}
                  descriptionText={t("documents.sign")}
                  clearText={t("documents.clear")}
                  confirmText={t("documents.submit")}
                  webStyle={`.m-signature-pad--footer
                        .button {
                         background-color: ${COLORS.PRIMARY};
                         color: ${COLORS.WHITE};
                         }`}
                  autoClear={true}
                  trimWhitespace={true}
                  backgroundColor={COLORS.WHITE}
                  imageType={"image/png"}
                />
              </MView>
            ) : (
              <MView>
                <Image
                  source={{ uri: base64Image }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                  height={200}
                />
                <MView style={styles.separator} />

                <MText style={styles.signatureDetail}>
                  {document?.person_name_name}
                </MText>
                <MText style={styles.signatureDetail}>
                  {moment(
                    document?.person_agreement_created || new Date()
                  ).format("LLL")}
                </MText>
              </MView>
            )}
          </MView>
        )}
      </ScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.WHITE,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",

    marginHorizontal: 20,
    textAlign: "center",
  },
  cardContainer: {
    borderWidth: 1,
    borderTopColor: COLORS.PRIMARY,
    borderTopWidth: 3,
    borderColor: COLORS.LIGHT_GREY,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: COLORS.WHITE,
  },
  docTxt: {
    fontSize: 20,
    color: COLORS.BLACK,
    marginBottom: 10,
    fontWeight: "600",
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    width: "40%",
  },
  detailValue: {
    fontWeight: "600",
    width: "60%",
  },
  signatureInstructions: {
    fontSize: 16,
    color: COLORS.BLACK,
    marginBottom: 10,
  },
  txtBold: {
    fontWeight: "bold",
  },
  downloadBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.LIGHT_GREY,
    marginVertical: 20,
  },
  signatureCanvasContainer: {
    width: Dimensions.get("window").width - 65,
    height: 350,
    marginTop: 30,
  },
  flex_row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  signatureImage: {
    width: "100%",
    height: 200,
  },
  signatureDetail: {
    textAlign: "center",
  },
});

export default DocumentDetailScreen;
