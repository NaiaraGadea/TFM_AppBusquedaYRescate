// src/screens/createSearch/CasosActivos.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getCases } from "../../../api";

export default function CasosActivos({ navigation }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    getCases().then(setCases).catch(console.error);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("PantallaCasoActivo", { caseId: item.id })}
    >
      <Text style={styles.buttonText}>
        #{item.id} - {item.full_name} ({item.age} años)
      </Text>
      <Text style={{ color: "#555" }}>
        Última vez visto: {item.last_seen_location}
      </Text>
      <Text style={{ color: "#999", fontSize: 12 }}>
        Creado: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casos Activos</Text>
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