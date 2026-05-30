// src/screens/home/pantallaCasosGrupo.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla donde se muestran todos los casos del grupo logueado.
*/

// Importaciones
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getCasesByGroup, getPersonById, getUserById, getGroupById, getMissingPersonById } from "../../../api";
import { Ionicons } from '@expo/vector-icons'; // para iconos sutiles

import { UserContext } from '../../../App';

// Etiqueta base
const InfoTag = ({
  text,
  backgroundColor = '#3498db',
  textColor = '#fff',
  style,
}) => {
  return (
    <View style={[styles.tagContainer, { backgroundColor }, style]}>
      <Text style={[styles.tagText, { color: textColor }]}>{text}</Text>
    </View>
  );
};

// Exportación
export default function GroupCases({ navigation }) {
    const { currentUser } = useContext(UserContext);
    const [person, setPerson] = useState(null);
    const [userData, setUserData] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [cases,setCasesData] = useState([]);

    // Cargamos la información del usuario actual
    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);
    console.log("CURRENT USER:", currentUser);

    // POLLING: refresca SOLO los casos cada 5 segundos
    // (sin recargar persona, usuario o grupo para no ralentizar)
    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(() => {
            loadCasesOnly(); // función ligera
        }, 10000); // refresco cada 10 segundos

        return () => clearInterval(interval); // limpieza al salir de la pantalla
    }, [currentUser]);

    // Cargamos la información del usuario actual
    async function loadData() {
        if (!currentUser) return;
    
        const p = await getPersonById(currentUser.person_id);
        const u = await getUserById(currentUser.user_id);
        const g = await getGroupById(currentUser.group_id);
        const rawCases = await getCasesByGroup(currentUser.group_id);
        

        //console.log("PERSON DATA:", p); //Info
        //console.log("USER DATA:", u); //Info

        // Enriquecer cada caso con la info de la persona
        const c = await Promise.all(
        rawCases.map(async (caso) => {
            // 1. Obtener missing_person
            const missing = await getMissingPersonById(caso.missing_id);
            // 2. Obtener datos de la persona asociada
            const person = await getPersonById(missing.person_id);
            return {...caso, missing,person};
        }));

        console.log("CASE DATA:", c); //Info

        setPerson(p);
        setUserData(u);
        setGroupData(g);
        setCasesData(c);
    }

    // Función que recarga solo los casos (más eficiente para el polling)
    async function loadCasesOnly() {
        if (!currentUser) return;

        const rawCases = await getCasesByGroup(currentUser.group_id);

        const c = await Promise.all(
            rawCases.map(async (caso) => {
                const missing = await getMissingPersonById(caso.missing_id);
                const person = await getPersonById(missing.person_id);
                return { ...caso, missing, person };
            })
        );

        setCasesData(c);
    }

    //console.log("PERSON DATA:", person); //Info
    //console.log("GROUP DATA:", groupData); //Info
    if (!groupData || !person) {
        return <Text>Cargando...</Text>;
    }

    //Item con la información básica del caso. Luego se mostrará una lista con todos los casos (items).
    const renderItem = ({ item }) => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PantallaCasoActivo", {item})}
        >
          <InfoTag
            text={item.case_status === 'active' ? 'Activo' : 'Cerrado'}
            backgroundColor={item.case_status === 'active' ? '#27ae60' : '#8B0000'}
            />

          <Text style={styles.buttonText}>
            #{item.case_id} - {item.person.first_name} {item.person.last_name} ({item.person.age} años)
          </Text>
          <Text style={{ color: "#555" }}>
            Última vez visto: {item.last_seen_point}
          </Text>
          <Text style={{ color: "#999", fontSize: 12 }}>
            Creado: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      );
    
    // Vista de la interfaz de la pantalla
    return (
        <View style={styles.container}>
            {/* BLOQUE FIJO: SIEMPRE SE MUESTRA */}
            <View style={styles.header}>
            <Text style={styles.title}>{groupData.group_name}</Text>
            <Text style={styles.subtitle}>
                Jefatura: {person.first_name} {person.last_name}
            </Text>
            <TouchableOpacity style={styles.firstButton} onPress={() => navigation.navigate('RegistrarCaso')}>
                    <Ionicons name={"add-circle-outline"} size={22} color="rgb(172, 11, 27)" style={styles.icon} />
                    <Text style={styles.buttonText}>{" Registrar caso "}</Text>
                  </TouchableOpacity>
            </View>

            {/* BLOQUE DINÁMICO */}
            {cases.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#888" />
                <Text style={styles.emptyText}>No hay casos registrados en este grupo.</Text>
            </View>
            ) : (
            <FlatList
                data={cases}
                keyExtractor={(item) => item.case_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
            )}

        </View>
    );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: { fontSize: 22, fontWeight: "700", fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  emptyContainer: {marginTop: 40, alignItems: "center"},
  emptyText: {marginTop: 10, fontSize: 16, color: "#777"},
  firstButton: {
    flexDirection: "row",        // icono + texto en fila
    alignSelf: "center",     // el botón se ajusta al contenido
    borderWidth: 1,
    borderColor: "#d32f2f",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: '#eeeeee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  button: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#111827" },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
