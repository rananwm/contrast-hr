import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Platform, RefreshControl, StyleSheet } from "react-native";
import {
  MButton,
  MIcon,
  MSelect,
  MText,
  MTouchable,
  MView,
} from "../components/MComponents";
import MLayout from "../components/MLayout";
import { Image } from "react-native";
import { COLORS, ROUTES, WEB_URL } from "../constants";
import MScrollView from "../components/MComponents/MScrollView";
import { getAuthData, getItems } from "../src/store";
import {
  challenges_categories,
  challenges_get,
  get_challenge_featured,
  programs_categories,
  programs_get,
  search_challenges,
} from "../src/api";
import { ActivityIndicator, Card } from "react-native-paper";
import { t } from "i18next";
import ChallengeCard from "../components/ChallengeCard";
import moment from "moment";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "@react-navigation/native";

const ChallengesScreen = ({ navigation, route: { params } }) => {
  const [auth, setAuth] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [challenges, setChallenges] = React.useState([]);
  const [activeProgram, setActiveProgram] = React.useState([]);
  const [searchChallenges, setSearchChallenges] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [active, setActive] = React.useState("0");
  const [language, setLanguage] = React.useState("");
  const [challengeType, setChallengeType] = React.useState("");
  const [programLanguage, setProgramLanguage] = React.useState("");
  const [programType, setProgramType] = React.useState("");
  const [featureChallenge, setFeatureChallenge] = React.useState(null);
  // const [featureChallengeData, setFeatureChallengeData] = React.useState(null);
  const [featureLoading, setFeatureLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [categories, setCategories] = React.useState({
    tags: [],
    languages: {},
  });
  const [programCategories, setProgramCategories] = React.useState({
    tags: [],
    languages: {},
  });
  const programs_search = async (...args) => {
    const result = await search_challenges(...args, [], [], "program");
    return result;
  };
  const getChallenges = async () => {
    try {
      setLoading(true);
      const auth = await getAuthData(setAuth);
      setAuth(auth);
      await getItems(auth, [
        {
          key: "feature_challenge",
          stateHook: setFeatureChallenge,
          apiFallback: get_challenge_featured,
        },
        {
          key: "challenges",
          stateHook: (data) => {
            setChallenges(data);
            if (Object.values(data ?? {})?.length === 0) {
              setActive("1");
            }
          },
          apiFallback: challenges_get,
        },
        {
          key: "challenges_categories",
          apiFallback: challenges_categories,
          stateHook: setCategories,
        },
        {
          key: "programs_categories",
          apiFallback: programs_categories,
          stateHook: setProgramCategories,
        },
        {
          key: "challenges_search",
          stateHook: setSearchChallenges,
          apiFallback: search_challenges,
        },
        {
          key: "active_programs",
          stateHook: setActiveProgram,
          apiFallback: programs_get,
        },
        {
          key: "programs_search",
          stateHook: setPrograms,
          apiFallback: programs_search,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getChallenges();
      setRefreshing(false);
    }, 1000);
  };
  const onSearchChallenges = async (type = "challenge") => {
    try {
      // if (!challengeType && !language) {
      //   Alert.alert("Please select a category and language");
      //   return;
      // }

      setSearchLoading(true);
      const lang = type === "challenge" ? language : programLanguage;
      const ChallengeType = type === "challenge" ? challengeType : programType;
      const response = await search_challenges(
        auth?.data?.profile_auth,
        auth?.cookie,
        lang?.split(",").filter(Boolean),
        ChallengeType?.split(",").filter(Boolean),
        type
      );
      if (type === "challenge") setSearchChallenges(response?.data);
      else setPrograms(response?.data);
    } catch (error) {
      console.log("🚀 ~ onSearchChallenges ~ error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const [id, setId] = useState("");
  const [playing, setPlaying] = useState(false);
  const featureChallengeData = useMemo(() => {
    if (!featureChallenge) return null;
    let featChallenge = Object.values(featureChallenge)?.[0];
    return featChallenge;
  }, [featureChallenge]);
  const videoId = useMemo(() => {
    if (!featureChallengeData) return "";
    setId(
      featureChallengeData?.chapter_current?.video
        ?.split("v=")?.[1]
        ?.split("&")?.[0]
    );
    return (
      featureChallengeData?.chapter_current?.video
        ?.split("v=")?.[1]
        ?.split("&")?.[0] || ""
    );
  }, [featureChallengeData, featureChallengeData?.chapter_current?.video]);
  useEffect(() => {
    getChallenges();
  }, []);
  useFocusEffect(
    useCallback(() => {
      return () => {
        setPlaying(false); // Stop video when screen loses focus
      };
    }, [])
  );
  useEffect(() => {
    if (params?.step) {
      setActive(params?.step);
    }
  }, [params?.step]);
  return (
    <MLayout isProfileHeader>
      <MScrollView
        contentContainerStyle={loading ? styles.scrollContainer : {}}
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {featureChallengeData && (
          <Card
            style={{
              margin: 12,
              backgroundColor: COLORS.WHITE,
              marginTop: 20,
            }}
          >
            <>
              <Image
                source={{
                  uri: `${WEB_URL}/${featureChallengeData?.banner}`,
                }}
                style={{
                  height: "auto",
                  width: "100%",
                  aspectRatio: 16 / 1.97,
                  resizeMode: "contain",
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                }}
              />
              <MView style={{ padding: 12 }}>
                <MView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <MText
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      width: "70%",
                    }}
                  >
                    {featureChallengeData?.name}
                  </MText>
                  <MTouchable
                    style={{
                      width: 100,
                      backgroundColor: COLORS.PRIMARY,
                      borderRadius: 5,
                      padding: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      const selectedChallenge = Object.values(
                        featureChallenge || {}
                      )?.[0];
                      navigation.navigate(ROUTES.CHALLENGE_DETAIL, {
                        challengeInstanceAuth:
                          featureChallengeData?.challenge_instance_auth,
                        banner: `${WEB_URL}/${featureChallengeData?.banner}`,
                        challenge: selectedChallenge,
                        isActive: true,
                        isChallenge:
                          selectedChallenge?.challenge_type === "challenge",
                        selectedChapter: {
                          instance:
                            featureChallengeData?.chapter_current
                              ?.challenge_chapter_auth,
                          index: featureChallengeData?.index,
                        },
                      });
                    }}
                  >
                    <MText style={{ color: COLORS.WHITE }}>Read More</MText>
                  </MTouchable>
                </MView>
                <MText
                  style={{
                    fontWeight: "500",
                    fontSize: 16,
                    marginVertical: 5,
                  }}
                >
                  {featureChallengeData?.chapter_current?.name || "N/A"}{" "}
                  <MText
                    style={{
                      color: COLORS.PRIMARY,
                      fontWeight: "600",
                    }}
                  >
                    {moment(featureChallengeData?.challenge_start)
                      .add(
                        parseInt(
                          featureChallengeData?.chapter_current?.announce?.split(
                            " "
                          )[0]
                        ) - 1,
                        "days"
                      )
                      .format("LL")}
                  </MText>
                </MText>
                <MText
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  {featureChallengeData?.chapter_current?.description || "N/A"}
                </MText>
                <MView
                  style={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                    // ...(Platform.OS === "android"
                    //   ? {
                    //       height: 200,
                    //     }
                    //   : {}),
                    paddingTop: 12,
                    marginBottom: 10,
                  }}
                >
                  {videoId && (
                    <YoutubePlayer
                      key={videoId}
                      height={270}
                      play={playing}
                      width={Dimensions.get("window").width - 50}
                      videoId={videoId}
                      onChangeState={(event) => {
                        if (event === "ended") {
                          setPlaying(false);
                        }
                      }}
                    />
                  )}
                </MView>
              </MView>
            </>
          </Card>
        )}

        <MView style={styles.btnContainer}>
          <MButton
            style={{ ...styles.activeBtn(active === "0") }}
            onPress={() => {
              setActive("0");
            }}
          >
            <MText style={styles.btnTxt}>
              {t("challenges.active_challenges")}
            </MText>
          </MButton>
          <MButton
            style={{ ...styles.activeBtn(active === "1") }}
            onPress={() => {
              setActive("1");
            }}
          >
            <MText style={styles.btnTxt}>
              {t("challenges.find_challenges")}
            </MText>
          </MButton>
          <MButton
            style={{ ...styles.activeBtn(active === "2") }}
            onPress={() => {
              setActive("2");
            }}
          >
            <MText style={styles.btnTxt}>
              {t("challenges.active_programs")}
            </MText>
          </MButton>
          <MButton
            style={{ ...styles.activeBtn(active === "3") }}
            onPress={() => {
              setActive("3");
            }}
          >
            <MText style={styles.btnTxt}>{t("challenges.find_programs")}</MText>
          </MButton>
        </MView>

        {loading ? (
          <MView style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.SECONDARY} />
          </MView>
        ) : active === "0" ? (
          <MView style={styles.container}>
            {challenges &&
              Object.values(challenges)
                ?.filter((item) => {
                  return moment(item?.challenge_end)
                    ?.add(7, "days")
                    ?.isAfter(moment());
                })
                ?.map((challenge, index) => {
                  return (
                    <ChallengeCard
                      key={index}
                      challenge={challenge}
                      isActive
                      onPress={() =>
                        navigation.navigate(ROUTES.CHALLENGE_DETAIL, {
                          challengeInstanceAuth:
                            challenge?.challenge_instance_auth,
                          challenge,
                          isChallenge: true,
                          banner: `${WEB_URL}/${challenge?.banner}`,
                          isActive: true,
                        })
                      }
                    />
                  );
                })}
          </MView>
        ) : active === "1" ? (
          <MView style={styles.container}>
            <MText style={styles.txt}>
              {t("challenges.find_challenges_matching")}
            </MText>
            <MSelect
              mode="outlined"
              list={
                categories?.tags?.map((tag) => ({
                  label: tag,
                  value: tag,
                })) ?? []
              }
              placeholder={t("challenges.select_category")}
              value={challengeType}
              setValue={setChallengeType}
              multiSelect
            ></MSelect>
            <MText style={{ ...styles.txt, marginTop: 12 }}>
              {t("challenges.language")}
            </MText>
            <MView
              style={{
                flexDirection: "row",
                width: "100%",
                gap: 10,
              }}
            >
              <MView
                style={{
                  width: "70%",
                }}
              >
                <MSelect
                  mode="outlined"
                  list={
                    Object.entries(categories?.languages || {})?.map(
                      (lang) => ({
                        label: lang[1] || "",
                        value: lang[0] || "",
                      })
                    ) ?? []
                  }
                  placeholder={t("challenges.select_language")}
                  value={language}
                  setValue={setLanguage}
                  multiSelect
                />
              </MView>
              <MTouchable
                style={styles.searchBtn}
                onPress={() => onSearchChallenges("challenge")}
                disabled={searchLoading}
              >
                <MIcon source="magnify" size={20} color="#fff" />
                <MText style={styles.btnTxt}>{t("challenges.search")}</MText>
              </MTouchable>
            </MView>
            {searchLoading ? (
              <ActivityIndicator
                color={COLORS.SECONDARY}
                style={{
                  alignSelf: "center",
                  height: "100%",
                }}
              />
            ) : (
              searchChallenges &&
              Object.values(searchChallenges).map((challenge, index) => {
                return (
                  <ChallengeCard
                    key={index}
                    challenge={challenge}
                    onPress={() => {
                      navigation.navigate(ROUTES.CHALLENGE_DETAIL, {
                        challengeInstanceAuth:
                          challenge?.challenge_template_auth,
                        banner: `${WEB_URL}/${challenge?.banner}`,
                        challenge,
                        isActive: false,
                        isChallenge: true,
                      });
                    }}
                  />
                );
              })
            )}
          </MView>
        ) : active === "2" ? (
          <MView style={styles.container}>
            {activeProgram &&
              Object.values(activeProgram)
                ?.filter((item) => moment(item.challenge_end).isAfter(moment()))
                .map((challenge, index) => {
                  return (
                    <ChallengeCard
                      key={index}
                      challenge={challenge}
                      isActive
                      onPress={() =>
                        navigation.navigate(ROUTES.CHALLENGE_DETAIL, {
                          challengeInstanceAuth:
                            challenge?.challenge_instance_auth,
                          challenge,
                          isChallenge: false,
                          banner: `${WEB_URL}/${challenge?.banner}`,
                          isActive: true,
                        })
                      }
                    />
                  );
                })}
          </MView>
        ) : active === "3" ? (
          <MView style={styles.container}>
            <MText style={styles.txt}>
              {t("challenges.find_programs_matching")}
            </MText>
            <MSelect
              mode="outlined"
              list={
                programCategories?.tags?.map((tag) => ({
                  label: tag,
                  value: tag,
                })) ?? []
              }
              placeholder={t("challenges.select_category")}
              value={programType}
              setValue={setProgramType}
              multiSelect
            ></MSelect>
            <MText style={{ ...styles.txt, marginTop: 12 }}>
              {t("challenges.language")}
            </MText>
            <MView
              style={{
                flexDirection: "row",
                width: "100%",
                gap: 10,
              }}
            >
              <MView
                style={{
                  width: "70%",
                }}
              >
                <MSelect
                  mode="outlined"
                  list={
                    Object.entries(programCategories?.languages || {})?.map(
                      (lang) => ({
                        label: lang[1] || "",
                        value: lang[0] || "",
                      })
                    ) ?? []
                  }
                  placeholder={t("challenges.select_language")}
                  value={programLanguage}
                  setValue={setProgramLanguage}
                  multiSelect
                />
              </MView>
              <MTouchable
                style={styles.searchBtn}
                onPress={() => onSearchChallenges("program")}
                disabled={searchLoading}
              >
                <MIcon source="magnify" size={20} color="#fff" />
                <MText style={styles.btnTxt}>{t("challenges.search")}</MText>
              </MTouchable>
            </MView>
            {searchLoading ? (
              <ActivityIndicator
                color={COLORS.SECONDARY}
                style={{
                  alignSelf: "center",
                  height: "100%",
                }}
              />
            ) : (
              programs &&
              Object.values(programs).map((challenge, index) => {
                return (
                  <ChallengeCard
                    key={index}
                    challenge={challenge}
                    onPress={() =>
                      navigation.navigate(ROUTES.CHALLENGE_DETAIL, {
                        challengeInstanceAuth:
                          challenge?.challenge_instance_auth,
                        banner: `${WEB_URL}/${challenge?.banner}`,
                        challenge,
                        isActive: false,
                        isChallenge: false,
                      })
                    }
                  />
                );
              })
            )}
          </MView>
        ) : null}
      </MScrollView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 12,
  },
  txt: {
    color: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontWeight: "500",
  },
  cardContainer: {
    borderColor: "#000",
    borderWidth: 0.8,
    marginVertical: 10,
  },
  layoutContainer: {
    paddingBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 100,
    resizeMode: "cover",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 50,
    resizeMode: "stretch",
  },
  loadingContainer: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    minHeight: 100,
  },
  activeBtn: (isActive = false) => ({
    width: "48%",
    borderRadius: 8,
    backgroundColor: isActive ? COLORS.SECONDARY : COLORS.PRIMARY,
    paddingVertical: 5,
  }),
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 12,
    marginTop: 12,
  },
  btnTxt: {
    color: "#fff",
    fontSize: 14,
  },
  txt: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginBottom: 8,
  },
  searchBtn: {
    width: "28%",
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    flexDirection: "row",
  },
});

export default ChallengesScreen;
