import React from "react";
import { MButton, MIcon, MText, MTouchable, MView } from "./MComponents";
import { Image, Platform, Pressable, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";
import { ActivityIndicator, TextInput } from "react-native-paper";
import moment from "moment";

export default function CommentCard({
  title = "",
  time = "",
  comment = "",
  repliedComments = [],
  like = 0,
  image = null,
  isEditable = null,
  userId = null,
  onReplyComment = () => {},
  onLikeComment = () => {},
  onEditComment = () => {},
  commentAuth = "",
  replyAuth = "",
}) {
  const [isReplyFieldOpen, setIsReplyFieldOpen] = React.useState(false);
  const [repliedMessage, setRepliedMessage] = React.useState("");
  const [editMessage, setEditMessage] = React.useState(comment);
  const [isEdit, setIsEdit] = React.useState(false);
  return (
    <MView
      style={{
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderRadius: 10,
        position: "relative",
      }}
    >
      {isEditable && (
        <TouchableOpacity
          hitSlop={30}
          style={{ position: "absolute", top: 14, right: 10, zIndex: 1000 }}
          onPress={() => setIsEdit(!isEdit)}
        >
          <MIcon
            source="pencil"
            style={{
              color: COLORS.PRIMARY,
            }}
            size={20}
          />
        </TouchableOpacity>
      )}
      <MView
        style={{
          flexDirection: "row",
          gap: 10,
          width: "100%",
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              height: 32,
              width: 32,
              borderRadius: 16,
            }}
            alt="Profile image"
          />
        ) : (
          <MView
            style={{
              height: 32,
              width: 32,
              borderRadius: 16,
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
              {title[0] || "A"}
            </MText>
          </MView>
        )}

        <MView style={{ width: "70%" }}>
          <MText
            style={{
              fontWeight: "bold",
            }}
          >
            {title} <MText>{moment(time).fromNow()}</MText>
          </MText>
          {isEdit ? (
            <MView style={{ marginTop: 12 }}>
              <TextInput
                placeholder="What do you want to say?"
                value={editMessage}
                onChangeText={(value) => {
                  setEditMessage(value);
                }}
                style={{
                  ...(Platform.OS === "android" && {
                    textAlignVertical: "top",
                  }),

                  width: "100%",
                  color: "#000",
                }}
              />
              <MView
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <MTouchable
                  style={{
                    height: 30,
                    paddingHorizontal: 5,
                    backgroundColor: COLORS.SECONDARY,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    width: "45%",
                  }}
                  onPress={() => {
                    setIsEdit(false);
                  }}
                >
                  <MText style={{ color: COLORS.WHITE }}>Cancel</MText>
                </MTouchable>
                <MTouchable
                  style={{
                    height: 30,
                    paddingHorizontal: 5,
                    backgroundColor: COLORS.PRIMARY,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                    width: "45%",
                  }}
                  onPress={() => {
                    if (!editMessage) {
                      alert("Please add comment");
                      return;
                    }
                    onEditComment(commentAuth, editMessage);
                  }}
                >
                  <MText style={{ color: COLORS.WHITE }}>Save</MText>
                </MTouchable>
              </MView>
            </MView>
          ) : (
            <MText>{comment || "N/A"}</MText>
          )}

          <MView
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <MText
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                backgroundColor: COLORS.PRIMARY,
                color: COLORS.WHITE,
              }}
              onPress={() => setIsReplyFieldOpen(!isReplyFieldOpen)}
            >
              <MIcon source="message" color={COLORS.WHITE} /> Reply
            </MText>

            <MText
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 6,
                backgroundColor: COLORS.PRIMARY,
                color: COLORS.WHITE,
              }}
              onPress={() => onLikeComment(commentAuth)}
            >
              <MIcon source="thumb-up" color={COLORS.WHITE} /> Like
            </MText>
            <MText>|</MText>
            <MText
              style={{
                backgroundColor: COLORS.GREY,
                padding: 6,
              }}
            >
              {like || 0 + " "} <MIcon source="thumb-up" />
            </MText>
          </MView>
          {isReplyFieldOpen && (
            <MView
              style={{
                backgroundColor: "#fff",
                height: 126,
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 20,
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <TextInput
                multiline
                placeholder="What do you want to say?"
                value={repliedMessage}
                onChangeText={(value) => {
                  setRepliedMessage(value);
                }}
                style={{
                  ...(Platform.OS === "android" && {
                    textAlignVertical: "top",
                  }),

                  maxWidth: "80%",
                  color: "#000",
                  fontSize: 10,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (!repliedMessage) {
                    alert("Please add comment");
                    return;
                  }
                  onReplyComment(replyAuth, commentAuth, repliedMessage);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MText
                  style={{
                    color: "#8f8f8f",
                    fontSize: 22,

                    paddingBottom: 2,
                    marginTop: 15,
                  }}
                >
                  Comment{" "}
                </MText>
              </TouchableOpacity>
              <MView height={3} width={100} backgroundColor="#8f8f8f" />
            </MView>
          )}
          {repliedComments?.length > 0 &&
            repliedComments.map((message, index) => {
              const replied = message?.comments
                ? Array.isArray(message?.comments)
                  ? message?.comments
                  : Object.values(message?.comments || {})
                : [];
              const profileImage = message?.person_image
                ? `https://app.myexectras.com/${message?.person_image}`
                : null;
              return (
                <MView key={index}>
                  <CommentCard
                    repliedComments={replied}
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
                    replyAuth={message?.reply_auth}
                    commentAuth={message?.comment_auth}
                    isEditable={userId === message?.person_id}
                    userId={userId}
                    onReplyComment={onReplyComment}
                    onLikeComment={onLikeComment}
                    onEditComment={onEditComment}
                  />
                </MView>
              );
            })}
        </MView>
      </MView>
    </MView>
  );
}
