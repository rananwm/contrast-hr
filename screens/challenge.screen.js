import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  MButton,
  MCard,
  MDatePicker,
  MIcon,
  MInput,
  MSelect,
  MSwitch,
  MText,
  MTouchable,
  MView,
} from "../components/MComponents";
import mime from "mime";

import ChallengeSidebar from "../components/challenges/ChallengeSidebar";
import MLayout from "../components/MLayout";
import {
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuthData } from "../src/store";
import {
  add_comment,
  add_reply,
  challenge_get,
  edit_comment,
  get_challenge_leaderboard,
  get_chapter_comments,
  get_chapter_detail,
  get_photo_gallery,
  get_potential_participants,
  like_comment,
  start_challenge,
  submit_task_data,
} from "../src/api";
import {
  ActivityIndicator,
  Card,
  Checkbox,
  ProgressBar,
  TextInput,
  useTheme,
} from "react-native-paper";
import { COLORS, ROUTES, WEB_URL } from "../constants";
import HTMLView from "react-native-htmlview";
import YoutubePlayer from "react-native-youtube-iframe";
import TaskTableRow from "../components/TaskTableRow";
import moment from "moment";
import { MModal } from "../components/MModal";
import Slider from "@react-native-community/slider";
import CommentCard from "../components/CommentCard";
import { t } from "i18next";
import { resizeImage } from "../utils";
import useHealth from "../hooks/useHealth";
import HealthDataSyncingModal from "../components/HealthDataSyncingModal";

const ChallengeScreen = ({ navigation, route: { params } }) => {
  const [step, setStep] = React.useState(0);
  const [challenge, setChallenge] = useState(null);

  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [photoGallery, setPhotoGallery] = useState([]);
  const [isSwitch, setIsSwitch] = useState(false);
  const [selectAll, setSelectAll] = useState("");
  const [selectedChapter, setSelectedChapter] = useState({
    instance: null,
    index: 0,
  });
  const [startChallengeLoading, setStartChallengeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [trackValue, setTrackValue] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [participant, setParticipant] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [submitTaskLoading, setSubmitTaskLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [startData, setStartData] = useState({
    invites: "",
    participants: [],
    challenge_start: moment(),
    challenge_end: "",
    challenge_stakes: "",
  });
  const [healthModal, setHealthModal] = useState(false);
  const toggleHealthModal = () => setHealthModal(!healthModal);
  const theme = useTheme();
  const { initializeAndSyncHealthData } = useHealth();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const filesize = result.assets[0].fileSize;
      if (filesize > 5000000) {
        const compress = await resizeImage(result.assets[0].uri);
        setImage(compress);
      } else setImage(result.assets[0].uri);
    }
  };

  const onSubmitTaskData = async () => {
    try {
      setSubmitTaskLoading(true);
      if (modalData) {
        let data = [
          {
            name: "challenge_instance_auth",
            value: params?.challengeInstanceAuth,
          },
          { name: "task_data_auth", value: modalData?.task_auth },
        ];

        if (modalData?.task_type === "value") {
          data.push({
            name: "task_amount",
            value: trackValue,
          });
        } else if (modalData?.task_type === "photo") {
          if (!image) {
            alert("Please select an image");
            return;
          }
          data.push({
            name: "photo_submission",
            value: {
              uri: image,
              name: "photo_submission" + new Date().getTime(),
              type: mime.getType(image),
            },
          });
          data.push({
            name: "caption",
            value: caption || "",
          });
          data.push({
            name: "task_amount",
            value: "1",
          });
        } else {
          data.push({
            name: "task_amount",
            value: "1",
          });
        }
        const response = await submit_task_data(
          auth.data.profile_auth,
          auth.cookie,
          data
        );
        getChapterDetails(selectedChapter?.instance);
        if (
          response?.status === "success" &&
          modalData?.task_type === "photo"
        ) {
          getPhotoGallery();
        }
      }
    } catch (error) {
      console.log("🚀 ~ onSubmitTaskData ~ error:", error);
    } finally {
      setIsModal(false);
      setSubmitTaskLoading(false);
    }
  };
  const [leaderBoard, setLeaderBoard] = useState(null);
  const [chapterDetails, setChapterDetails] = useState(null);

  const [chapterLoading, setChapterLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onHandleChange = (id, value) => {
    setStartData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (id === "challenge_start") {
      const challengeLength =
        params?.challenge?.chapters_meta?.length?.split(" ")?.[0] ?? "";
      if (challengeLength && challengeLength !== "-") {
        const endDate = moment(value).add(challengeLength, "days");
        onHandleChange("challenge_end", endDate);
      }
    }
  };
  const onStartChallenge = async () => {
    try {
      setStartChallengeLoading(true);
      const payload = {
        challenge_stakes: startData?.challenge_stakes || "",
        challenge_start: startData?.challenge_start
          ? moment(startData?.challenge_start).format("MM/DD/YYYY")
          : null,
        participants: JSON.stringify(
          startData?.participants?.filter(Boolean)?.length > 0
            ? startData?.participants?.filter(Boolean)
            : []
        ),
        invites: JSON.stringify(
          startData?.invites?.split(",").filter(Boolean)?.length > 0
            ? startData?.invites?.split(",").filter(Boolean)
            : []
        ),
        challenge_template_auth: params?.challenge?.challenge_template_auth,
      };
      const data = Object.entries(payload ?? {})
        .filter((ele) => ele?.[1])
        .map((item) => ({
          name: item?.[0],
          value: item?.[1],
        }));
      if (params?.challenge?.enable_device_sync === "1") {
        await initializeAndSyncHealthData();
      }
      const response = await start_challenge(
        auth.data.profile_auth,
        auth.cookie,
        data
      );
      if (response?.data?.challenge_instance_auth) {
        navigation.setParams({
          isActive: true,
          challenge: response?.data,
          challengeInstanceAuth: response?.data?.challenge_instance_auth || "",
        });
        setStep(1);
        getChallengeDetails(response?.data?.challenge_instance_auth);
        getChallengeLeaderBoard();
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.log("🚀 ~ onStartChallenge ~ error:", error);
    } finally {
      setStartChallengeLoading(false);
    }
  };
  const onAddComment = async () => {
    try {
      if (!message) {
        alert("Please enter a message");
        return;
      }
      setCommentLoading(true);
      const response = await add_comment(
        auth.data.profile_auth,
        auth.cookie,
        params?.challengeInstanceAuth,
        selectedChapter?.instance,
        message
      );
      if (response?.data) {
        getChapterComments(selectedChapter?.instance);
        getChapterDetails();
        setMessage("");
      }
    } catch (error) {
      console.log("🚀 ~ onAddComment ~ error:", error);
    } finally {
      setCommentLoading(false);
    }
  };
  const onReplyComment = async (replyAuth, commentAuth, comment) => {
    await add_reply(
      auth.data.profile_auth,
      auth.cookie,
      params?.challengeInstanceAuth,
      selectedChapter?.instance,
      commentAuth,
      replyAuth,
      comment
    );

    getChapterComments(selectedChapter?.instance);
  };
  const onLikeComment = async (commentAuth) => {
    await like_comment(
      auth.data.profile_auth,
      auth.cookie,
      params?.challengeInstanceAuth,
      selectedChapter?.instance,
      commentAuth
    );
    getChapterComments(selectedChapter?.instance);
  };
  const onEditComment = async (commentAuth, comment) => {
    await edit_comment(
      auth.data.profile_auth,
      auth.cookie,
      params?.challengeInstanceAuth,
      selectedChapter?.instance,
      commentAuth,
      comment
    );
    getChapterComments(selectedChapter?.instance);
  };
  const stepperChallenge = React.useMemo(() => {
    const data = Object.values(challenge?.chapters ?? {});
    if (params?.selectedChapter?.instance) {
      const index = data?.findIndex(
        (ele) =>
          ele?.challenge_chapter_auth === params?.selectedChapter?.instance
      );
      if (index !== -1) {
        setSelectedChapter({
          instance: params?.selectedChapter?.instance,
          index,
        });
        setStep(2);
      } else {
        setStep(1);
      }
    } else {
      setSelectedChapter({
        instance: data?.[0]?.challenge_chapter_auth,
        index: 0,
      });
    }
    return data;
  }, [challenge]);
  const isContentDisable = () => {
    const isDisable =
      stepperChallenge[selectedChapter.index + 1]?.announce === "00:00:00"
        ? false
        : moment().isBefore(
            moment(challenge?.challenge_start).add(
              "days",
              stepperChallenge[selectedChapter.index + 1]?.announce?.split(
                " "
              )[0]
            )
          );
    return isDisable;
  };
  const handleLayout = (event) => {
    const layout = event?.nativeEvent?.layout;

    const height = layout?.height;
    const itemHeight =
      height / Object.values(challenge?.chapters ?? {})?.length;

    const completeChapter = Object.values(challenge?.chapters ?? {}).filter(
      (ele) =>
        moment().isAfter(
          moment(challenge?.challenge_start).add(
            "days",
            ele?.announce?.split(" ")?.[0]
          )
        )
    );
    scrollRef?.current?.scrollTo({
      y: (completeChapter?.length - 1) * itemHeight,
      animated: true,
    });
  };
  const Stepper = memo(() => (
    <MView style={styles.stepper}>
      {selectedChapter?.index > 0 && (
        <MTouchable
          style={styles.backward}
          onPress={() => {
            setSelectedChapter({
              instance:
                stepperChallenge?.[selectedChapter?.index - 1]
                  ?.challenge_chapter_auth,
              index: selectedChapter?.index - 1,
            });
            setChapterDetails({});
          }}
        >
          <MView style={styles.rotateIcon}>
            <MIcon source="forward" color="#fff" />
          </MView>
          <MText style={styles.stepperTxt}>
            {stepperChallenge?.[selectedChapter?.index - 1]?.name?.length > 14
              ? stepperChallenge?.[selectedChapter?.index - 1]?.name?.slice(
                  0,
                  14
                ) + "..."
              : stepperChallenge?.[selectedChapter?.index - 1]?.name}
          </MText>
        </MTouchable>
      )}
      {stepperChallenge?.length - 1 <= selectedChapter?.index ? null : (
        <MTouchable
          style={{
            ...styles.forward,
            backgroundColor: isContentDisable() ? COLORS.GREY : COLORS.PRIMARY,
          }}
          disabled={isContentDisable()}
          onPress={() => {
            setSelectedChapter({
              instance:
                stepperChallenge?.[selectedChapter?.index + 1]
                  ?.challenge_chapter_auth,
              index: selectedChapter?.index + 1,
            });
            setChapterDetails({});
          }}
        >
          <MText style={styles.stepperTxt}>
            {stepperChallenge?.[selectedChapter?.index + 1]?.name?.length > 22
              ? stepperChallenge?.[selectedChapter?.index + 1]?.name?.slice(
                  0,
                  22
                ) + "..."
              : stepperChallenge?.[selectedChapter?.index + 1]?.name}{" "}
          </MText>

          <MIcon source="forward" color="#fff" />
        </MTouchable>
      )}
    </MView>
  ));

  const renderSteps = () => {
    const challengesStep = {
      0: (
        <MView>
          <Card style={styles.container}>
            <MText style={styles.title}>{params?.challenge?.name}</MText>
            <MText>{params?.challenge?.description || ""}</MText>
            <MText>
              {"\n"}
              Chapters:
              {Object.values(params?.challenge?.chapters ?? {})?.length || 0}
              {"\n"}
              Runtime: {params?.challenge?.chapters_meta?.length || "0"}
              {"\n"}
              Language:{" "}
              {params?.challenge?.language === "es" ? "Spanish" : "English"}
            </MText>
            {isStarted && (
              <MView
                style={{
                  borderColor: "#e1e1e1",
                  borderWidth: 1,
                  padding: 10,
                  marginTop: 20,
                }}
              >
                <MText
                  style={{
                    fontSize: 18,
                  }}
                >
                  {params?.isChallenge ? "Challenge Setup" : "Program Setup"}
                </MText>
                {params?.isChallenge && (
                  <>
                    <MText style={{ ...styles.label, marginBottom: 10 }}>
                      Invites
                    </MText>

                    <>
                      <MSelect
                        mode="outlined"
                        style={{
                          height: 20,
                        }}
                        value={startData?.invites}
                        setValue={(value) => {
                          onHandleChange("invites", value);
                          const selectedParticipant = participant?.find((ele) =>
                            ele?.invite_auth === value?.startsWith(",")
                              ? value?.slice(1)
                              : value?.endsWith(",")
                              ? value?.slice(0, -1)
                              : value
                          );
                          if (
                            startData?.participants?.includes(
                              selectedParticipant?.participant_auth
                            )
                          ) {
                            onHandleChange(
                              "participants",
                              startData?.participants?.filter(
                                (ele) =>
                                  ele !== selectedParticipant?.participant_auth
                              )
                            );
                          } else if (selectedParticipant?.participants) {
                            onHandleChange(
                              "participants",
                              startData?.participants?.concat(
                                selectedParticipant?.participant_auth
                              )
                            );
                          }
                        }}
                        list={
                          participant?.length > 0
                            ? participant?.map((item) => ({
                                label: item?.name + " " + item?.surname,
                                value: item?.invite_auth,
                              }))
                            : []
                        }
                        placeholder={"Select"}
                        multiSelect
                        // required={required}
                      />
                      <MView
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox.Android
                          theme={{
                            colors: { accent: theme?.colors.primary },
                          }}
                          status={selectAll ? "checked" : "unchecked"}
                          onPress={() => {
                            setSelectAll(!selectAll);
                            setStartData((prev) => ({
                              ...prev,
                              invites: selectAll
                                ? ""
                                : participant
                                    ?.map((item) => item?.invite_auth)
                                    .join(","),
                            }));
                          }}
                        />
                        <MText>{t("challenges.select_all")}</MText>
                      </MView>
                    </>
                  </>
                )}

                <MText style={styles.label}>
                  {params?.isChallenge ? "Challenge Start" : "Program Start"}
                </MText>
                <MDatePicker
                  value={startData?.challenge_start}
                  format="YYYY-MM-DD"
                  mode="outlined"
                  setDate={(date) => {
                    onHandleChange("challenge_start", date);
                  }}
                />
                <MText style={styles.label}>
                  {" "}
                  {params?.isChallenge ? "Challenge End" : "Program End"}
                </MText>

                <MDatePicker
                  value={startData?.challenge_end}
                  format="YYYY-MM-DD"
                  mode="outlined"
                  disabled
                  setDate={(date) => {
                    onHandleChange("challenge_end", date);
                  }}
                />
                {params?.isChallenge && (
                  <>
                    <MText style={styles.label}>What are we playing for?</MText>

                    <MInput
                      value={startData?.challenge_stakes}
                      onChangeText={(text) => {
                        onHandleChange("challenge_stakes", text);
                      }}
                      mode="outlined"
                      placeholder="Type here..."
                      style={{
                        backgroundColor: "white",
                        marginTop: 10,
                        height: 50,
                      }}
                    />
                  </>
                )}
              </MView>
            )}
            <MButton
              mode="contained"
              style={styles.startChallengeBtn}
              disabled={startChallengeLoading}
              onPress={() => {
                if (!isStarted) {
                  setIsStarted(true);
                  return;
                }
                if (params?.challenge?.enable_device_sync === "1") {
                  toggleHealthModal();
                  return;
                }
                onStartChallenge();
              }}
            >
              {!params?.isChallenge
                ? "+START THE PROGRAM"
                : "+START THE CHALLENGE"}
              {"  "}
              {startChallengeLoading && (
                <ActivityIndicator size={"small"} style={{ marginLeft: 0 }} />
              )}
            </MButton>
          </Card>

          <HTMLView
            value={params?.challenge?.content ?? ""}
            renderNode={renderNode}
            style={{
              marginTop: 20,
            }}
          />
          {/* <RenderHtml
            contentWidth={width}
            source={{
              html: params?.challenge?.content || "",
            }}
          /> */}
        </MView>
      ),
      1: (
        <MView onLayout={handleLayout}>
          <MText style={styles.title}>{challenge?.description}</MText>
          <Card
            style={{
              ...styles.infoCard,
              width: "88%",
              marginVertical: 12,
            }}
          >
            <HTMLView
              value={challenge?.content ?? ""}
              renderNode={renderNode}
            />
          </Card>
          <Card
            style={{
              ...styles.infoCard,
              width: "88%",
            }}
          >
            <MText style={{ fontWeight: "bold" }}>
              What are we playing for:
            </MText>
            <MText>{challenge?.challenge_stakes || "N/A"}</MText>
          </Card>
          {Object.values(challenge?.chapters ?? {}).map((item, index) => {
            const isDisable =
              item?.announce === "00:00:00"
                ? false
                : moment().isBefore(
                    moment(challenge?.challenge_start).add(
                      "days",
                      +item?.announce?.split(" ")[0]
                    )
                  );

            return (
              <MView
                key={index}
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  opacity: isDisable ? 0.6 : 1,
                }}
              >
                <Image
                  source={{
                    uri: `${WEB_URL}/${item.poster}`,
                  }}
                  style={{
                    height: "100%",
                    width: "30%",
                  }}
                  resizeMode="contain"
                />
                <MCard
                  onPress={() => {
                    if (isDisable) return;
                    setSelectedChapter({
                      instance: item?.challenge_chapter_auth,
                      index,
                    });
                    setChapterDetails({});
                    setStep(2);
                  }}
                  style={styles.cardContainer}
                  title={
                    <MText>
                      {item?.name || ""}
                      <MText style={styles.subTxt}>
                        {" "}
                        {item?.announce === "00:00:00"
                          ? moment(challenge?.challenge_start).format("LL")
                          : moment(challenge?.challenge_start)
                              .add(
                                parseInt(item?.announce?.split(" ")[0]),
                                "days"
                              )
                              .format("LL")}
                      </MText>
                    </MText>
                  }
                  body={<MText>{item?.description || ""}</MText>}
                />
              </MView>
            );
          })}
        </MView>
      ),
      2: (
        <MView>
          <Stepper />
          {chapterLoading ? (
            <MView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.SECONDARY} />
            </MView>
          ) : (
            <>
              <MView
                style={{
                  width: "88%",
                }}
              >
                <MText style={styles.title}>{chapterDetails?.name}</MText>
                <MText style={styles.challengeDate}>
                  {chapterDetails?.announce === "00:00:00"
                    ? moment(challenge?.challenge_start).format("LL")
                    : moment(challenge?.challenge_start)
                        .add(
                          parseInt(chapterDetails?.announce?.split(" ")[0]),
                          "days"
                        )
                        .format("LL")}
                  {chapterDetails?.name?.includes("Week") &&
                    ` - ${moment(challenge?.challenge_start)
                      .add(
                        parseInt(chapterDetails?.announce?.split(" ")[0]),
                        "days"
                      )
                      .add(6, "days")
                      .format("LL")}`}
                </MText>
                <MText>
                  {chapterDetails?.description || ""} {"\n"}
                </MText>

                <HTMLView
                  value={chapterDetails?.content ?? ""}
                  renderNode={renderNode}
                />
              </MView>
              <MTouchable style={styles.goToTaskBtn} onPress={() => setStep(3)}>
                <MText style={styles.goToTaskTxt}>
                  {t("challenges.go_earn_tasks")}
                </MText>
              </MTouchable>
            </>
          )}
        </MView>
      ),
      3: (
        <MView>
          {chapterLoading ? (
            <MView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.SECONDARY} />
            </MView>
          ) : (
            <>
              <Stepper />
              <MText style={styles.title}>
                {chapterDetails?.name} Challenge Task
              </MText>
              <MText style={styles.challengeDate}>
                {chapterDetails?.announce === "00:00:00"
                  ? moment(challenge?.challenge_start).format("LL")
                  : moment(challenge?.challenge_start)
                      .add(
                        parseInt(chapterDetails?.announce?.split(" ")[0]),
                        "days"
                      )
                      .format("LL")}
              </MText>

              {Object.values(chapterDetails?.tasks ?? {})
                .filter((ele) => ele.name)
                .map((item, index) => {
                  const taskAmount = item?.data?.reduce((current, item) => {
                    return current + +item?.task_amount;
                  }, 0);
                  const progressValue = taskAmount / +item?.task_threshold;
                  return (
                    <MCard
                      key={index}
                      style={styles.taskCard}
                      onPress={() => {
                        if (item?.task_type === "wall") {
                          setStep(4);
                        } else {
                          setModalData(item);
                          setIsModal(true);
                          setTrackValue(0);
                          setIsSwitch(false);
                          setImage(null);
                          setCaption("");
                        }
                      }}
                      title={
                        <MView style={styles.taskSubContainer}>
                          <MText style={styles.font_500}>{item?.name}</MText>
                          {taskAmount >= +item?.task_threshold && (
                            <MIcon
                              source="check-bold"
                              color={COLORS.PRIMARY}
                              size={16}
                            />
                          )}
                        </MView>
                      }
                      body={
                        <MView
                          style={{
                            maxWidth:
                              Dimensions.get("screen").width -
                              Dimensions.get("screen").width * 0.3,
                          }}
                        >
                          <MText>{item?.description}</MText>
                          <ProgressBar
                            progress={progressValue}
                            color={COLORS.PRIMARY}
                            style={{ marginTop: 10, minWidth: "100%" }}
                          />
                          <MView style={styles.awardBtnContainer}>
                            {taskAmount >= +item?.task_threshold ? (
                              <MView style={styles.taskAwardBtn}>
                                <MText style={styles.font_500}>
                                  {item?.task_points ?? 0}{" "}
                                  <MIcon source="star" /> Awarded
                                </MText>
                              </MView>
                            ) : (
                              <MView style={styles.unAwardedBtn}>
                                <MText style={styles.font_500}>
                                  {item?.task_points ?? 0}{" "}
                                  <MIcon source="star" />{" "}
                                </MText>
                              </MView>
                            )}
                            <MText>
                              {taskAmount}/{+item?.task_threshold}
                            </MText>
                          </MView>
                        </MView>
                      }
                    />
                  );
                })}
            </>
          )}
          {/* <MCard
            style={styles.taskCard}
            title={
              <MView style={styles.taskSubContainer}>
                <MText style={styles.font_500}>Share Memories </MText>
                <MIcon source="check-bold" color="#3face7" size={16} />
              </MView>
            }
            body={
              <MView>
                <MText>
                  Share a cherished childhood photo or memory with your family
                  members. Reminisce about the good times you've shared and take
                  this opportunity to strengthen your bond through shared
                  experiences.
                </MText>
                <MView
                  style={{ ...styles.taskDivider, backgroundColor: "#CACACA" }}
                />
                <MView style={styles.awardBtnContainer}>
                  <MView style={styles.unAwardedBtn}>
                    <MText style={styles.font_500}>
                      100 <MIcon source="star" />
                    </MText>
                  </MView>
                  <MText>0/1</MText>
                </MView>
              </MView>
            }
          /> */}
        </MView>
      ),
      4:
        stepperChallenge?.length > 0 ? (
          <MView>
            <Stepper />
            <MText
              style={{
                marginBottom: 2,
                marginTop: 12,
                fontSize: 15,
              }}
            >
              {chapterDetails?.comment_prompt || challenge?.comment_prompt}
            </MText>
            {moment(params?.challenge?.challenge_end)?.isAfter() ? (
              <>
                <MView
                  style={{
                    backgroundColor: COLORS.WHITE,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    marginTop: 20,
                  }}
                >
                  <MView
                    style={{
                      height: 52,
                      width: 52,
                      borderRadius: 26,
                      backgroundColor: COLORS.PRIMARY,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MText
                      style={{
                        color: COLORS.WHITE,
                      }}
                    >
                      {"A"}
                    </MText>
                  </MView>
                  <MText
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Post a Comment
                  </MText>
                </MView>
                <TextInput
                  multiline
                  placeholder="What do you want to say?"
                  value={message}
                  onChangeText={setMessage}
                  style={{
                    minHeight: 100,
                    ...(Platform.OS === "android" && {
                      textAlignVertical: "top",
                    }),
                    fontSize: 18,
                    width: "80%",
                    color: "#000",
                    marginTop: 10,
                  }}
                />
                <MButton
                  style={{
                    width: "80%",
                    marginTop: 10,
                  }}
                  onPress={commentLoading ? null : onAddComment}
                  loading={commentLoading}
                >
                  Comment
                </MButton>
              </>
            ) : null}

            {commentsLoading ? (
              <ActivityIndicator
                style={{
                  marginTop: 10,
                }}
              />
            ) : comments?.length > 0 ? (
              comments?.map((message, index) => {
                const repliedComments = message?.comments
                  ? Array.isArray(message?.comments)
                    ? message?.comments
                    : Object.values(message?.comments || {})
                  : [];
                const profileImage = message?.person_image
                  ? `${WEB_URL}/${message?.person_image}`
                  : null;
                return (
                  <CommentCard
                    key={index}
                    repliedComments={repliedComments}
                    time={message?.created}
                    comment={message?.comment}
                    title={
                      message?.name
                        ? message?.name
                        : "N/A" + " " + message?.surname
                        ? message?.surname
                        : ""
                    }
                    like={message?.reactions?.like?.num || 0}
                    image={profileImage}
                    commentAuth={message?.comment_auth}
                    isEditable={
                      layoutRef?.current?.profile?.id === message?.person_id
                    }
                    userId={layoutRef?.current?.profile?.id}
                    replyAuth={message?.reply_auth}
                    onReplyComment={onReplyComment}
                    onLikeComment={onLikeComment}
                    onEditComment={onEditComment}
                  />
                );
              })
            ) : (
              <MText
                style={{
                  textAlign: "center",
                  marginVertical: 10,
                }}
              >
                {t("challenges.no_comments")}
              </MText>
            )}
          </MView>
        ) : (
          <MText style={styles.title}>Messaging</MText>
        ),
      5: (
        <MView>
          <MText style={styles.title}>Photo Gallery</MText>
          {photoLoading ? (
            <MView
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={COLORS.SECONDARY} />
            </MView>
          ) : photoGallery?.length > 0 ? (
            photoGallery?.map((item, index) => (
              <MView style={styles.photoGalleryContainer} key={index}>
                <MView style={styles.photoContainer}>
                  <Image
                    source={{
                      uri: item?.photo,
                    }}
                    style={styles.profileCover}
                    resizeMode="contain"
                  />
                  <MView style={styles.profileContainer}>
                    <Image
                      style={styles.profile}
                      source={{
                        uri: item?.profile_img,
                      }}
                      resizeMode="cover"
                    />
                    <MView>
                      <MText
                        style={{
                          fontWeight: "bold",
                          maxWidth: "88%",
                        }}
                      >
                        {item?.caption || "N/A"}
                      </MText>
                      <MText
                        style={{
                          marginVertical: 8,
                        }}
                      >
                        {item?.name + " " + item?.surname || "N/A"}
                      </MText>
                      <MText style={styles.photoGalleryCreatedAt}>
                        - {moment(item?.created).format("LLL")}
                      </MText>
                    </MView>
                  </MView>
                </MView>
              </MView>
            ))
          ) : (
            <MText
              style={{
                textAlign: "center",
              }}
            >
              No Photos
            </MText>
          )}
        </MView>
      ),
      6: (
        <MView>
          <Card style={styles.infoCard}>
            <MText style={{ fontWeight: "bold" }}>
              What are we playing for:
            </MText>
            <MText>{challenge?.challenge_stakes || "N/A"}</MText>
          </Card>
          <MText style={styles.pointTxt}>
            Points{"  "}
            <MText style={styles.leaderTxt}>LEADERS</MText>
          </MText>
          <MView style={styles.tableHeader}>
            <MView style={styles.tableHead}>
              <MText style={styles.colLabel}>Participant</MText>
              <MText style={styles.colValue}>Points</MText>
              <MText style={styles.colValue}>Ranks</MText>
              {/* </MView> */}
            </MView>
            {leaderBoard?.points
              ?.sort((a, b) => +b?.total_points - +a?.total_points)
              .map((item, index) => (
                <TaskTableRow
                  key={index}
                  index={index}
                  name={item?.name + " " + item?.surname}
                  task={item?.total_points}
                />
              ))}
          </MView>
        </MView>
      ),
    };
    return challengesStep[step] || <></>;
  };
  const getPotentialParticipants = async (auth) => {
    try {
      const response = await get_potential_participants(
        auth.data.profile_auth,
        auth.cookie
      );

      setParticipant(response?.data);
    } catch (error) {
      console.log("🚀 ~ getPotientialParticipants ~ error:", error);
    }
  };
  const getAuth = async () => {
    try {
      const auth = await getAuthData(setAuth);
      setAuth(auth);
      if (auth) getPotentialParticipants(auth);
    } catch (error) {}
  };
  const sortChapters = (chapters) => {
    const sortedChapters = Object.values(chapters ?? {})?.sort((a, b) => {
      if (a.date === "00:00:00") return -1;
      if (b.date === "00:00:00") return 1;

      const dateA = moment(a?.challenge_start).add(
        "days",
        a?.announce?.split(" ")[0]
      );
      const dateB = moment(b?.challenge_start).add(
        "days",
        b?.announce?.split(" ")[0]
      );
      if (dateA.isBefore(dateB)) {
        return -1;
      } else if (dateA.isAfter(dateB)) {
        return 1;
      } else {
        return 0;
      }
    });
    return sortedChapters;
  };
  const getChallengeDetails = async (instance = null) => {
    try {
      setLoading(true);
      const result = await challenge_get(
        auth.data.profile_auth,
        auth.cookie,
        params?.challengeInstanceAuth || instance
      );
      if (result?.data) {
        const sortedChapters = sortChapters(result?.data?.chapters ?? {});
        const newChapters = {};
        sortedChapters?.forEach((item, index) => {
          newChapters[item.challenge_chapter_auth] = {
            ...item,
          };
        });
        setChallenge({
          ...result.data,
          chapters: newChapters,
        });
      }
    } catch (error) {
      console.log("🚀 ~ getChallengeDetails ~ error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getChallengeLeaderBoard = async () => {
    try {
      const response = await get_challenge_leaderboard(
        auth.data.profile_auth,
        auth.cookie,
        params?.challengeInstanceAuth
      );
      setLeaderBoard(response?.data);
    } catch (error) {
      console.log("🚀 ~ getChallengeLeaderBoard ~ error:", error);
    }
  };
  const getChapterDetails = async (instance = null) => {
    try {
      setChapterLoading(true);
      const response = await get_chapter_detail(
        auth?.data.profile_auth,
        auth?.cookie,
        params?.challengeInstanceAuth,
        selectedChapter?.instance || instance
      );
      setChapterDetails(response?.data || {});
    } catch (error) {
      console.log("🚀 ~ getChapterDetails ~ error:", error);
    } finally {
      setChapterLoading(false);
    }
  };
  const getChapterComments = async (instance = null) => {
    try {
      setCommentsLoading(true);
      const response = await get_chapter_comments(
        auth?.data.profile_auth,
        auth?.cookie,
        params?.challengeInstanceAuth,
        selectedChapter?.instance || instance
      );
      setComments(response?.data || []);
    } catch (error) {
      console.log("🚀 ~ getChapterDetails ~ error:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const getPhotoGallery = async () => {
    try {
      setPhotoLoading(true);

      const response = await get_photo_gallery(
        auth?.data.profile_auth,
        auth?.cookie,
        params?.challengeInstanceAuth
      );
      const data = Object.values(response?.data ?? {});
      setPhotoGallery(data || []);
    } catch (error) {
      console.log("🚀 ~ getChapterDetails ~ error:", error);
    } finally {
      setPhotoLoading(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (selectedChapter?.instance) {
        getChapterDetails(selectedChapter?.instance);
        if (params?.isChallenge) {
          getChapterComments(selectedChapter?.instance);
        }
      } else {
        getChallengeDetails();
        if (params?.isChallenge) {
          getChallengeLeaderBoard();
        }
      }
      getPhotoGallery();
      initializeAndSyncHealthData();
      setRefreshing(false);
    }, 1500);
  };

  function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == "oembed") {
      const a = node.attribs;
      // get video id
      const videoId = a?.url?.split("v=")[1]?.split("&")[0] || "";
      return (
        <MView
          key={index}
          style={{
            width: Dimensions.get("window").width * 0.8,
            aspectRatio: 16 / 9,
            ...(Platform.OS === "android"
              ? {
                  height: 200,
                }
              : {
                  height: "auto",
                }),
            borderRadius: 10,
            marginBottom: Platform.OS === "ios" ? 10 : 0,
          }}
        >
          {videoId && (
            <YoutubePlayer
              height={270}
              play={false}
              width={Dimensions.get("window").width * 0.8 - 10}
              videoId={videoId}
            />
          )}
        </MView>
      );
    } else if (node?.name === "li") {
      return (
        <MView style={styles.bulletPointContainer}>
          {/* Create Custom list bullet item */}

          <MView style={styles.bulletPoint} />

          <MText>{defaultRenderer(node.children, parent)}</MText>
        </MView>
      );
    } else if (node?.name === "ul") {
      return (
        <MView style={{ marginBottom: 10 }}>
          {defaultRenderer(node.children, parent)}
        </MView>
      );
    }
  }
  const layoutRef = useRef(null);
  useEffect(() => {
    if (!auth) {
      getAuth();
    }
    if (!params?.isActive) {
      const challengeLength =
        params?.challenge?.chapters_meta?.length?.split(" ")?.[0] ?? "";
      if (challengeLength && challengeLength !== "-") {
        const endDate = moment().add(challengeLength, "days");
        onHandleChange("challenge_end", endDate);
      }
    }
  }, []);
  useEffect(() => {
    if (selectedChapter?.instance) {
      getChapterDetails();
      if (params?.isChallenge) {
        getChapterComments();
      }
    } else if (stepperChallenge?.length > 0 && auth) {
      getChapterDetails(stepperChallenge?.[0]?.challenge_chapter_auth);
      if (params?.isChallenge) {
        getChapterComments(stepperChallenge?.[0]?.challenge_chapter_auth);
      }
    } else {
      setChapterDetails(null);
      if (params?.isChallenge) {
        getChapterComments(null);
      }
    }
  }, [selectedChapter, stepperChallenge, auth]);
  useEffect(() => {
    if (auth && params?.challengeInstanceAuth) {
      getChallengeDetails();
      getPhotoGallery();
      if (params?.isChallenge) {
        getChallengeLeaderBoard();
      }
      if (params?.selectedChapter && params?.selectedChapter?.instance) {
        setSelectedChapter({
          ...selectedChapter,
        });
      } else if (params?.isActive) {
        if (moment(params?.challenge?.challenge_end).isAfter()) {
          setStep(1);
        } else {
          setStep(4);
        }
      }
    }
  }, [params, auth]);
  const scrollRef = useRef(null);
  const selectedTaskValue = useMemo(() => {
    return modalData?.data?.reduce((current, item) => {
      return current + +item?.task_amount;
    }, 0);
  }, [modalData]);
  return (
    <MLayout isProfileHeader ref={layoutRef} statusBarColor={COLORS.WHITE}>
      <MView style={{ flex: 1, padding: 0 }}>
        {params?.banner && (
          <Image source={{ uri: params?.banner }} style={styles.image} />
        )}

        {!loading && params?.isActive && (
          <ChallengeSidebar
            step={step}
            setStep={setStep}
            disabledFields={
              moment(params?.challenge?.challenge_end)?.isAfter()
                ? []
                : ["Chapters", "Content", "Tasks"]
            }
            isActiveChallenge={params?.isActive ?? false}
            isChallenge={params?.isChallenge ?? true}
            isCommentDisabled={params?.challenge?.enable_comments === "0"}
            isPhotoGalleryDisabled={params?.challenge?.enable_photos === "0"}
          />
        )}
        <MTouchable
          onPress={() => {
            navigation.navigate(ROUTES.CHALLENGES_STACK, {
              screen: ROUTES.CHALLENGES,
            });
          }}
          style={{
            backgroundColor: "transparent",
            marginLeft: 20,
            marginTop: 8,
          }}
        >
          <MIcon source="arrow-left" size={30} color={COLORS.BLACK} />
        </MTouchable>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={
            loading
              ? {
                  flex: 1,
                }
              : {}
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          automaticallyAdjustKeyboardInsets={true}
          ref={scrollRef}
        >
          {loading ? (
            <MView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.SECONDARY} />
            </MView>
          ) : (
            <>
              {renderSteps()}
              <MView style={{ height: 30 }} />
            </>
          )}
        </ScrollView>
      </MView>
      <MModal
        onDismiss={() => {
          setIsModal(false);
        }}
        visible={isModal}
        contentContainerStyle={{
          width: "90%",
          minHeight: 200,
          borderRadius: 20,
          alignSelf: "center",
          backgroundColor: "#fff",
          padding: 20,
        }}
      >
        <MText
          style={{
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {modalData?.name ?? ""}
        </MText>
        <MText>{modalData?.description}</MText>
        <MView
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            marginTop: 10,
            borderRadius: 5,
            flexDirection:
              modalData?.task_type === "boolean" ? "row" : "column",
            width: "100%",
          }}
        >
          <MText
            style={{
              width: "80%",
            }}
          >
            Were you able to complete the{" "}
            <MText style={{ fontWeight: "bold" }}>
              {modalData?.name ?? "N/A"}
            </MText>{" "}
            challenge?
          </MText>
          {modalData?.task_type === "boolean" ? (
            <MSwitch value={isSwitch} onValueChange={setIsSwitch} />
          ) : modalData?.task_type === "value" ? (
            <MView
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {modalData?.task_direct_entry !== "0" && (
                <Slider
                  style={{ width: "90%", height: 40 }}
                  minimumValue={0}
                  maximumValue={
                    isNaN(+selectedTaskValue)
                      ? 200
                      : modalData?.task_threshold - +selectedTaskValue
                  }
                  minimumTrackTintColor={COLORS.PRIMARY}
                  maximumTrackTintColor={COLORS.GREY}
                  onSlidingComplete={(value) => {
                    setTrackValue(value.toFixed(0));
                  }}
                  thumbTintColor={COLORS.LIGHTER_GREY}
                  value={+trackValue}
                />
              )}
              {modalData?.task_direct_entry !== "0" && (
                <MText>{trackValue}</MText>
              )}
            </MView>
          ) : modalData?.task_type === "photo" ? (
            <>
              <MText style={{ marginTop: 12 }}>Add a Caption</MText>
              <MInput
                value={caption}
                onChangeText={setCaption}
                mode="outlined"
                placeholder="Type here..."
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  height: 50,
                }}
              />
              {image && (
                <Image
                  resizeMode="contain"
                  style={styles.photo}
                  source={
                    image ? { uri: image } : require("../assets/profile.jpg")
                  }
                />
              )}

              <MButton onPress={pickImage} style={styles.pickPhotoBtn}>
                Select A Photo
              </MButton>
            </>
          ) : null}
        </MView>
        {modalData?.task_direct_entry === "0" && (
          <MView style={styles.taskIndirectlyComplete}>
            <MText>
              <MText style={{ fontWeight: "bold" }}>
                {t("challenges.task_indirectly_complete")}
              </MText>
              , {t("challenges.need_to_follow_instruction")}
            </MText>
          </MView>
        )}
        {modalData?.task_direct_entry !== "0" && (
          <MButton
            style={{
              marginTop: 12,
              backgroundColor: COLORS.PRIMARY,
            }}
            onPress={submitTaskLoading ? undefined : onSubmitTaskData}
            loading={submitTaskLoading}
            disabled={modalData?.task_direct_entry === "0"}
          >
            Log {modalData?.name}
          </MButton>
        )}
      </MModal>
      <HealthDataSyncingModal
        visible={healthModal}
        onContinue={onStartChallenge}
        onDismiss={toggleHealthModal}
      />
    </MLayout>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: 10,
  },
  startChallengeBtn: {
    width: "85%",
    backgroundColor: COLORS.PRIMARY,
    marginTop: 20,
    alignSelf: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 2,
    width: "56%",
  },
  subTxt: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    paddingLeft: 20,
  },
  font_500: {
    fontWeight: "500",
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 2,
    width: "88%",
    marginVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
  },
  taskSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  taskDivider: {
    width: Dimensions.get("window").width * 0.7,
    height: 5,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 10,
  },
  taskAwardBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 5,
  },
  awardBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  unAwardedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#767676",
    borderRadius: 5,
    marginTop: 10,
  },
  pointTxt: {
    fontSize: 22,
    fontWeight: "500",
    marginTop: 12,
  },
  leaderTxt: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.PRIMARY,
  },
  tableHeader: {
    borderTopWidth: 3,
    borderTopColor: COLORS.PRIMARY,
    width: "88%",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    marginTop: 12,
  },
  tableHead: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "#F1F1F1",
    width: "100%",
  },
  colLabel: {
    fontWeight: "bold",
    width: "50%",
  },
  colValue: {
    fontWeight: "bold",
    width: "25%",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  rowVal: {
    width: "25%",
    textAlign: "center",
  },
  image: {
    height: "auto",
    width: "100%",
    aspectRatio: 16 / 1.93,
    resizeMode: "contain",
  },
  loadingContainer: {
    minHeight: "100%",
    justifyContent: "center",
    alignSelf: "center",
    flex: 1,
  },
  stepper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 10,
  },
  backward: {
    backgroundColor: COLORS.PRIMARY,
    width: Platform.OS === "android" ? "47%" : "49%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 5,
  },
  rotateIcon: {
    transform: [{ rotate: "180deg" }],
  },
  stepperTxt: {
    color: "#fff",
    fontSize: 12,
  },
  forward: {
    backgroundColor: COLORS.PRIMARY,
    width: "49%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 20,
  },
  bulletPoint: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#000",
    marginTop: 6,
    marginLeft: 16,
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  photoGalleryContainer: {
    maxWidth:
      Dimensions.get("screen").width - Dimensions.get("screen").width * 0.27,
    marginVertical: 10,
  },
  photoContainer: {
    paddingVertical: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.GREY,
  },
  profileCover: {
    width: "90%",
    height: 250,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  profileContainer: {
    borderTopWidth: 2,
    borderTopColor: COLORS.GREY,
    backgroundColor: COLORS.GREY_BG,
    flexDirection: "row",
    padding: 20,
    marginTop: 12,
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.DARK_GREY,
    marginRight: 10,
  },
  photoGalleryCreatedAt: {
    fontStyle: "italic",
    color: COLORS.GREY,
  },
  goToTaskBtn: {
    backgroundColor: COLORS.PRIMARY,
    width: "98%",
    justifyContent: "center",
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 20,
  },
  goToTaskTxt: {
    color: COLORS.WHITE,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  infoCard: {
    padding: 10,
    backgroundColor: COLORS.WHITE,
  },
  photo: {
    height: 150,
    width: "auto",
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  pickPhotoBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 10,
  },
  taskIndirectlyComplete: {
    backgroundColor: COLORS.LIGHT_RED_BG,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  challengeDate: {
    fontSize: 14,
    fontWeight: "semibold",
    marginTop: 4,
    marginBottom: 6,
  },
});
export default ChallengeScreen;
