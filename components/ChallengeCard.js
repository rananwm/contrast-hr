import React from "react";
import { Image, StyleSheet } from "react-native";
import { MIcon, MText, MTouchable, MView } from "./MComponents";
import { Card } from "react-native-paper";
import { COLORS } from "../constants";
import moment from "moment";

const ChallengeCard = ({ challenge, onPress, isActive = false }) => {
  return (
    <Card
      style={{
        marginVertical: 10,
        backgroundColor: COLORS.WHITE,
        position: "relative",
      }}
    >
      <Card.Content
        style={{
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
      >
        <MTouchable style={styles.cardContainer} onPress={onPress}>
          <Image
            style={styles.image}
            source={{
              uri: `https://app.myexectras.com/${challenge?.banner}`,
            }}
          />
          <MView
            style={{
              padding: 10,
            }}
          >
            <MText style={styles.title}>{challenge?.name}</MText>
            {isActive && (
              <MView style={styles.dateContainer}>
                <MText style={styles.date}>
                  {moment(challenge?.challenge_start).format("ll")}
                  {" - "}
                </MText>
                <MText style={styles.date}>
                  {moment(challenge?.challenge_end).format("ll")}
                </MText>
              </MView>
            )}
            <MText style={styles.subtitle}>{challenge?.description}</MText>
            <MView
              style={{
                position: "absolute",
                right: 5,
                bottom: -10,
              }}
            >
              <MIcon source="arrow-right-thin" size={30} />
            </MView>
          </MView>
        </MTouchable>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    backgroundColor: COLORS.WHITE,
  },
  dateContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  image: {
    height: "auto",
    width: "100%",
    aspectRatio: 16 / 1.97,
    resizeMode: "contain",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: -12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    fontWeight: "500",
  },
  date: {
    fontWeight: "bold",
  },
});

export default ChallengeCard;
