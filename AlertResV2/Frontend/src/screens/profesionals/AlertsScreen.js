// Pantalla de creación de alertas respecto a un caso.
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, StyleSheet, Switch, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createAlert, getCaseByCaseId } from '../../../api';
import CaseItem from '../components/CaseItem';
import AlertItem from '../components/AlertItem';

export default function AlertsScreen({ route, navigation }) {
  const { item } = route.params;
  console.log("ITEM Alert DATA:", item);
  const [caseData] = useState(item);
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [alertType, setAlertType] = useState('normal');
  const [zone, setZone] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  /*
  useEffect(() => {
    getCaseByCaseId(caseId).then(setCaseData);
  }, [caseId]);*/

  const handleSubmit = async () => {
    setShowConfirm(false);
    try {
      //await createAlert({ case_id: caseId, message, is_public: isPublic, alert_type: alertType, zone });
      await createAlert({ 
        case_id: item.case_id, 
        message, 
        is_public: isPublic, 
        alert_type: alertType, 
        alert_zone: zone });
      //setShowFinal(true);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la alerta');
    }
  };

  if (!caseData) return <Text>Cargando...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>

        {/* Información del caso */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <CaseItem item={item} />
        </View>

        {/* Mensaje */}
        <Text style={styles.label}>Mensaje de la alerta</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Escribe aquí"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {/* Pública */}
        <View style={styles.row}>
          <Text style={styles.label}>¿Alerta pública?</Text>
          <Switch 
            value={isPublic} 
            onValueChange={setIsPublic}
            trackColor={{ true: "rgb(129, 173, 198)", false:"rgb(239,239,239)" }} 
          />
        </View>

        {/* Tipo */}
        <Text style={styles.label}>Tipo de alerta</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={alertType} onValueChange={setAlertType}>
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Mayor" value="mayor" />
            <Picker.Item label="Menor" value="menor" />
            <Picker.Item label="Vulnerable" value="vulnerable" />
          </Picker>
        </View>

        {/* Zona */}
        <Text style={styles.label}>Zona de envío</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={zone} onValueChange={setZone}>
            <Picker.Item label="Selecciona zona..." value="" />
            <Picker.Item label="Toda la provincia" value="provincia" />
            <Picker.Item label="Municipio" value="municipio" />
            <Picker.Item label="Todo el País" value="pais" />
            <Picker.Item label="Otra (especificar abajo)" value="otra" />
          </Picker>
        </View>

        {zone === "otra" && (
          <TextInput
            style={styles.input}
            placeholder="Especifica la zona"
            onChangeText={setZone}
          />
        )}

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={() => setShowConfirm(true)}>
          <Text style={styles.buttonText}>Enviar alerta</Text>
        </TouchableOpacity>

        {/* Modal de confirmación */}
        <Modal visible={showConfirm} transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Confirmar envío</Text>
              <Text style={styles.confirmText}>
                ¿Quieres enviar esta alerta?
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
                  <Text style={styles.confirmTextBtn}>Enviar</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingBottom: 50 },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8 },
  textArea: { borderWidth: 1, borderColor: '#ccc', padding: 10, height: 120, textAlignVertical: 'top' },
  pickerBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: {
    borderRadius: 6,
    backgroundColor: 'rgba(25, 76, 100, 1)',
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: { color: '#fff', fontWeight: '600', textTransform: 'uppercase' },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  confirmBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 5,
  },
  confirmTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  confirmText: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#ccc' },
  confirmButton: { backgroundColor: '#d32f2f' },
  cancelText: { color: '#333', fontWeight: '600' },
  confirmTextBtn: { color: '#fff', fontWeight: '600' },
});