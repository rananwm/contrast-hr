import React, { useMemo, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { MIcon, MText, MTouchable, MView } from "../MComponents";
import { COLORS } from "../../constants";

const ChallengeSidebar = ({
  step,
  setStep,
  isActiveChallenge,
  isChallenge,
  disabledFields = [],
  isCommentDisabled = false,
  isPhotoGalleryDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const sidebar = useMemo(() => {
    let data = [
      {
        icon: "format-list-bulleted",
        transform: [{ rotate: "180deg" }],
        title: "Chapters",
      },
      {
        icon: "information",
        title: "Content",
      },
      {
        icon: "checkbox-marked-circle-outline",
        title: "Tasks",
      },
      {
        icon: "chat-processing",
        title: "Comment Wall",
      },
      {
        icon: "camera-outline",
        title: "Photo Gallery",
      },
      {
        icon: "equalizer",
        title: "Leaderboard",
      },
    ];
    return isChallenge ? data : data.slice(0, 3);
  }, [isChallenge]);

  return (
    <MView style={styles.container}>
      <MTouchable
        onPress={toggleOpen}
        style={{
          transform: [{ rotate: isOpen ? "0deg" : "180deg" }],
          width: "100%",
          alignSelf: "flex-end",
        }}
      >
        <MIcon source="arrow-right-thin" size={30} color={COLORS.WHITE} />
      </MTouchable>
      {sidebar.map((item, index) => {
        const isActive = index + 1 === step;
        const isDisabled =
          item?.title === "Comment Wall"
            ? isCommentDisabled
            : item?.title === "Photo Gallery"
            ? isPhotoGalleryDisabled
            : disabledFields.includes(item?.title)
            ? true
            : false;
        return (
          <MView key={index} style={styles.iconContainer}>
            <MTouchable
              disabled={isDisabled}
              style={{
                transform: item?.transform,
                flexDirection: item?.transform ? "row-reverse" : "row",
                gap: 6,
                alignItems: "center",
              }}
              onPress={() => {
                if (step === index + 1) {
                  if (!isActiveChallenge) {
                    setStep(0);
                    return;
                  }
                  return;
                }
                setStep(index + 1);
              }}
            >
              {isOpen && (
                <MText
                  style={{ ...styles.iconTitle, transform: item?.transform }}
                >
                  {item.title}
                </MText>
              )}
              <MIcon
                source={item.icon}
                size={40}
                color={
                  isDisabled
                    ? COLORS.GREY
                    : isActive
                    ? COLORS.SECONDARY
                    : "#fff"
                }
              />
            </MTouchable>
          </MView>
        );
      })}
    </MView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: Dimensions.get("window").height / 5.6,
    padding: 10,
    backgroundColor: COLORS.PRIMARY,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    zIndex: 1,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginVertical: 1,
  },
  iconTitle: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChallengeSidebar;
