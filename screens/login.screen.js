import React from "react";
import { storeData, getJSONData, getAuthData } from "../src/store";
import { login } from "../src/api";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  MView,
  MButton,
  MInput,
  MDivider,
  MText,
  MIcon,
  MTouchable,
} from "../components/MComponents";
import { TextInput, useTheme } from "react-native-paper";
import { COLORS, ROUTES } from "../constants";
import * as linking from "expo-linking";
import MScrollView from "../components/MComponents/MScrollView";

export default ({ navigation }) => {
  const [auth, setAuth] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const theme = useTheme();

  const navigateAccount = async () => {
    setLoading(true);
    const auth = login(username, password)
      .then((authResult) => {
        if (authResult) {
          storeData("auth", JSON.stringify(authResult));
          storeData("authCreds", JSON.stringify({ username, password }));
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.HOME }],
          });
        } else {
          alert("Invalid username or password");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigateRegister = () => {
    navigation.navigate(ROUTES.REGISTER);
  };

  const openLink = (link) => {
    linking.openURL(link).catch((err) => alert("unable to open link"));
  };

  React.useEffect(() => {
    getAuthData(setAuth).then(async () => {
      if (auth) {
        setUsername(auth.data.username);
        navigation.navigate(ROUTES.HOME);
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <MScrollView
          contentContainerStyle={{
            flex: 1,
          }}
          automaticallyAdjustKeyboardInsets={true}
        >
          <MDivider />
          <View
            style={[
              styles.body,
              {
                backgroundColor: COLORS.PRIMARY,
                justifyContent: "center",
              },
            ]}
          >
            <Image
              resizeMode={"contain"}
              style={{
                width: "70%",
              }}
              source={require("./../assets/exectras_logo.png")}
            />
          </View>
          <View style={[styles.body, { flexBasis: 250 }]}>
            <MText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 40,
                marginBottom: 30,
              }}
            >
              Welcome!
            </MText>
            <MText style={{ fontSize: 14, marginBottom: 20 }}>
              Please sign in to continue.
            </MText>
            <MInput
              label="Username"
              value={username}
              onChangeText={(nextValue) => setUsername(nextValue)}
              style={{ width: 280, maxWidth: 280 }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <MView style={styles.secureEyeContainer}>
              <MInput
                label="Password"
                value={password}
                secureTextEntry={secureTextEntry}
                onChangeText={(nextValue) => setPassword(nextValue)}
                style={{ width: 280, maxWidth: 280, margin: 10 }}
                autoCapitalize="none"
                right={<MIcon source="eye" size={40} />}
              />
              <MTouchable
                style={styles.eyeIcon}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <MIcon source={secureTextEntry ? "eye" : "eye-off"} size={20} />
              </MTouchable>
            </MView>
            <MText
              onPress={() => {
                openLink("https://app.myexectras.com/signin?p=forgot");
              }}
              style={{ marginTop: 10, marginBottom: 20, textAlign: "right" }}
            >
              <MText style={{ color: "blue", textDecorationLine: "underline" }}>
                Forgot Your Password?
              </MText>
            </MText>
            <MButton
              style={{
                backgroundColor: COLORS.PRIMARY,
                width: 280,
                borderRadius: 5,
              }}
              dark={true}
              onPress={navigateAccount}
              loading={loading}
            >
              LOGIN
            </MButton>
            <MText
              onPress={() => openLink("https://exectras.com/contact/")}
              style={{ marginTop: 30 }}
            >
              Don't have an account?{" "}
              <MText style={{ color: "blue", textDecorationLine: "underline" }}>
                Sign Up
              </MText>
            </MText>
          </View>
        </MScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // paddingTop: 20,
  },
  secureEyeContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    top: 30,
    right: 20,
  },
});
