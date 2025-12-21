import { useState } from "react";
import { Text, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "../(auth)/login";
import Signup from "../(auth)/register";

export default function Home() {
  const [view, setView] = useState("login");
  return (
    <View>
      <Text>Welcome to Back2Me 🎉</Text>
      <SafeAreaProvider>
    {view === "login" ? (
      <Login onSwitch={() => setView("signup")} />
    ) : (
      <Signup onSwitch={() => setView("login")} />
    )}
  </SafeAreaProvider>
    </View>
    
  );
}
