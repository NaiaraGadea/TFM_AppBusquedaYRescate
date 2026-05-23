// src/screens/createSearch/pantallaCaso.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateCase } from "../../../api";

export default function InformacionCaso({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();

  const handleCloseCase = async () => {
      await updateCase(item.case_id, { case_status: "closed" });
      alert("El caso ha sido cerrado correctamente.");
      navigation.goBack();
  };


  const desaparecido = item.missing;
  const persona = item.person;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Caso #{item.case_id}</Text>

      {desaparecido.photo_url ? (
        <Image
          source={{ uri: desaparecido.photo_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      {/* DATOS PERSONALES */}
      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.text}>{persona.first_name} {persona.last_name}</Text>

      <Text style={styles.label}>Edad:</Text>
      <Text style={styles.text}>{persona.age} años</Text>

      <Text style={styles.label}>Nacionalidad:</Text>
      <Text style={styles.text}>{desaparecido.nationality}</Text>

      <Text style={styles.label}>Dirección habitual:</Text>
      <Text style={styles.text}>{desaparecido.habitual_address}</Text>

      {/* INFORMACIÓN DEL CASO */}
      <Text style={styles.label}>Última vez visto:</Text>
      <Text style={styles.text}>{item.last_seen_point}</Text>

      <Text style={styles.label}>Fecha desaparición:</Text>
      <Text style={styles.text}>
        {new Date(item.disappearance_date).toLocaleDateString()}
      </Text>

      <Text style={styles.label}>Estado del caso:</Text>
      <Text style={styles.text}>
        {item.case_status === "active" ? "Activo" : "Cerrado"}
      </Text>

      {/* BOTONES */}
      {/* BOTÓN: Modificar datos */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <TouchableOpacity style={styles.button2} onPress={() => {}}>
          <Text style={styles.buttonText}>Modificar Datos</Text>
        </TouchableOpacity>
      </View>

      {item.case_status === 'active' && (
      <>{/* BOTÓN: Crear Búsqueda */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => navigation.navigate("NuevaBusqueda", { item })}
          >
            <Text style={styles.buttonText}>Crear Búsqueda</Text>
          </TouchableOpacity>
        </View>
        {/* BOTÓN: Enviar Alerta */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CrearAlerta", { item})}
          >
            <Text style={styles.buttonText}>Enviar Alerta</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÓN: Cerrar caso */}
        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#8B0000' }]}
            onPress={() => navigation.navigate("CasoCerrado", { item })}
          >
            <Text style={styles.buttonText}>Cerrar Caso</Text>
          </TouchableOpacity>
        </View>
      </>
    )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingBottom: 50 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", paddingLeft: 10, marginTop: 15 },
  text: { fontSize: 14, paddingLeft: 10 },
  button: {
    marginTop: 12,
    backgroundColor: "rgba(131, 14, 25, 1)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  button2: {
    marginTop: 12,
    backgroundColor: "rgb(143,164,179)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: "rgb(255,255,255)",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
  },
  image: {
    width: "40%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 12,
    alignSelf: "center",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
