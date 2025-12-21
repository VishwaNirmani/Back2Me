import { useState } from "react";
import { Text, View } from 'react-native';

export default function Home() {
  const [view, setView] = useState("login");
  return (
    <View>
      <Text>Welcome to Back2Me 🎉</Text>
    </View>
    
  );
}
