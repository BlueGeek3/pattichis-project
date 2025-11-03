import React from "react";
import {
  ImageBackground,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";

const bg = require("../assets/bg-intro.png");

export default function Intro({ navigation }: any) {
  const { height } = useWindowDimensions();
  const topOffset = height * 0.20;     // 30% from top
  const bottomOffset = height * 0.20;  // 20% from bottom
  const isWeb = Platform.OS === "web";

  return (
    <ImageBackground
      source={bg}
      resizeMode="cover"
      style={[styles.bg, isWeb && { height, width: "100%" }]} // web-only: fill viewport
    >
      {/* Title ~30% from top */}
      <View style={[styles.titleWrap, { top: topOffset }]}>
        <Text style={styles.title}>My MS Diary</Text>
      </View>

      {/* Button ~20% from bottom */}
      <View style={[styles.btnWrap, { bottom: bottomOffset }]}>
        <Pressable
          onPress={() => navigation.replace("Tabs")}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  titleWrap: { position: "absolute", width: "100%", alignItems: "center" },
  btnWrap:   { position: "absolute", width: "100%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700", color: "#2A2A2A" },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: "#4A4A4A",
    elevation: 4,
  },
  btnPressed: { backgroundColor: "#5a5a5a" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
