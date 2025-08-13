import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [texto1, setTexto1] = useState("Oi, meu nome é");
  const [texto2, setTexto2] = useState("Olá, meu nome é");

  const alterarTexto1 = () => setTexto1("Kauã, como você está?");
  const alterarTexto2 = () => setTexto2("Marcio, estou bem e você?");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{texto1}</Text>
      <Button title="Mudar o texto" onPress={alterarTexto1} color="#af4c4cff" />

      <View style={styles.separator} />

      <Text style={styles.text}>{texto2}</Text>
      <Button title="Também muda o texto" onPress={alterarTexto2} color="#bd6f09ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  separator: {
    height: 30,
  },
});
