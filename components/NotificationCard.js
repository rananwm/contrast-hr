import React from "react";
import { MCard, MText, MView } from "./MComponents";
import moment from "moment";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { COLORS } from "../constants";

export const NotificationCard = (props) => {
  const [visible, setVisible] = React.useState(true);

  const {
    notification,
    action,
    style,
    is_archived,
    toggle = false,
    onChangeToggle = () => {},
    auth = null,
    toggleStyle,
  } = props;
  const key = "notification_" + notification.id;
  const title = notification.name;
  const subtitle = notification.description;
  const description = notification.description_full;
  const [isActive, setIsActive] = React.useState(false);

  return visible ? (
    <MCard
      subtitle={
        <MView
          style={{
            maxWidth:
              Dimensions.get("screen").width -
              Dimensions.get("screen").width * 0.3,
          }}
        >
          <RenderHTML
            source={{ html: subtitle }}
            contentWidth={
              Dimensions.get("screen").width -
              Dimensions.get("screen").width * 0.3
            }
          />
        </MView>
      }
      key={key}
      style={style}
      title={title}
      body={isActive ? <RenderHTML source={{ html: description }} /> : null}
      icon={is_archived ? "bell" : "bell-ring"}
      cta={isActive ? "Hide" : "More"}
      toggleStyle={toggleStyle}
      ctaText={
        isActive
          ? moment(notification?.created).format("MMMM DD, YYYY @ h:mm A") +
            " " +
            auth?.name +
            " " +
            auth?.surname
          : ""
      }
      toggle={toggle}
      onChangeToggle={onChangeToggle}
      isToggleCta={!is_archived}
      titleStyle={{
        color: "#000",
        fontWeight: "bold",
      }}
      onPress={() => {
        // if (!is_archived) {
        setIsActive(!isActive);
        // setVisible(false);
        // }
      }}
      ctaStyle={{
        backgroundColor: COLORS.PRIMARY,
        width: 60,
        alignSelf: "flex-end",
        marginTop: 10,
        borderRadius: 5,
        marginHorizontal: 14,
      }}
      ctaTextStyle={{
        fontSize: 10,
        padding: 0,
        color: "#fff",
      }}
    ></MCard>
  ) : null;
};
