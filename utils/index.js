import { Linking, Text } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
export const formattedText = (description) => {
  const boldRegex = /\*{2}(.*?)\*{2}/g; // Regular expression for bold markers

  // Function to create a Text component with optional bold styling
  const createText = (text, isBold = false, index) => (
    <Text key={index} style={{ fontWeight: isBold ? "bold" : "normal" }}>
      {text}
    </Text>
  );

  const formattedText = description.split(boldRegex).map((part, index) => {
    if (index % 2 === 0) {
      // Even index: unbolded text
      return createText(part, false, index);
    } else {
      // Odd index: bolded text
      return createText(part, true, index);
    }
  });

  return formattedText; // Return an array of Text components
};
export const localizeConfig = (t, config) => {
  const localizedConfig = {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      title: t(section.title),
      label: t(section.label),
      fields: section.fields.map((field) => ({
        ...field,
        label: t(field.label),
        ...(field?.type === "radiogroup" || field?.type === "select"
          ? {
              options: field.options.map((option) => ({
                ...option,
                label: t(option.label),
              })),
            }
          : {}),
      })),
    })),
  };

  return localizedConfig;
};
export const handleCall = (phoneNumber) => {
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url)
    .then((supported) => {})
    .catch((err) => console.error("An error occurred", err));
};
export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const resizeImage = async (uri) => {
  if (!uri) return "";
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult.uri;
};
