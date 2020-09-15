import React from "react";
import { View, Button, StyleSheet } from "react-native";
import * as AuthSession from "expo-auth-session";

export default function App() {
  const handlePress = async () => {
    const response = await AuthSession.startAsync({
      returnUrl: "http://localhost:19006/",
      authUrl: "https://eva.fing.edu.uy/login/index.php",
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Llevame al browser" onPress={handlePress}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
