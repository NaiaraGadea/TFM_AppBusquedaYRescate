// src/screens/createSearch/pantallaCasoActivo.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla con la información de un caso.
*/

// Importaciones
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { updateCase } from "../../../api";

// Exportación
export default function InformacionCaso({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();

  const desaparecido = item.missing;
  const persona = item.person;

  // Vista de la interfaz de la pantalla
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
      <Text style={styles.sectionTitle}>Información básica</Text>

      <Text style={styles.label}>Nombre:</Text>
      <Text style={styles.text}>{persona.first_name} {persona.last_name}</Text>

      <Text style={styles.label}>Edad:</Text>
      <Text style={styles.text}>{persona.age} años</Text>

      {persona.birth_date && <>
        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.text}>{persona.birth_date}</Text>
      </>}

      <Text style={styles.label}>Nacionalidad:</Text>
      <Text style={styles.text}>{desaparecido.nationality}</Text>

      {persona.dni && <>
        <Text style={styles.label}>DNI:</Text>
        <Text style={styles.text}>{persona.dni}</Text>
      </>}

      {persona.phone && <>
        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.text}>{persona.phone}</Text>
      </>}

      {persona.email && <>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{persona.email}</Text>
      </>}

      <Text style={styles.label}>Dirección habitual:</Text>
      <Text style={styles.text}>{desaparecido.habitual_address}</Text>

      {/* INFORMACIÓN DEL CASO */}
      <Text style={styles.sectionTitle}>Información del incidente</Text>

      <Text style={styles.label}>Última vez visto:</Text>
      <Text style={styles.text}>{item.last_seen_point || item.departure_point}</Text>

      <Text style={styles.label}>Fecha desaparición:</Text>
      <Text style={styles.text}>
        {new Date(item.disappearance_date).toLocaleDateString()}
      </Text>

      <Text style={styles.label}>Estado del caso:</Text>
      <Text style={styles.text}>
        {item.case_status === "active" ? "Activo" : "Cerrado"}
      </Text>

      {item.expected_return_point && <>
        <Text style={styles.label}>Punto de retorno esperado:</Text>
        <Text style={styles.text}>{item.expected_return_point}</Text>
      </>}

      {item.last_seen_at && <>
        <Text style={styles.label}>Hora última vez visto:</Text>
        <Text style={styles.text}>{item.last_seen_at}</Text>
      </>}

      {item.last_seen_by && <>
        <Text style={styles.label}>Visto por:</Text>
        <Text style={styles.text}>{item.last_seen_by}</Text>
      </>}

      {item.last_known_point && <>
        <Text style={styles.label}>Último punto conocido:</Text>
        <Text style={styles.text}>{item.last_known_point}</Text>
      </>}

      {item.last_known_at && <>
        <Text style={styles.label}>Hora último punto conocido:</Text>
        <Text style={styles.text}>{item.last_known_at}</Text>
      </>}

      {item.typology && <>
        <Text style={styles.label}>Tipología:</Text>
        <Text style={styles.text}>{item.typology}</Text>
      </>}

      {item.category && <>
        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.text}>{item.category}</Text>
      </>}

      {item.recurrence && <>
        <Text style={styles.label}>Reincidencia:</Text>
        <Text style={styles.text}>{item.recurrence}</Text>
      </>}


      {/** OTRA INFORMACIÓN DE LA PERSONA DESAPARECIDA */}
      <Text style={styles.sectionTitle}>Descripción de la persona desaparecida</Text>

      {desaparecido.nickname && <>
        <Text style={styles.label}>Apodo:</Text>
        <Text style={styles.text}>{desaparecido.nickname}</Text>
      </>}

      {desaparecido.languages && <>
        <Text style={styles.label}>Idiomas:</Text>
        <Text style={styles.text}>{desaparecido.languages}</Text>
      </>}

      {desaparecido.height && <>
        <Text style={styles.label}>Altura:</Text>
        <Text style={styles.text}>{desaparecido.height} cm</Text>
      </>}

      {desaparecido.weight && <>
        <Text style={styles.label}>Peso:</Text>
        <Text style={styles.text}>{desaparecido.weight} kg</Text>
      </>}

      {desaparecido.hair && <>
        <Text style={styles.label}>Cabello:</Text>
        <Text style={styles.text}>{desaparecido.hair}</Text>
      </>}

      {desaparecido.facial_hair && <>
        <Text style={styles.label}>Vello facial:</Text>
        <Text style={styles.text}>{desaparecido.facial_hair}</Text>
      </>}

      {desaparecido.eye_color && <>
        <Text style={styles.label}>Color de ojos:</Text>
        <Text style={styles.text}>{desaparecido.eye_color}</Text>
      </>}

      {desaparecido.last_clothing && <>
        <Text style={styles.label}>Última ropa vista:</Text>
        <Text style={styles.text}>{desaparecido.last_clothing}</Text>
      </>}

      <Text style={styles.sectionTitle}>Información médica y psicofísica</Text>

      {desaparecido.physical_level && <>
        <Text style={styles.label}>Nivel físico:</Text>
        <Text style={styles.text}>{desaparecido.physical_level}</Text>
      </>}

      {desaparecido.physical_constitution && <>
        <Text style={styles.label}>Constitución física:</Text>
        <Text style={styles.text}>{desaparecido.physical_constitution}</Text>
      </>}

      {desaparecido.other_physical_features && <>
        <Text style={styles.label}>Otros rasgos físicos:</Text>
        <Text style={styles.text}>{desaparecido.other_physical_features}</Text>
      </>}

      {desaparecido.medical_conditions && <>
        <Text style={styles.label}>Condiciones médicas:</Text>
        <Text style={styles.text}>{desaparecido.medical_conditions}</Text>
      </>}

      {desaparecido.allergies && <>
        <Text style={styles.label}>Alergias:</Text>
        <Text style={styles.text}>{desaparecido.allergies}</Text>
      </>}

      {desaparecido.disability && <>
        <Text style={styles.label}>Discapacidad:</Text>
        <Text style={styles.text}>{desaparecido.disability}</Text>
      </>}

      {desaparecido.lack_of_autonomy && <>
        <Text style={styles.label}>Falta de autonomía:</Text>
        <Text style={styles.text}>{desaparecido.lack_of_autonomy}</Text>
      </>}

      {desaparecido.treatment && <>
        <Text style={styles.label}>Tratamiento:</Text>
        <Text style={styles.text}>{desaparecido.treatment}</Text>
      </>}

      {desaparecido.with_medication !== null && <>
        <Text style={styles.label}>¿Lleva medicación?:</Text>
        <Text style={styles.text}>{desaparecido.with_medication ? "Sí" : "No"}</Text>
      </>}

      {desaparecido.substance_abuse && <>
        <Text style={styles.label}>Consumo de sustancias:</Text>
        <Text style={styles.text}>{desaparecido.substance_abuse}</Text>
      </>}

      {desaparecido.visual_problems && <>
        <Text style={styles.label}>Problemas visuales:</Text>
        <Text style={styles.text}>{desaparecido.visual_problems}</Text>
      </>}

      {desaparecido.hearing_problems && <>
        <Text style={styles.label}>Problemas auditivos:</Text>
        <Text style={styles.text}>{desaparecido.hearing_problems}</Text>
      </>}

      {desaparecido.grade_of_deafness && <>
        <Text style={styles.label}>Grado de sordera:</Text>
        <Text style={styles.text}>{desaparecido.grade_of_deafness}</Text>
      </>}

      {desaparecido.gender_violence !== null && <>
        <Text style={styles.label}>Violencia de género:</Text>
        <Text style={styles.text}>{desaparecido.gender_violence ? "Sí" : "No"}</Text>
      </>}


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

// Estilo de la pantalla
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    paddingLeft: 10,
    color: "#ac0b1b",
  },

});
