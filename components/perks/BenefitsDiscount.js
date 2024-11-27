import React from "react";
import { Dimensions, FlatList, Linking, StyleSheet } from "react-native";
import { MButton, MText, MView } from "../MComponents";
import { Image } from "react-native";
import { COLORS } from "../../constants";
import { t } from "i18next";
import MLayout from "../MLayout";
import { formattedText } from "../../utils";

const BenefitsDiscount = ({ navigation }) => {
  const benefits = t("perks.benefits_discounts.benefits", {
    returnObjects: true,
  });
  const images = [
    require("../../assets/perk_images/discount/ups.png"),
    require("../../assets/perk_images/discount/odp.jpg"),
    require("../../assets/perk_images/discount/lenovo.jpg"),
    require("../../assets/perk_images/discount/hotel-engine.png"),
    require("../../assets/perk_images/discount/collete.jpg"),
    require("../../assets/perk_images/discount/avis.png"),
    require("../../assets/perk_images/discount/budget.png"),
    require("../../assets/perk_images/discount/travel-savings.png"),
  ];
  const urls = [
    "http://www.savewithups.com/exectras",
    "http://community.odpbusiness.com/GPOHome?id=48848295",
    "http://www.lenovo.com/us/en/lsp",
    "http://hotelengine.com/join/b2b829f",
    "http://www.gocollette.com/en/landing-pages/partners/members-ajg",
    "http://www.avis.com/en/association/A715046",
    "http://www.budget.com/en/association/B203949",
    "https://app.myexectras.com/Travel%20Savings%20Center",
  ];
  const renderItem = ({ item, index }) => {
    return (
      <MView style={styles.itemStyle}>
        <Image
          source={images[index]}
          resizeMode="contain"
          style={styles.image}
        />
        <MView>
          <MText style={styles.font_16}>{item.title}</MText>
          <MText
            style={{
              flexWrap: "wrap",
              width: Dimensions.get("window").width - 140,
              marginVertical: 10,
            }}
          >
            {item.desc}
          </MText>
          <MButton
            style={styles.desc}
            onPress={() => Linking.openURL(urls[index])}
          >
            {t("perks.benefits_discounts.visit_web")}
          </MButton>
        </MView>
      </MView>
    );
  };
  return (
    <MLayout
      headerTitle={t("perks.benefits_discounts.title")}
      containerStyle={{
        backgroundColor: COLORS.WHITE,
      }}
      headerProps={{
        leftIcon: "chevron-left",
        leftIconOnPress: () => navigation.goBack(),
      }}
    >
      <FlatList
        data={benefits}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <>
            <MText style={[styles.title, { fontSize: 20, marginBottom: 12 }]}>
              {t("perks.benefits_discounts.desc1")}
            </MText>
            <MText>{t("perks.benefits_discounts.details")}</MText>
            <MText style={styles.title}>
              {t("perks.benefits_discounts.feature_program")}
            </MText>
            <MView style={styles.footerContainer}>
              <Image
                source={require("../../assets/perk_images/discount/1800members.png")}
                resizeMode="contain"
                style={styles.memberImg}
              />
              <MText style={{ marginVertical: 12 }}>
                {t("perks.benefits_discounts.call_instructions")}
              </MText>
              <MButton
                mode="outlined"
                style={styles.callBtn}
                textStyle={styles.callBtnTxt}
              >
                Call (800) 636-2377
              </MButton>
              <MButton
                mode="contained"
                style={styles.button}
                textStyle={{ ...styles.callBtnTxt, color: COLORS.WHITE }}
                onPress={() =>
                  Linking.openURL("https://www.1800members.com/exectras")
                }
              >
                {t("perks.benefits_discounts.learn_more")}
              </MButton>
            </MView>
          </>
        )}
        ListFooterComponent={() => (
          <MText
            style={{ textAlign: "center", marginVertical: 12 }}
            onPress={() => Linking.openURL("mailto:support@exectras.com")}
          >
            {t("perks.prescription_savings.details.contact")}{" "}
            <MText style={styles.link}>support@exectras.com</MText>
          </MText>
        )}
        contentContainerStyle={{
          padding: 12,
          backgroundColor: COLORS.WHITE,
        }}
        showsVerticalScrollIndicator={false}
      />
    </MLayout>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  image: {
    height: 60,
    width: 80,
    marginRight: 12,
  },
  memberImg: {
    width: "80%",
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
  },
  font_16: {
    fontSize: 16,
  },
  desc: {
    width: 170,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
  },
  footerContainer: {
    borderWidth: 1,
    borderTopColor: COLORS.PRIMARY,
    borderTopWidth: 2,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: COLORS.WHITE,
  },
  contactContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 6,
  },
  callBtnTxt: {
    color: COLORS.PRIMARY,
    fontSize: 16,
  },
  callBtn: {
    borderRadius: 8,
    marginTop: 12,
  },
  link: {
    color: COLORS.PRIMARY,
  },
});

export default BenefitsDiscount;
