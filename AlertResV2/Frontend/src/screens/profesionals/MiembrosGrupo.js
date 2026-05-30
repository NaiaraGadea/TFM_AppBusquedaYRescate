// src/screens/profesionals/MiembrosGrupo.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla donde se muestran todos los miembros del grupo.
*/

// Importaciones
import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { getPersonById, getGroupById, getUserByPersonId, getMembersByGroupId, getPersonByDni, createGroupMember, updateUser} from "../../../api";
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../../App';

// Etiqueta base
const InfoTag = ({ text, backgroundColor = '#3498db', textColor = '#fff' }) => (
    <View style={[styles.tagContainer, { backgroundColor }]}>
        <Text style={[styles.tagText, { color: textColor }]}>{text}</Text>
    </View>
);

// Exportación
export default function MembersList({ navigation }) {
    const { currentUser } = useContext(UserContext);

    const [person, setPerson] = useState(null);
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState([]);

    // Para el modal de añadir miembro
    const [showAddModal, setShowAddModal] = useState(false);
    const [dni, setDni] = useState("");
    const [rol, setRol] = useState("");


    // Cargar datos iniciales
    useEffect(() => {
        if (currentUser) loadData();
    }, [currentUser]);

    // Polling: refrescar solo búsquedas
    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(() => {
            loadMembersOnly();
        }, 30000); // Cada 30 segundos

        return () => clearInterval(interval);
    }, [currentUser]);

    // Función para cargar toda la información de los miembros del grupo logueado.
    async function loadData() {
        if (!currentUser) return;

        const p = await getPersonById(currentUser.person_id);
        const g = await getGroupById(currentUser.group_id);

        // Obtener los miembros del grupo
        const rawMembers = await getMembersByGroupId(currentUser.group_id);

        console.log("RAW MEMBERS:", rawMembers);

        // Enriquecer cada búsqueda con info del caso y persona
        const enriched = await Promise.all(
            rawMembers.map(async (m) => {
                const person = await getPersonById(m.person_id);
                const user = await getUserByPersonId(m.person_id);

                return { ...m, person, user };

            })
        );

        setPerson(p);
        setGroupData(g);
        setMembers(enriched);
    }

    // Función para cargar la información de todos los miembros del grupo, pero optimizada.
    async function loadMembersOnly() {
        // Obtener los miembros del grupo
        const rawMembers = await getMembersByGroupId(currentUser.group_id);
        // Enriquecer cada búsqueda con info del caso y persona
        const enriched = await Promise.all(
            rawMembers.map(async (m) => {
                const person = await getPersonById(m.person_id);
                const user = await getUserByPersonId(m.person_id);

                return { ...m, person, user };
            })
        );
        setMembers(enriched);
    }
    
    // Función que se activará en el modal para añadir nuevos miembros al grupo en base a su DNI.
    async function handleAddMember() {
        // 1. Buscar persona por DNI
        const person = await getPersonByDni(dni);
        if (!person) {
            alert("No existe ninguna usuario con ese DNI");
            return;
        }

        if (members.some(m => m.person_id === person.person_id)) {
            alert("Esta persona ya es miembro del grupo");
            return;
        }

        // 2. Insertar en group_members
        await createGroupMember({
            group_id: currentUser.group_id,
            person_id: person.person_id,
            role_in_group: rol
        });

        // 3. Actualizar rol del usuario
        const user = await getUserByPersonId(person.person_id);
        await updateUser(user.user_id, { rol: "group_member" });

        // 4. Recargar lista
        loadMembersOnly();

        // 5. Cerrar modal
        setShowAddModal(false);
        setDni("");
        setRol("");
    }


    if (!person) return <Text>Cargando...</Text>;

    // Vista del ítem de cada miembro del grupo.
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.button} onPress={() => {}}>
            <InfoTag text={item.role_in_group} backgroundColor="#f68700" />

            <Text style={styles.buttonText}>
                Miembro – {item.person.first_name} {item.person.last_name}
            </Text>

            <Text style={{ color: "#555" }}>
                Participaciones en búsquedas: {item.user.search_count}
            </Text>

            <Text style={{ color: "#999", fontSize: 12 }}>
                Teléfono: {item.person.phone}
            </Text>

            <Text style={{ color: "#999", fontSize: 12 }}>
                Email: {item.person.email}
            </Text>
        </TouchableOpacity>
    );

    // Vista de la pantalla
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{groupData?.group_name}</Text>
                <Text style={styles.subtitle}>
                    Jefatura: {person.first_name} {person.last_name}
                </Text>
                <TouchableOpacity style={styles.firstButton} onPress={() => setShowAddModal(true)}>
                    <Ionicons name={"add-circle-outline"} size={22} color="#81ADC6" style={styles.icon} />
                    <Text style={styles.buttonText}>{" Añadir Miembro "}</Text>
                </TouchableOpacity>
            </View>

            
            <FlatList
                data={members}
                keyExtractor={(item) => item.person_id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}/>

            {/* MODAL para añadir miembros*/}
            {showAddModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Añadir miembro</Text>

                        <TextInput style={styles.modalInput} placeholder="DNI" value={dni} onChangeText={setDni}/>

                        <TextInput style={styles.modalInput} placeholder="Rol en el grupo" value={rol} onChangeText={setRol} />

                        <TouchableOpacity style={styles.modalButton} onPress={handleAddMember}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Añadir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowAddModal(false)}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    firstButton: {
    flexDirection: "row",        // icono + texto en fila
    alignSelf: "center",     // el botón se ajusta al contenido
    borderWidth: 2,
    borderColor: "#81ADC6",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: '#eeeeee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
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
    tagText: { fontSize: 14, fontWeight: '500' },
        modalOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: "#81ADC6",
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
    },
    modalCancelButton: {
        backgroundColor: "#AC0B1B",
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 20
    },


});
