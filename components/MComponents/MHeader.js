import React from "react";
import {
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import MView from "./MView";
import MIconButton from "./MIconButton";
import MText from "./MText";
import MIcon from "./MIcon";
import { COLORS } from "../../constants";

const MHeader = ({
  title,
  leftIcon,
  rightIcon,
  leftIconProps = {},
  rightIconProps = {},
  leftIconOnPress,
  rightIconOnPress,
  renderRightIcon,
  renderLeftIcon,
  containerStyle = {},
}) => {
  return (
    <MView
      style={{
        ...styles.container,
        ...containerStyle,
      }}
    >
      {renderLeftIcon ? (
        renderLeftIcon
      ) : leftIcon ? (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 5,
          }}
          onPress={leftIconOnPress}
        >
          <MIcon source={leftIcon} color="#fff" size={30} {...leftIconProps} />
          <MText style={styles.backBtn}>Back</MText>
        </TouchableOpacity>
      ) : (
        <MView style={{ width: 50 }} />
      )}

      <MText style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </MText>

      {renderRightIcon ? (
        renderRightIcon
      ) : rightIcon ? (
        <MIconButton
          icon={rightIcon}
          onPress={rightIconOnPress}
          size={30}
          {...rightIconProps}
        />
      ) : (
        <MView style={{ width: 50 }} />
      )}
    </MView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "bold" : "",
    textAlign: "center",
    lineHeight: 62,
    color: "#fff",
  },
  backBtn: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MHeader;
