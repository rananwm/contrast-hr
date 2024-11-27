import React from "react";
import { StyleSheet } from "react-native";
import { MSwitch, MText, MView } from "../components/MComponents";
import MLayout from "../components/MLayout";

const HealthScreen = () => {
  return (
    <MLayout
      headerTitle="Apple Health"
      headerProps={{
        leftIcon: "chevron-left",
      }}
    >
      <MView style={styles.container}>
        <MView
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 10,
            flexDirection: "row",
            padding: 20,
            marginVertical: 20,
          }}
        >
          <MView
            style={{
              width: "80%",
            }}
          >
            <MText style={{ fontSize: 16 }}>
              Heart rate,steps,active energy, walking + running distance
            </MText>
            <MText
              style={{
                color: "red",
                marginTop: 10,
              }}
            >
              {" "}
              Do no turn on if you are already syncing with Fitbit
            </MText>
          </MView>
          <MSwitch />
        </MView>
        <MView
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 10,
            flexDirection: "row",
            padding: 20,
          }}
        >
          <MView
            style={{
              width: "80%",
            }}
          >
            <MText style={{ fontSize: 16 }}>
              Heart rate,steps,active energy, walking + running distance
            </MText>
            <MText
              style={{
                color: "red",
                marginTop: 10,
              }}
            >
              {" "}
              Do no turn on if you are already syncing with Fitbit
            </MText>
          </MView>
          <MSwitch />
        </MView>
      </MView>
    </MLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D1f0fc",
    flex: 1,
    padding: 24,
  },
  txt: {
    color: "#fff",
  },
});

export default HealthScreen;
