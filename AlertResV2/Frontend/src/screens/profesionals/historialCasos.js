// src/screens/createSearch/HistorialCasos.js
// FUERA
// Pantalla donde se muestran todos los casos por estado del caso
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getCasesByStatus } from "../../../api";

export default function HistorialCasos({ navigation }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {getCasesByStatus("all").then(setCases).catch(console.error);}, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("PantallaCaso", { caseId: item.id })}
    >
      <Text style={styles.buttonText}>
        #{item.id} - {item.full_name} ({item.age} años)
      </Text>
      <Text style={{ color: "#555" }}>
        Última vez visto: {item.last_seen_location}
      </Text>
      <Text style={{ color: "#777" }}>Estado: {item.status}</Text>
      <Text style={{ color: "#999", fontSize: 12 }}>
        Creado: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Casos</Text>
      <FlatList
        data={cases}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24, textAlign: "center" },
  button: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
