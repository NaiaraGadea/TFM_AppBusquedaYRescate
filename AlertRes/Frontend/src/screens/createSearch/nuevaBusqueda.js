import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createSearch, getCaseByCaseId } from '../../../api';
import CaseItem from '../components/CaseItem';
import { SearchContext } from '../../../App';   // 👈 Importamos el contexto

export default function NuevaBusqueda({ route, navigation }) {
  const { caseId } = route.params;
  const [caseData, setCaseData] = useState(null);
  const [meetingPlace, setMeetingPlace] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [createdSearch, setCreatedSearch] = useState(null);

  const { setActiveSearch } = useContext(SearchContext); 

  useEffect(() => {
    getCaseByCaseId(caseId).then(setCaseData);
  }, [caseId]);

  const handleSubmit = async () => {
    try {
      const newSearch = await createSearch({ 
        case_id: caseId, 
        meeting_place: meetingPlace, 
        meeting_date: meetingDate, 
        message, 
        recommendations, 
        is_public: isPublic 
      });
      setCreatedSearch(newSearch);   // guardamos la búsqueda creada
      setShowConfirm(true);          // mostramos el modal de confirmación
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la búsqueda');
    }
  };

  const handleReject = () => {
    setShowConfirm(false);
    navigation.navigate('Inicio'); // vuelve al inicio si no participa
  };

  const handleAccept = () => {
    setShowConfirm(false);
    setActiveSearch(createdSearch); // Guardamos la búsqueda activa en el contexto
    navigation.navigate('Búsqueda'); // navegamos a la pestaña de búsqueda
  };

  if (!caseData) return <Text>Cargando...</Text>;

  return (
    <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}>
        <ScrollView style={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <CaseItem item={caseData} />  
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

      {/* Confirmación */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>¿Quieres participar en esta búsqueda?</Text>
            {createdSearch && (
              <>
                <Text>Lugar: {createdSearch.meeting_place}</Text>
                <Text>Fecha: {createdSearch.meeting_date}</Text>
                <Text>Mensaje: {createdSearch.message}</Text>
                <Text>Recomendaciones: {createdSearch.recommendations}</Text>
              </>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleReject}>
                <Text>Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAccept}>
                <Text style={{color:'#fff'}}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
