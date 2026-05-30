// src/screens/search/pantallaListaBusqueda.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla donde se muestran todas las búsquedas públicas y del grupo.
*/

// Importaciones
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getPersonById, getUserById, getGroupById, getMissingPersonById, getSearchesByVisibility, getCaseByCaseId} from "../../../api";
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../../App';

// Etiqueta base
const InfoTag = ({ text, backgroundColor = '#3498db', textColor = '#fff' }) => (
    <View style={[styles.tagContainer, { backgroundColor }]}>
        <Text style={[styles.tagText, { color: textColor }]}>{text}</Text>
    </View>
);

// Exportación
export default function SearchList({ navigation }) {
    const { currentUser } = useContext(UserContext);

    const [person, setPerson] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [searches, setSearches] = useState([]);

    // Cargar datos iniciales
    useEffect(() => {
        if (currentUser) loadData();
    }, [currentUser]);

    // Polling: refrescar solo búsquedas
    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(() => {
            loadSearchesOnly();
        }, 30000);

        return () => clearInterval(interval);
    }, [currentUser]);

    // Función para cargar todos los datos de búsquedas registradas en la base de datos.
    async function loadData() {
        if (!currentUser) return;

        const p = await getPersonById(currentUser.person_id);
        const g = await getGroupById(currentUser.group_id);

        // Obtener búsquedas públicas + del grupo
        const rawSearches = await getSearchesByVisibility(currentUser.group_id ?? 0);

        console.log("RAW SEARCHES:", rawSearches);

        // Enriquecer cada búsqueda con info del caso y persona
        const enriched = await Promise.all(
            rawSearches.map(async (s) => {
                const caseData = await getCaseByCaseId(s.case_id);
                const missing = await getMissingPersonById(caseData.missing_id);
                const person = await getPersonById(missing.person_id);
                const creatorGroup = await getGroupById(s.created_by);
                return { ...s, missing, person, creatorGroup };

            })
        );

        setPerson(p);
        setGroupData(g);
        setSearches(enriched);
    }

    // Función optimizada para el polling donde se obtienen las búsquedas de la base de datos.
    async function loadSearchesOnly() {
        const rawSearches = await getSearchesByVisibility(currentUser.group_id ?? 0);
        //console.log("SEARCHES DATA:", rawSearches); //Info

        const enriched = await Promise.all(
            rawSearches.map(async (s) => {
                const caseData = await getCaseByCaseId(s.case_id);
                const missing = await getMissingPersonById(caseData.missing_id);
                const person = await getPersonById(missing.person_id);
                const creatorGroup = await getGroupById(s.created_by);
                return { ...s, missing, person, creatorGroup };

            })
        );

        setSearches(enriched);
    }

    if (!person) return <Text>Cargando...</Text>;

    // Vista del item donde se recogerá un resumen de la información de una búsqueda. Se mostrará una lista de items.
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Búsqueda", { item })}
        >
            <InfoTag text={
                item.is_public? `Pública · ${item.creatorGroup?.group_name || "Grupo desconocido"}` : `Privada · ${item.creatorGroup?.group_name || "Grupo desconocido"}`}
                backgroundColor={item.is_public ? "#f68700" : "#00318b"}/>

            <InfoTag text={item.search_status === "finalizada" ? "Finalizada" : "Activa"}
                backgroundColor={item.search_status === "finalizada" ? "#8B0000" : "#27ae60"}/>

            <Text style={styles.buttonText}>
                Búsqueda #{item.search_id} – {item.person.first_name} {item.person.last_name}
            </Text>

            <Text style={{ color: "#555" }}>
                Punto de encuentro: {item.meeting_point || "No definido"}
            </Text>

            <Text style={{ color: "#999", fontSize: 12 }}>
                Creada: {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    // Vista de la pantalla
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{groupData?.group_name || "Voluntario"}</Text>
                <Text style={styles.subtitle}>
                    {person.first_name} {person.last_name}
                </Text>
            </View>

            {searches.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={40} color="#888" />
                    <Text style={styles.emptyText}>No hay búsquedas disponibles.</Text>
                </View>
            ) : (
                <FlatList
                    data={searches}
                    keyExtractor={(item) => item.search_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </View>
    );
}

// Estilo de la pantalla
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 24, textAlign: "center" },
    subtitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
    emptyContainer: { marginTop: 40, alignItems: "center" },
    emptyText: { marginTop: 10, fontSize: 16, color: "#777" },
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
        marginBottom: 8,
    },
    tagText: { fontSize: 14, fontWeight: '500' },
});
