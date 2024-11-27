import React from "react";
import { MText, MView } from "./MComponents";
import { Image, StyleSheet } from "react-native";

const CareCard = ({
  title = "",
  subtitle = "",
  description = "",
  bulletPoint = [],
  image = "",
}) => {
  return (
    <MView style={styles.cardContainer}>
      <MText style={styles.careTxt}>{title}</MText>
      <MText style={styles.subtitle}>{subtitle}</MText>
      <MText style={styles.mt_10}>{description}</MText>
      <Image source={image} style={styles.perkImage} />
      <MView style={styles.bulletContainer}>
        {/* first half of the list */}
        <MView
          style={
            {
              // flex: 1,
            }
          }
        >
          {bulletPoint
            .slice(0, Math.floor(bulletPoint.length / 2 + 1))
            .map((item, index) => (
              <MView key={index} style={styles.listContainer}>
                <MView style={styles.bulletPoint} />
                <MText
                  style={{
                    fontSize: 12,
                    maxWidth: "65%",
                  }}
                >
                  {item}
                </MText>
              </MView>
            ))}
        </MView>
        {/* second half of the list */}
        <MView>
          {bulletPoint
            .slice(Math.floor(bulletPoint.length / 2 + 1), bulletPoint.length)
            .map((item, index) => (
              <MView key={index} style={styles.listContainer}>
                <MView style={styles.bulletPoint} />
                <MText
                  style={{
                    fontSize: 12,
                    maxWidth: "65%",
                  }}
                >
                  {item}
                </MText>
              </MView>
            ))}
        </MView>
      </MView>
    </MView>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  careTxt: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  mt_10: {
    marginTop: 10,
  },
  perkImage: {
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginVertical: 20,
  },
  bulletContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
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
});
export default CareCard;
