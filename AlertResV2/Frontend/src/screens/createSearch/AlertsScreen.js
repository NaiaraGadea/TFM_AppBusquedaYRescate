// Pantalla de creación de alertas respecto a un caso.
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, Switch, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createAlert, getCaseByCaseId } from '../../../api';
import CaseItem from '../components/CaseItem';
import AlertItem from '../components/AlertItem';

export default function AlertsScreen({ route, navigation }) {
  const { caseId } = route.params;
  const [caseData, setCaseData] = useState(null);
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [alertType, setAlertType] = useState('normal');
  const [zone, setZone] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    getCaseByCaseId(caseId).then(setCaseData);
  }, [caseId]);

  const handleSubmit = async () => {
    setShowConfirm(false);
    try {
      await createAlert({ case_id: caseId, message, is_public: isPublic, alert_type: alertType, zone });
      setShowFinal(true);
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la alerta');
    }
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
      <TextInput
        style={styles.input}
        placeholder="Mensaje de la alerta"
        value={message}
        onChangeText={setMessage}
      />
      <Text>¿Alerta pública?</Text>
      <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ true: "rgb(129, 173, 198)" , false:"rgb(239,239,239)"}} />

      <Text>Tipo de alerta:</Text>
      <TextInput value={alertType} onChangeText={setAlertType} style={styles.input} />

      <Text>Zona de envío:</Text>
      <TextInput value={zone} onChangeText={setZone} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={() => setShowConfirm(true)} >
        <Text style={styles.buttonText}>Aceptar</Text>
      </TouchableOpacity>
      <Text> </Text>

      {/* Confirmación */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Confirmar envío</Text>
            <Text style={styles.confirmText}>
              ¿Quieres enviar esta alerta con los datos introducidos?
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.confirmTextBtn}>Sí, enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notificación final */}
      <Modal visible={showFinal} transparent animationType="fade">
        <View style={styles.modal}>
          <AlertItem
            alert={{
              ...caseData,
              message,
              alert_type: alertType,
            }}
          />
          <TouchableOpacity style={styles.button2} onPress={() => {setShowFinal(false);navigation.goBack();}}>
              <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 , backgroundColor: '#fff', paddingBottom:50},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  modal: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 20
  },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
button:{borderRadius: 6, 
  backgroundColor:'rgba(25, 76, 100, 1)', 
  alignSelf: 'center', 
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 20,
},
button2:{borderRadius: 6, 
  backgroundColor:'#d32f2f', 
  alignSelf: 'center', 
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 20,
},
buttonText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
confirmBox: {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  width: '80%',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
},
confirmTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 10,
  textAlign: 'center',
  color: '#333',
},
confirmText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 20,
  textAlign: 'center',
},
actions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
actionButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
  marginHorizontal: 5,
},
cancelButton: {
  backgroundColor: '#ccc',
},
confirmButton: {
  backgroundColor: '#d32f2f',
},
cancelText: {
  color: '#333',
  fontWeight: '600',
},
confirmTextBtn: {
  color: '#fff',
  fontWeight: '600',
},

});
