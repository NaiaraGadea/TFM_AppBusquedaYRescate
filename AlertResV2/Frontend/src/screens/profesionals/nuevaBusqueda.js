// src/screens/createSearch/nuevaBusqueda.js
/*
TFM: AlertRes, app de búsqueda y rescate de personas desaparecidas (2026)
Autora: Naiara Gadea Rodríguez Gómez
Máster en Ingeniería Biomédica y Salud Digital, Universidad de Sevilla

---
Descripción: Pantalla de creación de una nueva búsqueda para un caso.
*/

// Importaciones
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createSearch } from '../../../api';
import CaseItem from '../components/CaseItem';
import { SearchContext } from '../../../App'; 

// Exportación
export default function NuevaBusqueda({ route, navigation }) {
  const { item } = route.params;

  const [meetingPlace, setMeetingPlace] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const { setActiveSearch } = useContext(SearchContext); 

  const handleSubmit = async () => {
    try {
      const newSearch = await createSearch({
        case_id: item.case_id,   
        meeting_point: meetingPlace,
        meeting_date: meetingDate,
        message,
        recommendations,
        is_public: isPublic,
        created_by : item.created_by
      });
      setActiveSearch(newSearch);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Inicio' }],
      });

      navigation.navigate('Búsquedas');
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la búsqueda');
    }
  };

  // Vista de la interfaz de la pantalla
  return (
    <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}>
        <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <CaseItem item={item} />  
      </View>

      <Text>Lugar de encuentro: </Text>
      <TextInput style={styles.input} placeholder="Lugar de encuentro" value={meetingPlace} onChangeText={setMeetingPlace} />
      <Text>Fecha y hora (YYYY-MM-DD HH:mm):</Text>
      <TextInput style={styles.input} placeholder="Fecha y hora (YYYY-MM-DD HH:mm)" value={meetingDate} onChangeText={setMeetingDate} />
      <Text>Mensaje:</Text>
      <TextInput style={styles.input} placeholder="Mensaje" value={message} onChangeText={setMessage} />
      <Text>Recomendaciones:</Text>
      <TextInput style={styles.input} placeholder="Recomendaciones" value={recommendations} onChangeText={setRecommendations} />

      <Text>¿Búsqueda pública?</Text>
      <Switch value={isPublic} onValueChange={setIsPublic} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Aceptar</Text>
      </TouchableOpacity>
      <Text> </Text>

    </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  button: { backgroundColor: '#1976d2', padding: 12, borderRadius: 6, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  confirmBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  confirmTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 6 },
  confirmButton: { padding: 10, backgroundColor: '#1976d2', borderRadius: 6 },
});
