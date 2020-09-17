import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function App() {
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const response = await WebBrowser.openAuthSessionAsync(
      "https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize"
    );
    setToken(response);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <View style={styles.container}>
      {token ? (
        <Button title="Cerrar sesión de ID Uruguay" onPress={handleLogout} />
      ) : (
        <Button title="Ingresar con ID Uruguay" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
