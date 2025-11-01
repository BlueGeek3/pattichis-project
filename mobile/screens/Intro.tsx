import React from "react";
import { View, Image, StyleSheet, Pressable, Text } from "react-native";
// import bg from "../assets/bg-intro.png"; // or .png if that's your file
const bg = require("../assets/bg-intro.png");


export default function Intro({ navigation }: any) {
  return (
    <View style={styles.root}>
      <Image
        source={bg}
        style={StyleSheet.absoluteFillObject}
        resizeMode="contain"       // ⚠️ shows full image, no cropping
      />
      <View style={styles.content}>
        <Text style={styles.title}>My MS Diary</Text>
        <Pressable
          onPress={() => navigation.replace("Tabs")}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFE9D1" }, // match your background tone
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#2A2A2A", marginBottom: 24 },
  btn: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 24, backgroundColor: "#4A4A4A", elevation: 4 },
  btnPressed: { backgroundColor: "#5a5a5a" },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
