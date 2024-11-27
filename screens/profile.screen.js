import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  Image,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { getAuthData, getItems, removeData, clearAll } from "../src/store";
import {
  get_compensation_summary,
  get_employment_summary,
  get_profile_assets_allowances,
  get_profile_qualification,
  profile_bio_get,
  profile_bio_save,
  profile_get,
  profile_signout,
  profile_update,
} from "../src/api";
import {
  MButton,
  MView,
  MText,
  MDivider,
  MIcon,
  MIconButton,
  MTouchable,
  MSelect,
} from "../components/MComponents";
import mime from "mime";

import { DynamicSectionList } from "../components/DynamicSectionList";
import { profile_config } from "../config/profile";
import { Appbar } from "react-native-paper";
import { COLORS, ROUTES } from "../constants";
import { MModal } from "../components/MModal";
import * as ImagePicker from "expo-image-picker";
import { t } from "i18next";
import DropDown from "react-native-paper-dropdown";
import i18n from "../localization/localization";
import moment from "moment";
import { localizeConfig } from "../utils";
import EmploymentSummary from "../components/EmploymentSummary";
import { BarChart } from "react-native-gifted-charts";
import CompensationSummary from "../components/CompensationSummary";
import ProfileAssets from "../components/ProfileAssets";
import QualificationSummary from "../components/QualificationSummary";

export default ({ navigation, route }) => {
  const [auth, setAuth] = React.useState("");
  const [loaded, setLoaded] = React.useState(true);
  const [profile, setProfile] = React.useState({});
  const [profileAssets, setProfileAssets] = useState({});
  const [qualification, setQualification] = React.useState({});
  const [profileEmployment, setProfileEmployment] = React.useState({});
  const [compensation, setCompensation] = React.useState({});
  const [updatedProfile, setUpdatedProfile] = React.useState({});
  const [imageLoading, setImageLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [languageCode, setLanguageCode] = React.useState("en");

  const toggleModal = () => setVisible(!visible);

  React.useEffect(() => {
    getAuthData(setAuth).then(async (auth) => {
      setAuth(auth);
      if (auth && auth.data) {
        await getItems(auth, [
          {
            key: "profile",
            stateHook: (data) => {
              setProfile((prev) => {
                return {
                  ...prev,
                  ...data,
                };
              });
              setUpdatedProfile((prev) => {
                return {
                  ...prev,
                  ...data,
                };
              });
            },
            apiFallback: profile_get,
          },
          {
            key: "profile_bio",
            stateHook: (data) => {
              const {
                family_image = null,
                profile_image = null,
                preferences = {},
              } = data;
              setProfile((prev) => {
                return {
                  ...prev,
                  preferences,
                  personal_photo: {
                    family_image,
                    profile_image,
                  },
                };
              });
              setUpdatedProfile((prev) => {
                return {
                  ...prev,
                  preferences,
                  personal_photo: {
                    family_image,
                    profile_image,
                  },
                };
              });
            },
            apiFallback: profile_bio_get,
          },
        ]);
        setProfile((profile) => {
          return {
            ...profile,
            language_preference: i18n.language,
          };
        });
        setLoaded(true);
      } else {
        console.log("auth failed!!!", auth);
        alert("Your session has expired. Please log in again.");
        removeData("auth");
        navigation.navigate(ROUTES.LOGIN);
      }
    });
  }, []);

  let routeSection = "personal";
  if (route && route.params && route.params.section) {
    routeSection = route.params.section;
  }

  const [activeSection, setActiveSection] = React.useState(routeSection);

  const setActive = (section) => {
    if (section == activeSection) {
      setActiveSection("none");
    } else {
      setActiveSection(section);
    }
  };

  const forceReloadProfile = () => {
    removeData("profile");
    getItems(auth, [
      {
        key: "profile",
        stateHook: (data) => {
          setProfile((prev) => {
            return {
              ...prev,
              ...data,
            };
          });
          setUpdatedProfile((prev) => {
            return {
              ...prev,
              ...data,
            };
          });
        },
        apiFallback: profile_get,
      },
      {
        key: "profile_bio",
        stateHook: (data) => {
          const {
            family_image = null,
            profile_image = null,
            preferences = {},
          } = data;
          setProfile((prev) => {
            return {
              ...prev,
              preferences,
              personal_photo: {
                family_image,
                profile_image,
              },
            };
          });
          setUpdatedProfile((prev) => {
            return {
              ...prev,
              preferences,
              personal_photo: {
                family_image,
                profile_image,
              },
            };
          });
        },
        apiFallback: profile_bio_get,
      },
    ]);
  };
  const handleSave = async (isImage = false, callback = () => {}) => {
    try {
      if (isImage) {
        setImageLoading(true);
      } else setLoading(true);

      const { personal_photo, preferences, ...payload } = updatedProfile;
      if (payload?.language_preference) delete payload.language_preference;
      if (payload?.dob) {
        const formattedDob = moment(payload.dob).format("DD-MM-YYYY");
        const dobData = formattedDob?.split("-");
        payload.dob_day = dobData[0];
        payload.dob_month = dobData[1];
        payload.dob_year = dobData[2];
        delete payload.dob;
      }

      const data = [
        {
          name: "data",
          value: JSON.stringify({
            preferences,
          }),
        },
        ...(personal_photo?.profile_image !==
        profile?.personal_photo?.profile_image
          ? [
              {
                name: "profile_image",
                value: {
                  uri: personal_photo?.profile_image,
                  name: "profile_image" + new Date().getTime(),
                  type: mime.getType(personal_photo?.profile_image),
                },
              },
            ]
          : []),
        ...(personal_photo?.family_image !==
        profile?.personal_photo?.family_image
          ? [
              {
                name: "family_image",
                value: {
                  uri: personal_photo?.family_image,
                  name: "family_image" + new Date().getTime(),
                  type: mime.getType(personal_photo?.family_image),
                },
              },
            ]
          : []),
      ];

      const updateProfileBio = await profile_bio_save(
        auth?.data?.profile_auth,
        auth.cookie,
        data
      );

      const response = await profile_update(
        auth.data.profile_auth,
        auth.data.company_auth,
        auth.cookie,
        payload,
        image
      );
      forceReloadProfile();
      // reset updatedSkills to empty object so we don't post more changes each save
      setUpdatedProfile({});
      if (response && response.status == "success") {
        forceReloadProfile();
        // reset updatedSkills to empty object so we don't post more changes each save
        setUpdatedProfile({});
        alert("Your profile has been updated.");
      } else {
        alert("There was an error updating your profile.");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      if (isImage) {
        setImageLoading(false);
      } else setLoading(false);
      if (callback) callback();
    }
  };
  const updateLanguageCode = (newValue) => {
    setLanguageCode(newValue);
    i18n.changeLanguage(newValue);
  };
  const handleChange = (id, newValue) => {
    if (id === "localization") {
      updateLanguageCode(newValue);
    }

    // Create a deep copy of the profile to ensure immutability
    let deepCopy = JSON.parse(JSON.stringify(updatedProfile));

    // Split the id by dots to handle potential nested keys
    const keys = id?.split(".");
    let current = deepCopy;
    // Check if the id represents a nested property
    if (keys.length > 1) {
      // Iterate through the keys, except for the last one
      for (let i = 0; i < keys?.length - 1; i++) {
        const key = keys?.[i];

        // Create the object if it does not exist
        if (!current?.[key]) {
          current[key] = {};
        }

        current = current[key];
      }
      // Set the new value at the final key for a nested property
      current[keys?.[keys?.length - 1]] = newValue;
    } else {
      // Handle simple property update
      deepCopy[id] = newValue;
    }

    // Update the state with the modified profile
    setUpdatedProfile(deepCopy);
  };

  // let config = JSON.parse(JSON.stringify(profile_config));
  const config = localizeConfig(t, profile_config);
  // if (config && routeSection != '') {
  //   config.sections = config.sections.filter((section) => {
  //     return (section.id == route.params.section)
  //   })
  // }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const signOut = async () => {
    profile_signout(auth.data.profile_auth, auth.cookie).then((response) => {
      if (response && response.status == "success") {
        clearAll();
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.LOGIN }],
        });
      } else {
        alert("There was an error signing out.");
      }
    });
  };
  const profileImage = `https://app.myexectras.com/${
    profile?.profile_image
  }?${new Date().getTime()}`;

  const { width } = useWindowDimensions();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.WHITE, alignItems: "center" }}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={COLORS.PRIMARY} />
      <MView style={styles.header}>
        <MView style={{ flexDirection: "row", alignItems: "center" }}>
          <MTouchable onPress={toggleModal}>
            <Image
              resizeMode="cover"
              style={{
                height: 50,
                width: 50,
                marginRight: 10,
                marginLeft: -10,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "#fff",
              }}
              // profile_image
              source={
                image
                  ? { uri: image }
                  : profileImage
                  ? { uri: profileImage }
                  : require("../assets/profile.jpg")
              }
            />
          </MTouchable>
          <MText style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            {profile?.name || ""} {profile?.surname || ""}
          </MText>
        </MView>
        <MTouchable onPress={() => navigation.openDrawer()}>
          <MIcon source="menu" size={30} color="#fff" />
        </MTouchable>
      </MView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        style={{ flex: 1, width: "90%", marginVertical: 10 }}
      >
        <DynamicSectionList
          config={config}
          values={updatedProfile}
          handleChange={handleChange}
          setActive={setActive}
          defaultSection={routeSection}
        />
        {/* <MTouchable
          onPress={() => setActive("profile_employment")}
          style={styles.accordion}
        >
          <MText style={{ fontSize: 16 }}>
            {t("profile.summary.employment_summary")}
          </MText>
          <MIcon
            source={activeSection === "profile_employment" ? "minus" : "plus"}
            color={"#000"}
            size={30}
          />
        </MTouchable>

        {activeSection === "profile_employment" && profileEmployment && (
          <MView>
            <EmploymentSummary data={profileEmployment} />
          </MView>
        )}
        <MTouchable
          onPress={() => setActive("profile_compensation")}
          style={styles.accordion}
        >
          <MText style={{ fontSize: 16 }}>
            {t("profile.summary.compensation_summary")}
          </MText>
          <MIcon
            source={activeSection === "profile_compensation" ? "minus" : "plus"}
            color={"#000"}
            size={30}
          />
        </MTouchable>
        {activeSection === "profile_compensation" &&
          compensation?.compensation_summary?.years && (
            <>
              <MText style={styles.title}>
                {t("profile.summary.annual_salary")}
              </MText>

              {compensation?.compensation_summary?.years && (
                <BarChart
                  isAnimated
                  barStyle={{
                    paddingTop: 10,
                  }}
                  data={Object.entries(
                    compensation?.compensation_summary?.years || {}
                  ).map(([key, value]) => {
                    return {
                      value,
                      label: key,
                    };
                  })}
                  barWidth={
                    (width * 0.5) /
                    Object.entries(
                      compensation?.compensation_summary?.years || {}
                    )?.length
                  }
                  frontColor={COLORS.PRIMARY}
                  backColor={COLORS.SECONDARY}
                  yAxisTextStyle={{
                    fontSize: 8,
                  }}
                />
              )}
              <MText style={styles.title}>
                {t("profile.summary.earning_to_date")}
              </MText>
              {compensation?.compensation_summary?.years && (
                <BarChart
                  isAnimated
                  barStyle={{
                    paddingTop: 10,
                  }}
                  data={Object.entries(
                    compensation?.compensation_summary?.years || {}
                  )
                    .reduce((acc, [year, value]) => {
                      const previousSum =
                        acc?.length > 0 ? acc?.[acc?.length - 1]?.value : 0;
                      acc?.push({
                        label: year,
                        value: previousSum + +value,
                      });
                      return acc;
                    }, [])
                    .map((item) => {
                      return {
                        value: item?.value,
                        label: item?.label,
                        topLabelComponentHeight: 20,
                      };
                    })}
                  barWidth={
                    (width * 0.5) /
                    Object.entries(
                      compensation?.compensation_summary?.years || {}
                    )?.length
                  }
                  frontColor={COLORS.PRIMARY}
                  backColor={COLORS.SECONDARY}
                  yAxisTextStyle={{
                    fontSize: 8,
                  }}
                />
              )}
              <CompensationSummary data={compensation} />
            </>
          )}
        <MTouchable
          onPress={() => setActive("profile_assets")}
          style={styles.accordion}
        >
          <MText style={{ fontSize: 16 }}>
            {t("profile.summary.profile_assets")}
          </MText>
          <MIcon
            source={activeSection === "profile_assets" ? "minus" : "plus"}
            color={"#000"}
            size={30}
          />
        </MTouchable>
        {activeSection === "profile_assets" && profileAssets && (
          <ProfileAssets data={profileAssets} />
        )}

        <MTouchable
          onPress={() => setActive("qualification")}
          style={styles.accordion}
        >
          <MText style={{ fontSize: 16 }}>
            {t("profile.qualification.label")}
          </MText>
          <MIcon
            source={activeSection === "qualification" ? "minus" : "plus"}
            color={"#000"}
            size={30}
          />
        </MTouchable>
        {activeSection === "qualification" && (
          <QualificationSummary data={qualification} />
        )} */}
      </ScrollView>
      <MButton
        style={styles.action}
        onPress={() => handleSave(false, null)}
        loading={loading}
      >
        <MText style={{ color: "#fff" }}>{t("save_profile")}</MText>
      </MButton>
      <MModal
        visible={visible}
        onDismiss={toggleModal}
        contentContainerStyle={styles.modalContainer}
      >
        <MIconButton
          icon="close-circle"
          iconColor={COLORS.SECONDARY}
          style={styles.crossButton}
          onPress={toggleModal}
        />

        <MView
          style={{
            position: "relative",
          }}
        >
          <Image
            source={
              image
                ? { uri: image }
                : profileImage
                ? { uri: profileImage }
                : require("../assets/profile.jpg")
            }
            style={styles.image}
          />
          <MIconButton
            onPress={pickImage}
            iconColor={COLORS.PRIMARY}
            icon="square-edit-outline"
            style={styles.editButton}
          />
        </MView>
        <MButton
          onPress={() => handleSave(true, toggleModal)}
          mode="contained"
          style={styles.pickImageBtn}
          loading={imageLoading}
        >
          {t("save_profile")}
        </MButton>
      </MModal>
    </SafeAreaView>

    // <MView style={{ flex: 1, flexBasis: '100%' }}>
    //   <Appbar.Header>
    //     <Appbar.BackAction onPress={() => { navigation.goBack() }} />
    //     <Appbar.Content title="Update Your Profile" />
    //   </Appbar.Header>

    //   <ScrollView style={{ flex: 1, flexBasis: '80%' }}>

    //     <MView style={styles.body}>

    //       <MView style={styles.form}>

    //         {loaded ?
    //           <DynamicSectionList
    //             config={config}
    //             values={profile}
    //             handleChange={handleChange}
    //             setActive={setActive}
    //             defaultSection={routeSection}
    //           /> : <LoadingNotification />
    //         }
    //       </MView>
    //     </MView>
    //   </ScrollView>
    //   <Appbar style={!isKeyboardVisible ? styles.bottom : styles.hidden}>
    //     <MButton style={styles.action} onPress={handleSave}>
    //       Save Profile
    //     </MButton>
    //     <MButton style={{ backgroundColor: 'none' }} onPress={
    //       navigation.goBack
    //     }>Cancel</MButton>
    //   </Appbar>

    // </MView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  hidden: {
    display: "none",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  form: {
    width: "90%",
    paddingBottom: 20,
  },
  formInput: {
    marginTop: 10,
  },
  formInputLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    color: "#949FB7",
  },
  actions: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    marginTop: 15,
    justifyContent: "flex-start",
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
  },
  action: {
    marginRight: 5,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 5,
    marginBottom: 10,
    color: "#fff",
  },
  logout: {
    marginTop: 15,
    marginLeft: 5,
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    position: "relative",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderColor: "#454545",
    borderWidth: 2,
    borderRadius: 100,
  },
  pickImageBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 20,
  },
  crossButton: {
    alignSelf: "flex-end",
  },
  editButton: {
    position: "absolute",
    bottom: 10,
    right: 40,
  },
  accordion: {
    width: "100%",
    backgroundColor: "#fff",
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
});
