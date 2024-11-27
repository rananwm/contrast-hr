import React from "react";
import { Image, Linking, StyleSheet } from "react-native";
import { MButton, MIcon, MText, MView } from "../MComponents";
import MLayout from "../MLayout";
import MScrollView from "../MComponents/MScrollView";
import CareCard from "../CareCard";
import { t } from "i18next";
import { COLORS } from "../../constants";
import TeleHealth from "../TeleHealth";

const VirtualPrimaryCare = ({ navigation }) => {
  const savingPoints = t("perks.virtual_primary_care.details.saving", {
    returnObjects: true,
  });
  const urgentCarePoints = t(
    "perks.virtual_primary_care.details.urgent_care.points",
    {
      returnObjects: true,
    }
  );
  const menCarePoints = t(
    "perks.virtual_primary_care.details.mens_health.points",
    {
      returnObjects: true,
    }
  );
  const womenCarePoints = t(
    "perks.virtual_primary_care.details.women_health.points",
    {
      returnObjects: true,
    }
  );

  const talkTherapyPoints = t(
    "perks.virtual_primary_care.details.talk_therapy.points",
    {
      returnObjects: true,
    }
  );

  const teenTherapyPoints = t(
    "perks.virtual_primary_care.details.teen_therapy.points",
    {
      returnObjects: true,
    }
  );

  const psychiatryPoints = t(
    "perks.virtual_primary_care.details.psychiatry.points",
    {
      returnObjects: true,
    }
  );

  const didYouKnow = [
    {
      percentage:
        "perks.virtual_primary_care.details.did_you_know_review.0.percentage",
      description:
        "perks.virtual_primary_care.details.did_you_know_review.0.desc",
    },
    {
      percentage:
        "perks.virtual_primary_care.details.did_you_know_review.1.percentage",
      description:
        "perks.virtual_primary_care.details.did_you_know_review.1.desc",
    },
    {
      percentage:
        "perks.virtual_primary_care.details.did_you_know_review.2.percentage",
      description:
        "perks.virtual_primary_care.details.did_you_know_review.2.desc",
    },
  ];

  return (
    <MLayout
      headerTitle="Virtual Primary Care"
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <MScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <MText style={styles.title}>
          {t("perks.virtual_primary_care.details.title")}
        </MText>
        <MText style={styles.mt_10}>
          {t("perks.virtual_primary_care.details.desc1")}
          {"\n"}
          {"\n"}
          {t("perks.virtual_primary_care.details.desc2")}
        </MText>
        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.desc3")}
        </MText>
        <TeleHealth />
        <MView style={styles.cardContainer}>
          <MText style={styles.didYouKnowTxt}>
            {" "}
            {t("perks.virtual_primary_care.details.did_you_know")}
          </MText>
          {didYouKnow.map((item, index) => (
            <MText
              key={index}
              style={{
                marginVertical: 8,
              }}
            >
              <MText
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: COLORS.PRIMARY,
                }}
              >
                {t(item.percentage)}
              </MText>{" "}
              {t(item?.description)}
              <MText
                style={{
                  color: COLORS.PRIMARY,
                }}
              >
                (Source)
              </MText>{" "}
            </MText>
          ))}
        </MView>
        <MText style={styles.subheading}>
          {t("perks.virtual_primary_care.details.walmart_desc")}
        </MText>
        <MView style={styles.cardContainer}>
          <MView style={styles.primaryCareHeader}>
            <MText style={styles.primaryCareLabel}>
              {t("perks.virtual_primary_care.details.walmart_table_label1")}
            </MText>

            <MText style={styles.primaryCareLabel}>
              {" "}
              {t("perks.virtual_primary_care.details.walmart_table_label2")}
            </MText>
          </MView>
          {Array(7)
            .fill(null)
            .map((item, index) => (
              <MView key={index} style={styles.primaryCare}>
                <MText style={styles.primaryCareTxt}>
                  {t(
                    `perks.virtual_primary_care.details.walmart_table.${index}`
                  )}
                </MText>
                <MView style={styles.checkIcon}>
                  <MIcon source="check-bold" size={20} color="#BFD43D" />
                </MView>
                <MView style={styles.crossIcon}>
                  <MIcon source="close" size={22} color="#F61600" />
                </MView>
              </MView>
            ))}
        </MView>
        <MText style={styles.mt_20}>
          {t("perks.virtual_primary_care.details.walmart_pre_desc0")}
          {"\n"} {"\n"}{" "}
          {t("perks.virtual_primary_care.details.walmart_pre_desc1")}
        </MText>
        {savingPoints.map((list, index) => (
          <MView key={index}>
            <MText style={styles.bulletPointTitle}>{list.title}</MText>
            <MView style={styles.bulletPointContainer}>
              {list.list.map((item, index) => (
                <MView key={index} style={styles.listContainer}>
                  <MView style={styles.bulletPoint} />
                  <MText>{item}</MText>
                </MView>
              ))}
            </MView>
          </MView>
        ))}
        <MText style={styles.whatWeTreat}>
          {" "}
          {t("perks.virtual_primary_care.details.what_we_treat")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.urgent_care.title")}
          subtitle={t(
            "perks.virtual_primary_care.details.urgent_care.subtitle"
          )}
          description={t(
            "perks.virtual_primary_care.details.urgent_care.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_urgent-care.jpg")}
          bulletPoint={urgentCarePoints}
        />

        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.urgent_care.note1")}
        </MText>
        <MText style={{ ...styles.secondaryTxt, marginTop: 5 }}>
          {t("perks.virtual_primary_care.details.urgent_care.note2")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.mens_health.title")}
          subtitle={t(
            "perks.virtual_primary_care.details.mens_health.subtitle"
          )}
          description={t(
            "perks.virtual_primary_care.details.mens_health.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_mens-health.jpg")}
          bulletPoint={menCarePoints}
        />

        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.mens_health.note")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.women_health.title")}
          subtitle={t(
            "perks.virtual_primary_care.details.women_health.subtitle"
          )}
          description={t(
            "perks.virtual_primary_care.details.women_health.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_womens-health.jpg")}
          bulletPoint={womenCarePoints}
        />

        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.women_health.note")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.talk_therapy.title")}
          subtitle={t(
            "perks.virtual_primary_care.details.talk_therapy.subtitle"
          )}
          description={t(
            "perks.virtual_primary_care.details.talk_therapy.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_therapy.jpg")}
          bulletPoint={talkTherapyPoints}
        />
        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.talk_therapy.note")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.teen_therapy.title")}
          subtitle={t(
            "perks.virtual_primary_care.details.teen_therapy.subtitle"
          )}
          description={t(
            "perks.virtual_primary_care.details.teen_therapy.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_teen-therapy.jpg")}
          bulletPoint={teenTherapyPoints}
        />
        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.teen_therapy.note")}
        </MText>
        <CareCard
          title={t("perks.virtual_primary_care.details.psychiatry.title")}
          subtitle={t("perks.virtual_primary_care.details.psychiatry.subtitle")}
          description={t(
            "perks.virtual_primary_care.details.psychiatry.description"
          )}
          image={require("../../assets/perk_images/virtualCare/telehealth_psychiatry.jpg")}
          bulletPoint={psychiatryPoints}
        />
        <MText style={styles.secondaryTxt}>
          {t("perks.virtual_primary_care.details.psychiatry.note")}
        </MText>
        <MText style={{ ...styles.secondaryTxt, fontStyle: "normal" }}>
          {t("perks.virtual_primary_care.details.footer_note1")}
          {"\n"} {"\n"} {t("perks.virtual_primary_care.details.footer_note2")}
          {"\n"} {"\n"} {t("perks.virtual_primary_care.details.footer_note3")}
        </MText>
        <MText
          style={{ textAlign: "center", marginVertical: 12 }}
          onPress={() => Linking.openURL("mailto:support@exectras.com")}
        >
          {t("perks.prescription_savings.details.contact")}{" "}
          <MText style={styles.link}>support@exectras.com</MText>
        </MText>
        <MView style={{ height: 30 }} />
      </MScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  link: {
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  mt_10: {
    marginTop: 10,
  },
  mt_20: {
    marginTop: 20,
  },
  secondaryTxt: {
    fontSize: 12,
    marginTop: 20,
    fontStyle: "italic",
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  didYouKnowTxt: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#242424",
  },
  subheading: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    marginTop: 20,
  },
  bulletPointTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bulletPointContainer: {
    alignItems: "center",
    gap: 10,
  },
  listContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
  },
  bulletPoint: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#000",
  },
  whatWeTreat: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  careTxt: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
    marginTop: 10,
  },
  primaryCare: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryCareTxt: {
    color: COLORS.PRIMARY,
    fontWeight: "bold",
    fontSize: 8,
    width: "40%",
  },
  checkIcon: {
    width: "38%",
    flexDirection: "row",
    justifyContent: "center",
  },
  crossIcon: {
    width: "24%",
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryCareHeader: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 5,
    marginBottom: 10,
  },
  primaryCareLabel: {
    color: COLORS.PRIMARY,
    fontWeight: "bold",
    fontSize: 8,
  },
});

export default VirtualPrimaryCare;
