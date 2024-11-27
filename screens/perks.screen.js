import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { getAuthData, getItems, removeData } from "../src/store";
import { perks_get } from "../src/api";
import { perks_config } from "../config/perks";
import {
  MDivider,
  MCard,
  MText,
  MView,
  MButton,
  MIconButton,
  MInput,
  MIcon,
} from "../components/MComponents";
import { PerkCard } from "../components/PerkCard";
import { useTheme } from "react-native-paper";
import { LoadingNotification } from "../components/Loading";
import { MModal } from "../components/MModal";
import { COLORS, ROUTES } from "../constants";
import { LogoBar } from "../components/LogoBar";
import { t } from "i18next";
import { formattedText } from "../utils";
import MLayout from "../components/MLayout";

export default ({ navigation }) => {
  // get props.navigation
  // const { navigation } = props;

  const theme = useTheme();
  const [auth, setAuth] = React.useState({});
  const [perks, setPerks] = React.useState(perks_config);
  const [perkSearchVisible, setPerkSearchVisible] = React.useState(false);
  const [perkKeywords, setPerkKeywords] = React.useState("");

  const togglePerkSearchModal = () => setPerkSearchVisible(!perkSearchVisible);
  const hidePerkSearchModal = () => setPerkSearchVisible(false);

  const navigatePerk = (perk_id) => {
    navigation.navigate(ROUTES.PERK, { perk_id: perk_id });
  };

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        //     await getItems(auth, [
        //       {key: "perks", stateHook: setPerks, apiFallback: perks_get}
        //     ])
      } else {
        //     // console.log("auth failed!!!", auth)
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);

  const createPerk = (perk) => {
    const title = perk.name;
    const subtitle = "";
    const cta = perk.cta;
    return (
      <MCard
        key={"perk_" + perk.id}
        style={styles.perk}
        onPress={() => {
          if (perk.route && perk.route !== ROUTES.CHALLENGES_STACK) {
            navigation.navigate(ROUTES.PERK_DETAIL, {
              name: perk.route,
            });
          } else {
            navigation.navigate(perk.route);
          }
        }}
        imageProps={{

          resizeMode:'contain',
          style:{
            height: 100,
            width: '100%',
            backgroundColor: '#fff',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }
        }}
        title={
          <MText
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t(title)}
          </MText>
        }
        subtitle={t(subtitle)}
        body={formattedText(t(perk.description))}
        cta={t(cta)}
        image={perk.image}
        ctaStyle={{ backgroundColor: "#E85100", borderRadius: 5 }}
        ctaTextStyle={{ color: "#fff" }}
      />
    );
  };

  const nukePerks = () => {
    removeData("perks");
    setPerks([]);
  };

  return (
    <MLayout isProfileHeader>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE,
          alignItems: "center",
        }}
      >
        <MView style={styles.body}>
          <ScrollView
            style={{ marginTop: 5 }}
            showsVerticalScrollIndicator={false}
          >
            {/* <LogoBar /> */}

            {/* <MModal visible={perkSearchVisible} onDismiss={hidePerkSearchModal}>
          <ScrollView style={{ flex: 1 }}>
            <MText style={[styles.headingH3, { color: "#000000" }]}>
              Search Perks
            </MText>
            <MInput
              label="Search Title"
              value={perkKeywords}
              onChangeText={(text) => setPerkKeywords(text)}
            />
            <MDivider style={{ margin: 20 }} />
            <MButton onPress={hidePerkSearchModal}>Search</MButton>
          </ScrollView>
        </MModal> */}

            {/* <MView
          style={{
            width: "90%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MText style={styles.headingH3}>Employee Perks</MText>
          <MButton
            style={{ marginTop: 12, marginLeft: 15 }}
            size={16}
            icon="briefcase-search"
            onPress={() => {
              togglePerkSearchModal();
            }}
          >
            Search
          </MButton>
        </MView>
        <MView
          style={{
            width: "90%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <MText variant="bodySmall" style={{ color: "#ffffff" }}>
            Listed below are all currently offered Employee Benefits available
            under the Exectras Program.
          </MText>
        </MView> */}
            <MText style={{ margin: 15, fontSize: 25, fontWeight: "bold" }}>
              {t("perks.employee_perks")}
            </MText>
            <MText style={{ marginLeft: 15, fontSize: 16 }}>
              {t("perks.perks_description")}
            </MText>
            <MInput
              placeholder={t("perks.filter_employee")}
              style={{
                marginVertical: 10,
                marginHorizontal: 15,
                backgroundColor: "#fff",
                // borderWidth: 0.2,
              }}
              onChangeText={() => {}}
            />
            {
              // limit to 5 perks
              perks && perks.length > 0 ? (
                perks
                  .filter((perk) =>
                    perk.name.toLowerCase().includes(perkKeywords.toLowerCase())
                  )
                  .slice(0, 30)
                  .map((perk) => createPerk(perk))
              ) : (
                <LoadingNotification />
              )
            }
          </ScrollView>
        </MView>
      </SafeAreaView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "95%",
    paddingHorizontal: 30,
    // backgroundColor: 'red',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 20,
    // paddingHorizontal: 10,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,1)",
    marginHorizontal: 20,
    borderRadius: 15,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -20,
  },
  perk: {
    // flex: 1,
    // flexGrow: 1,
    marginHorizontal: 15,
    marginVertical: 10,
    // maxWidth: "95%",
    // minWidth: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 5,
  },
  perkTitle: {
    color: "#E85100",
    fontWeight: "bold",
    marginBottom: 5,
  },
  perkDescription: {},
  perkMetadata: {
    marginTop: 10,
    marginLeft: -2,
  },
  perkInfo: {
    backgroundColor: "#009dce",
    borderColor: "#009dce",
    marginTop: 5,
  },
  heading: {
    marginBottom: 15,
    fontWeight: "bold",
    fontSize: 24,
  },
  headingH3: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
    color: "#ffffff",
  },
  action: {
    backgroundColor: "#009dce",
    borderColor: "#009dce",
    padding: 0,
    lineHeight: 0,
  },
  compact: {
    padding: 0,
    lineHeight: 0,
  },
});
