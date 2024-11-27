import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { View } from "react-native";
import MText from "./MText";
import MSwitch from "./MSwitch";
import MView from "./MView";

const LeftContent = (props) => (
  <Avatar.Icon {...props} icon="account-hard-hat" />
);

// const description = job.description.replace(/(\r\n|\n|\r)/gm, " ")
// const displayDescription = description.length > 100 ? description.substring(0, 100) + "..." : description
{
  /* <MCard key={"job_" + job.id} style={styles.job} onPress={() => {navigateJob(job.id)}}>
        <Text style={styles.jobTitle}>{job.name}</Text>
        <Text style={styles.jobDescription}>{displayDescription}</Text>
        <View>
          <MButton size="tiny" disabled="true" accessoryLeft={LocationIcon}>{job.location}</MButton>
          <MButton size="tiny" disabled="true">{job.employer}</MButton>
        </View>
        <MButton size="small" style={styles.jobInfo} disabled="True">More Information</MButton>
      </MCard> */
}

const MCard = (props) => {
  const {
    title,
    subtitle,
    body,
    isToggleCta = true,
    cta,
    metadata,
    onPress,
    image,
    icon,
    style,
    toggle,
    onChangeToggle,
    ctaText = "",
    titleStyle = {},
    toggleStyle = {},
    imageProps = {},
  } = props;
  return (
    <Card mode="elevated" onPress={onPress} style={style}>
      {typeof image !== "undefined" ? (
        <Card.Cover style={{ borderRadius: 0, height: 150 }} source={image} {...imageProps}/>
      ) : null}
      {/* {image ? <Card.Cover source={require('./../../assets/perk_images/benefit_telehealth.jpg')} /> : null } */}
      <MView></MView>
      {icon ? (
        <>
          <Card.Title
            titleNumberOfLines={2}
            titleVariant="bodyMedium"
            title={title}
            titleStyle={{ color: "#293376", ...titleStyle }}
            // subtitle={subtitle}
            subtitleNumberOfLines={4}
            subtitleStyle={{ marginTop: 5, fontSize: 12 }}
            left={() => <Avatar.Icon size={30} icon={icon} />}
            right={() => {
              return (
                <Card.Actions>
                  {isToggleCta ? (
                    <MSwitch
                      value={toggle}
                      onValueChange={onChangeToggle}
                      containerStyle={toggleStyle}
                    />
                  ) : null}
                </Card.Actions>
              );
            }}
          />
          <Card.Content>
            <MText>{subtitle}</MText>
          </Card.Content>
        </>
      ) : (
        <Card.Title titleNumberOfLines={2} title={title} subtitle={""} />
      )}
      {/* <MText style={{ marginLeft: 72, marginTop: -25 }}>{subtitle}</MText> */}
      {body && (
        <Card.Content>
          <Text>{body}</Text>
          {/* for each metadata add a small text component */}
          {metadata ? (
            <View>
              {metadata.map((e, i) => (
                <Text key={"meta_" + i} variant="bodySmall">
                  {e.label}: {e.value}
                </Text>
              ))}
            </View>
          ) : null}
        </Card.Content>
      )}
      <Card.Actions>
        {ctaText && (
          <MText
            style={{
              flex: 1,
              fontStyle: "italic",
            }}
          >
            {ctaText}
          </MText>
        )}
        {cta ? (
          <Button mode="text" style={props?.ctaStyle}>
            <MText style={props?.ctaTextStyle}>{cta}</MText>
          </Button>
        ) : null}
      </Card.Actions>

      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
    </Card>
  );
};

export default MCard;
