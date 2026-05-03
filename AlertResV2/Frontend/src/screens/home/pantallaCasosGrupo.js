// src/screens/home/pantallaCasosGrupo.js
// Pantalla donde se muestran todos los casos del grupo
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getCasesByGroup, getPersonById, getUserById, getGroupById, getMissingPersonById } from "../../../api";
import { Ionicons } from '@expo/vector-icons'; // para iconos sutiles

import { UserContext } from '../../../App';



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
        }, 5000); // refresco cada 5 segundos

        return () => clearInterval(interval); // limpieza al salir de la pantalla
    }, [currentUser]);


    // Cargamos la información del usuario actual
    async function loadData() {
        if (!currentUser) return;
    
        const p = await getPersonById(currentUser.person_id);
        const u = await getUserById(currentUser.user_id);
        const g = await getGroupById(currentUser.group_id);
        const rawCases = await getCasesByGroup(currentUser.group_id);
        

        //console.log("PERSON DATA:", p);
        //console.log("USER DATA:", u);

        // Enriquecer cada caso con la info de la persona
        const c = await Promise.all(
        rawCases.map(async (caso) => {
        // 1. Obtener missing_person
        const missing = await getMissingPersonById(caso.missing_id);
        // 2. Obtener datos de la persona asociada
        const person = await getPersonById(missing.person_id);
        return {...caso, missing,person};
        })
    );

    
        setPerson(p);
        setUserData(u);
        setGroupData(g);
        setCasesData(c);
    }

    // Nueva función: recarga solo los casos (más eficiente para el polling)
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

    console.log("PERSON DATA:", person);
    console.log("GROUP DATA:", groupData);
    if (!groupData || !person) {
        return <Text>Cargando...</Text>;
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PantallaCaso", { caseId: item.case_id })}
        >
          <Text style={styles.buttonText}>
            #{item.case_id} - {item.person.first_name} {item.person.last_name} ({item.person.age} años)
          </Text>
          <Text style={{ color: "#555" }}>
            Última vez visto: {item.last_seen_point}
          </Text>
          <Text style={{ color: "#777" }}>Estado: {item.case_status}</Text>
          <Text style={{ color: "#999", fontSize: 12 }}>
            Creado: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      );
    
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
  buttonText: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
