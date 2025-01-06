import React, { memo, useMemo, useRef, useState } from "react";
import { Dimensions, Image, StatusBar, StyleSheet } from "react-native";
import { removeData, getAuthData, getItems } from "../src/store";
import ReAnimatedCarousel from "react-native-reanimated-carousel";

import {
  challenges_get,
  get_timeoff_settings,
  get_timeoff_summary,
  notifications_get,
  profile_get,
  programs_get,
} from "../src/api";
import {
  MButton,
  MText,
  MView,
  MIcon,
  MTouchable,
} from "../components/MComponents";
import { ActivityIndicator, Card, useTheme } from "react-native-paper";
import { COLORS, ROUTES, WEB_URL } from "../constants";
import { LogoBar } from "../components/LogoBar";
import MScrollView from "../components/MComponents/MScrollView";
import { PERKS_ROUTES } from "../constants/perks";
import { CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { formattedText, generateRandomString } from "../utils";
import RenderHTML from "react-native-render-html";
import moment from "moment";
import ChallengeCard from "../components/ChallengeCard";
import { useAuth } from "../context/AuthContext";

export default ({ navigation }) => {
  const carouselRef = useRef(null);
  const [auth, setAuth] = React.useState({});
  const [profile, setProfile] = useState({});
  const [timeoffSummary, setTimeOffSummary] = useState(null);
  const [timeoffSettings, setTimeSettings] = useState(null);
  const [challenges, setChallenges] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [activeProgram, setActiveProgram] = React.useState([]);

  const [notificationsLoading, setNotificationsLoading] = React.useState(false);
  const latestNotification = notifications?.sort(
    (a, b) => new Date(b?.created) - new Date(a?.created)
  )?.[0];
  React.useEffect(() => {
    setNotificationsLoading(true);
    getAuthData(setAuth)
      .then(async (auth) => {
        setAuth(auth);
        if (auth && auth.data) {
          await getItems(auth, [
            {
              key: "notifications",
              stateHook: setNotifications,
              apiFallback: notifications_get,
            },
            {
              key: "profile",
              stateHook: setProfile,
              apiFallback: profile_get,
            },
            {
              key: "time_off",
              stateHook: setTimeOffSummary,
              apiFallback: get_timeoff_summary,
            },
            {
              key: "time_settings",
              stateHook: setTimeSettings,
              apiFallback: get_timeoff_settings,
            },
            {
              key: "challenges",
              stateHook: (data) => {
                setChallenges(data);
              },
              apiFallback: challenges_get,
            },
            {
              key: "active_programs",
              stateHook: setActiveProgram,
              apiFallback: programs_get,
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
        setNotificationsLoading(false);
      });
  }, []);
  React.useEffect(() => {
    if (profile?.localization) {
      i18n.changeLanguage(profile?.localization);
    }
  }, [profile, profile?.localization]);

  const goToNext = () => {
    carouselRef.current.next();
  };

  const goToPrevious = () => {
    carouselRef.current.prev();
  };
  const { t, i18n } = useTranslation();
  const updateLanguageCode = (newValue) => {
    // setLanguageCode(newValue);
    i18n.changeLanguage(newValue);
  };
  const profileImage = useMemo(() => {
    return `${WEB_URL}/${profile?.profile_image}?${new Date().getTime()}`;
  }, [profile?.profile_image]);
  const _renderItem = ({ item, index }) => {
    let id = index.toString() + generateRandomString(7);
    return (
      <MView style={styles.flexColumn} key={id.toString()}>
        <MView>
          <Image
            resizeMode="cover"
            style={styles.medicationImage}
            source={item.image}
          />
          <MText
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t(item.title)}
          </MText>
          <MText
            style={{
              marginTop: 5,
              fontSize: 14,
            }}
          >
            {formattedText(t(item.description))}
          </MText>
        </MView>
        <MButton
          style={styles.perkBtn}
          dark={true}
          onPress={() => {
            if (Object.values(ROUTES).includes(item.route)) {
              navigation.navigate(item.route);
              return;
            }
            navigation.dispatch(
              CommonActions.navigate({
                name: ROUTES.JOBS,
                params: {
                  screen: ROUTES.PERK_DETAIL,
                  params: { name: item.route },
                },
              })
            );
          }}
        >
          {t(item.label)}
        </MButton>
      </MView>
    );
  };
  const activeChallenges = useMemo(() => {
    return Object.values(challenges || {})?.filter((item) => {
      return moment(item?.challenge_end)?.add(7, "days")?.isAfter(moment());
    });
  }, [challenges]);
  const activePrograms = useMemo(() => {
    return Object.values(activeProgram || {})?.filter((item) => {
      return moment(item?.challenge_end)?.add(7, "days")?.isAfter(moment());
    });
  }, [activeProgram]);
  return (
    <>
      <LogoBar
        isProfile
        onProfilePress={() => {
          navigation.openDrawer();
        }}
      />
      <StatusBar barStyle={"light-content"} backgroundColor={COLORS.PRIMARY} />
      <MScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: 12,
          ...(notificationsLoading
            ? {
                flex: 1,
              }
            : {}),
        }}
      >
        {notificationsLoading ? (
          <MView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
            }}
          >
            <ActivityIndicator />
          </MView>
        ) : (
          <>
            <MView style={styles.body}>
              <Card style={styles.profileCard}>
                <MView style={styles.cardContainer}>
                  <MView style={styles.card}>
                    <MTouchable
                      style={styles.flexRowCenter}
                      onPress={() => navigation.navigate(ROUTES.PROFILE_STACK)}
                    >
                      <Image
                        resizeMode="cover"
                        style={styles.image}
                        source={
                          profile?.profile_image
                            ? { uri: profileImage }
                            : require("../assets/profile.jpg")
                        }
                      />
                      <MView>
                        <MText style={styles.welcomeTxt}>
                          {auth?.data?.name + " " + auth?.data?.surname}
                        </MText>
                        <MText style={{ fontSize: 14 }}>
                          {auth?.data?.company || ""}
                        </MText>
                      </MView>
                    </MTouchable>
                    {timeoffSettings && timeoffSummary && (
                      <>
                        <MView style={styles.separator} />
                        <MView style={styles.timeoffContainer}>
                          <MView style={styles.flexColCenter}>
                            <MText style={styles.hour}>
                              {timeoffSettings?.hours_in_day}
                            </MText>
                            <MText>{t("timeoff.hours")}</MText>
                          </MView>
                          <MView style={styles.flexColCenter}>
                            <MText style={styles.hour}>
                              {
                                timeoffSummary?.[1]?.[
                                  timeoffSummary?.[1]?.length - 1
                                ]
                              }
                            </MText>
                            <MText>
                              {timeoffSummary?.[1]?.[0]?.split(" ")[0]}
                            </MText>
                          </MView>
                          <MView style={styles.flexColCenter}>
                            <MText style={styles.hour}>
                              {
                                timeoffSummary?.[2]?.[
                                  timeoffSummary?.[1]?.length - 1
                                ]
                              }
                            </MText>
                            <MText>
                              {timeoffSummary?.[2]?.[0]?.split(" ")?.[0]}
                            </MText>
                          </MView>
                        </MView>
                        <MButton
                          onPress={() =>
                            navigation.navigate(ROUTES.REQUEST_TIME_OFF)
                          }
                          style={styles.timeOffBtn}
                          textStyle={{
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          {t("timeoff.request_timeoff")}
                        </MButton>
                      </>
                    )}
                  </MView>
                </MView>
              </Card>

              {/* <Card
                style={{
                  flex: 1,
                  backgroundColor: COLORS.WHITE,
                  marginHorizontal: 20,
                }}
              >
                <Card.Content style={{ paddingHorizontal: 0 }}>
                  <MView style={{ marginTop: 20, ...styles.cardContainer }}>
                    <MView
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MTouchable onPress={goToPrevious} hitSlop={30}>
                        <MIcon source="chevron-left" size={30} />
                      </MTouchable>
                      <ReAnimatedCarousel
                        ref={carouselRef}
                        loop
                        width={Dimensions.get("window").width - 105}
                        height={260}
                        autoPlay={true}
                        data={carouselList}
                        scrollAnimationDuration={3000}
                        onSnapToItem={(index) => {}}
                        renderItem={_renderItem}
                        keyExtractor={(item) => item.id}
                      />
                      <MTouchable onPress={goToNext}>
                        <MIcon source="chevron-right" size={30} />
                      </MTouchable>
                    </MView>
                  </MView>
                </Card.Content>
              </Card> */}
              <Card
                style={{
                  flex: 1,
                  backgroundColor: COLORS.WHITE,
                  marginHorizontal: 20,
                  marginTop: 12,
                }}
              >
                <Card.Content
                  style={{ paddingHorizontal: 0, paddingVertical: 0 }}
                >
                  <MView style={styles.cardContainer}>
                    <MView style={styles.card}>
                      <MView style={styles.notificationHeaderContainer}>
                        <MText style={styles.notificationTxt}>
                          {t("notifications.notifications")}
                        </MText>
                        <MView style={{ position: "relative" }}>
                          <MIcon
                            source="bell"
                            size={30}
                            color={COLORS.SECONDARY}
                          />
                          <MView style={styles.notificationCountContainer}>
                            <MText style={styles.notificationCount}>
                              {notifications?.length}
                            </MText>
                          </MView>
                        </MView>
                      </MView>
                      {notificationsLoading ? (
                        <ActivityIndicator />
                      ) : notifications?.length > 0 ? (
                        <>
                          <MText
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                            }}
                          >
                            {latestNotification?.name}
                          </MText>
                          <RenderHTML
                            contentWidth={Dimensions.get("window").width - 140}
                            baseStyle={{
                              fontSize: 14,
                              color: "rgb(30,26,29)",
                            }}
                            source={{
                              html: latestNotification?.description,
                            }}
                            tagsStyles={{
                              p: {
                                margin: 0,
                                padding: 5,
                              },
                            }}
                          />
                          <MText style={{ fontStyle: "italic" }}>
                            -
                            {moment(latestNotification?.created).format(
                              "MMMM DD, YYYY @ h:mm A"
                            )}
                            {"\n"}
                            {auth?.data?.name + " " + auth?.data?.surname}
                          </MText>
                        </>
                      ) : (
                        <MText style={styles.normalText}>
                          {t("notifications.no_new_notifications")}
                        </MText>
                      )}

                      <MButton
                        style={styles.button}
                        mode="text"
                        textStyle={{
                          fontSize: 10,
                          padding: 0,
                        }}
                        onPress={() =>
                          navigation.navigate(ROUTES.NOTIFICATIONS_STACK)
                        }
                      >
                        {t("home.more")}
                      </MButton>
                    </MView>
                  </MView>
                </Card.Content>
              </Card>
              {activeChallenges?.length > 0 || activePrograms?.length > 0 ? (
                <MView style={styles.challengeContainer}>
                  <MText style={styles.heading}>
                    {t("challenges.active_challenges")}
                  </MText>
                  {activeChallenges?.length > 0 ? (
                    activeChallenges?.map((challenge, index) => {
                      return (
                        <ChallengeCard
                          key={index}
                          challenge={challenge}
                          isActive
                          onPress={() =>
                            navigation.navigate(ROUTES.CHALLENGES_STACK, {
                              screen: ROUTES.CHALLENGE_DETAIL,
                              params: {
                                challengeInstanceAuth:
                                  challenge?.challenge_instance_auth,
                                challenge,
                                isChallenge: true,
                                banner: `${WEB_URL}/${challenge?.banner}`,
                                isActive: true,
                              },
                            })
                          }
                        />
                      );
                    })
                  ) : (
                    <MText>{t("challenges.no_active_challenges")}</MText>
                  )}
                  <MText style={styles.heading}>
                    {t("challenges.active_programs")}
                  </MText>
                  {activePrograms?.length > 0 ? (
                    activePrograms?.map((challenge, index) => {
                      return (
                        <ChallengeCard
                          key={index}
                          challenge={challenge}
                          isActive
                          onPress={() =>
                            navigation.navigate(ROUTES.CHALLENGES_STACK, {
                              screen: ROUTES.CHALLENGE_DETAIL,
                              params: {
                                challengeInstanceAuth:
                                  challenge?.challenge_instance_auth,
                                challenge,
                                isChallenge: true,
                                banner: `${WEB_URL}/${challenge?.banner}`,
                                isActive: true,
                              },
                            })
                          }
                        />
                      );
                    })
                  ) : (
                    <MText>{t("challenges.no_active_program")}</MText>
                  )}
                </MView>
              ) : (
                <>
                  <MView style={styles.btnContainer}>
                    <MButton
                      style={styles.activeBtn}
                      onPress={() => {
                        navigation.navigate(ROUTES.CHALLENGES_STACK, {
                          screen: ROUTES.CHALLENGES,
                          params: {
                            step: "0",
                          },
                        });
                      }}
                    >
                      <MText style={styles.btnTxt}>
                        {t("challenges.active_challenges")}
                      </MText>
                    </MButton>
                    <MButton
                      style={styles.activeBtn}
                      onPress={() => {
                        navigation.navigate(ROUTES.CHALLENGES_STACK, {
                          screen: ROUTES.CHALLENGES,
                          params: {
                            step: "1",
                          },
                        });
                      }}
                    >
                      <MText style={styles.btnTxt}>
                        {t("challenges.find_challenges")}
                      </MText>
                    </MButton>
                    <MButton
                      style={styles.activeBtn}
                      onPress={() => {
                        navigation.navigate(ROUTES.CHALLENGES_STACK, {
                          screen: ROUTES.CHALLENGES,
                          params: {
                            step: "2",
                          },
                        });
                      }}
                    >
                      <MText style={styles.btnTxt}>
                        {t("challenges.active_programs")}
                      </MText>
                    </MButton>
                    <MButton
                      style={styles.activeBtn}
                      onPress={() => {
                        navigation.navigate(ROUTES.CHALLENGES_STACK, {
                          screen: ROUTES.CHALLENGES,
                          params: {
                            step: "3",
                          },
                        });
                      }}
                    >
                      <MText style={styles.btnTxt}>
                        {t("challenges.find_programs")}
                      </MText>
                    </MButton>
                  </MView>
                </>
              )}
            </MView>
          </>
        )}
      </MScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
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
  job: {
    flex: 1,
    flexGrow: 1,
    margin: 10,
    maxWidth: "95%",
    minWidth: "95%",
  },
  notification: {
    flex: 1,
    flexGrow: 1,
    margin: 10,
    minWidth: "95%",
  },
  jobTitle: {
    color: "#E85100",
    fontWeight: "bold",
    marginBottom: 5,
  },
  jobDescription: {},
  jobMetadata: {
    marginTop: 10,
    marginLeft: -2,
  },
  jobInfo: {
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
  cardContainer: {
    // paddingHorizontal: 20,
    width: "100%",
    minWidth: "100%",
  },
  card: {
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  flexRowCenter: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  flexColCenter: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  flexColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  image: {
    height: 50,
    width: 50,
    marginRight: 10,
    marginLeft: -10,
    borderRadius: 25,
  },
  welcomeTxt: {
    fontWeight: "bold",
    fontSize: 18,
  },
  medicationImage: {
    width: "100%",
    height: 80,
    // marginVertical: 10,
  },
  perkBtn: {
    backgroundColor: COLORS.SECONDARY,
    // marginTop: 20,
    borderRadius: 5,
    alignSelf: "center",
    width: "100%",
  },
  notificationHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationTxt: {
    fontWeight: "bold",
    fontSize: 25,
    // marginBottom: 10,
  },
  notificationCountContainer: {
    position: "absolute",
    backgroundColor: COLORS.PRIMARY,
    fontSize: 12,
    height: 12,
    width: 12,
    right: 2,
    top: 3,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  rowContainer: {},
  titleText: {
    color: "#5A3F5D",
    fontSize: 17,
    maxWidth: "80%",
  },
  normalText: {
    color: "#5A3F5D",
    fontSize: 17,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: 60,
    alignSelf: "flex-end",
    marginTop: 10,
    borderRadius: 5,
  },
  profileCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.LIGHTER_GREY,
    marginTop: 10,
  },
  timeoffContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  hour: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  timeOffBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 20,
  },
  btnContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
  },
  activeBtn: {
    width: "48%",
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 5,
  },
  btnTxt: {
    color: COLORS.WHITE,
    fontSize: 14,
  },
  challengeContainer: {
    padding: 16,
  },
});
